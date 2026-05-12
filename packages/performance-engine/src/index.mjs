export function buildPerformancePlan(arrangement) {
  return {
    kind: 'performance-plan',
    bpm: arrangement.bpm,
    key: arrangement.key,
    sections: arrangement.sections.map((section) => ({
      section: section.id,
      density: section.density,
      gestures: section.active_roles.map((role) => ({
        role,
        timing: role === 'drums' ? 'tight-human' : 'natural-human',
        velocity: section.density === 'wide' ? 'open' : 'controlled',
        articulation: role === 'strings' ? 'long-legato' : 'default'
      }))
    }))
  };
}
