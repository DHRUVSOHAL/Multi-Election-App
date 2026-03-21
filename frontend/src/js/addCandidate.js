const token = localStorage.getItem("adminToken");

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

document.getElementById("candidateForm").addEventListener("submit",async(e)=>{

e.preventDefault();

const data={

name:document.getElementById("name").value,
age:document.getElementById("age").value,
candidateId:document.getElementById("candidateId").value,
electionId:electionId

};

const res = await fetch("https://multi-election-app.onrender.com/election/addCandidates",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},

body:JSON.stringify(data)

});

const result=await res.json();

alert(result.message);

});