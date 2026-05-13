import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const target = process.argv[2];

if (!target) {
  console.error("Usage: node tools/living-song-validator/src/index.mjs <song.dkey.json>");
  process.exit(1);
}

const filePath = resolve(target);
const rootDir = process.cwd();

function fail(message) {
  console.error(`LIVING_SONG_CHECK_FAILED: ${message}`);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`Invalid JSON at ${path}: ${error.message}`);
  }
}

function requireString(object, key) {
  if (!object[key] || typeof object[key] !== "string") {
    fail(`Missing required string: ${key}`);
  }
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    fail(`Missing ${label}: ${path}`);
  }
}

requireFile(filePath, "song asset");

const song = readJson(filePath);
const songDir = dirname(filePath);

requireString(song, "id");
requireString(song, "type");
requireString(song, "title");
requireString(song, "version");

if (song.type !== "dkey-living-song") {
  fail(`Unexpected song type: ${song.type}`);
}

if (!Number.isFinite(song.durationSeconds) || song.durationSeconds <= 0) {
  fail("durationSeconds must be a positive number");
}

if (!Array.isArray(song.sections) || song.sections.length === 0) {
  fail("sections must be a non-empty array");
}

let lastEnd = 0;

for (const section of song.sections) {
  requireString(section, "id");
  requireString(section, "label");
  requireString(section, "scene");

  if (!Number.isFinite(section.start) || !Number.isFinite(section.end)) {
    fail(`Section ${section.id} must include numeric start/end`);
  }

  if (section.start < lastEnd) {
    fail(`Section ${section.id} overlaps previous section`);
  }

  if (section.end <= section.start) {
    fail(`Section ${section.id} has invalid time range`);
  }

  if (!Number.isFinite(section.energy) || section.energy < 0 || section.energy > 1) {
    fail(`Section ${section.id} energy must be between 0 and 1`);
  }

  lastEnd = section.end;
}

if (lastEnd > song.durationSeconds) {
  fail("Sections exceed durationSeconds");
}

const timingPath = resolve(songDir, song.timing || "");
const lyricsPath = resolve(songDir, song.lyrics || "");
const palettePath = resolve(songDir, song.visual?.palette || "");
const siteEntry = resolve(songDir, song.site?.entry || "");
const exportProfilesPath = song.export?.profiles
  ? resolve(songDir, song.export.profiles)
  : null;

requireFile(timingPath, "timing file");
requireFile(lyricsPath, "lyrics file");
requireFile(palettePath, "palette file");
requireFile(siteEntry, "site entry");

if (exportProfilesPath) {
  requireFile(exportProfilesPath, "export profiles file");
  const exportProfiles = readJson(exportProfilesPath);

  if (!exportProfiles.profiles || typeof exportProfiles.profiles !== "object") {
    fail("export profiles must include a profiles object");
  }

  for (const [profileId, profile] of Object.entries(exportProfiles.profiles)) {
    if (!profile.label || typeof profile.label !== "string") {
      fail(`Export profile ${profileId} missing label`);
    }

    if (!Number.isFinite(profile.width) || !Number.isFinite(profile.height) || !Number.isFinite(profile.fps)) {
      fail(`Export profile ${profileId} must include numeric width, height, and fps`);
    }
  }
}

const timing = readJson(timingPath);

if (!Array.isArray(timing.lyrics)) {
  fail("timing.lyrics must be an array");
}

for (const line of timing.lyrics) {
  if (!Number.isFinite(line.time) || typeof line.text !== "string") {
    fail("Each timing lyric must include numeric time and string text");
  }
}

console.log("LIVING_SONG_CHECK_OK");
console.log(`song: ${song.id}`);
console.log(`title: ${song.title}`);
console.log(`sections: ${song.sections.length}`);
console.log(`durationSeconds: ${song.durationSeconds}`);
console.log(`site: ${siteEntry.replace(`${rootDir}/`, "")}`);
