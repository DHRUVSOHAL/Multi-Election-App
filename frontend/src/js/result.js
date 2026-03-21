const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Admin not logged in");
  window.location.href = "./admin_login.html";
}

async function loadResults() {
  try {
    const res = await fetch(`https://multi-election-app.onrender.com/election/result/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Failed to load results. Please try again.");
      return;
    }

    const data = await res.json();
    const table = document.getElementById("resultsTable");

    if (!data.results || data.results.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="2" class="p-3 text-gray-500 text-center">
            No results found
          </td>
        </tr>
      `;
      return;
    }

    let rows = "";
    data.results.forEach(c => {
      rows += `
        <tr class="border-t">
          <td class="p-3">${c.name}</td>
          <td class="p-3 font-semibold text-blue-600">${c.votes}</td>
        </tr>
      `;
    });

    table.innerHTML = rows;

  } catch (err) {
    console.error("Error loading results:", err);
    alert("Error loading results. Please try again.");
  }
}

loadResults();