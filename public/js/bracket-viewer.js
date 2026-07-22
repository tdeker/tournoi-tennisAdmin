/*
 * bracket-viewer.js — affichage des tableaux (principal & consolantes)
 * -------------------------------------------------------------------
 * Librairie : bracketry (sbachinin/bracketry), importee en ESM depuis
 * jsDelivr (le package ne fournit pas de build UMD/<script> classique).
 *
 * Recupere un tournoi via l'API backend et affiche l'ETAT EXACT de la
 * table Resultat : aucun resultat n'est simule. Un tour non rempli
 * reste vide ; une position sans joueur est un BYE (qualification
 * automatique, sans "adversaire" affiche).
 *
 * Endpoints backend :
 *   GET /api/tournois              -> tournois AYANT des resultats
 *   GET /api/tableau/<nomTournoi>  -> { rounds, matches } (format bracketry)
 */

const API_BASE = "https://tournoi-tennisado-production.up.railway.app";

// Import ESM depuis jsDelivr (bracketry n'expose pas de build UMD).
let createBracket;
let bracketryPret = import("https://cdn.jsdelivr.net/npm/bracketry/+esm")
  .then((mod) => { createBracket = mod.createBracket; })
  .catch((err) => afficherErreur(`Chargement de bracketry impossible : ${err.message}`));

function show(id) {
  ["state-loading", "state-error"].forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });
  if (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }
  const empty = document.getElementById("bracket-empty");
  if (empty) {
    const hasBracket = document.querySelector(".bracket-wrapper .bracket-root");
    empty.classList.toggle("hidden", id === "state-loading" || !!hasBracket);
  }
}

function afficherErreur(message) {
  show("state-error");
  const el = document.getElementById("error-detail");
  if (el) el.textContent = message;
}

/* Menu deroulant : uniquement les tournois presents dans Resultat
 * (le backend ne renvoie que ceux-la). Principal puis consolantes. */
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
        "Aucun tournoi n'a encore de resultats. Initialisez un tableau " +
        "dans la table Resultat pour le voir apparaitre ici."
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
  const select = document.getElementById("tournoi-select");
  const nom = select.value;
  const pdfBtn = document.getElementById("pdf-btn");
  if (!nom) { afficherErreur("Selectionnez un tournoi."); return; }

  pdfBtn.disabled = true; // desactive tant qu'un tableau n'est pas affiche
  show("state-loading");
  try {
    await bracketryPret; // s'assure que createBracket est charge
    if (!createBracket) throw new Error("bracketry n'a pas pu etre charge.");

    const res = await fetch(`${API_BASE}/api/tableau/${nom}`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || `HTTP ${res.status}`);

    show(null);

    const empty = document.getElementById("bracket-empty");
    if (empty) empty.classList.add("hidden");

    const wrapper = document.querySelector(".bracket-wrapper");
    wrapper.innerHTML = ""; // reinitialise avant un nouveau rendu

    createBracket(json.data, wrapper, {
      // Aucun score affiche (evolution future) : on ne fournit pas de
      // "scores"/"currentScore" dans les sides, donc rien ne s'affiche.
      displayWholeRounds: true,   // pas de tour partiellement visible
      matchMaxWidth: 240,
      useClassicalLayout: true,   // hauteur stable, adaptee au desktop
      // Theme clair, aligne sur l'export PDF et le reste de l'admin.
      rootBgColor: "#f8fafc",
      rootBorderColor: "#cbd5e1",
      matchTextColor: "#0f172a",
      roundTitleColor: "#475569",
      connectionLinesColor: "#94a3b8",
      matchFontSize: 15,
    });

    // Titre affiche uniquement a l'impression (voir .print-only) :
    // libelle exact de l'option choisie (ex. "[Consolante] Consolante Femmes").
    const libelle = select.options[select.selectedIndex].textContent;
    const date = new Date().toLocaleDateString("fr-FR");
    document.getElementById("print-title").textContent = `${libelle} — ${date}`;

    pdfBtn.disabled = false; // un tableau est affiche : le telechargement est possible
  } catch (err) {
    afficherErreur(err.message);
  }
}

/* Ouvre la boite de dialogue d'impression du navigateur, avec la
 * feuille de style @media print dediee (admin.css) qui masque les
 * controles et neutralise le theme sombre pour un rendu papier propre.
 * L'utilisateur choisit "Enregistrer en PDF" comme destination : c'est
 * la maniere standard de produire un PDF cote navigateur, sans
 * dependance externe (pas de generation cote serveur). */
function telechargerPDF() {
  window.print();
}

show(null);
chargerListeTournois();

// Exposees pour les attributs onclick de la page.
window.afficherTableau = afficherTableau;
window.telechargerPDF = telechargerPDF;