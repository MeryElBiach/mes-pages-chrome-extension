// Évite d'ajouter le listener deux fois si le script est injecté plusieurs fois
if (!window.mesPagesListenerAdded) {
  window.mesPagesListenerAdded = true;

  // Écoute les messages envoyés par le popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageInfo") {
      sendResponse({
        title: document.title,   // le titre de la page
        url: location.href       // le lien de la page
      });
    }
  });
}