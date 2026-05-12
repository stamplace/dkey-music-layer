import { readFileSync } from 'node:fs';
import { validatePack } from '../../formats/src/index.mjs';

export function loadPack(path) {
  const pack = JSON.parse(readFileSync(path, 'utf8'));
  const validation = validatePack(pack);
  if (!validation.ok) {
    throw new Error(`Invalid DML pack:\n${validation.errors.join('\n')}`);
  }
  return pack;
}

export function findAssetsByRole(pack, role) {
  return pack.assets.filter((asset) => asset.role === role);
}
