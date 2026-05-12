#!/usr/bin/env node
import fs from 'node:fs';

const statePath = 'tools/devctl/state/dkey-music-layer.json';

const requiredFiles = [
  'README.md',
  'MANIFEST.json',
  'package.json',
  'docs/vision/00_DKEY_MUSIC_LAYER_VISION.md',
  'docs/architecture/02_SYSTEM_ARCHITECTURE.md',
  'docs/roadmap/active-wave.md',
  'packages/core/src/index.mjs',
  'packages/formats/src/index.mjs',
  'packages/intent-engine/src/index.mjs',
  'packages/arrangement-engine/src/index.mjs',
  'packages/performance-engine/src/index.mjs',
  'packages/sample-engine/src/index.mjs',
  'packages/render-engine/src/index.mjs',
  'tools/pack-validator/src/index.mjs',
  'tools/render-smoke/src/index.mjs',
  'docs/formats/09_DML_FORMAT_CONTRACT.md',
  'assets/demo-projects/hasidic-modern/project.dml.json',
  'assets/vault/demo-hasidic-modern/asset-vault.dml.json',
  'tools/project-validator/src/index.mjs',
  'docs/arrangement/10_INTENT_TO_ARRANGEMENT_CONTRACT.md',
  'assets/demo-arrangements/hasidic-modern/arrangement.dml.json',
  'tools/arrangement-validator/src/index.mjs',
  'docs/performance/11_ARRANGEMENT_TO_PERFORMANCE_CONTRACT.md',
  'assets/demo-performances/hasidic-modern/performance.dml.json',
  'tools/performance-validator/src/index.mjs',
  'docs/midi/12_PERFORMANCE_TO_MIDI_EVENT_PLAN.md',
  'assets/demo-midi-events/hasidic-modern/midi-events.dml.json',
  'tools/midi-event-validator/src/index.mjs',
  'docs/rendering/13_DEBUG_MIDI_RENDERER.md',
  'tools/debug-midi-renderer/src/index.mjs',
  'tools/debug-midi-renderer/src/check.mjs',
  'generated/debug-midi/hasidic-modern/debug-midi-render.dml.json',
  'docs/export/14_STANDARD_MIDI_EXPORT_BOUNDARY.md',
  'tools/standard-midi-writer/src/index.mjs',
  'tools/standard-midi-writer/src/check.mjs',
  'generated/standard-midi/hasidic-modern/demo-hasidic-modern.mid',
  'docs/playback/15_SAMPLE_TRIGGER_PLAYBACK_BOUNDARY.md',
  'assets/demo-sample-trigger-maps/hasidic-modern/sample-trigger-map.dml.json',
  'tools/sample-trigger-validator/src/index.mjs',
  'tools/playback-planner/src/index.mjs',
  'tools/playback-planner/src/check.mjs',
  'generated/playback-plans/hasidic-modern/playback-plan.dml.json',
  'docs/preview/16_SAMPLE_SLOT_PREVIEW_RENDERER.md',
  'tools/sample-slot-preview-renderer/src/index.mjs',
  'tools/sample-slot-preview-renderer/src/check.mjs',
  'generated/sample-slot-previews/hasidic-modern/sample-slot-preview.dml.json',
  '.github/workflows/ci.yml'
];

function readState() {
  return JSON.parse(fs.readFileSync(statePath, 'utf8'));
}

function writeState(state) {
  state.updated_at = new Date().toISOString();
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}

function doctorCommand() {
  console.log('DOCTOR DKey Music Layer');
  let ok = true;

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log('OK  ', file);
    } else {
      console.log('MISS', file);
      ok = false;
    }
  }

  if (!ok) {
    console.error('Doctor failed.');
    process.exit(1);
  }

  console.log('Doctor passed.');
}

function statusCommand() {
  const state = readState();
  console.log('DKEY MUSIC LAYER STATUS');
  console.log('project:', state.project);
  console.log('delivery_status:', state.delivery_status);
  console.log('active_wave:', state.active_wave);
  console.log('current_work:', state.current_work);
  console.log('next_action:', state.next_action);
  console.log('verified:', state.verified);
}

function pickCommand() {
  const state = readState();
  state.delivery_status = 'picked';
  state.active_wave = 'Wave 09: Sample Slot Preview Renderer Boundary';
  state.current_work = 'Add deterministic sample-slot preview renderer boundary';
  state.next_action = 'Run npm run verify, commit, and push Wave 09 preview boundary';
  state.verified = false;
  writeState(state);
  console.log('Work picked.');
  statusCommand();
}

function closeCommand() {
  const state = readState();
  state.delivery_status = 'implemented';
  state.active_wave = 'Wave 09: Sample Slot Preview Renderer Boundary';
  state.current_work = 'Sample-slot preview renderer baseline implemented';
  state.next_action = 'Wave 10: Asset rights manifest hardening before real sample loading';
  state.verified = true;
  writeState(state);
  console.log('Work closed.');
  statusCommand();
}

const cmd = process.argv[2] || 'doctor';

if (cmd === 'doctor') doctorCommand();
else if (cmd === 'status') statusCommand();
else if (cmd === 'pick') pickCommand();
else if (cmd === 'close') closeCommand();
else {
  console.error('Unknown devctl command:', cmd);
  process.exit(1);
}
