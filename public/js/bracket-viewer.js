/*
 * bracket-viewer.js — affichage des tableaux (principal & consolantes)
 * -------------------------------------------------------------------
 * Front admin Tennisado. Récupère un tournoi via l'API backend
 * (branche research de tournoi-tennisADO) et le rend avec
 * brackets-viewer.js (Drarig29), déjà chargé par la page.
 *
 * Endpoints backend attendus :
 *   GET /api/tournois              -> { success, tournois: [{nom,type,...}] }
 *   GET /api/tableau/<nomTournoi>  -> { success, data: {participant, stage,
 *                                        group, round, match, match_game} }
 *
 * Le champ `data` est déjà au format brackets-viewer : on le passe
 * tel quel à render().
 */

// Même base d'API que generer-poules.js (Railway).
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

/* Remplit le menu déroulant des tournois au chargement de la page.
 * Principal et consolantes sont tous listés : la consolante est un
 * Tournoi comme un autre (Type = "Consolante"), on l'affiche avec le
 * même viewer. On préfixe le libellé par son type pour s'y retrouver. */
async function chargerListeTournois() {
  const select = document.getElementById("tournoi-select");
  try {
    const res = await fetch(`${API_BASE}/api/tournois`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Erreur inconnue");

    const tournois = json.tournois || [];
    if (tournois.length === 0) {
      select.innerHTML = `<option value="">Aucun tournoi</option>`;
      return;
    }

    // Principal d'abord, puis consolantes.
    const ordre = { Principal: 0, Consolante: 1 };
    tournois.sort(
      (a, b) => (ordre[a.type] ?? 9) - (ordre[b.type] ?? 9)
    );

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
  const select = document.getElementById("tournoi-select");
  const nom = select.value;
  if (!nom) {
    afficherErreur("Sélectionnez un tournoi.");
    return;
  }

  show("state-loading");
  try {
    const res = await fetch(`${API_BASE}/api/tableau/${nom}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }

    const data = json.data;
    show(null); // masque loading + erreur

    // Noms de tours lisibles (au lieu de "Round 1, Round 2...").
    // brackets-viewer appelle cette fonction pour chaque titre de round.
    window.bracketsViewer.setRoundNamesFor?.("single_elimination", () => {});

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
        // Affiche "16es / 8es / Quarts / Demi / Finale" plutôt que
        // "Round N" quand la lib le permet ; sinon comportement défaut.
        customRoundName: (info) => nomDeTour(info, data.stage[0]?.settings?.size),
      }
    );
  } catch (err) {
    afficherErreur(err.message);
  }
}

/* Traduit un numéro de round + taille de tableau en libellé tennis.
 * info = { roundNumber, roundCount, ... } selon la version de la lib. */
function nomDeTour(info, taille) {
  const total = info.roundCount;
  const n = info.roundNumber;
  const restants = total - n; // 0 = finale
  const libelles = {
    0: "Finale",
    1: "Demi-finales",
    2: "Quarts",
    3: "8es de finale",
    4: "16es de finale",
    5: "32es de finale",
  };
  return libelles[restants] || `Tour ${n}`;
}

// Init
show(null);
chargerListeTournois();