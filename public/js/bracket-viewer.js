/*
 * bracket-viewer.js — affichage des tableaux (principal & consolantes)
 * -------------------------------------------------------------------
 * Récupère un tournoi via l'API backend et le rend avec
 * brackets-viewer.js (Drarig29). Affiche l'ÉTAT EXACT de la table
 * Resultat : aucun résultat n'est simulé, les tours non remplis
 * restent vides, les positions sans joueur sont des byes.
 *
 * Endpoints backend :
 *   GET /api/tournois              -> tournois AYANT des résultats
 *   GET /api/tableau/<nomTournoi>  -> payload brackets-viewer
 */

const API_BASE = "https://tournoi-tennisado-production.up.railway.app";

function show(id) {
  ["state-loading", "state-error"].forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });
  if (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }
}

function afficherErreur(message) {
  show("state-error");
  document.getElementById("error-detail").textContent = message;
}

/* Menu déroulant : UNIQUEMENT les tournois présents dans Resultat
 * (le backend ne renvoie que ceux-là). Principal puis consolantes. */
async function chargerListeTournois() {
  const select = document.getElementById("tournoi-select");
  const btn = document.getElementById("afficher-btn");
  try {
    const res = await fetch(`${API_BASE}/api/tournois`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Erreur inconnue");

    const tournois = json.tournois || [];
    if (tournois.length === 0) {
      select.innerHTML = `<option value="">Aucun tableau disponible</option>`;
      select.disabled = true;
      btn.disabled = true;
      afficherErreur(
        "Aucun tournoi n'a encore de résultats. Initialisez un tableau " +
        "dans la table Resultat pour le voir apparaître ici."
      );
      return;
    }

    const ordre = { Principal: 0, Consolante: 1 };
    tournois.sort((a, b) => (ordre[a.type] ?? 9) - (ordre[b.type] ?? 9));

    select.innerHTML = tournois
      .map((t) => {
        const tag = t.type ? `[${t.type}] ` : "";
        return `<option value="${encodeURIComponent(t.nom)}">${tag}${t.nom}</option>`;
      })
      .join("");
  } catch (err) {
    afficherErreur(`Chargement des tournois impossible : ${err.message}`);
  }
}

async function afficherTableau() {
  const nom = document.getElementById("tournoi-select").value;
  if (!nom) { afficherErreur("Sélectionnez un tournoi."); return; }

  show("state-loading");
  try {
    const res = await fetch(`${API_BASE}/api/tableau/${nom}`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || `HTTP ${res.status}`);

    const data = json.data;
    show(null);

    window.bracketsViewer.render(
      {
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
      },
      {
        selector: ".brackets-viewer",
        clear: true,
        customRoundName: (info) => nomDeTour(info),
      }
    );
  } catch (err) {
    afficherErreur(err.message);
  }
}

/* Nom de tour à partir du nombre de tours restants : robuste quelle que
 * soit la taille (un tableau de 32 nomme son 1er tour "16es", etc.). */
function nomDeTour(info) {
  const restants = info.roundCount - info.roundNumber; // 0 = finale
  const libelles = {
    0: "Finale", 1: "Demi-finales", 2: "Quarts de finale",
    3: "8es de finale", 4: "16es de finale", 5: "32es de finale",
  };
  return libelles[restants] || `Tour ${info.roundNumber}`;
}

show(null);
chargerListeTournois();