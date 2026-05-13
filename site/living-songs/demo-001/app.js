const canvas = document.querySelector("#livingCanvas");
const ctx = canvas.getContext("2d");

const titleEl = document.querySelector("#songTitle");
const subtitleEl = document.querySelector("#songSubtitle");
const lyricEl = document.querySelector("#lyricLine");
const sectionEl = document.querySelector("#sectionLabel");
const playBtn = document.querySelector("#playBtn");
const clipBtn = document.querySelector("#clipBtn");
const replayBtn = document.querySelector("#replayBtn");
const progressBar = document.querySelector("#progressBar");
const timeLabel = document.querySelector("#timeLabel");

const SONG_URL = "../../../songs/demo-001/song.dkey.json";
const TIMING_URL = "../../../songs/demo-001/timing.json";

const fallbackSong = {
  title: "DKey Living Song Demo 001",
  subtitle: "שיר שהוא אתר חי",
  durationSeconds: 96,
  bpm: 90,
  sections: [
    { id: "intro", label: "Intro", start: 0, end: 12, energy: 0.22, scene: "small-light" },
    { id: "verse-1", label: "Verse 1", start: 12, end: 42, energy: 0.42, scene: "inner-room" },
    { id: "chorus-1", label: "Chorus", start: 42, end: 68, energy: 0.88, scene: "wide-light" },
    { id: "bridge", label: "Bridge", start: 68, end: 82, energy: 0.35, scene: "quiet-space" },
    { id: "final", label: "Final", start: 82, end: 96, energy: 0.72, scene: "breathing-afterglow" }
  ]
};

const fallbackTiming = {
  lyrics: [
    { time: 0.5, text: "זה לא דף לשיר." },
    { time: 6.0, text: "זה השיר עצמו." },
    { time: 14.0, text: "האור מתחיל קטן," },
    { time: 22.0, text: "נושם מתוך השקט." },
    { time: 42.0, text: "ואז הפזמון נפתח," },
    { time: 50.0, text: "כמו חלון גדול בלילה." },
    { time: 70.0, text: "בסוף הכול נשאר חי —" },
    { time: 84.0, text: "גם אחרי שהשיר נגמר." }
  ]
};

let song = fallbackSong;
let timing = fallbackTiming;

let audioContext;
let oscillator;
let gainNode;

let isPlaying = false;
let startedAt = 0;
let pausedAt = 0;
let bootTime = performance.now();

const particles = Array.from({ length: 90 }, (_, index) => ({
  index,
  x: Math.random(),
  y: Math.random(),
  r: 0.6 + Math.random() * 2.8,
  speed: 0.12 + Math.random() * 0.72,
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

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
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

function ensureAudio() {
  if (audioContext) return;

  audioContext = new AudioContext();
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 185;
  gainNode.gain.value = 0.0001;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
}

function updateDemoAudio(section, time) {
  if (!gainNode || !oscillator) return;

  const pulse = 0.5 + Math.sin(time * song.bpm / 60 * Math.PI * 2) * 0.5;
  const targetGain = isPlaying ? 0.035 + section.energy * 0.055 + pulse * 0.012 : 0.0001;
  const targetFrequency = 120 + section.energy * 190;

  gainNode.gain.setTargetAtTime(targetGain, audioContext.currentTime, 0.06);
  oscillator.frequency.setTargetAtTime(targetFrequency, audioContext.currentTime, 0.08);
}

function draw(time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const section = getSection(time);
  const energy = section.energy || 0.3;
  const runtime = (performance.now() - bootTime) / 1000;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    10,
    width * 0.5,
    height * 0.42,
    Math.max(width, height) * 0.85
  );

  gradient.addColorStop(0, `rgba(124, 199, 255, ${0.12 + energy * 0.26})`);
  gradient.addColorStop(0.35, `rgba(214, 177, 106, ${0.08 + energy * 0.16})`);
  gradient.addColorStop(1, "rgba(5, 7, 17, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const orbRadius = 70 + energy * 190 + Math.sin(runtime * 1.3) * 18;
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.43, orbRadius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(238, 244, 255, ${0.04 + energy * 0.12})`;
  ctx.fill();

  for (const particle of particles) {
    const drift = runtime * particle.speed * (0.2 + energy);
    const x = ((particle.x * width) + Math.sin(drift + particle.phase) * 70) % width;
    const y = ((particle.y * height) + drift * 42) % height;
    const alpha = 0.13 + energy * 0.42;

    ctx.beginPath();
    ctx.arc(x, y, particle.r * (0.7 + energy), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(238, 244, 255, ${alpha})`;
    ctx.fill();
  }

  const waveY = height * (0.68 - energy * 0.08);
  ctx.beginPath();

  for (let x = 0; x <= width; x += 14) {
    const y =
      waveY
      + Math.sin((x * 0.012) + runtime * (1.2 + energy * 3.4)) * (14 + energy * 44)
      + Math.sin((x * 0.027) - runtime * 1.8) * (6 + energy * 18);

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = `rgba(124, 199, 255, ${0.22 + energy * 0.45})`;
  ctx.lineWidth = 1.5 + energy * 3;
  ctx.stroke();

  updateDemoAudio(section, time);
}

function updateUi() {
  const time = getCurrentTime();
  const section = getSection(time);
  const duration = song.durationSeconds || 96;
  const progress = Math.min(100, (time / duration) * 100);

  titleEl.textContent = song.title;
  subtitleEl.textContent = song.subtitle || "";
  sectionEl.textContent = section.label;
  lyricEl.textContent = getLyric(time);
  progressBar.style.width = `${progress}%`;
  timeLabel.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
  playBtn.textContent = isPlaying ? "Pause" : "Play";

  if (isPlaying && time >= duration) {
    stopAtEnd();
  }
}

function stopAtEnd() {
  isPlaying = false;
  pausedAt = song.durationSeconds || 96;
  if (gainNode && audioContext) {
    gainNode.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.08);
  }
}

function frame() {
  const time = getCurrentTime();
  draw(time);
  updateUi();
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
    return;
  }

  if (pausedAt >= (song.durationSeconds || 96)) {
    pausedAt = 0;
  }

  startedAt = performance.now() - pausedAt * 1000;
  isPlaying = true;
}

function replay() {
  ensureAudio();
  pausedAt = 0;
  startedAt = performance.now();
  isPlaying = true;
}

async function init() {
  song = await loadJson(SONG_URL, fallbackSong);
  timing = await loadJson(TIMING_URL, fallbackTiming);

  if (new URLSearchParams(window.location.search).get("clip") === "1") {
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
});

init();
