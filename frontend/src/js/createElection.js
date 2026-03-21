const form = document.getElementById("createElectionForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const title = document.getElementById("title").value;
const description = document.getElementById("description").value;
const startDate = document.getElementById("startDate").value;
const endDate = document.getElementById("endDate").value;
const electionId = document.getElementById("electionId").value;
const password = document.getElementById("password").value;
const isActive = document.getElementById("isActive").checked;

try{

const res = await fetch("https://multi-election-app.onrender.com/election",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title,
description,
startDate,
endDate,
electionId,
password,
isActive
})

});

const data = await res.json();

if(res.ok){

// save JWT token
localStorage.setItem("adminToken", data.token);

// optional: store electionId too
localStorage.setItem("electionId", electionId);

document.getElementById("message").innerText =
"Election Created Successfully ✅ Redirecting...";

setTimeout(()=>{

window.location.href = "admin.html";

},1500);

}else{

document.getElementById("message").innerText = data.message || "Error creating election";

}

}catch(err){

console.error(err);
document.getElementById("message").innerText="Server error";

}

});