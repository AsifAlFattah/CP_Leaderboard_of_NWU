const friendsHandles = ["Asif_Al_Fattah", "SHossain", "md_jakariya", "Sai.kat", "Hridoy_Kumar_Bala", "noman_r", "Shahjalal2075", "jyoti__", "Howlader", "FormerNasir"];
let leaderboardData = [];

// Fetch user info
async function fetchUserInfo(handle) {
  const url = `https://codeforces.com/api/user.info?handles=${handle}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.status === "OK" ? data.result[0] : null;
}

// Fetch user status
async function fetchUserStatus(handle) {
  const url = `https://codeforces.com/api/user.status?handle=${handle}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.status === "OK" ? data.result : null;
}

// Fetch leaderboard data
async function fetchLeaderboard(handles) {
  const users = await Promise.all(
    handles.map(async (handle) => {
      const userInfo = await fetchUserInfo(handle);
      const userStatus = await fetchUserStatus(handle);

      if (!userInfo || !userStatus) return null;

      const uniqueProblems = new Set(
        userStatus
          .filter((sub) => sub.verdict === "OK")
          .map((sub) => `${sub.problem.contestId}-${sub.problem.index}`)
      );

      const problemsSolvedIn2025 = calculateProblemsSolvedInYear(userStatus, 2025);

      return {
        handle: userInfo.handle,
        problemsSolvedIn2025: problemsSolvedIn2025,
      };
    })
  );

  leaderboardData = users.filter((user) => user !== null);
  displayLeaderboard("problemsSolvedIn2025");
}

// Calculate problems solved in a specific year
function calculateProblemsSolvedInYear(submissions, year) {
  const uniqueProblemsInYear = new Set(
    submissions
      .filter(
        (sub) =>
          sub.verdict === "OK" &&
          new Date(sub.creationTimeSeconds * 1000).getFullYear() === year
      )
      .map((sub) => `${sub.problem.contestId}-${sub.problem.index}`)
  );
  return uniqueProblemsInYear.size;
}

// Display leaderboard
function displayLeaderboard(sortBy) {
  const tableBody = document.querySelector("#leaderboard tbody");
  const loadingDiv = document.getElementById("loading");

  // Sort the data
  leaderboardData.sort((a, b) => b[sortBy] - a[sortBy]);

  // Clear previous rows
  tableBody.innerHTML = "";

  // Populate the table
  leaderboardData.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.handle}</td>
      <td>${user.problemsSolvedIn2025}</td>
    `;
    tableBody.appendChild(row);
  });

  // Hide loading message and show leaderboard
  loadingDiv.style.display = "none";
  document.getElementById("leaderboard").style.display = "table";
}


// Fetch and display leaderboard
fetchLeaderboard(friendsHandles).catch((error) => {
  document.getElementById("loading").textContent = `Error: ${error.message}`;
});

document.getElementById("rankByNumberOfProblemsSolvedIn2025").addEventListener("click", () => {
  displayLeaderboard("problemsSolvedIn2025");
});


