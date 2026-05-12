#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const playbackPlanPath = process.argv[2] || 'generated/playback-plans/hasidic-modern/playback-plan.dml.json';
const outputPath = process.argv[3] || 'generated/sample-slot-previews/hasidic-modern/sample-slot-preview.dml.json';

function fail(message) {
  console.error(`Sample slot preview render failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(playbackPlanPath)) {
  fail(`missing playback plan ${playbackPlanPath}`);
}

const plan = JSON.parse(fs.readFileSync(playbackPlanPath, 'utf8'));

if (plan.schema !== 'dml.playback_plan.v0') fail('input schema must be dml.playback_plan.v0');
if (!Array.isArray(plan.triggers) || plan.triggers.length === 0) fail('triggers are required');

const timeline = plan.triggers
  .map((trigger, index) => ({
    index,
    tick: trigger.tick,
    end_tick: trigger.tick + trigger.duration,
    section: trigger.section,
    track: trigger.track,
    sample_slot: trigger.sample_slot,
    velocity_layer: trigger.velocity_layer,
    note: trigger.note,
    velocity: trigger.velocity,
    articulation: trigger.articulation,
    humanize_ms: trigger.humanize_ms,
    preview_label: `${trigger.section}:${trigger.track}:${trigger.sample_slot}:${trigger.velocity_layer}`
  }))
  .sort((a, b) => a.tick - b.tick || a.track.localeCompare(b.track) || a.index - b.index);

const byTrack = {};
const bySection = {};

for (const item of timeline) {
  byTrack[item.track] ??= [];
  byTrack[item.track].push(item.index);

  bySection[item.section] ??= [];
  bySection[item.section].push(item.index);
}

const artifact = {
  schema: 'dml.sample_slot_preview.v0',
  preview_id: 'demo-hasidic-modern-sample-slot-preview',
  source_playback_plan: plan.playback_plan_id,
  deterministic: true,
  summary: {
    preview_event_count: timeline.length,
    track_count: Object.keys(byTrack).length,
    section_count: Object.keys(bySection).length,
    tracks: Object.keys(byTrack),
    sections: Object.keys(bySection),
    start_tick: Math.min(...timeline.map((item) => item.tick)),
    end_tick: Math.max(...timeline.map((item) => item.end_tick))
  },
  timeline,
  indexes: {
    by_track: byTrack,
    by_section: bySection
  },
  boundary: {
    creates_audio: false,
    loads_real_samples: false,
    writes_wav: false,
    preview_only: true,
    next_step: 'Wave 10 can introduce asset rights manifest hardening before any real sample loading.'
  }
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(artifact, null, 2) + '\n');

console.log('Sample slot preview render: OK');
console.log('output:', outputPath);
console.log('preview_events:', artifact.summary.preview_event_count);
console.log('tracks:', artifact.summary.tracks.join(','));
console.log('sections:', artifact.summary.sections.join(','));
