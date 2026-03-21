const token = localStorage.getItem("adminToken");

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url);
  return JSON.parse(base64);
}

const decoded = parseJwt(token);
const electionId = decoded.electionId;

async function deleteCandidate() {

const candidateId = document.getElementById("candidateId").value;

const res = await fetch(
`https://multi-election-app.onrender.com/election/deleteCandidate/${candidateId}`,
{
method: "DELETE",
headers: {
"Authorization": "Bearer " + token
}
}
);

const data = await res.json();

alert(data.message);

}