#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { validatePack } from '../../../packages/formats/src/index.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node tools/pack-validator/src/index.mjs <pack.dml.json>');
  process.exit(2);
}

const pack = JSON.parse(readFileSync(file, 'utf8'));
const result = validatePack(pack);
if (!result.ok) {
  console.error('DML pack validation: FAIL');
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('DML pack validation: OK');
console.log(`pack: ${pack.id}`);
console.log(`assets: ${pack.assets.length}`);
