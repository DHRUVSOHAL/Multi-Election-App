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

document.getElementById("voterForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const voterData = {
    username: document.getElementById("username").value,
    electionId: electionId
  };

  try {
    const res = await fetch("https://multi-election-app.onrender.com/election/addVoters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(voterData)
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
    } else {
      alert(data.message || "Something went wrong");
    }

  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
});