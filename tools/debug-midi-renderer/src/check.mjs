#!/usr/bin/env node
import fs from 'node:fs';

const artifactPath = process.argv[2] || 'generated/debug-midi/hasidic-modern/debug-midi-render.dml.json';

function fail(message) {
  console.error(`Debug MIDI artifact check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(artifactPath)) {
  fail(`missing artifact ${artifactPath}`);
}

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

if (artifact.schema !== 'dml.debug_midi_render.v0') fail('schema must be dml.debug_midi_render.v0');
if (!artifact.render_id) fail('render_id is required');
if (!artifact.source_midi_event_plan) fail('source_midi_event_plan is required');
if (!artifact.summary) fail('summary is required');
if (artifact.summary.event_count < 10) fail('expected at least 10 events');
if (artifact.summary.track_count < 5) fail('expected at least 5 tracks');
if (artifact.summary.section_count < 3) fail('expected at least 3 sections');
if (!artifact.render_policy?.debug_only) fail('artifact must be debug_only');

const requiredTracks = ['piano', 'bass', 'drums', 'strings', 'guitar'];
const tracks = new Set(artifact.summary.tracks || []);

for (const track of requiredTracks) {
  if (!tracks.has(track)) fail(`missing track ${track}`);
}

console.log('Debug MIDI artifact check: OK');
console.log('render:', artifact.render_id);
console.log('events:', artifact.summary.event_count);
console.log('tracks:', artifact.summary.tracks.join(','));
console.log('sections:', artifact.summary.sections.join(','));
