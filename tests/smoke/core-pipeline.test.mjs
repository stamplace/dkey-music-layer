import { createDmlProject } from '../../packages/core/src/index.mjs';
import { validateProject } from '../../packages/formats/src/index.mjs';
import { parseIntent } from '../../packages/intent-engine/src/index.mjs';
import { buildArrangement } from '../../packages/arrangement-engine/src/index.mjs';
import { buildPerformancePlan } from '../../packages/performance-engine/src/index.mjs';

const intent = parseIntent('Hasidic modern Bm 90BPM wide chorus strings guitar');
const project = createDmlProject({ title: 'test-song', prompt: intent.prompt, key: intent.key, bpm: intent.bpm, roles: intent.roles });
const validation = validateProject(project);
if (!validation.ok) throw new Error(validation.errors.join('\n'));

const arrangement = buildArrangement(intent);
const performance = buildPerformancePlan(arrangement);

if (!arrangement.sections.length) throw new Error('arrangement sections missing');
if (!performance.sections.length) throw new Error('performance sections missing');
if (!project.tracks.some((track) => track.role === 'strings')) throw new Error('strings track expected');

console.log('core pipeline test: OK');
