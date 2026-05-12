#!/usr/bin/env node
import fs from 'node:fs';

const planPath = process.argv[2] || 'generated/playback-plans/hasidic-modern/playback-plan.dml.json';

function fail(message) {
  console.error(`Playback plan check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(planPath)) fail(`missing playback plan ${planPath}`);

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));

if (plan.schema !== 'dml.playback_plan.v0') fail('schema must be dml.playback_plan.v0');
if (!plan.playback_plan_id) fail('playback_plan_id is required');
if (!plan.source_midi_event_plan) fail('source_midi_event_plan is required');
if (!plan.source_trigger_map) fail('source_trigger_map is required');
if (!Array.isArray(plan.triggers) || plan.triggers.length < 10) fail('expected at least 10 triggers');
if (plan.boundary?.creates_audio !== false) fail('playback plan must not create audio in Wave 08');

const requiredTracks = ['piano', 'strings', 'bass', 'drums', 'guitar'];
const tracks = new Set(plan.summary?.tracks || []);

for (const track of requiredTracks) {
  if (!tracks.has(track)) fail(`missing track ${track}`);
}

for (const trigger of plan.triggers) {
  if (!trigger.sample_slot) fail('trigger missing sample_slot');
  if (!trigger.sample_root) fail('trigger missing sample_root');
  if (!trigger.velocity_layer) fail('trigger missing velocity_layer');
  if (trigger.creates_audio !== false) fail('trigger must not create audio in Wave 08');
}

console.log('Playback plan check: OK');
console.log('playback_plan:', plan.playback_plan_id);
console.log('triggers:', plan.triggers.length);
console.log('tracks:', plan.summary.tracks.join(','));
console.log('sections:', plan.summary.sections.join(','));
