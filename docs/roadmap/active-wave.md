# Active Wave — Wave 11A: GitHub Ops Bridge

## Status
BUILD

## Goal
Create a GitHub-based operations bridge so mobile work no longer depends on long terminal paste blocks.

## Scope
- Upgrade CI from partial checks to full `npm run verify`.
- Add manual GitHub Actions workflow for safe whitelisted operations.
- Add ops runner for `status`, `doctor`, `format-check`, `verify`, and `full-report`.
- Add generated ops report artifact path.
- Add documentation for the mobile GitHub workflow.
- Preserve all existing checks.

## GitHub
- Issue: #11 — Wave 11A: GitHub Ops Bridge

## Definition of Done
- Main CI runs `npm run verify`.
- Manual `DML Manual Ops` workflow exists.
- Ops runner rejects unknown operations.
- Ops runner writes `generated/ops/latest-ops-report.dml.json`.
- GitHub Actions uploads generated artifacts for inspection.
- Documentation explains how to run from phone.
- `npm run verify` remains the source of truth.

## Boundaries
- No real sample loading.
- No WAV rendering.
- No audio DSP.
- No public product site deployment in this wave.
- No arbitrary shell command workflow.
