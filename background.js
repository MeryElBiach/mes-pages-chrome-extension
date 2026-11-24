console.log("Background démarré ✅");

// Écoute les messages envoyés par le popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "savePage") {
    savePage(message.page).then(sendResponse);
    return true; // la réponse sera envoyée plus tard (asynchrone)
  }
});

async function savePage(page) {
  // 1. Lire la liste déjà sauvegardée (vide au début)
  const data = await chrome.storage.local.get({ pages: [] });
  const pages = data.pages;

  // 2. Éviter les doublons : même lien = déjà sauvegardé
  if (pages.some(p => p.url === page.url)) {
    return { ok: false, message: "Page déjà sauvegardée" };
  }

  // 3. Ajouter la page avec la date, puis sauvegarder
  pages.push({ ...page, date: new Date().toLocaleDateString("fr-FR") });
  await chrome.storage.local.set({ pages });

  console.log("Page sauvegardée :", page.title);
  return { ok: true, message: "Page sauvegardée ✅" };
}