#!/usr/bin/env node
import fs from 'node:fs';

const projectPath = process.argv[2] || 'assets/demo-projects/hasidic-modern/project.dml.json';

function fail(message) {
  console.error(`DML project validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(projectPath)) {
  fail(`missing file ${projectPath}`);
}

const project = JSON.parse(fs.readFileSync(projectPath, 'utf8'));

if (project.schema !== 'dml.project.v0') fail('schema must be dml.project.v0');
if (!project.project_id) fail('project_id is required');
if (!project.title) fail('title is required');
if (!project.musical_context?.bpm) fail('musical_context.bpm is required');
if (!project.musical_context?.key) fail('musical_context.key is required');
if (!project.intent?.human_prompt) fail('intent.human_prompt is required');
if (!Array.isArray(project.tracks) || project.tracks.length === 0) fail('tracks must be a non-empty array');
if (!project.exports?.project) fail('exports.project is required');
if (!project.rights) fail('rights block is required');
if (project.rights.contains_real_commercial_assets !== false) {
  fail('demo project must not contain real commercial assets');
}

for (const track of project.tracks) {
  if (!track.id) fail('track.id is required');
  if (!track.role) fail(`track ${track.id} missing role`);
  if (!track.engine) fail(`track ${track.id} missing engine`);
  if (!track.output) fail(`track ${track.id} missing output`);
}

console.log('DML project validation: OK');
console.log('project:', project.project_id);
console.log('tracks:', project.tracks.map((track) => track.id).join(','));
console.log('exports:', Object.keys(project.exports).join(','));
