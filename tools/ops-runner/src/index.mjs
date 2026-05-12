#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const requestedOp = process.argv[2] || 'status';

const allowedOps = {
  status: {
    description: 'Read current devctl status only.',
    command: ['npm', ['run', 'ops:status']]
  },
  doctor: {
    description: 'Run repository doctor checks.',
    command: ['npm', ['run', 'doctor']]
  },
  'format-check': {
    description: 'Run full DML format and artifact checks.',
    command: ['npm', ['run', 'format:check']]
  },
  verify: {
    description: 'Run the full production verification path.',
    command: ['npm', ['run', 'verify']]
  },
  'full-report': {
    description: 'Run the full production verification path and persist an ops report.',
    command: ['npm', ['run', 'verify']]
  }
};

function writeReport(report) {
  const outputDir = 'generated/ops';
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'latest-ops-report.dml.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
  console.log('ops_report:', outputPath);
}

if (!Object.hasOwn(allowedOps, requestedOp)) {
  const report = {
    schema: 'dml.github_ops_report.v0',
    op: requestedOp,
    status: 'rejected',
    reason: 'Operation is not whitelisted.',
    allowed_ops: Object.keys(allowedOps),
    generated_at: new Date().toISOString()
  };

  console.error('DML ops runner rejected unknown op:', requestedOp);
  console.error('Allowed ops:', Object.keys(allowedOps).join(','));
  writeReport(report);
  process.exit(1);
}

const startedAt = new Date().toISOString();
const op = allowedOps[requestedOp];
const [command, args] = op.command;

console.log('DML GitHub Ops Runner');
console.log('op:', requestedOp);
console.log('description:', op.description);
console.log('command:', [command, ...args].join(' '));

const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: false,
  env: process.env
});

const exitCode = typeof result.status === 'number' ? result.status : 1;
const endedAt = new Date().toISOString();
const report = {
  schema: 'dml.github_ops_report.v0',
  op: requestedOp,
  status: exitCode === 0 ? 'passed' : 'failed',
  command: [command, ...args],
  description: op.description,
  started_at: startedAt,
  ended_at: endedAt,
  exit_code: exitCode,
  next_action: exitCode === 0
    ? 'Continue with the next locked wave.'
    : 'Read the GitHub Actions log and fix the first failed step.'
};

writeReport(report);
process.exit(exitCode);
