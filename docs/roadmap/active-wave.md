# Active Wave — Wave 05: Performance-to-MIDI Event Plan

## Status
BUILD

## Goal
Add the first MIDI event plan derived from performance state.

## Scope
- Add MIDI event plan fixture.
- Add MIDI event validation.
- Add performance-to-MIDI documentation.
- Strengthen format checks.
- Preserve doctor, tests, pack validation, project validation, arrangement validation, performance validation, render smoke, and ops status.

## GitHub
- Issue: #5 — Wave 05: Performance-to-MIDI event plan

## Definition of Done
- npm run doctor passes.
- npm test passes.
- npm run pack:check passes.
- npm run project:check passes.
- npm run arrangement:check passes.
- npm run performance:check passes.
- npm run midi:check passes.
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No real .mid file export yet.
- No sample playback yet.
- No full DAW UI yet.
- This wave adds inspectable event state only.
