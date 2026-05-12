#!/usr/bin/env node
import fs from 'node:fs';

const previewPath = process.argv[2] || 'generated/sample-slot-previews/hasidic-modern/sample-slot-preview.dml.json';

function fail(message) {
  console.error(`Sample slot preview check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(previewPath)) fail(`missing preview ${previewPath}`);

const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'));

if (preview.schema !== 'dml.sample_slot_preview.v0') fail('schema must be dml.sample_slot_preview.v0');
if (!preview.preview_id) fail('preview_id is required');
if (!preview.source_playback_plan) fail('source_playback_plan is required');
if (preview.deterministic !== true) fail('preview must be deterministic');
if (!Array.isArray(preview.timeline) || preview.timeline.length < 10) fail('expected at least 10 preview events');
if (preview.boundary?.creates_audio !== false) fail('preview must not create audio');
if (preview.boundary?.loads_real_samples !== false) fail('preview must not load real samples');
if (preview.boundary?.writes_wav !== false) fail('preview must not write wav');

const requiredTracks = ['piano', 'strings', 'bass', 'drums', 'guitar'];
const tracks = new Set(preview.summary?.tracks || []);

for (const track of requiredTracks) {
  if (!tracks.has(track)) fail(`missing track ${track}`);
}

for (const item of preview.timeline) {
  if (!Number.isInteger(item.tick)) fail('timeline item missing integer tick');
  if (!Number.isInteger(item.end_tick)) fail('timeline item missing integer end_tick');
  if (item.end_tick <= item.tick) fail('timeline item end_tick must be after tick');
  if (!item.sample_slot) fail('timeline item missing sample_slot');
  if (!item.velocity_layer) fail('timeline item missing velocity_layer');
  if (!item.preview_label) fail('timeline item missing preview_label');
}

console.log('Sample slot preview check: OK');
console.log('preview:', preview.preview_id);
console.log('preview_events:', preview.timeline.length);
console.log('tracks:', preview.summary.tracks.join(','));
console.log('sections:', preview.summary.sections.join(','));
