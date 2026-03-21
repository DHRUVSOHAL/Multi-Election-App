const token = localStorage.getItem("adminToken");

function parseJwt(token){
return JSON.parse(atob(token.split('.')[1]));
}

const decoded=parseJwt(token);
const electionId=decoded.electionId;

async function loadVoters(){

const res = await fetch(
`https://multi-election-app.onrender.com/election/voters/${electionId}`,
{
headers:{
"Authorization":"Bearer "+token
}
}
);

const voters = await res.json();

const table=document.getElementById("votersTable");

voters.forEach(v=>{

const election = v.eligibleElections.find(
e=>e.election===electionId
);
table.innerHTML += `
<tr class="border-t text-center">

<td class="p-3">${v.name}</td>
<td class="p-3">${v.username}</td>
<td class="p-3">${v.age}</td>
<td class="p-3">
${election.hasVoted ? "✅ Yes" : "❌ No"}
</td>

</tr>
`;


});

}

loadVoters();