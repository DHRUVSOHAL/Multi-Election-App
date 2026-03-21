const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Admin not logged in");
  window.location.href = "./admin_login.html";
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

async function deleteCandidate() {
  const candidateId = document.getElementById("candidateId").value.trim();

  if (!candidateId) {
    alert("Please enter a Candidate ID");
    return;
  }

  try {
    const res = await fetch(
      `https://multi-election-app.onrender.com/election/deleteCandidate/${candidateId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Candidate deleted successfully ✅");
      // Optionally, refresh page or update UI
    } else {
      alert(data.message || "Failed to delete candidate ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
}