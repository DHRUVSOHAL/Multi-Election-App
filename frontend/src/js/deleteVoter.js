const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Admin not logged in");
  window.location.href = "./admin_login.html";
}

async function deleteVoter() {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Please enter a username");
    return;
  }

  try {
    const res = await fetch(`https://multi-election-app.onrender.com/election/removeVoter/${username}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Voter deleted successfully ✅");
      // Optionally, refresh page or update UI
    } else {
      alert(data.message || "Failed to delete voter ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
}