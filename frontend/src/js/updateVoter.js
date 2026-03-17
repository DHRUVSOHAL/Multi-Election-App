document.addEventListener("DOMContentLoaded", () => {

  // ✅ Handle form submission
  document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get token fresh every time
    const token = localStorage.getItem("voterToken");
    if (!token) {
      alert("You must log in first.");
      window.location.href = "/login.html";
      return;
    }

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!oldPassword) {
      return alert("Old password is required");
    }

    try {
      const res = await fetch("http://localhost:1000/vote/updateSelf", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name || undefined,
          age: age ? parseInt(age) : undefined,
          gender,
          oldPassword,
          newPassword: newPassword || undefined,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login.html";
          return;
        }
        return alert(data.message || data.error || "Update failed");
      }

      alert(data.message || "Profile updated successfully!");
      // Optionally redirect back to dashboard
      window.location.href = "/dashboard.html";
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Check if your backend is running.");
    }
  });
});