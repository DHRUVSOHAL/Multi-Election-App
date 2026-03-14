const token = localStorage.getItem("adminToken");

function parseJwt(token){
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

document.getElementById("electionIdText").innerText = electionId;

document
.getElementById("deleteElectionBtn")
.addEventListener("click", deleteElection);


async function deleteElection(){

const password = document.getElementById("password").value;

if(!password){
alert("Enter password");
return;
}

const res = await fetch(
`http://localhost:1000/election/${password}/${electionId}`,
{
method:"DELETE",
headers:{
"Authorization":"Bearer "+token
}
}
);

const data = await res.json();

alert(data.message);

if(res.ok){
localStorage.removeItem("adminToken");
window.location.href="admin_login.html";
}

}