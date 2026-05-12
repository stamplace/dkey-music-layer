#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const midiPath = process.argv[2] || 'assets/demo-midi-events/hasidic-modern/midi-events.dml.json';
const mapPath = process.argv[3] || 'assets/demo-sample-trigger-maps/hasidic-modern/sample-trigger-map.dml.json';
const outputPath = process.argv[4] || 'generated/playback-plans/hasidic-modern/playback-plan.dml.json';

function fail(message) {
  console.error(`Playback plan failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(midiPath)) fail(`missing midi event plan ${midiPath}`);
if (!fs.existsSync(mapPath)) fail(`missing trigger map ${mapPath}`);

const midi = JSON.parse(fs.readFileSync(midiPath, 'utf8'));
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

if (midi.schema !== 'dml.midi_events.v0') fail('midi schema must be dml.midi_events.v0');
if (map.schema !== 'dml.sample_trigger_map.v0') fail('trigger map schema must be dml.sample_trigger_map.v0');

function selectLayer(layers, velocity) {
  return layers.find((layer) => velocity >= layer.min && velocity <= layer.max)?.name || 'default';
}

const triggers = [];

for (const event of midi.events) {
  if (event.type !== 'note') continue;

  const slot = map.track_slots[event.track];
  if (!slot) fail(`no sample slot for track ${event.track}`);

  triggers.push({
    section: event.section,
    track: event.track,
    tick: event.tick,
    note: event.note,
    duration: event.duration,
    velocity: event.velocity,
    sample_slot: slot.slot,
    sample_root: slot.sample_root,
    velocity_layer: selectLayer(slot.velocity_layers, event.velocity),
    articulation: event.articulation,
    humanize_ms: event.humanize_ms,
    creates_audio: false
  });
}

const artifact = {
  schema: 'dml.playback_plan.v0',
  playback_plan_id: 'demo-hasidic-modern-playback-plan',
  source_midi_event_plan: midi.midi_event_plan_id,
  source_trigger_map: map.trigger_map_id,
  generated_at: new Date().toISOString(),
  summary: {
    trigger_count: triggers.length,
    track_count: new Set(triggers.map((trigger) => trigger.track)).size,
    section_count: new Set(triggers.map((trigger) => trigger.section)).size,
    tracks: [...new Set(triggers.map((trigger) => trigger.track))],
    sections: [...new Set(triggers.map((trigger) => trigger.section))]
  },
  triggers,
  boundary: {
    debug_only: true,
    creates_audio: false,
    loads_real_samples: false,
    next_step: 'Wave 09 can introduce deterministic sample-slot preview rendering without real DSP.'
  }
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(artifact, null, 2) + '\n');

console.log('Playback plan: OK');
console.log('output:', outputPath);
console.log('triggers:', artifact.summary.trigger_count);
console.log('tracks:', artifact.summary.tracks.join(','));
console.log('sections:', artifact.summary.sections.join(','));
