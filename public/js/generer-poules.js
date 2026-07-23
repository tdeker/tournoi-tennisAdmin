const API_URL = "https://tournoi-tennisado-production.up.railway.app/api/poules/generer";

// Génération désactivée depuis l'interface : les poules ont déjà été
// créées pour ce tournoi. Passer à true réactive le bouton (voir aussi
// l'attribut "disabled" sur les boutons dans generer-poules.html).
const GENERATION_DESACTIVEE = true;

function show(id) {
  ["state-idle", "state-loading", "state-success", "state-error"].forEach(s => {
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

async function callApi() {
  if (GENERATION_DESACTIVEE) return; // garde cote JS, en plus du bouton grise

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