export function buildRenderPlan({ project, performancePlan, pack }) {
  const tracks = project.tracks.map((track) => ({
    track: track.id,
    role: track.role,
    assets: pack.assets.filter((asset) => asset.role === track.role).map((asset) => asset.id),
    export: `exports/stems/${track.id}.wav`,
    status: 'planned'
  }));

  return {
    kind: 'render-plan',
    project: project.id,
    key: project.musical.key,
    bpm: project.musical.bpm,
    tracks,
    mix: {
      path: 'exports/mix/master.wav',
      status: 'planned'
    },
    performance_summary: performancePlan.sections.length
  };
}
