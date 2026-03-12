const token = localStorage.getItem("adminToken");

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

const res = await fetch("http://localhost:5000/elections/addVoters",{
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
electionId
})

});

const data = await res.json();

alert(data.message);

}