const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Admin not logged in");
  window.location.href = "admin_login.html";
}

// --- Utilities ---
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

// --- Header Elements ---
const electionTitle = document.getElementById("electionTitle");
const toggleBtn = document.getElementById("toggleElectionBtn");

// --- 1. Load Election Status on Page Start ---
async function fetchElectionStatus() {
  try {
    // Note: Ensure the URL matches your server's route prefix (e.g., /api/election/current)
    const response = await fetch('http://localhost:1000/election/current', { 
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      electionTitle.innerText = data.title;
      updateToggleUI(data.isActive);
    }
  } catch (err) {
    console.error("Error fetching status:", err);
  }
}

// --- 2. Toggle Functionality ---
toggleBtn.onclick = async () => {

  try {
    const response = await fetch('http://localhost:1000/election/toggleElection', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      
    });

    const data = await response.json();
    if (response.ok) {
      updateToggleUI(data.isActive);
      alert(data.message);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Failed to toggle election status.");
  }
};

// Helper to change button color/text
function updateToggleUI(isActive) {
  if (isActive) {
    toggleBtn.innerText = "Active";
    toggleBtn.className = "px-4 py-2 rounded text-white font-semibold bg-green-600 hover:bg-green-700";
  } else {
    toggleBtn.innerText = "Inactive";
    toggleBtn.className = "px-4 py-2 rounded text-white font-semibold bg-red-600 hover:bg-red-700";
  }
}

// --- 3. Navigation Buttons ---
document.getElementById("addVoterBtn").onclick = () => window.location.href = "addVoter.html";
document.getElementById("addCandidateBtn").onclick = () => window.location.href = "addCandidate.html";
document.getElementById("deleteVoterBtn").onclick = () => window.location.href = "deleteVoter.html";
document.getElementById("deleteCandidateBtn").onclick = () => window.location.href = "deleteCandidate.html";
document.getElementById("manageElectionBtn").onclick = () => window.location.href = "manageElection.html";
document.getElementById("resultsBtn").onclick = () => window.location.href = "result.html";

// Initial Execution
fetchElectionStatus();