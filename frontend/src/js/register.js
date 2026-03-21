document.getElementById("register-submit").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if(!name || !age || !gender || !username || !password){
    alert("Please fill all fields");
    return;
  }

  if (isNaN(age) || Number(age) <= 0) {
    alert("Please enter a valid age");
    return;
  }

  try {
    const res = await fetch("https://multi-election-app.onrender.com/vote/addVoter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, age, gender, username, password })
    });

    const data = await res.json();

    if(res.ok){
      alert(data.message || "Registered successfully ✅");
      window.location.href = "./login.html";
    } else {
      alert(data.message || "Registration failed ❌");
    }

  } catch(err) {
    console.error(err);
    alert("Server error. Please try again.");
  }
});