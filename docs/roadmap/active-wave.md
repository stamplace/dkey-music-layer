# Active Wave — Wave 10: Asset Rights Manifest Hardening

## Status
BUILD

## Goal
Add a rights manifest gate before real sample loading.

## Scope
- Generate asset rights manifest from playback plan sample slots.
- Add asset rights validator.
- Add rights boundary documentation.
- Add rights:check.
- Strengthen format:check and verify.
- Preserve all existing checks.

## GitHub
- Issue: #10 — Wave 10: Asset rights manifest hardening

## Definition of Done
- npm run doctor passes.
- npm test passes.
- npm run pack:check passes.
- npm run project:check passes.
- npm run arrangement:check passes.
- npm run performance:check passes.
- npm run midi:check passes.
- npm run render:check passes.
- npm run export:check passes.
- npm run playback:check passes.
- npm run preview:check passes.
- npm run rights:check passes.
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No real sample loading.
- No WAV rendering.
- No audio DSP.
- No commercial rights claim.
