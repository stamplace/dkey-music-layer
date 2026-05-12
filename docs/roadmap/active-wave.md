# Active Wave — Wave 11B: Public Demo Surface And First Song Path

## Status
BUILD

## Goal
Turn the visible static product demo into a verified first-song creation path.

## Scope
- Keep the static `site/index.html` demo as the public product surface.
- Add a committed first-song DML artifact.
- Add a first-song validator.
- Add `first-song:check`.
- Wire `first-song:check` into `format:check` and `verify`.
- Preserve all existing checks.

## GitHub
- Issue: #12 — Wave 11B: Public demo surface and first song creation path

## Definition of Done
- Static demo page exists.
- Demo can generate and download a first-song JSON artifact in the browser.
- A committed first-song artifact exists under `assets/demo-first-songs`.
- Validator rejects incomplete or unsafe first-song briefs.
- `npm run first-song:check` passes.
- `npm run verify` passes.
- GitHub Pages workflow exists.

## Boundaries
- No server.
- No real audio generation.
- No sample loading.
- No WAV rendering.
- No commercial asset claim.
