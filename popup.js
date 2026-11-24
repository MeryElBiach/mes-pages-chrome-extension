const saveBtn = document.getElementById("saveBtn");
const message = document.getElementById("message");
const list = document.getElementById("list");

// 1. À l'ouverture du popup : afficher les pages déjà sauvegardées
showPages();

// 2. Au clic sur le bouton : sauvegarder la page ouverte
saveBtn.addEventListener("click", async () => {
  let step = "";
  try {
    step = "a. trouver l'onglet";
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    step = "b. injecter content.js";
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    step = "c. parler au content script";
    const page = await chrome.tabs.sendMessage(tab.id, { action: "getPageInfo" });

    step = "d. parler au background";
    const result = await chrome.runtime.sendMessage({ action: "savePage", page });

    message.textContent = result.message;
    showPages();
  } catch (error) {
    message.textContent = "Erreur à l'étape : " + step + " ❌";
    console.error(step, error);
  }
});

// Afficher la liste des pages sauvegardées
async function showPages() {
  const data = await chrome.storage.local.get({ pages: [] });
  list.innerHTML = "";

  data.pages.forEach(page => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = page.title;   // textContent, pas innerHTML : sécurité XSS
    link.href = "#";
    link.addEventListener("click", () => chrome.tabs.create({ url: page.url }));
    li.appendChild(link);
    li.append(` (${page.date})`);
    list.appendChild(li);
  });
}