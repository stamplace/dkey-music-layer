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
  state.active_wave = 'Wave 02: DML Project Format and Asset Vault Hardening';
  state.current_work = 'Harden DML project format, asset vault metadata, and validators';
  state.next_action = 'Run npm run verify, commit, and push Wave 02 format hardening';
  state.verified = false;
  writeState(state);
  console.log('Work picked.');
  statusCommand();
}

function closeCommand() {
  const state = readState();
  state.delivery_status = 'implemented';
  state.active_wave = 'Wave 02: DML Project Format and Asset Vault Hardening';
  state.current_work = 'DML project format and asset vault baseline implemented';
  state.next_action = 'Wave 03: Intent-to-arrangement contract and first editable arrangement plan';
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
