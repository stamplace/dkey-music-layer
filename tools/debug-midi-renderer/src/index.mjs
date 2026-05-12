#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'assets/demo-midi-events/hasidic-modern/midi-events.dml.json';
const outputPath = process.argv[3] || 'generated/debug-midi/hasidic-modern/debug-midi-render.dml.json';

function fail(message) {
  console.error(`Debug MIDI render failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  fail(`missing input ${inputPath}`);
}

const plan = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

if (plan.schema !== 'dml.midi_events.v0') fail('input schema must be dml.midi_events.v0');
if (!Array.isArray(plan.events) || plan.events.length === 0) fail('input events are required');

const tracks = {};
const sections = {};

for (const event of plan.events) {
  tracks[event.track] ??= [];
  sections[event.section] ??= {
    section: event.section,
    start_tick: event.tick,
    end_tick: event.tick
  };

  tracks[event.track].push({
    tick: event.tick,
    note: event.note,
    duration: event.duration,
    velocity: event.velocity,
    articulation: event.articulation,
    humanize_ms: event.humanize_ms,
    section: event.section
  });

  sections[event.section].start_tick = Math.min(sections[event.section].start_tick, event.tick);
  sections[event.section].end_tick = Math.max(sections[event.section].end_tick, event.tick + event.duration);
}

const orderedTracks = Object.fromEntries(
  Object.entries(tracks).map(([track, events]) => [
    track,
    events.sort((a, b) => a.tick - b.tick)
  ])
);

const orderedSections = Object.values(sections).sort((a, b) => a.start_tick - b.start_tick);

const artifact = {
  schema: 'dml.debug_midi_render.v0',
  render_id: 'debug-render-demo-hasidic-modern',
  source_midi_event_plan: plan.midi_event_plan_id,
  generated_at: new Date().toISOString(),
  timebase: plan.timebase,
  summary: {
    event_count: plan.events.length,
    track_count: Object.keys(orderedTracks).length,
    section_count: orderedSections.length,
    tracks: Object.keys(orderedTracks),
    sections: orderedSections.map((section) => section.section),
    start_tick: Math.min(...plan.events.map((event) => event.tick)),
    end_tick: Math.max(...plan.events.map((event) => event.tick + event.duration))
  },
  tracks: orderedTracks,
  sections: orderedSections,
  render_policy: {
    debug_only: true,
    writes_standard_midi_file: false,
    safe_to_commit: true,
    next_step: 'Wave 07 can add a real Standard MIDI File writer.'
  }
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(artifact, null, 2) + '\n');

console.log('Debug MIDI render: OK');
console.log('input:', inputPath);
console.log('output:', outputPath);
console.log('events:', artifact.summary.event_count);
console.log('tracks:', artifact.summary.tracks.join(','));
console.log('sections:', artifact.summary.sections.join(','));
