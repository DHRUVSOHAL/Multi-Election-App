const token = localStorage.getItem("adminToken");

document.getElementById("deleteCandidateBtn").onclick = async ()=>{

const id = document.getElementById("candidateId").value;

const res = await fetch(`http://localhost:5000/elections/deleteCandidate/${id}`,{

method:"DELETE",

headers:{
"Authorization":`Bearer ${token}`
}

});

const data = await res.json();

alert(data.message);

}