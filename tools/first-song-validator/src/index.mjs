#!/usr/bin/env node
import fs from 'node:fs';

const inputPath = process.argv[2] || 'assets/demo-first-songs/hasidic-modern/first-song.dml.json';

function fail(message) {
  console.error(`First song validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(inputPath)) fail(`missing first song file ${inputPath}`);

const song = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

if (song.schema !== 'dml.first_song_brief.v0') fail('schema must be dml.first_song_brief.v0');
if (song.product !== 'DKey Music Layer') fail('product must be DKey Music Layer');
if (!song.title || typeof song.title !== 'string') fail('title is required');
if (!song.musical_intent || typeof song.musical_intent !== 'object') fail('musical_intent is required');
if (!song.musical_intent.theme) fail('musical_intent.theme is required');
if (!song.musical_intent.emotion) fail('musical_intent.emotion is required');
if (!song.musical_intent.key) fail('musical_intent.key is required');
if (!Number.isInteger(song.musical_intent.bpm)) fail('musical_intent.bpm must be an integer');
if (song.musical_intent.bpm < 50 || song.musical_intent.bpm > 180) fail('musical_intent.bpm must be between 50 and 180');
if (song.musical_intent.human_role !== 'conductor') fail('human_role must be conductor');
if (!Array.isArray(song.arrangement) || song.arrangement.length < 3) fail('arrangement must include at least 3 sections');
if (!Array.isArray(song.tracks) || song.tracks.length < 3) fail('tracks must include at least 3 tracks');
if (!song.production_direction) fail('production_direction is required');
if (song.boundaries?.creates_audio !== false) fail('first song brief must not create audio');
if (song.boundaries?.loads_real_samples !== false) fail('first song brief must not load real samples');
if (song.boundaries?.requires_rights_gate_for_real_assets !== true) fail('rights gate is required before real assets');

const requiredSections = ['intro', 'verse', 'chorus'];
const sections = new Set(song.arrangement.map((section) => section.section));
for (const required of requiredSections) {
  if (!sections.has(required)) fail(`missing required arrangement section ${required}`);
}

for (const section of song.arrangement) {
  if (!section.section) fail('section name is required');
  if (!Number.isInteger(section.bars) || section.bars <= 0) fail(`section ${section.section} must have positive integer bars`);
  if (!section.energy) fail(`section ${section.section} missing energy`);
  if (!section.focus) fail(`section ${section.section} missing focus`);
}

console.log('First song validation: OK');
console.log('title:', song.title);
console.log('key:', song.musical_intent.key);
console.log('bpm:', song.musical_intent.bpm);
console.log('sections:', song.arrangement.map((section) => section.section).join(','));
console.log('tracks:', song.tracks.join(','));
