export const DML_VERSION = '0.1.0-foundation';

export function stableId(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

export function createDmlProject({ title, prompt, key = 'Bm', bpm = 90, roles = [] }) {
  const id = stableId(title || prompt || 'dml-project');
  return {
    dml_version: DML_VERSION,
    kind: 'project',
    id,
    title: title || id,
    prompt: prompt || '',
    musical: {
      key,
      bpm,
      meter: '4/4',
      mood: 'human-directed'
    },
    tracks: roles.map((role, index) => ({
      id: stableId(role),
      role,
      order: index + 1,
      engine: 'sample',
      status: 'planned'
    })),
    exports: {
      stems: true,
      mix: true,
      project: true
    },
    human_control: {
      conductor: true,
      requires_approval_for_export: true
    }
  };
}

export function ensure(condition, message) {
  if (!condition) throw new Error(message);
}
