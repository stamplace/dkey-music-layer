#!/usr/bin/env node
import fs from 'node:fs';

const manifestPath = process.argv[2] || 'assets/rights/hasidic-modern/asset-rights.dml.json';
const playbackPlanPath = process.argv[3] || 'generated/playback-plans/hasidic-modern/playback-plan.dml.json';

function fail(message) {
  console.error(`Asset rights manifest check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) fail(`missing rights manifest ${manifestPath}`);
if (!fs.existsSync(playbackPlanPath)) fail(`missing playback plan ${playbackPlanPath}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const plan = JSON.parse(fs.readFileSync(playbackPlanPath, 'utf8'));

if (manifest.schema !== 'dml.asset_rights_manifest.v0') fail('schema must be dml.asset_rights_manifest.v0');
if (!manifest.rights_manifest_id) fail('rights_manifest_id is required');
if (manifest.deterministic !== true) fail('manifest must be deterministic');
if (manifest.policy?.placeholder_slots_only !== true) fail('placeholder_slots_only must be true');
if (manifest.policy?.real_sample_loading_allowed !== false) fail('real_sample_loading_allowed must be false');
if (manifest.boundary?.loads_real_samples !== false) fail('boundary must not load real samples');
if (manifest.boundary?.creates_audio !== false) fail('boundary must not create audio');
if (manifest.boundary?.writes_wav !== false) fail('boundary must not write wav');
if (!Array.isArray(manifest.slots) || manifest.slots.length === 0) fail('slots are required');

const requiredSlots = new Set(plan.triggers.map((trigger) => trigger.sample_slot));
const declaredSlots = new Set(manifest.slots.map((slot) => slot.slot_id));

for (const slotId of requiredSlots) {
  if (!declaredSlots.has(slotId)) fail(`missing rights record for slot ${slotId}`);
}

for (const slot of manifest.slots) {
  if (slot.rights_status !== 'placeholder_only') fail(`slot ${slot.slot_id} must be placeholder_only`);
  if (slot.real_asset_attached !== false) fail(`slot ${slot.slot_id} must not attach a real asset`);
  if (slot.source_cleared !== false) fail(`slot ${slot.slot_id} must not claim source clearance yet`);
  if (!slot.allowed_uses?.includes('metadata_preview')) fail(`slot ${slot.slot_id} missing metadata_preview allowed use`);
  if (!slot.blocked_uses?.includes('real_sample_loading')) fail(`slot ${slot.slot_id} must block real_sample_loading`);
  if (!slot.blocked_uses?.includes('commercial_release')) fail(`slot ${slot.slot_id} must block commercial_release`);
}

console.log('Asset rights manifest check: OK');
console.log('manifest:', manifest.rights_manifest_id);
console.log('slots:', manifest.slots.length);
console.log('tracks:', manifest.summary.tracks.join(','));
console.log('sections:', manifest.summary.sections.join(','));
