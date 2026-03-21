const token = localStorage.getItem("adminToken");

async function deleteVoter(){

const username=document.getElementById("username").value;

const res = await fetch(`https://multi-election-app.onrender.com/election/removeVoter/${username}`,{

method:"DELETE",

headers:{
"Authorization":"Bearer "+token
}

});

const data = await res.json();


alert(data.message);

}