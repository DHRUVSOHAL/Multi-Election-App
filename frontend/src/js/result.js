const token = localStorage.getItem("adminToken");

async function loadResults() {
  try {
    const res = await fetch(
      `http://localhost:1000/election/result/`,
      {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    const data = await res.json();

    const table = document.getElementById("resultsTable");

    // ✅ Empty check
    if (!data.results || data.results.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="2" class="p-3 text-gray-500">
            No results found
          </td>
        </tr>
      `;
      return;
    }

    // ✅ Efficient rendering
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
  }
}

loadResults();