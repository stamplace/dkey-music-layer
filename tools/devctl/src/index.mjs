#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const STATE = join(ROOT, 'tools/devctl/state/dkey-music-layer.json');

const required = [
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
  '.github/workflows/ci.yml'
];

function readState() {
  if (!existsSync(STATE)) return null;
  return JSON.parse(readFileSync(STATE, 'utf8'));
}

function doctor() {
  const missing = required.filter((p) => !existsSync(join(ROOT, p)));
  if (missing.length) {
    console.error('DOCTOR DKey Music Layer: FAIL');
    for (const file of missing) console.error(`MISSING ${file}`);
    process.exit(1);
  }
  console.log('DOCTOR DKey Music Layer');
  for (const file of required) console.log(`OK   ${file}`);
  console.log('Doctor passed.');
}

function status() {
  const state = readState();
  if (!state) {
    console.log('No devctl state found.');
    return;
  }
  console.log(`Project: ${state.project}`);
  console.log(`Mode: ${state.mode}`);
  console.log(`Delivery Status: ${state.delivery_status}`);
  console.log(`Active Wave: ${state.active_wave}`);
  console.log(`Next Action: ${state.next_action}`);
}

const cmd = process.argv[2] || 'status';
if (cmd === 'doctor') doctor();
else if (cmd === 'status') status();
else {
  console.error(`Unknown devctl command: ${cmd}`);
  process.exit(2);
}
