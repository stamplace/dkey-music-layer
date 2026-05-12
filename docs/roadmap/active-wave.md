# Active Wave — Wave 06: Debug MIDI Renderer

## Status
BUILD

## Goal
Add a debug renderer that turns the MIDI event plan into a generated artifact.

## Scope
- Add debug MIDI renderer tool.
- Add generated debug MIDI artifact.
- Add artifact check script.
- Add debug renderer documentation.
- Strengthen render and format checks.
- Preserve all existing verification.

## GitHub
- Issue: #6 — Wave 06: Debug MIDI renderer and first generated artifact

## Definition of Done
- npm run doctor passes.
- npm test passes.
- npm run pack:check passes.
- npm run project:check passes.
- npm run arrangement:check passes.
- npm run performance:check passes.
- npm run midi:check passes.
- npm run render:check passes.
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No Standard MIDI File export yet.
- No sample playback yet.
- No full DAW UI yet.
- This wave adds debug render state only.
