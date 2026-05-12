# Active Wave — Wave 09: Sample Slot Preview Renderer Boundary

## Status
BUILD

## Goal
Add a deterministic preview renderer from playback plan to sample-slot timeline artifact.

## Scope
- Add sample-slot preview renderer.
- Generate sample-slot preview artifact.
- Add preview artifact checker.
- Add preview boundary documentation.
- Add preview:check.
- Strengthen format:check and verify.
- Preserve all existing verification.

## GitHub
- Issue: #9 — Wave 09: Sample slot preview renderer

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
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No audio DSP yet.
- No WAV rendering yet.
- No real sample loading yet.
- This wave creates deterministic preview metadata only.
