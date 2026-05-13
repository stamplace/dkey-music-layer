const grid = document.querySelector("#songsGrid");
const songCount = document.querySelector("#songCount");

const fallbackManifest = {
  title: "DKey Living Songs",
  subtitle: "שירים שהם אתרים חיים",
  items: [
    {
      id: "demo-001",
      title: "DKey Living Song Demo 001",
      subtitle: "שיר שהוא אתר חי",
      artist: "DKey Music Layer",
      key: "Bm",
      bpm: 90,
      durationSeconds: 96,
      url: "./demo-001/",
      clipUrl: "./demo-001/?clip=1",
      songAsset: "../../songs/demo-001/song.dkey.json"
    }
  ]
};

async function loadManifest() {
  try {
    const response = await fetch("./manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return fallbackManifest;
  }
}

function formatDuration(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safe / 60);
  const remaining = String(Math.floor(safe % 60)).padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function renderSongCard(item) {
  const article = document.createElement("article");
  article.className = "song-card";
  article.innerHTML = `
    <div class="song-card-content">
      <div class="song-meta">${item.artist || "DKey"} · ${item.key || "Key"} · ${item.bpm || "BPM"}BPM · ${formatDuration(item.durationSeconds)}</div>
      <h3 class="song-title">${item.title}</h3>
      <p class="song-subtitle">${item.subtitle || ""}</p>
      <div class="actions">
        <a class="primary" href="${item.url}">פתח שיר חי</a>
        <a href="${item.clipUrl}">Clip Mode</a>
      </div>
    </div>
  `;
  return article;
}

async function init() {
  const manifest = await loadManifest();
  const items = Array.isArray(manifest.items) ? manifest.items : [];

  songCount.textContent = `${items.length} נכס/ים`;

  grid.replaceChildren(...items.map(renderSongCard));

  if (items.length === 0) {
    grid.innerHTML = "<p>עדיין אין שירים חיים להצגה.</p>";
  }
}

init();
