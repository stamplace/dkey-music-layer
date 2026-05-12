#!/usr/bin/env node
import fs from 'node:fs';

const performancePath = process.argv[2] || 'assets/demo-performances/hasidic-modern/performance.dml.json';

function fail(message) {
  console.error(`DML performance validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(performancePath)) {
  fail(`missing file ${performancePath}`);
}

const performance = JSON.parse(fs.readFileSync(performancePath, 'utf8'));

if (performance.schema !== 'dml.performance.v0') fail('schema must be dml.performance.v0');
if (!performance.performance_id) fail('performance_id is required');
if (!performance.source_arrangement) fail('source_arrangement is required');
if (!performance.playback_context?.bpm) fail('playback_context.bpm is required');
if (!performance.playback_context?.key) fail('playback_context.key is required');
if (!performance.global_humanize) fail('global_humanize is required');
if (!Array.isArray(performance.sections) || performance.sections.length === 0) {
  fail('sections must be a non-empty array');
}
if (!performance.render_policy?.renderable_to_midi) fail('render_policy.renderable_to_midi must be true');

const requiredTrackIds = ['drums', 'bass', 'piano', 'strings', 'guitar'];

for (const section of performance.sections) {
  if (!section.id) fail('section.id is required');
  if (section.playable !== true) fail(`section ${section.id} must be playable`);
  if (!section.tracks || typeof section.tracks !== 'object') fail(`section ${section.id} missing tracks`);

  for (const trackId of requiredTrackIds) {
    const track = section.tracks[trackId];
    if (!track) fail(`section ${section.id} missing track ${trackId}`);
    if (!track.articulation) fail(`section ${section.id} track ${trackId} missing articulation`);
    if (!Array.isArray(track.velocity_range) || track.velocity_range.length !== 2) {
      fail(`section ${section.id} track ${trackId} must define velocity_range [min,max]`);
    }
    if (track.velocity_range[0] > track.velocity_range[1]) {
      fail(`section ${section.id} track ${trackId} has invalid velocity_range`);
    }
    if (!track.timing_feel) fail(`section ${section.id} track ${trackId} missing timing_feel`);
    if (!track.humanize) fail(`section ${section.id} track ${trackId} missing humanize`);
  }
}

console.log('DML performance validation: OK');
console.log('performance:', performance.performance_id);
console.log('sections:', performance.sections.map((section) => section.id).join(','));
console.log('section_count:', performance.sections.length);
