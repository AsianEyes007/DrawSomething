// The idea lists (categories and moodData) now live in ideas.js

window.addEventListener("error", e => alert("Error: " + e.message + " (line " + e.lineno + ")"));

const pick = list => list[Math.floor(Math.random() * list.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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
let savedDefaults = {};
try {
  savedDefaults = JSON.parse(localStorage.getItem("defaultFilters") || "{}") || {};
} catch (err) { /* ignore */ }
filterKeys.forEach(key => {
  const i = filterOptions[key].findIndex(o => o.value === savedDefaults[key]);
  if (i >= 0) filterIndex[key] = i;
});

let selected = []; // subjects picked in Explore: { catKey, subject }

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

function buildPrompt() {
  const f = getFilters();
  const drawn = drawnTexts();
  let style = f.style === "any" ? pick(["simple", "detailed"]) : f.style;

  let pool = [];
  if (selected.length > 0) {
    pool = selected.slice();
  } else {
    const catKeys = f.category === "any" ? Object.keys(categories) : [f.category];
    catKeys.forEach(key => {
      categories[key].subjects.forEach(s => pool.push({ catKey: key, subject: s }));
    });
  }
  // Simple ideas never change, so skip the ones you've already drawn
  let options = style === "simple" && f.mood === "any"
    ? pool.filter(c => !drawn.has(`Draw ${c.subject}.`))
    : pool;
  if (options.length === 0 && f.style === "any") {
    style = "detailed";
    options = pool;
  }
  if (options.length === 0) return null;
  const choice = pick(options);
  const catKey = choice.catKey;
  const subject = choice.subject;

  const cat = categories[catKey];
  const title = cap(subject);

  if (style === "simple") {
    if (f.mood === "any") {
      return { title, text: `Draw ${subject}.`, tags: `${cat.label} · Simple` };
    }
    const feel = pick(moodData[f.mood].feels);
    return {
      title,
      text: `Draw ${subject}, ${feel}.`,
      tags: `${cat.label} · Simple · ${cap(f.mood)}`
    };
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
    btn.addEventListener("click", () => {
    showScreen(btn.dataset.screen);
    if (btn.dataset.screen === "history") showHistoryView(false);
  });
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

  const q = (document.getElementById("history-search").value || "").trim().toLowerCase();
  const moodV = document.getElementById("hist-mood").value || "any";
  const styleV = document.getElementById("hist-style").value || "any";
  const filtering = q !== "" || moodV !== "any" || styleV !== "any";

  const shown = history
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => {
      const parts = (p.tags || "").toLowerCase().split(" · ");
      if (moodV !== "any" && !parts.includes(moodV)) return false;
      if (styleV !== "any" && !parts.includes(styleV)) return false;
      const all = (p.title || "") + " " + (p.text || "") + " " + (p.tags || "");
      if (q && !all.toLowerCase().includes(q)) return false;
      return true;
    });

  if (shown.length === 0) {
    list.innerHTML = "<p>Nothing matches that search.</p>";
    return;
  }

  const items = shown
    .map(({ p, i }) => `<div class="saved-item history-item">
        <strong>${esc(p.title)}</strong>${esc(p.text)}
        <small>Drawn on ${esc(p.date)}</small>
        <div class="photo-row" data-index="${i}"></div>
        <div class="saved-actions">
          <button class="photo-add-btn" data-index="${i}">Add photo</button>
          <button class="compare-btn" data-index="${i}" hidden>Compare</button>
          <button class="delete-btn hist-remove-btn" data-index="${i}">Remove</button>
        </div>
      </div>`)
    .reverse()
    .join("");

  const note = filtering
    ? `<p class="hint">Showing ${shown.length} of ${history.length} drawn ideas.</p>`
    : `<p class="hint">An idea you mark as drawn won’t come up again in exactly the same form. Remove it here to bring it back.</p>`;
  list.innerHTML = note + items;
  loadPhotoRows();
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
        <strong>${esc(p.title)}</strong>${esc(p.text)}
        <div class="saved-actions">
          <button class="drawn-btn" data-index="${i}">Drawn</button>
          <button class="delete-btn" data-index="${i}">Remove</button>
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

function newIdea() {
  const prompt = generatePrompt();
  if (!prompt) {
    currentPrompt = null;
    document.getElementById("prompt-title").textContent = "Nothing left here";
    document.getElementById("prompt-text").textContent =
      "You’ve drawn every simple idea here. Try Detailed style or other subjects.";
    document.getElementById("prompt-tags").textContent = "";
    return;
  }
  showPrompt(prompt);
}
document.getElementById("new-idea").addEventListener("click", newIdea);

document.getElementById("save-idea").addEventListener("click", () => {
  if (!currentPrompt) return;

  if (saved.some(p => p.text === currentPrompt.text)) {
    showMessage("This idea is already saved", "warn");
    return;
  }

  saved.push(currentPrompt);
  saveSaved();
  showSaved();
  showMessage("Saved", "ok");
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
          `<button class="subject-chip${isSelected(key, s) ? " selected" : ""}" data-cat="${key}" data-subject="${s}">${cap(s)}</button>`
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
  toggleSelected(chip.dataset.cat, chip.dataset.subject);
  chip.classList.toggle("selected", isSelected(chip.dataset.cat, chip.dataset.subject));
});

document.getElementById("explore-go").addEventListener("click", () => {
  showScreen("home");
  newIdea();
});

// ---------- Version ----------
const APP_VERSION = "2.2.2";
const versionEl = document.getElementById("version");
if (versionEl) versionEl.textContent = "DrawSomething v" + APP_VERSION;

// ---------- Backup and restore ----------
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");
const backupNote = document.getElementById("backup-note");
const storageNote = document.getElementById("storage-note");
const lastBackupEl = document.getElementById("last-backup");

function showLastBackup() {
  if (!lastBackupEl) return;
    lastBackupEl.innerHTML =
    "Backs up your saved ideas, drawn ideas and photos.<br>Last backup: " +
    esc(localStorage.getItem("lastBackup") || "never");
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function dataURLToBuffer(url) {
  const bin = atob(url.slice(url.indexOf(",") + 1));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

const getAllPhotos = () => dbTx("readonly", s => s.getAll());

async function exportBackup() {
  backupNote.textContent = "Preparing backup...";
  const photos = [];
  try {
    const all = await getAllPhotos();
    for (const p of all) {
      const type = p.type || "image/jpeg";
      photos.push({
        ideaText: p.ideaText,
        added: p.added,
        type,
        image: await blobToDataURL(new Blob([p.data], { type }))
      });
    }
  } catch (err) {
    backupNote.textContent = "Couldn’t read your photos, so no backup was saved.";
    return;
  }

  const data = {
    app: "DrawSomething",
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    saved,
    history,
    photos
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "drawsomething-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  localStorage.setItem("lastBackup", new Date().toLocaleDateString());
  showLastBackup();
  backupNote.textContent =
    "Backup saved to your Downloads with " + photos.length + " photo(s). Keep a copy somewhere safe, like Google Drive.";
}

function cleanItem(p, withDate) {
  if (!p || typeof p.text !== "string" || typeof p.title !== "string") return null;
  const item = {
    title: p.title,
    text: p.text,
    tags: typeof p.tags === "string" ? p.tags : ""
  };
  if (withDate) item.date = typeof p.date === "string" ? p.date : "";
  return item;
}

// Importing adds what's missing and never deletes anything you already have
function importBackup(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    let data;
    try {
      data = JSON.parse(reader.result);
      if (!data || data.app !== "DrawSomething") throw new Error("not a backup");
    } catch (err) {
      backupNote.textContent = "That file doesn’t look like a DrawSomething backup.";
      return;
    }

    let addedSaved = 0;
    let addedHistory = 0;
    let addedPhotos = 0;
    let photoFailed = false;

    (Array.isArray(data.saved) ? data.saved : []).forEach(p => {
      const item = cleanItem(p, false);
      if (item && !saved.some(s => s.text === item.text)) {
        saved.push(item);
        addedSaved++;
      }
    });
    (Array.isArray(data.history) ? data.history : []).forEach(p => {
      const item = cleanItem(p, true);
      if (item && !history.some(h => h.text === item.text)) {
        history.push(item);
        addedHistory++;
      }
    });
    saveSaved();
    saveHistory();

    if (Array.isArray(data.photos)) {
      try {
        const existing = new Set((await getAllPhotos()).map(p => p.ideaText + "|" + p.added));
        for (const p of data.photos) {
          if (!p || typeof p.ideaText !== "string" || typeof p.image !== "string") continue;
          const added = typeof p.added === "number" ? p.added : Date.now();
          const key = p.ideaText + "|" + added;
          if (existing.has(key)) continue;
          const buffer = dataURLToBuffer(p.image);
          const type = typeof p.type === "string" ? p.type : "image/jpeg";
          await dbTx("readwrite", s => s.add({ ideaText: p.ideaText, data: buffer, type, added }));
          existing.add(key);
          addedPhotos++;
        }
      } catch (err) {
        photoFailed = true;
      }
    }

    showSaved();
    showHistory();
    backupNote.textContent =
      "Imported " + addedSaved + " saved ideas, " + addedHistory + " drawn ideas and " +
      addedPhotos + " photo(s)." + (photoFailed ? " Some photos couldn’t be imported." : "");
  };
  reader.readAsText(file);
}

// Ask Chrome to protect this app's data from being cleared when storage runs low
async function protectStorage() {
  if (!storageNote) return;
  try {
        if (!(navigator.storage && navigator.storage.persist)) {
      storageNote.textContent =
        "Storage protection isn’t available here, so export a backup now and then.";
      return;
    }
    let ok = await navigator.storage.persisted();
    if (!ok) ok = await navigator.storage.persist();
    storageNote.textContent = ok
      ? "Chrome has marked your data as protected from low-storage clearing."
      : "Your data isn’t guaranteed to survive low storage, so export a backup now and then.";
  } catch (err) {
    // not supported here, nothing to show
  }
}

// ---------- History page: settings sub-page ----------
const historyMain = document.getElementById("history-main");
const historySettings = document.getElementById("history-settings");

function showHistoryView(showSettings) {
  historyMain.classList.toggle("hidden", showSettings);
  historySettings.classList.toggle("open", showSettings);
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}


// ---------- Photos (IndexedDB) ----------
let dbPromise;
function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open("drawsomething-photos", 1);
      req.onupgradeneeded = () => {
        const store = req.result.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
        store.createIndex("ideaText", "ideaText");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}
function dbTx(mode, fn) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t = db.transaction("photos", mode);
    const req = fn(t.objectStore("photos"));
    t.oncomplete = () => resolve(req.result);
    t.onerror = () => reject(t.error);
  }));
}
const addPhoto = async (ideaText, blob) => {
  const data = await blob.arrayBuffer();
  return dbTx("readwrite", s =>
    s.add({ ideaText, data, type: blob.type || "image/jpeg", added: Date.now() })
  );
};
const getPhotos = ideaText =>
  dbTx("readonly", s => s.index("ideaText").getAll(ideaText));
const deletePhoto = id =>
  dbTx("readwrite", s => s.delete(id));

function resizeImage(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => (b ? resolve(b) : reject(new Error("fail"))), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
    img.src = url;
  });
}

let photoUrls = [];
let photoRun = 0;
async function loadPhotoRows() {
  const run = ++photoRun;
  const rows = document.querySelectorAll(".photo-row");
  const newUrls = [];
  for (const row of rows) {
    const item = history[Number(row.dataset.index)];
    if (!item) continue;
    try {
      const photos = (await getPhotos(item.text)).sort((a, b) => a.added - b.added);
      if (run !== photoRun) {
        newUrls.forEach(u => URL.revokeObjectURL(u));
        return;
      }
      row.innerHTML = photos.map(p => {
        const blob = new Blob([p.data], { type: p.type });
        const url = URL.createObjectURL(blob);
        newUrls.push(url);
        return `<div class="thumb"><img src="${url}" data-full="${url}" alt="My drawing">`
          + `<button class="thumb-del" data-id="${p.id}" aria-label="Delete photo">✕</button></div>`;
      }).join("");
      const card = row.closest(".saved-item");
      const cmp = card && card.querySelector(".compare-btn");
      if (cmp) cmp.hidden = photos.length < 2;
    } catch (err) {
      row.textContent = "Couldn’t load photos: " + err.message;
    }
  }
  photoUrls.forEach(u => URL.revokeObjectURL(u));
  photoUrls = newUrls;
}

const photoInput = document.createElement("input");
photoInput.type = "file";
photoInput.accept = "image/*";
photoInput.multiple = true;
photoInput.hidden = true;
document.body.appendChild(photoInput);
let photoTarget = null;

photoInput.addEventListener("change", async () => {
  const files = Array.from(photoInput.files || []);
  if (!files.length || !photoTarget) return;
  try {
    for (const f of files) await addPhoto(photoTarget, await resizeImage(f));
  } catch (err) {
    alert("Couldn’t add that photo: " + (err && err.message ? err.message : err));
  }
  photoInput.value = "";
  loadPhotoRows();
});

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = '<img alt="">';
document.body.appendChild(lightbox);
lightbox.addEventListener("click", () => lightbox.classList.remove("open"));

document.getElementById("history-list").addEventListener("click", async e => {
  const t = e.target;

    if (t.classList.contains("compare-btn")) {
    const item = history[Number(t.dataset.index)];
    if (item) openCompare(item.text, item.title);
    return;
  }

  if (t.classList.contains("photo-add-btn")) {
    const item = history[Number(t.dataset.index)];
    if (!item) return;
    photoTarget = item.text;
    photoInput.click();
    return;
  }
  if (t.classList.contains("thumb-del")) {
    if (confirm("Delete this photo?")) {
      await deletePhoto(Number(t.dataset.id));
      loadPhotoRows();
    }
    return;
  }
  if (t.tagName === "IMG" && t.dataset.full) {
    lightbox.querySelector("img").src = t.dataset.full;
    lightbox.classList.add("open");
    return;
  }
  if (t.classList.contains("hist-remove-btn")) {
    const index = Number(t.dataset.index);
    const item = history[index];
    if (!item) return;
    const photos = await getPhotos(item.text).catch(() => []);
    if (photos.length && !confirm("Removing this also deletes its " + photos.length + " photo(s). Continue?")) return;
    for (const p of photos) await deletePhoto(p.id);
    history.splice(index, 1);
    saveHistory();
    showHistory();
  }
});

// ---------- Selected subjects (chips on Home) ----------
function isSelected(catKey, subject) {
  return selected.some(s => s.catKey === catKey && s.subject === subject);
}

function toggleSelected(catKey, subject) {
  const i = selected.findIndex(s => s.catKey === catKey && s.subject === subject);
  if (i >= 0) selected.splice(i, 1);
  else selected.push({ catKey, subject });
  renderSelected();
}

function renderSelected() {
  document.getElementById("selected-chips").innerHTML = selected
    .map((s, i) => `<button class="sel-chip" data-index="${i}">${esc(cap(s.subject))} <span>✕</span></button>`)
    .join("");
  document.getElementById("pill-category").classList.toggle("dim", selected.length > 0);
  document.getElementById("explore-bar").classList.toggle("visible", selected.length > 0);
  document.getElementById("explore-go").textContent = "Use " + selected.length + " selected →";
}

document.getElementById("selected-chips").addEventListener("click", e => {
  const chip = e.target.closest(".sel-chip");
  if (!chip) return;
  selected.splice(Number(chip.dataset.index), 1);
  renderSelected();
  renderBrowse(searchBox.value);
});

// ---------- Default filters (Settings) ----------
filterKeys.forEach(key => {
  const sel = document.getElementById("def-" + key);
  if (!sel) return;
  sel.innerHTML = filterOptions[key]
    .map(o => `<option value="${o.value}">${o.label}</option>`).join("");
  sel.value = savedDefaults[key] || "any";
  sel.addEventListener("change", () => {
    savedDefaults[key] = sel.value;
    localStorage.setItem("defaultFilters", JSON.stringify(savedDefaults));
    filterIndex[key] = filterOptions[key].findIndex(o => o.value === sel.value);
    renderPills();
  });
});

// ---------- Settings open/close ----------
document.getElementById("open-settings").addEventListener("click", () => {
  document.getElementById("history-main").classList.add("hidden");
  document.getElementById("history-settings").classList.add("open");
  window.scrollTo(0, 0);
});
document.getElementById("settings-back").addEventListener("click", () => {
  document.getElementById("history-main").classList.remove("hidden");
  document.getElementById("history-settings").classList.remove("open");
  window.scrollTo(0, 0);
});

// ---------- Compare photos ----------
const compare = document.createElement("div");
compare.className = "compare";
compare.innerHTML =
  '<div class="compare-bar"><button class="compare-close">‹ Close</button><span class="compare-title"></span></div>' +
  '<div class="compare-pick"><select class="compare-left" aria-label="Left photo"></select>' +
  '<select class="compare-right" aria-label="Right photo"></select></div>' +
  '<div class="compare-views"><img class="compare-img-left" alt="Left photo">' +
  '<img class="compare-img-right" alt="Right photo"></div>';
document.body.appendChild(compare);

const cmpLeft = compare.querySelector(".compare-left");
const cmpRight = compare.querySelector(".compare-right");
const cmpImgLeft = compare.querySelector(".compare-img-left");
const cmpImgRight = compare.querySelector(".compare-img-right");
let compareUrls = [];

function updateCompare() {
  cmpImgLeft.src = compareUrls[Number(cmpLeft.value)] || "";
  cmpImgRight.src = compareUrls[Number(cmpRight.value)] || "";
}

function closeCompare() {
  compare.classList.remove("open");
  cmpImgLeft.removeAttribute("src");
  cmpImgRight.removeAttribute("src");
  compareUrls.forEach(u => URL.revokeObjectURL(u));
  compareUrls = [];
}

async function openCompare(ideaText, title) {
  let photos;
  try {
    photos = (await getPhotos(ideaText)).sort((a, b) => a.added - b.added);
  } catch (err) {
    alert("Couldn’t load photos: " + err.message);
    return;
  }
  if (photos.length < 2) return;
  closeCompare();
  compareUrls = photos.map(p => URL.createObjectURL(new Blob([p.data], { type: p.type })));
  const options = photos
    .map((p, i) => `<option value="${i}">Photo ${i + 1} · ${esc(new Date(p.added).toLocaleDateString())}</option>`)
    .join("");
  cmpLeft.innerHTML = options;
  cmpRight.innerHTML = options;
  cmpLeft.value = "0";
  cmpRight.value = String(photos.length - 1);
  compare.querySelector(".compare-title").textContent = title || "";
  updateCompare();
  compare.classList.add("open");
}

compare.querySelector(".compare-close").addEventListener("click", closeCompare);
cmpLeft.addEventListener("change", updateCompare);
cmpRight.addEventListener("change", updateCompare);

// ---------- History search and filters ----------
const histSearch = document.getElementById("history-search");
const histClear = document.getElementById("history-clear");
const histMood = document.getElementById("hist-mood");
const histStyle = document.getElementById("hist-style");

histMood.innerHTML = filterOptions.mood
  .map(o => `<option value="${o.value}">${o.label}</option>`).join("");
histStyle.innerHTML = filterOptions.style
  .map(o => `<option value="${o.value}">${o.label}</option>`).join("");

let histTimer;
histSearch.addEventListener("input", () => {
  histClear.classList.toggle("visible", histSearch.value !== "");
  clearTimeout(histTimer);
  histTimer = setTimeout(showHistory, 200);
});
histClear.addEventListener("click", () => {
  histSearch.value = "";
  histClear.classList.remove("visible");
  showHistory();
});
histMood.addEventListener("change", showHistory);
histStyle.addEventListener("change", showHistory);

// ---------- Start up ----------
showSaved();
showHistory();
renderBrowse();
renderSelected();
showLastBackup();
protectStorage();

// ---------- Offline support ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
