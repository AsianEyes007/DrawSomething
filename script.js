// ---------- Prompt data ----------
const categories = {
  objects: {
    label: "Objects",
    subjects: [
      "a samurai helmet", "a pocket watch", "a glowing sword", "an antique lantern",
      "a teapot", "a pair of old boots", "a music box", "a compass",
      "a treasure chest", "a sewing machine"
    ]
  },
  environments: {
    label: "Environments",
    subjects: [
      "a lighthouse", "a ramen shop", "a rooftop garden", "a floating market",
      "a mountain temple", "a small harbour", "a treehouse village", "a train station",
      "a desert outpost", "a hidden waterfall"
    ]
  },
  anime: {
    label: "Anime and manga",
    subjects: [
      "a swordswoman", "a ninja on a rooftop", "a mecha pilot", "a magical girl",
      "a wandering ronin", "a cat spirit", "a student with a mysterious power",
      "a demon hunter", "an idol on stage", "a fox-eared warrior"
    ]
  },
  characters: {
    label: "Characters",
    subjects: [
      "an old wizard", "a retired robot", "a lighthouse keeper", "a space pirate",
      "a village baker", "a fox spirit", "a tired knight", "a clockmaker",
      "a deep-sea diver", "a travelling merchant"
    ]
  }
};

const moodData = {
  peaceful: {
    settings: ["on a quiet mountain", "beside a calm lake", "in a sunny meadow", "in a cosy cabin"],
    details: ["bathed in soft morning light", "with gentle falling petals", "surrounded by sleeping animals", "under a warm sunset"]
  },
  dark: {
    settings: ["in a ruined cathedral", "in a foggy graveyard", "deep in a cursed forest", "in a collapsed mine"],
    details: ["lit by a single flickering candle", "covered in cracks and shadows", "watched by glowing eyes", "wrapped in creeping thorns"]
  },
  mysterious: {
    settings: ["inside an abandoned train station", "in a hidden library", "at the end of a foggy pier", "in a room with no doors"],
    details: ["with a locked door that hums", "with strange symbols on the walls", "half hidden in mist", "with a note nobody can read"]
  },
  futuristic: {
    settings: ["in a neon-lit alley", "on a floating city platform", "inside a space station", "in a rain-soaked cyber market"],
    details: ["glowing with holographic light", "with robotic parts showing", "reflected in wet neon streets", "surrounded by drifting drones"]
  },
  fantasy: {
    settings: ["floating above the clouds", "inside a giant tree", "at the edge of a dragon's nest", "in a crystal cave"],
    details: ["covered in glowing runes", "with tiny fairies circling", "wrapped in ancient magic", "with a faint golden aura"]
  }
};

const pick = list => list[Math.floor(Math.random() * list.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- Filter pills (Home) ----------
const filterOptions = {
  category: [
    { value: "any", label: "Anything" },
    { value: "objects", label: "Objects" },
    { value: "environments", label: "Environments" },
    { value: "anime", label: "Anime" },
    { value: "characters", label: "Characters" }
  ],
  style: [
    { value: "any", label: "Any style" },
    { value: "simple", label: "Simple" },
    { value: "detailed", label: "Detailed" }
  ],
  mood: [
    { value: "any", label: "Any mood" },
    { value: "peaceful", label: "Peaceful" },
    { value: "dark", label: "Dark" },
    { value: "mysterious", label: "Mysterious" },
    { value: "futuristic", label: "Futuristic" },
    { value: "fantasy", label: "Fantasy" }
  ]
};
const filterIndex = { category: 0, style: 0, mood: 0 };
const filterKeys = ["category", "style", "mood"];

function getFilters() {
  return {
    category: filterOptions.category[filterIndex.category].value,
    style: filterOptions.style[filterIndex.style].value,
    mood: filterOptions.mood[filterIndex.mood].value
  };
}

function renderPills() {
  filterKeys.forEach(key => {
    document.getElementById("val-" + key).textContent =
      filterOptions[key][filterIndex[key]].label;
  });
  // Mood has no effect on simple ideas, so lock it
  document.getElementById("pill-mood").disabled = getFilters().style === "simple";
}

filterKeys.forEach(key => {
  const pill = document.getElementById("pill-" + key);
  pill.addEventListener("click", () => {
    filterIndex[key] = (filterIndex[key] + 1) % filterOptions[key].length;
    renderPills();
    pill.classList.remove("pop");
    void pill.offsetWidth;
    pill.classList.add("pop");
  });
});
renderPills();

// ---------- Prompt engine ----------
const seenThisSitting = new Set();

// forced is optional: { catKey, subject } when picked from Explore
function buildPrompt(forced) {
  const f = getFilters();
  const catKey = forced
    ? forced.catKey
    : (f.category === "any" ? pick(Object.keys(categories)) : f.category);
  const cat = categories[catKey];
  const style = f.style === "any" ? pick(["simple", "detailed"]) : f.style;
  const subject = forced ? forced.subject : pick(cat.subjects);
  const title = cap(subject);

  if (style === "simple") {
    return { title, text: `Draw ${subject}.`, tags: `${cat.label} · Simple` };
  }

  const moodKey = f.mood === "any" ? pick(Object.keys(moodData)) : f.mood;
  const m = moodData[moodKey];
  return {
    title,
    text: `Draw ${subject} ${pick(m.settings)}, ${pick(m.details)}.`,
    tags: `${cat.label} · Detailed · ${cap(moodKey)}`
  };
}

function generatePrompt() {
  let prompt;
  let tries = 0;
  do {
    prompt = buildPrompt();
    tries++;
  } while (seenThisSitting.has(prompt.text) && tries < 100);
  seenThisSitting.add(prompt.text);
  return prompt;
}

// ---------- Message bubble ----------
let messageTimer;

function showMessage(text, type = "ok") {
  const msg = document.getElementById("save-message");
  clearTimeout(messageTimer);
  msg.textContent = text;
  msg.className = "show " + type;
  messageTimer = setTimeout(() => msg.classList.remove("show"), 2000);
}

// ---------- Screens ----------
const navButtons = document.querySelectorAll("nav button");
const screens = document.querySelectorAll(".screen");

function showScreen(name) {
  navButtons.forEach(b =>
    b.classList.toggle("active", b.dataset.screen === name)
  );
  screens.forEach(s =>
    s.classList.toggle("active", s.id === name)
  );
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.screen));
});

// ---------- Stored lists ----------
let saved = JSON.parse(localStorage.getItem("saved") || "[]");
let history = JSON.parse(localStorage.getItem("history") || "[]");

function saveSaved() {
  localStorage.setItem("saved", JSON.stringify(saved));
}
function saveHistory() {
  localStorage.setItem("history", JSON.stringify(history));
}

// ---------- Drawing history ----------
function showHistory() {
  const list = document.getElementById("history-list");
  if (history.length === 0) {
    list.innerHTML = "<p>Nothing drawn yet.</p>";
    return;
  }
  list.innerHTML = [...history]
    .reverse()
    .map(p => `<div class="saved-item history-item">
        <strong>${p.title}</strong>${p.text}
        <small>Drawn on ${p.date}</small>
      </div>`)
    .join("");
}

// Returns true if added, false if it was already in history
function addToHistory(prompt) {
  if (history.some(p => p.text === prompt.text)) return false;
  history.push({
    title: prompt.title,
    text: prompt.text,
    tags: prompt.tags,
    date: new Date().toLocaleDateString()
  });
  saveHistory();
  showHistory();
  return true;
}

// ---------- Saved ideas ----------
function showSaved() {
  const list = document.getElementById("saved-list");
  if (saved.length === 0) {
    list.innerHTML = "<p>Nothing saved yet.</p>";
    return;
  }
  list.innerHTML = saved
    .map((p, i) => `<div class="saved-item">
        <strong>${p.title}</strong>${p.text}
        <div class="saved-actions">
          <button class="drawn-btn" data-index="${i}">Drawn</button>
          <button class="delete-btn" data-index="${i}">🗑 Remove</button>
        </div>
      </div>`)
    .reverse()
    .join("");
}

document.getElementById("saved-list").addEventListener("click", e => {
  const index = Number(e.target.dataset.index);

  if (e.target.classList.contains("delete-btn")) {
    saved.splice(index, 1);
    saveSaved();
    showSaved();
  } else if (e.target.classList.contains("drawn-btn")) {
    addToHistory(saved[index]);
    saved.splice(index, 1);
    saveSaved();
    showSaved();
  }
});

// ---------- Home screen ----------
let currentPrompt = null;

function showPrompt(prompt) {
  currentPrompt = prompt;
  document.getElementById("prompt-title").textContent = prompt.title;
  document.getElementById("prompt-text").textContent = prompt.text;
  document.getElementById("prompt-tags").textContent = prompt.tags;
}

document.getElementById("new-idea").addEventListener("click", () => {
  showPrompt(generatePrompt());
});

document.getElementById("save-idea").addEventListener("click", () => {
  if (!currentPrompt) return;

  if (saved.some(p => p.text === currentPrompt.text)) {
    showMessage("This idea is already saved", "warn");
    return;
  }

  saved.push(currentPrompt);
  saveSaved();
  showSaved();
  showMessage("Saved ⭐", "ok");
});

document.getElementById("drew-idea").addEventListener("click", () => {
  if (!currentPrompt) return;

  if (addToHistory(currentPrompt)) {
    showMessage("Marked as drawn", "ok");
  } else {
    showMessage("You already drew this one", "warn");
  }
});

// ---------- Explore: search and browse ----------
function renderBrowse(query = "") {
  const q = query.trim().toLowerCase();
  let html = "";

  Object.keys(categories).forEach(key => {
    const cat = categories[key];
    const matches = cat.subjects.filter(s => s.toLowerCase().includes(q));
    if (matches.length === 0) return;
    html += `<h2 class="browse-heading">${cat.label}</h2><div class="browse-grid">`
      + matches.map(s =>
          `<button class="subject-chip" data-cat="${key}" data-subject="${s}">${cap(s)}</button>`
        ).join("")
      + `</div>`;
  });

  document.getElementById("browse-list").innerHTML =
    html || "<p>No subjects found.</p>";
}

const searchBox = document.getElementById("search");
const clearBtn = document.getElementById("clear-search");

searchBox.addEventListener("input", () => {
  clearBtn.classList.toggle("visible", searchBox.value !== "");
  renderBrowse(searchBox.value);
});

clearBtn.addEventListener("click", () => {
  searchBox.value = "";
  clearBtn.classList.remove("visible");
  renderBrowse();
});

document.getElementById("browse-list").addEventListener("click", e => {
  const chip = e.target.closest(".subject-chip");
  if (!chip) return;
  const prompt = buildPrompt({
    catKey: chip.dataset.cat,
    subject: chip.dataset.subject
  });
  seenThisSitting.add(prompt.text);
  showPrompt(prompt);
  showScreen("home");
});

// ---------- Start up ----------
showSaved();
showHistory();
renderBrowse();

// ---------- Offline support ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}