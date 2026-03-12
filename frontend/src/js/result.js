const token = localStorage.getItem("adminToken");

if(!token){
alert("Admin login required");
window.location.href="admin_login.html";
}

function parseJwt(token){
const base64 = atob(token.split('.')[1]);
return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

async function loadResults(){

const res = await fetch(`http://localhost:5000/elections/results/${electionId}`,{

headers:{
"Authorization":`Bearer ${token}`
}

});

const data = await res.json();

const table = document.getElementById("resultsTable");

data.results.forEach(candidate => {

const row = document.createElement("tr");

row.innerHTML = `
<td class="border p-2">${candidate.name}</td>
<td class="border p-2 text-center">${candidate.votes}</td>
`;

table.appendChild(row);

});

}

loadResults();