const token = localStorage.getItem("token");

if(!token){
alert("Please login first");
window.location.href="login.html";
}

async function loadDashboard(){

const res = await fetch("http://localhost:1000/vote/dashboard",{
headers:{
"Authorization":`Bearer ${token}`
}
});

const data = await res.json();

document.getElementById("voterName").innerText = data.name;
document.getElementById("voterAge").innerText = data.age;
document.getElementById("voterGender").innerText = data.gender;
document.getElementById("voterUsername").innerText = data.username;
document.getElementById("usernameDisplay").innerText = data.username;

const container = document.getElementById("electionList");
container.innerHTML="";

data.elections.forEach(e => {

let card = document.createElement("div");

card.className = "border rounded-lg p-4 flex justify-between items-center";

card.innerHTML = `
<div>
<h3 class="font-semibold text-lg">${e.election}</h3>
<p class="text-sm text-gray-500">
${e.hasVoted ? "Status: Voted" : "Status: Not Voted"}
</p>
</div>

${e.hasVoted 
? `<span class="text-green-600 font-semibold">Already Voted</span>`
: `<button class="voteBtn bg-blue-500 text-white px-4 py-2 rounded"
data-election="${e.election}">
Vote
</button>`
}
`;

container.appendChild(card);

});

document.querySelectorAll(".voteBtn").forEach(btn=>{
btn.addEventListener("click",vote);
});

}

async function vote(event){

const electionId = event.target.dataset.election;
const candidateId = prompt("Enter Candidate ID");

const res = await fetch("http://localhost:1000/vote/giveVote",{

method:"PUT",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},

body:JSON.stringify({
electionId,
candidateId
})

});

const data = await res.json();

alert(data.message);

loadDashboard();

}

document.getElementById("logoutBtn").addEventListener("click",()=>{
localStorage.removeItem("token");
window.location.href="login.html";
});
document.getElementById("updateProfileBtn").addEventListener("click", () => {
  window.location = "updateVoter.html";
});

loadDashboard();