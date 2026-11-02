// The idea lists (categories and moodData) now live in ideas.js

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

// ---------- Drawn ideas (exact ideas only) ----------
function drawnTexts() {
  return new Set(history.map(p => p.text));
}

// ---------- Prompt engine ----------
const seenThisSitting = new Set();

// forced is optional: { catKey, subject } when picked from Explore
function buildPrompt(forced) {
  const f = getFilters();
  const drawn = drawnTexts();
  let style = f.style === "any" ? pick(["simple", "detailed"]) : f.style;
  let catKey;
  let subject;

  if (forced) {
    catKey = forced.catKey;
    subject = forced.subject;
    // A simple idea is identical every time, so if it's drawn, go detailed instead
    if (style === "simple" && drawn.has(`Draw ${subject}.`)) {
      if (f.style === "any") style = "detailed";
      else return null;
    }
  } else {
    const catKeys = f.category === "any" ? Object.keys(categories) : [f.category];
    const pool = [];
    catKeys.forEach(key => {
      categories[key].subjects.forEach(s => pool.push({ catKey: key, subject: s }));
    });
    // Simple ideas never change, so skip the ones you've already drawn
    let options = style === "simple"
      ? pool.filter(c => !drawn.has(`Draw ${c.subject}.`))
      : pool;
    if (options.length === 0 && f.style === "any") {
      style = "detailed";
      options = pool;
    }
    if (options.length === 0) return null;
    const choice = pick(options);
    catKey = choice.catKey;
    subject = choice.subject;
  }

  const cat = categories[catKey];
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
    if (!prompt) return null;
    tries++;
  } while (
    (seenThisSitting.has(prompt.text) || drawnTexts().has(prompt.text)) &&
    tries < 100
  );
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
  const items = history
    .map((p, i) => `<div class="saved-item history-item">
        <strong>${p.title}</strong>${p.text}
        <small>Drawn on ${p.date}</small>
        <button class="delete-btn hist-remove-btn" data-index="${i}">🗑 Remove</button>
      </div>`)
    .reverse()
    .join("");
  list.innerHTML = `<p class="hint">An idea you mark as drawn won’t come up again in exactly the same form. Remove it here to bring it back.</p>` + items;
}

document.getElementById("history-list").addEventListener("click", e => {
  if (!e.target.classList.contains("hist-remove-btn")) return;
  history.splice(Number(e.target.dataset.index), 1);
  saveHistory();
  showHistory();
});

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
  const prompt = generatePrompt();
  if (!prompt) {
    currentPrompt = null;
    document.getElementById("prompt-title").textContent = "Nothing left here";
    document.getElementById("prompt-text").textContent =
      "You’ve drawn every simple idea here. Try Detailed style or another category.";
    document.getElementById("prompt-tags").textContent = "";
    return;
  }
  showPrompt(prompt);
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
const openCats = new Set();

function renderBrowse(query = "") {
  const q = query.trim().toLowerCase();
  const searching = q !== "";
  let html = "";

  Object.keys(categories).forEach(key => {
    const cat = categories[key];
    const matches = cat.subjects.filter(s => s.toLowerCase().includes(q));
    if (matches.length === 0) return;
    // While searching, matching headings open by themselves
    const isOpen = searching || openCats.has(key);
    html += `<div class="browse-group${isOpen ? " open" : ""}">`
      + `<button class="browse-head" data-key="${key}" aria-expanded="${isOpen}">`
      + `<span>${cat.label}</span><span class="chev">▾</span></button>`
      + `<div class="browse-grid">`
      + matches.map(s =>
          `<button class="subject-chip" data-cat="${key}" data-subject="${s}">${cap(s)}</button>`
        ).join("")
      + `</div></div>`;
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
  const head = e.target.closest(".browse-head");
  if (head) {
    const group = head.parentElement;
    const isOpen = group.classList.toggle("open");
    head.setAttribute("aria-expanded", String(isOpen));
    if (searchBox.value.trim() === "") {
      if (isOpen) openCats.add(head.dataset.key);
      else openCats.delete(head.dataset.key);
    }
    return;
  }

  const chip = e.target.closest(".subject-chip");
  if (!chip) return;
  const prompt = buildPrompt({
    catKey: chip.dataset.cat,
    subject: chip.dataset.subject
  });
  if (!prompt) {
    currentPrompt = null;
    document.getElementById("prompt-title").textContent = "Already drawn";
    document.getElementById("prompt-text").textContent =
      "You’ve drawn this exact idea. Set Style to Detailed or Any for a fresh version.";
    document.getElementById("prompt-tags").textContent = "";
    showScreen("home");
    return;
  }
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
