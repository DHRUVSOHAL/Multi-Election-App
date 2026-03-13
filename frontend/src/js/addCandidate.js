const token = localStorage.getItem("adminToken");

function parseJwt(token){
const base64 = atob(token.split('.')[1]);
return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

document.getElementById("addCandidateBtn").onclick = async ()=>{

const name = document.getElementById("name").value;
const candidateId = document.getElementById("candidateId").value;
const party = document.getElementById("party").value;

const res = await fetch("http://localhost:1000/election/addCandidates",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},

body:JSON.stringify({
name,
candidateId,
party,
electionId
})

});

const data = await res.json();
alert(data.message);

}