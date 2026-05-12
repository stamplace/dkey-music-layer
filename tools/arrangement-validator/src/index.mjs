#!/usr/bin/env node
import fs from 'node:fs';

const arrangementPath = process.argv[2] || 'assets/demo-arrangements/hasidic-modern/arrangement.dml.json';

function fail(message) {
  console.error(`DML arrangement validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(arrangementPath)) {
  fail(`missing file ${arrangementPath}`);
}

const arrangement = JSON.parse(fs.readFileSync(arrangementPath, 'utf8'));

if (arrangement.schema !== 'dml.arrangement.v0') fail('schema must be dml.arrangement.v0');
if (!arrangement.arrangement_id) fail('arrangement_id is required');
if (!arrangement.source_project) fail('source_project is required');
if (!arrangement.source_intent?.human_prompt) fail('source_intent.human_prompt is required');
if (!arrangement.global_context?.bpm) fail('global_context.bpm is required');
if (!arrangement.global_context?.key) fail('global_context.key is required');
if (!Array.isArray(arrangement.sections) || arrangement.sections.length === 0) {
  fail('sections must be a non-empty array');
}

const requiredTrackIds = ['drums', 'bass', 'piano', 'strings', 'guitar'];

for (const section of arrangement.sections) {
  if (!section.id) fail('section.id is required');
  if (!section.bars || section.bars < 1) fail(`section ${section.id} must define bars`);
  if (!section.energy) fail(`section ${section.id} missing energy`);
  if (!section.density) fail(`section ${section.id} missing density`);
  if (!section.tracks || typeof section.tracks !== 'object') {
    fail(`section ${section.id} missing tracks`);
  }

  for (const trackId of requiredTrackIds) {
    if (!section.tracks[trackId]) {
      fail(`section ${section.id} missing track ${trackId}`);
    }
    if (!section.tracks[trackId].state) {
      fail(`section ${section.id} track ${trackId} missing state`);
    }
  }
}

if (!arrangement.revision_policy?.editable) {
  fail('revision_policy.editable must be true');
}

console.log('DML arrangement validation: OK');
console.log('arrangement:', arrangement.arrangement_id);
console.log('sections:', arrangement.sections.map((section) => section.id).join(','));
console.log('section_count:', arrangement.sections.length);
