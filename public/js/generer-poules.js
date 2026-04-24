const API_URL = "https://tournoi-tennisado-production.up.railway.app/api/poules/generer";

function show(id) {
  ["state-idle", "state-loading", "state-success", "state-error"].forEach(s => {
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

async function callApi() {
  show("state-loading");

  try {
    const response = await fetch(API_URL, { method: "POST" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} — ${response.statusText}`);
    }

    let responseText = "";
    try {
      const data = await response.json();
      responseText = JSON.stringify(data, null, 2);
    } catch {
      responseText = await response.text();
    }

    show("state-success");

    if (responseText && responseText.trim() !== "") {
      const box = document.getElementById("response-data");
      box.textContent = responseText;
      box.classList.remove("hidden");
    }

  } catch (err) {
    show("state-error");
    document.getElementById("error-detail").textContent = err.message;
  }
}

// Affiche le bouton au chargement
show("state-idle");
