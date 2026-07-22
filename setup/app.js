// Lädt data.json und rendert für jeden Eintrag eine Karte mit 3D-Modell.
// Neue Hardware hinzufügen = neuer Eintrag in data.json, kein Code-Änderung nötig.

const CARD_GRID = document.getElementById("card-grid");

async function loadComponents() {
  const response = await fetch("data.json");
  if (!response.ok) {
    throw new Error(`data.json konnte nicht geladen werden (Status ${response.status})`);
  }
  return response.json();
}

// Baut aus einem specs-Objekt ({Key: "Wert"}) eine <li>-Liste.
function buildSpecsList(specs) {
  const list = document.createElement("ul");
  list.className = "specs-list";
  for (const [key, value] of Object.entries(specs)) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="specs-key">${key}</span><span class="specs-value">${value}</span>`;
    list.appendChild(item);
  }
  return list;
}

// Erzeugt das komplette Karten-Element für einen Datensatz aus data.json.
function buildCard(component) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.category = component.category;

  const viewer = document.createElement("model-viewer");
  viewer.setAttribute("src", component.modelPath);
  viewer.setAttribute("alt", component.name);
  viewer.setAttribute("camera-controls", "");
  viewer.setAttribute("auto-rotate", "");
  viewer.setAttribute("shadow-intensity", "1");
  card.appendChild(viewer);

  const body = document.createElement("div");
  body.className = "card-body";

  const categoryLabel = document.createElement("span");
  categoryLabel.className = "card-category";
  categoryLabel.textContent = component.category;
  body.appendChild(categoryLabel);

  const title = document.createElement("h2");
  title.textContent = component.name;
  body.appendChild(title);

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = component.description;
  body.appendChild(description);

  body.appendChild(buildSpecsList(component.specs));

  card.appendChild(body);
  return card;
}

function renderComponents(components) {
  CARD_GRID.innerHTML = "";
  for (const component of components) {
    CARD_GRID.appendChild(buildCard(component));
  }
}

loadComponents()
  .then(renderComponents)
  .catch((error) => {
    CARD_GRID.innerHTML = `<p class="loading-hint">Fehler beim Laden der Komponenten: ${error.message}</p>`;
    console.error(error);
  });