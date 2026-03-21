document.getElementById("register-submit").addEventListener("click", async () => {

const name = document.getElementById("name").value;
const age = document.getElementById("age").value;
const gender = document.getElementById("gender").value;
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(!name || !age || !gender || !username || !password){
    alert("Please fill all fields");
    return;
}

try{

const res = await fetch("https://multi-election-app.onrender.com/vote/addVoter",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        name,
        age,
        gender,
        username,
        password, 
    })
});

const data = await res.json();

alert(data.message);

if(res.ok){
    window.location.href = "./login.html";
}

}catch(err){
    console.error(err);
    alert("Registration failed");
}
});