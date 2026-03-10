const token = localStorage.getItem("token");

async function loadDashboard(){

const res = await fetch("http://localhost:3000/voters/dashboard",{
headers:{
"Authorization":`Bearer ${token}`
}
});

const data = await res.json();

document.getElementById("welcome").innerText = "Welcome " + data.name;

const container = document.getElementById("elections");
container.innerHTML="";

data.elections.forEach(e => {

let card = document.createElement("div");

card.className = "bg-white p-6 rounded-xl shadow";

card.innerHTML = `
<h2 class="text-xl font-semibold mb-3">${e.election}</h2>

${e.hasVoted 
? `<span class="text-green-600 font-semibold">Already Voted</span>`
: `<button 
class="voteBtn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

const res = await fetch("http://localhost:1000/voters/giveVote",{

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

loadDashboard();