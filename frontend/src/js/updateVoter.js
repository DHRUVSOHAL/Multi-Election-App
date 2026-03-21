document.getElementById("updateForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // 🔹 Get form values and trim
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const oldPassword = document.getElementById("oldPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    // 🔹 Get token
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "./login.html";
        return;
    }

    if (!oldPassword) {
        alert("Old password is required!");
        return;
    }

    if (age && (isNaN(age) || Number(age) <= 0)) {
        alert("Please enter a valid age");
        return;
    }

    try {
        const response = await fetch("https://multi-election-app.onrender.com/vote/updateSelf", {
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
            window.location.href = "./dashboard.html";
        } else {
            alert("❌ " + (data.message || "Update failed"));
        }

    } catch (err) {
        console.error(err);
        alert("❌ Something went wrong! Please try again.");
    }
});