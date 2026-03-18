document.getElementById("updateForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // 🔹 Get form values
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    // 🔹 Get token
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    if (!oldPassword) {
        alert("Old password is required!");
        return;
    }

    try {
        const response = await fetch("http://localhost:1000/vote/updateSelf", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                age,
                gender,
                oldPassword,
                newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Profile updated successfully");
            window.location.href = "dashboard.html";
        } else {
            alert("❌ " + data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Something went wrong!");
    }
});