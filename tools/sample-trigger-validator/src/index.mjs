#!/usr/bin/env node
import fs from 'node:fs';

const mapPath = process.argv[2] || 'assets/demo-sample-trigger-maps/hasidic-modern/sample-trigger-map.dml.json';

function fail(message) {
  console.error(`DML sample trigger map validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(mapPath)) {
  fail(`missing file ${mapPath}`);
}

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

if (map.schema !== 'dml.sample_trigger_map.v0') fail('schema must be dml.sample_trigger_map.v0');
if (!map.trigger_map_id) fail('trigger_map_id is required');
if (!map.source_pack) fail('source_pack is required');
if (!map.source_midi_event_plan) fail('source_midi_event_plan is required');
if (!map.policy?.placeholder_slots_only) fail('placeholder_slots_only must be true in Wave 08');
if (!map.track_slots || typeof map.track_slots !== 'object') fail('track_slots is required');

const requiredTracks = ['piano', 'strings', 'bass', 'drums', 'guitar'];

for (const trackId of requiredTracks) {
  const slot = map.track_slots[trackId];
  if (!slot) fail(`missing track slot ${trackId}`);
  if (!slot.instrument_family) fail(`track ${trackId} missing instrument_family`);
  if (!slot.slot) fail(`track ${trackId} missing slot`);
  if (!slot.sample_root) fail(`track ${trackId} missing sample_root`);
  if (!Array.isArray(slot.velocity_layers) || slot.velocity_layers.length === 0) {
    fail(`track ${trackId} missing velocity_layers`);
  }

  for (const layer of slot.velocity_layers) {
    if (!layer.name) fail(`track ${trackId} has unnamed velocity layer`);
    if (!Number.isInteger(layer.min) || !Number.isInteger(layer.max)) {
      fail(`track ${trackId} velocity layer must use integer min/max`);
    }
    if (layer.min < 0 || layer.max > 127 || layer.min > layer.max) {
      fail(`track ${trackId} has invalid velocity layer range`);
    }
  }
}

if (map.playback_boundary?.creates_audio !== false) fail('Wave 08 must not create audio');
if (map.playback_boundary?.creates_playback_plan !== true) fail('Wave 08 must create playback plan');

console.log('DML sample trigger map validation: OK');
console.log('trigger_map:', map.trigger_map_id);
console.log('tracks:', Object.keys(map.track_slots).join(','));
console.log('placeholder_slots_only:', map.policy.placeholder_slots_only);
