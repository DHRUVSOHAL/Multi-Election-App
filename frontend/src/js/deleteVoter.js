const token = localStorage.getItem("adminToken");

function parseJwt(token){
const base64 = atob(token.split('.')[1]);
return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

document.getElementById("deleteVoterBtn").onclick = async ()=>{

const username = document.getElementById("username").value;

const res = await fetch(`http://localhost:5000/elections/deleteVoter/${username}/${electionId}`,{

method:"DELETE",

headers:{
"Authorization":`Bearer ${token}`
}

});

const data = await res.json();

alert(data.message);

}