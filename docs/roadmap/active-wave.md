# Active Wave — Wave 07: Standard MIDI Export Boundary

## Status
BUILD

## Goal
Add the first Standard MIDI File writer and export artifact from the DML MIDI event plan.

## Scope
- Add dependency-free Standard MIDI writer.
- Add generated MIDI file artifact.
- Add MIDI file checker.
- Add export boundary documentation.
- Strengthen export, format, and verify checks.
- Preserve all existing verification.

## GitHub
- Issue: #7 — Wave 07: Standard MIDI file writer and export boundary

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
- npm run format:check passes.
- npm run smoke passes.
- npm run verify passes.
- Git working tree is clean after checkpoint and push.

## Boundaries
- No sample playback yet.
- No audio rendering yet.
- No full DAW UI yet.
- The MIDI file is a proof artifact, not final musical output.
