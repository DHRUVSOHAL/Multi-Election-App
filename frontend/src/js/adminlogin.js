document.getElementById("adminLoginBtn").addEventListener("click", loginAdmin);

async function loginAdmin(){

const electionId = document.getElementById("electionId").value;
const password = document.getElementById("password").value;

if(!electionId || !password){
alert("Please fill all fields");
return;
}

const res = await fetch("https://multi-election-app.onrender.com/election/adminLogin",{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
electionId,
password
})

});

const data = await res.json();

if(res.ok){

localStorage.setItem("adminToken",data.token);

alert("Login successful");

window.location.href="./admin.html";

}else{

alert(data.message || "Login failed");

}

}