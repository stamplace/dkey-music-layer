# Active Wave — Wave 02: DML Project Format and Asset Vault Hardening

## Status
BUILD

## Goal
Harden the internal DML project and asset formats so DKey Music Layer can evolve from a foundation into a production-grade music project system.

## Scope
- Add a formal DML project fixture.
- Add asset vault metadata and rights fields.
- Add project validation.
- Strengthen format checks.
- Preserve doctor, tests, pack validation, render smoke, and ops status.

## GitHub
- Issue: #2 — Wave 02: DML Project Format and Asset Vault Hardening

## Definition of Done
- npm run doctor passes.
- npm test passes.
- npm run pack:check passes.
- npm run project:check passes.
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No real commercial samples yet.
- No direct external arranger import yet.
- No model training in this wave.
- This wave strengthens the internal DML contract first.
