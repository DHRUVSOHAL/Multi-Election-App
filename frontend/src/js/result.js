const token = localStorage.getItem("adminToken");

function parseJwt(token){
return JSON.parse(atob(token.split('.')[1]));
}

const decoded=parseJwt(token);
const electionId=decoded.electionId;

async function loadResults(){

const res = await fetch(`http://localhost:1000/election/result/`,{

headers:{
"Authorization":"Bearer "+token
}

});

const data = await res.json();

const table=document.getElementById("resultsTable");

data.results.forEach(c=>{

table.innerHTML+=`
<tr>
<td class="p-3">${c.name}</td>
<td class="p-3">${c.votes}</td>
</tr>
`;

});

}

loadResults();