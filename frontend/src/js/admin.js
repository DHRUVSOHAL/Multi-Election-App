const token = localStorage.getItem("adminToken");

// If admin not logged in
if (!token) {
  alert("Admin not logged in");
  window.location.href = "admin_login.html";
}

// decode JWT
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

console.log("Admin Election:", electionId);


// Navigation buttons

document.getElementById("addVoterBtn").onclick = () => {
  window.location.href = "addVoter.html";
};

document.getElementById("addCandidateBtn").onclick = () => {
  window.location.href = "addCandidate.html";
};

document.getElementById("deleteVoterBtn").onclick = () => {
  window.location.href = "deleteVoter.html";
};

document.getElementById("deleteCandidateBtn").onclick = () => {
  window.location.href = "deleteCandidate.html";
};

document.getElementById("manageElectionBtn").onclick = () => {
  window.location.href = "manageElection.html";
};

document.getElementById("resultsBtn").onclick = () => {
  window.location.href = "results.html";
};