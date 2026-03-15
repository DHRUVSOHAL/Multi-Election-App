const token = localStorage.getItem("adminToken");

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

document.getElementById("voterForm").addEventListener("submit", async (e)=>{

e.preventDefault();

const voterData = {

username:document.getElementById("username").value,

electionId:electionId

};

const res = await fetch("http://localhost:1000/election/addVoters",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},

body:JSON.stringify(voterData)

});

const data = await res.json();

alert(data.message);

});