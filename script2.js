async function fetchSolvedProblems(handle) {
    const url = `https://codeforces.com/api/user.status?handle=${handle}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for handle: ${handle}`);
    }
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(data.comment || "Error fetching user submissions");
    }
    const submissions = data.result;

    // Filter unique problems solved with "OK" verdict
    const uniqueProblems = new Set(
      submissions
        .filter(submission => submission.verdict === "OK")
        .map(submission => `${submission.problem.contestId}-${submission.problem.index}`)
    );

    return uniqueProblems.size;
  }

  async function fetchLeaderboard(handles) {
    const results = [];
    for (const handle of handles) {
      try {
        const solvedCount = await fetchSolvedProblems(handle);
        results.push({ handle, solvedCount });
      } catch (error) {
        console.error(error.message);
      }
    }
    return results;
  }

  function displayLeaderboard(users) {
    const tableBody = document.querySelector("#leaderboard tbody");
    const loadingDiv = document.getElementById("loading");

    // Sort users by problems solved (descending)
    users.sort((a, b) => b.solvedCount - a.solvedCount);

    // Populate table
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.handle}</td>
        <td>${user.solvedCount}</td>
      `;
      tableBody.appendChild(row);
    });

    // Hide loading message and show leaderboard
    loadingDiv.style.display = "none";
    document.getElementById("leaderboard").style.display = "table";
  }

  // Replace with your friends' Codeforces handles
  const friendsHandles = ["Asif_Al_Fattah", "SHossain", "md_jakariya", "Sai.kat", "Hridoy_Kumar_Bala", "noman_r", "Shahjalal2075", "jyoti__", "Howlader", "FormerNasir", "Al-Roman"];

  // Fetch and display leaderboard
  fetchLeaderboard(friendsHandles)
    .then(displayLeaderboard)
    .catch(error => {
      const loadingDiv = document.getElementById("loading");
      loadingDiv.textContent = `Error: ${error.message}`;
    });