#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const playbackPlanPath = process.argv[2] || 'generated/playback-plans/hasidic-modern/playback-plan.dml.json';
const outputPath = process.argv[3] || 'assets/rights/hasidic-modern/asset-rights.dml.json';

function fail(message) {
  console.error(`Asset rights manifest write failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(playbackPlanPath)) fail(`missing playback plan ${playbackPlanPath}`);

const plan = JSON.parse(fs.readFileSync(playbackPlanPath, 'utf8'));
if (plan.schema !== 'dml.playback_plan.v0') fail('input schema must be dml.playback_plan.v0');
if (!Array.isArray(plan.triggers) || plan.triggers.length === 0) fail('playback plan triggers are required');

const slotMap = new Map();

for (const trigger of plan.triggers) {
  if (!trigger.sample_slot) fail('trigger missing sample_slot');
  const current = slotMap.get(trigger.sample_slot) || {
    slot_id: trigger.sample_slot,
    tracks: new Set(),
    sections: new Set(),
    notes: new Set(),
    velocity_layers: new Set()
  };

  current.tracks.add(trigger.track);
  current.sections.add(trigger.section);
  current.notes.add(String(trigger.note));
  current.velocity_layers.add(trigger.velocity_layer);
  slotMap.set(trigger.sample_slot, current);
}

const slots = [...slotMap.values()]
  .sort((a, b) => a.slot_id.localeCompare(b.slot_id))
  .map((slot) => ({
    slot_id: slot.slot_id,
    rights_status: 'placeholder_only',
    source_type: 'internal_placeholder_slot',
    real_asset_attached: false,
    source_cleared: false,
    license_status: 'not_applicable_placeholder',
    allowed_uses: [
      'local_development',
      'metadata_preview',
      'validation',
      'non_audio_planning'
    ],
    blocked_uses: [
      'real_sample_loading',
      'audio_rendering',
      'commercial_release',
      'redistribution_as_sample_pack'
    ],
    tracks: [...slot.tracks].sort(),
    sections: [...slot.sections].sort(),
    notes: [...slot.notes].sort(),
    velocity_layers: [...slot.velocity_layers].sort()
  }));

const manifest = {
  schema: 'dml.asset_rights_manifest.v0',
  rights_manifest_id: 'demo-hasidic-modern-asset-rights',
  project_id: 'demo-hasidic-modern',
  source_playback_plan: plan.playback_plan_id,
  deterministic: true,
  policy: {
    placeholder_slots_only: true,
    real_sample_loading_allowed: false,
    require_rights_clearance_before_loading: true,
    require_license_record_before_audio_export: true,
    require_human_approval_before_real_assets: true
  },
  summary: {
    slot_count: slots.length,
    tracks: [...new Set(slots.flatMap((slot) => slot.tracks))].sort(),
    sections: [...new Set(slots.flatMap((slot) => slot.sections))].sort()
  },
  slots,
  boundary: {
    creates_audio: false,
    loads_real_samples: false,
    writes_wav: false,
    rights_gate_only: true,
    next_step: 'Wave 11 can add a real sample loading proposal only after rights metadata exists.'
  }
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n');

console.log('Asset rights manifest write: OK');
console.log('output:', outputPath);
console.log('slots:', manifest.summary.slot_count);
console.log('tracks:', manifest.summary.tracks.join(','));
console.log('sections:', manifest.summary.sections.join(','));
