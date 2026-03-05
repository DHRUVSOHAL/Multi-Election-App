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

const res = await fetch("http://localhost:1000/election",{

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

document.getElementById("message").innerText="Election Created Successfully ✅";

form.reset();

}else{

document.getElementById("message").innerText=data.message;

}

}catch(err){

document.getElementById("message").innerText="Server error";

}

});