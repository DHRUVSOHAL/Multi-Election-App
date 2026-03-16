const token = localStorage.getItem("adminToken");

async function deleteVoter(){

const username=document.getElementById("username").value;

const res = await fetch(`http://localhost:1000/election/removeVoter/${username}`,{

method:"DELETE",

headers:{
"Authorization":"Bearer "+token
}

});

const data = await res.json();


alert(data.message);

}