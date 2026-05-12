export function validateProject(project) {
  const errors = [];
  if (!project || typeof project !== 'object') errors.push('project must be object');
  if (project?.kind !== 'project') errors.push('kind must be project');
  if (!project?.id) errors.push('id is required');
  if (!project?.musical?.key) errors.push('musical.key is required');
  if (!Number.isFinite(project?.musical?.bpm)) errors.push('musical.bpm must be number');
  if (!Array.isArray(project?.tracks)) errors.push('tracks must be array');
  return { ok: errors.length === 0, errors };
}

export function validatePack(pack) {
  const errors = [];
  if (!pack || typeof pack !== 'object') errors.push('pack must be object');
  if (pack?.kind !== 'dml-pack') errors.push('kind must be dml-pack');
  if (!pack?.id) errors.push('id is required');
  if (!Array.isArray(pack?.assets)) errors.push('assets must be array');
  if (Array.isArray(pack?.assets)) {
    pack.assets.forEach((asset, i) => {
      if (!asset.id) errors.push(`assets[${i}].id is required`);
      if (!asset.path) errors.push(`assets[${i}].path is required`);
      if (!asset.role) errors.push(`assets[${i}].role is required`);
      if (!asset.rights?.owner) errors.push(`assets[${i}].rights.owner is required`);
      if (!asset.rights?.usage) errors.push(`assets[${i}].rights.usage is required`);
    });
  }
  return { ok: errors.length === 0, errors };
}
