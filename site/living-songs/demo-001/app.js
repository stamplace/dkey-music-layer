const canvas = document.querySelector("#livingCanvas");
const ctx = canvas.getContext("2d");
const clipVideo = document.querySelector("#clipVideo");
const coverFallback = document.querySelector("#coverFallback");

const titleEl = document.querySelector("#songTitle");
const subtitleEl = document.querySelector("#songSubtitle");
const lyricEl = document.querySelector("#lyricLine");
const sectionEl = document.querySelector("#sectionLabel");
const playBtn = document.querySelector("#playBtn");
const clipBtn = document.querySelector("#clipBtn");
const replayBtn = document.querySelector("#replayBtn");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const shareBtn = document.querySelector("#shareBtn");
const copyBtn = document.querySelector("#copyBtn");
const progressBar = document.querySelector("#progressBar");
const timeLabel = document.querySelector("#timeLabel");
const statusLabel = document.querySelector("#statusLabel");
const profileBadge = document.querySelector("#profileBadge");
const toast = document.querySelector("#toast");

const SONG_URL = "../../../songs/demo-001/song.dkey.json";
const TIMING_URL = "../../../songs/demo-001/timing.json";
const EXPORT_PROFILES_URL = "../../../songs/demo-001/export-profiles.json";

const params = new URLSearchParams(window.location.search);
const activeProfile = params.get("profile") || "live";

const fallbackSong = {
  title: "אור שקט",
  subtitle: "שיר חי איטי ונעים",
  durationSeconds: 128,
  bpm: 72,
  sections: [
    { id: "intro", label: "פתיחה", start: 0, end: 18, energy: 0.18, scene: "night-window" },
    { id: "verse-1", label: "בית א׳", start: 18, end: 46, energy: 0.34, scene: "quiet-room" },
    { id: "chorus-1", label: "פזמון", start: 46, end: 74, energy: 0.58, scene: "soft-open-sky" },
    { id: "verse-2", label: "בית ב׳", start: 74, end: 98, energy: 0.38, scene: "slow-road" },
    { id: "final", label: "סיום", start: 98, end: 128, energy: 0.48, scene: "afterglow" }
  ]
};

const fallbackTiming = {
  lyrics: [
    { time: 2, text: "יש רגע קטן" },
    { time: 10, text: "שלא מבקש לנצח." },
    { time: 20, text: "רק להיות כאן," },
    { time: 31, text: "בלי לרוץ לשום מקום." },
    { time: 47, text: "אור שקט יורד עליי," },
    { time: 59, text: "פותח לי חלון בלב." },
    { time: 76, text: "ואני חוזר לאט," },
    { time: 87, text: "אל מה שכבר ידעתי." },
    { time: 100, text: "גם אם הדרך ארוכה," },
    { time: 110, text: "יש נשימה שמחזיקה." },
    { time: 120, text: "ובסוף הלילה אומר:" },
    { time: 125, text: "הכול עוד חי בתוכי." }
  ]
};

const score = {
  chords: [
    { start: 0, end: 18, name: "Bm(add9)", notes: [123.47, 185.0, 246.94, 277.18] },
    { start: 18, end: 46, name: "Gmaj7", notes: [98.0, 196.0, 246.94, 293.66] },
    { start: 46, end: 74, name: "D(add9)", notes: [146.83, 220.0, 293.66, 329.63] },
    { start: 74, end: 98, name: "A(sus4)", notes: [110.0, 220.0, 277.18, 329.63] },
    { start: 98, end: 128, name: "Bm(add9)", notes: [123.47, 185.0, 246.94, 277.18] }
  ],
  melody: [
    { time: 6, note: 493.88, length: 2.8 },
    { time: 14, note: 554.37, length: 2.4 },
    { time: 25, note: 440.0, length: 3.2 },
    { time: 36, note: 493.88, length: 2.6 },
    { time: 50, note: 587.33, length: 3.8 },
    { time: 60, note: 659.25, length: 3.2 },
    { time: 69, note: 587.33, length: 4.2 },
    { time: 80, note: 493.88, length: 3.4 },
    { time: 91, note: 440.0, length: 3.6 },
    { time: 104, note: 493.88, length: 3.4 },
    { time: 116, note: 554.37, length: 3.2 },
    { time: 124, note: 493.88, length: 4.8 }
  ]
};

let song = fallbackSong;
let timing = fallbackTiming;
let exportProfiles = { profiles: {} };
let hasRealVideo = false;

let audioContext;
let masterGain;
let padFilter;
let padVoices = [];
let scheduledNotes = new Set();

let isPlaying = false;
let startedAt = 0;
let pausedAt = 0;
let bootTime = performance.now();
let lastFrameTime = 0;

const stars = Array.from({ length: 54 }, (_, index) => ({
  index,
  x: Math.random(),
  y: Math.random(),
  size: 0.4 + Math.random() * 1.8,
  drift: 0.008 + Math.random() * 0.025,
  phase: Math.random() * Math.PI * 2
}));

const dust = Array.from({ length: 26 }, (_, index) => ({
  index,
  x: Math.random(),
  y: Math.random(),
  size: 20 + Math.random() * 90,
  drift: 0.004 + Math.random() * 0.012,
  phase: Math.random() * Math.PI * 2
}));

async function loadJson(url, fallback) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return fallback;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

function applyProfile() {
  document.body.classList.remove("profile-youtube", "profile-shorts", "profile-telegram");

  if (activeProfile !== "live") {
    document.body.classList.add(`profile-${activeProfile}`);
  }

  const profile = exportProfiles.profiles?.[activeProfile];
  profileBadge.textContent = profile?.label || (activeProfile === "live" ? "Live" : activeProfile);
}

async function tryLoadRealVideo() {
  const videoPath = "../../../songs/demo-001/video/or-shaket.mp4";

  try {
    const response = await fetch(videoPath, { method: "HEAD", cache: "no-store" });
    if (!response.ok) return;

    clipVideo.src = videoPath;
    clipVideo.classList.add("ready");
    hasRealVideo = true;
  } catch {
    hasRealVideo = false;
  }
}

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function getCurrentTime() {
  if (!isPlaying) return pausedAt;
  return Math.min(song.durationSeconds, (performance.now() - startedAt) / 1000);
}

function getSection(time) {
  return song.sections.find((section) => time >= section.start && time < section.end)
    || song.sections[song.sections.length - 1]
    || fallbackSong.sections[0];
}

function getLyric(time) {
  const lines = timing.lyrics || [];
  let current = "לחץ Play כדי להיכנס לשיר.";
  for (const line of lines) {
    if (time >= line.time) current = line.text;
  }
  return current;
}

function getChord(time) {
  return score.chords.find((chord) => time >= chord.start && time < chord.end)
    || score.chords[score.chords.length - 1];
}

function ensureAudio() {
  if (audioContext) return;

  audioContext = new AudioContext();
  masterGain = audioContext.createGain();
  padFilter = audioContext.createBiquadFilter();

  masterGain.gain.value = 0.0001;
  padFilter.type = "lowpass";
  padFilter.frequency.value = 1250;
  padFilter.Q.value = 0.2;

  padFilter.connect(masterGain);
  masterGain.connect(audioContext.destination);

  padVoices = Array.from({ length: 4 }, (_, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = score.chords[0].notes[index];
    gain.gain.value = 0.035 - index * 0.004;

    oscillator.connect(gain);
    gain.connect(padFilter);
    oscillator.start();

    return { oscillator, gain };
  });
}

function scheduleBell(note) {
  if (!audioContext || scheduledNotes.has(note.time)) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = note.note;

  filter.type = "lowpass";
  filter.frequency.value = 2600;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.075, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + note.length);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + note.length + 0.1);

  scheduledNotes.add(note.time);
}

function updateSongAudio(time, section) {
  if (!audioContext || !masterGain || !padVoices.length) return;

  const chord = getChord(time);
  const now = audioContext.currentTime;
  const sectionGain = isPlaying ? 0.08 + section.energy * 0.09 : 0.0001;

  masterGain.gain.setTargetAtTime(sectionGain, now, 0.24);
  padFilter.frequency.setTargetAtTime(780 + section.energy * 980, now, 0.5);

  chord.notes.forEach((frequency, index) => {
    const voice = padVoices[index];
    const slowDrift = Math.sin((time * 0.08) + index) * 0.45;
    voice.oscillator.frequency.setTargetAtTime(frequency + slowDrift, now, 0.55);
  });

  for (const note of score.melody) {
    if (time >= note.time && time <= note.time + 0.25) {
      scheduleBell(note);
    }
  }
}

function sceneColors(scene) {
  const map = {
    "night-window": {
      top: [9, 14, 34],
      center: [80, 118, 164],
      warm: [210, 180, 120]
    },
    "quiet-room": {
      top: [12, 18, 42],
      center: [120, 144, 190],
      warm: [220, 188, 130]
    },
    "soft-open-sky": {
      top: [14, 28, 58],
      center: [116, 176, 230],
      warm: [255, 218, 150]
    },
    "slow-road": {
      top: [8, 13, 31],
      center: [88, 126, 176],
      warm: [210, 170, 118]
    },
    "afterglow": {
      top: [10, 12, 26],
      center: [150, 150, 190],
      warm: [255, 210, 145]
    }
  };

  return map[scene] || map["night-window"];
}

function rgb(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function draw(time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const section = getSection(time);
  const energy = section.energy || 0.3;
  const colors = sceneColors(section.scene);
  const progress = time / (song.durationSeconds || 128);

  ctx.clearRect(0, 0, width, height);

  const fade = ctx.createLinearGradient(0, 0, width, height);
  fade.addColorStop(0, rgb(colors.center, 0.08 + energy * 0.05));
  fade.addColorStop(0.55, "rgba(0,0,0,0)");
  fade.addColorStop(1, rgb(colors.warm, 0.06 + energy * 0.04));
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, width, height);

  const lightX = width * (0.35 + progress * 0.28);
  const lightY = height * 0.36;
  const glow = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, Math.max(width, height) * 0.45);
  glow.addColorStop(0, rgb(colors.warm, 0.10));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  if (!hasRealVideo && coverFallback) {
    coverFallback.style.transform = `scale(${1 + progress * 0.035})`;
  }

  updateSongAudio(time, section);
}

function updateUi() {
  const time = getCurrentTime();
  const section = getSection(time);
  const duration = song.durationSeconds || 128;
  const progress = Math.min(100, (time / duration) * 100);

  titleEl.textContent = song.title;
  subtitleEl.textContent = song.subtitle || "";
  sectionEl.textContent = section.label;
  lyricEl.textContent = getLyric(time);
  progressBar.style.width = `${progress}%`;
  timeLabel.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
  playBtn.textContent = isPlaying ? "Pause" : "Play";
  statusLabel.textContent = document.body.classList.contains("clip-mode")
    ? `Clip Mode · ${activeProfile}`
    : "שיר חי · מוזיקה מובנית · Canvas רגוע";

  if (isPlaying && time >= duration) {
    stopAtEnd();
  }
}

function stopAtEnd() {
  isPlaying = false;
  pausedAt = song.durationSeconds || 128;
  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.12);
  }
}

function frame(frameTime) {
  if (!lastFrameTime || frameTime - lastFrameTime > 40) {
    const time = getCurrentTime();
    draw(time);
    updateUi();
    lastFrameTime = frameTime;
  }

  requestAnimationFrame(frame);
}

function togglePlay() {
  ensureAudio();

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (isPlaying) {
    pausedAt = getCurrentTime();
    isPlaying = false;
    if (masterGain) masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.16);
    if (hasRealVideo) clipVideo.pause();
    return;
  }

  if (pausedAt >= (song.durationSeconds || 128)) {
    pausedAt = 0;
    scheduledNotes.clear();
  }

  startedAt = performance.now() - pausedAt * 1000;
  isPlaying = true;

  if (hasRealVideo) {
    clipVideo.currentTime = pausedAt;
    clipVideo.play().catch(() => {});
  }
}

function replay() {
  ensureAudio();
  scheduledNotes.clear();
  pausedAt = 0;
  startedAt = performance.now();
  isPlaying = true;

  if (hasRealVideo) {
    clipVideo.currentTime = 0;
    clipVideo.play().catch(() => {});
  }
}

async function init() {
  song = await loadJson(SONG_URL, fallbackSong);
  timing = await loadJson(TIMING_URL, fallbackTiming);
  exportProfiles = await loadJson(EXPORT_PROFILES_URL, { profiles: {} });

  applyProfile();
  await tryLoadRealVideo();

  if (params.get("clip") === "1") {
    document.body.classList.add("clip-mode");
  }

  resizeCanvas();
  updateUi();
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resizeCanvas);
playBtn.addEventListener("click", togglePlay);
replayBtn.addEventListener("click", replay);
clipBtn.addEventListener("click", () => {
  document.body.classList.toggle("clip-mode");
  showToast(document.body.classList.contains("clip-mode") ? "Clip Mode On" : "Clip Mode Off");
});

fullscreenBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      showToast("Fullscreen On");
    } else {
      await document.exitFullscreen();
      showToast("Fullscreen Off");
    }
  } catch {
    showToast("Fullscreen לא זמין כאן");
  }
});

copyBtn.addEventListener("click", async () => {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    showToast("הקישור הועתק");
  } catch {
    showToast(url);
  }
});

shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: song.title,
    text: song.subtitle || "DKey Living Song",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    showToast("הקישור הועתק לשיתוף");
  } catch {
    showToast("השיתוף בוטל");
  }
});

init();
