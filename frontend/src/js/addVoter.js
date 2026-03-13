const token = localStorage.getItem("adminToken");

if(!token){
alert("Admin not logged in");
window.location.href="admin_login.html";
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

document.getElementById("submitBtn").onclick = async () => {

const name = document.getElementById("name").value;
const username = document.getElementById("username").value;
const age = document.getElementById("age").value;
const gender = document.getElementById("gender").value;
const password = document.getElementById("password").value;

const res = await fetch("http://localhost:1000/election/addVoters",{
method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},

body:JSON.stringify({
name,
username,
age,
gender,
password,
electionId
})

});

const data = await res.json();
alert(data.message);

}