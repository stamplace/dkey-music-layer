# Active Wave — Wave 08: Sample Trigger Playback Boundary

## Status
BUILD

## Goal
Add the first asset-backed sample trigger map and playback plan boundary.

## Scope
- Add sample trigger map fixture.
- Add trigger map validation.
- Add playback planner.
- Generate playback plan artifact.
- Add playback boundary documentation.
- Strengthen playback, format, and verify checks.
- Preserve all existing verification.

## GitHub
- Issue: #8 — Wave 08: Asset-backed sample trigger map and first playback boundary

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
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No audio DSP yet.
- No WAV rendering yet.
- No real sample file loading yet.
- This wave creates an inspectable playback plan only.
