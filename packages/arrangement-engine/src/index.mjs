export function buildArrangement(intent) {
  const sections = intent.sections || ['intro', 'verse', 'chorus'];
  const roles = intent.roles || ['drums', 'bass', 'piano'];
  return {
    kind: 'arrangement',
    key: intent.key,
    bpm: intent.bpm,
    sections: sections.map((section, index) => ({
      id: section,
      order: index + 1,
      density: section.includes('chorus') ? 'wide' : intent.density,
      active_roles: roles.filter((role) => section !== 'intro' || role !== 'drums')
    })),
    roles
  };
}
