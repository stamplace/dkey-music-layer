#!/usr/bin/env node
import { createDmlProject } from '../../../packages/core/src/index.mjs';
import { validateProject } from '../../../packages/formats/src/index.mjs';
import { parseIntent } from '../../../packages/intent-engine/src/index.mjs';
import { buildArrangement } from '../../../packages/arrangement-engine/src/index.mjs';
import { buildPerformancePlan } from '../../../packages/performance-engine/src/index.mjs';
import { loadPack } from '../../../packages/sample-engine/src/index.mjs';
import { buildRenderPlan } from '../../../packages/render-engine/src/index.mjs';

const prompt = 'Hasidic modern song, Bm, 90BPM, wide chorus, strings, guitar, controlled verse';
const intent = parseIntent(prompt);
const project = createDmlProject({
  title: 'demo-hasidic-modern',
  prompt,
  key: intent.key,
  bpm: intent.bpm,
  roles: intent.roles
});
const validation = validateProject(project);
if (!validation.ok) throw new Error(validation.errors.join('\n'));

const arrangement = buildArrangement(intent);
const performancePlan = buildPerformancePlan(arrangement);
const pack = loadPack('assets/demo-packs/hasidic-modern/pack.dml.json');
const renderPlan = buildRenderPlan({ project, performancePlan, pack });

console.log('DML render smoke: OK');
console.log(`project: ${project.id}`);
console.log(`tracks: ${project.tracks.map((t) => t.id).join(',')}`);
console.log(`exports: ${Object.keys(project.exports).filter((k) => project.exports[k]).join(',')}`);
console.log(`render tracks: ${renderPlan.tracks.length}`);
