#!/usr/bin/env node
import fs from 'node:fs';

const midiPath = process.argv[2] || 'assets/demo-midi-events/hasidic-modern/midi-events.dml.json';

function fail(message) {
  console.error(`DML MIDI event validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(midiPath)) {
  fail(`missing file ${midiPath}`);
}

const plan = JSON.parse(fs.readFileSync(midiPath, 'utf8'));

if (plan.schema !== 'dml.midi_events.v0') fail('schema must be dml.midi_events.v0');
if (!plan.midi_event_plan_id) fail('midi_event_plan_id is required');
if (!plan.source_performance) fail('source_performance is required');
if (!plan.timebase?.ppq) fail('timebase.ppq is required');
if (!plan.timebase?.bpm) fail('timebase.bpm is required');
if (!Array.isArray(plan.events) || plan.events.length === 0) fail('events must be a non-empty array');

const tracks = new Set();
const sections = new Set();

for (const event of plan.events) {
  if (!event.section) fail('event.section is required');
  if (!event.track) fail('event.track is required');
  if (!Number.isInteger(event.tick) || event.tick < 0) fail('event.tick must be a non-negative integer');
  if (event.type !== 'note') fail('only note events are supported in Wave 05');
  if (!Number.isInteger(event.note) || event.note < 0 || event.note > 127) fail('event.note must be 0-127');
  if (!Number.isInteger(event.duration) || event.duration <= 0) fail('event.duration must be positive');
  if (!Number.isInteger(event.velocity) || event.velocity < 0 || event.velocity > 127) fail('event.velocity must be 0-127');
  if (!event.articulation) fail('event.articulation is required');
  if (!Number.isInteger(event.humanize_ms)) fail('event.humanize_ms must be an integer');

  tracks.add(event.track);
  sections.add(event.section);
}

const expectations = plan.smoke_expectations;
if (!expectations) fail('smoke_expectations is required');
if (plan.events.length < expectations.min_events) fail('not enough events');

for (const track of expectations.required_tracks || []) {
  if (!tracks.has(track)) fail(`missing required track ${track}`);
}

for (const section of expectations.required_sections || []) {
  if (!sections.has(section)) fail(`missing required section ${section}`);
}

console.log('DML MIDI event validation: OK');
console.log('midi_event_plan:', plan.midi_event_plan_id);
console.log('events:', plan.events.length);
console.log('tracks:', [...tracks].join(','));
console.log('sections:', [...sections].join(','));
