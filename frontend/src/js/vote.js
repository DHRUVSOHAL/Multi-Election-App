const token = localStorage.getItem("token");

if(!token){
  alert("Login first");
  window.location.href = "login.html";
}

// get electionId
const params = new URLSearchParams(window.location.search);
const electionId = params.get("electionId");

// ✅ check invalid access
if(!electionId){
  alert("Invalid Election");
  window.location.href = "dashboard.html";
}

async function loadCandidates(){

  const res = await fetch(`http://localhost:1000/vote/candidates/${electionId}`,{
    headers:{
      "Authorization": `Bearer ${token}`
    }
  });

  if(!res.ok){
    alert("Error loading candidates");
    return;
  }

  const candidates = await res.json();

  const container = document.getElementById("candidateList");
  container.innerHTML = "";

  // ✅ empty case
  if(candidates.length === 0){
    container.innerHTML = "<p>No candidates available</p>";
    return;
  }

  candidates.forEach(c => {

    const card = document.createElement("div");

    card.className = "bg-white p-4 rounded shadow flex justify-between items-center";

    card.innerHTML = `
      <div>
        <h2 class="font-semibold">${c.name}</h2>
        <p class="text-gray-500 text-sm">Candidate ID: ${c.candidateId}</p>
      </div>

      <button class="voteNow bg-green-500 text-white px-4 py-2 rounded"
        data-id="${c.candidateId}">
        Vote
      </button>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".voteNow").forEach(btn=>{
    btn.addEventListener("click", giveVote);
  });
}

async function giveVote(e){

  const candidateId = e.target.dataset.id;

  // ✅ confirmation
  if(!confirm("Are you sure you want to vote?")){
    return;
  }

  const res = await fetch("http://localhost:1000/vote/giveVote",{
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`
    },
    body: JSON.stringify({
      electionId,
      candidateId
    })
  });

  const data = await res.json();

  // ✅ error handling
  if(!res.ok){
    alert(data.message || "Vote failed");
    return;
  }

  alert(data.message);

  window.location.href = "dashboard.html";
}

loadCandidates();