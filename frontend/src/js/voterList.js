const token = localStorage.getItem("adminToken");

if(!token){
alert("Login required");
window.location.href="admin_login.html";
}

function parseJwt(token){
const base64 = atob(token.split('.')[1]);
return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

async function loadVoters(){

const res = await fetch(`http://localhost:5000/elections/voters/${electionId}`,{

headers:{
"Authorization":`Bearer ${token}`
}

});

const voters = await res.json();

const table = document.getElementById("votersTable");

voters.forEach(voter => {

const electionInfo = voter.eligibleElections.find(
e => e.election === electionId
);

const status = electionInfo?.hasVoted ? "✅ Voted" : "❌ Not Voted";

const row = document.createElement("tr");

row.innerHTML = `
<td class="border p-2">${voter.name}</td>
<td class="border p-2">${voter.username}</td>
<td class="border p-2">${voter.age}</td>
<td class="border p-2 text-center">${status}</td>
`;

table.appendChild(row);

});

}

loadVoters();