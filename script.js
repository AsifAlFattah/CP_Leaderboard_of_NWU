async function fetchLeaderboard(handles) {
  const apiUrl = `https://codeforces.com/api/user.info?handles=${handles.join(";")}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data from Codeforces API");
  }
  const data = await response.json();
  if (data.status !== "OK") {
    throw new Error(data.comment || "Error fetching user info");
  }
  return data.result.map(user => ({
    handle: user.handle,
    rating: user.rating || "Unrated"
  }));
}

function displayLeaderboard(users) {
  const tableBody = document.querySelector("#leaderboard tbody");
  const loadingDiv = document.getElementById("loading");

  // Sort users by rating (descending)
  users.sort((a, b) => (b.rating === "Unrated" ? -1 : b.rating) - (a.rating === "Unrated" ? -1 : a.rating));

  // Populate table
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.handle}</td>
      <td>${user.rating}</td>
    `;
    tableBody.appendChild(row);
  });

  // Hide loading message and show leaderboard
  loadingDiv.style.display = "none";
  document.getElementById("leaderboard").style.display = "table";
}

// Replace with your friends' Codeforces handles
const friendsHandles = ["Asif_Al_Fattah", "SHossain", "md_jakariya", "Sai.kat", "Hridoy_Kumar_Bala", "noman_r", "Shahjalal2075", "jyoti__", "Howlader", "FormerNasir"];

// Fetch and display leaderboard
fetchLeaderboard(friendsHandles)
  .then(displayLeaderboard)
  .catch(error => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.textContent = `Error: ${error.message}`;
  });