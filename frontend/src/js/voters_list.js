const token = localStorage.getItem("adminToken");

// ✅ Check token
if (!token) {
  alert("Admin not logged in!");
  window.location.href = "./admin_login.html";
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    console.error("Invalid token", err);
    alert("Invalid token. Please login again.");
    localStorage.removeItem("adminToken");
    window.location.href = "./admin_login.html";
  }
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

async function loadVoters() {
  try {
    const res = await fetch(`https://multi-election-app.onrender.com/election/voters/${electionId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Failed to fetch voters. Session may have expired.");
      localStorage.removeItem("adminToken");
      window.location.href = "./admin_login.html";
      return;
    }

    const voters = await res.json();
    const table = document.getElementById("votersTable");

    // Clear table first
    table.innerHTML = "";

    if (!voters || voters.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4" class="p-3 text-gray-500 text-center">No voters found</td>
        </tr>
      `;
      return;
    }

    // Use map + join instead of innerHTML += for better performance
    table.innerHTML = voters.map(v => {
      const election = v.eligibleElections.find(e => e.election === electionId);
      return `
        <tr class="border-t text-center">
          <td class="p-3">${v.name}</td>
          <td class="p-3">${v.username}</td>
          <td class="p-3">${v.age}</td>
          <td class="p-3">${election?.hasVoted ? "✅ Yes" : "❌ No"}</td>
        </tr>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    alert("Error loading voters. Please try again.");
  }
}

loadVoters();