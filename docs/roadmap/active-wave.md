# Active Wave — Production Product Path Control Plane

## Status
PRODUCTION

## Goal
Move DKey Music Layer from validation fixtures into a production-oriented product path: a visible web product surface, a first-song creation workflow, CI-backed verification, devctl orchestration, and a clear release gate.

## Product intent
DKey Music Layer is not a demo generator. It is a production music creation layer where the human remains the conductor and the system turns musical intent into structured, verifiable creation artifacts that can advance toward arrangement, performance, MIDI, sample loading, stems, and audio rendering.

## Current production slice
The current slice must prove one complete product path:

1. Open the web product surface.
2. Create a first-song brief.
3. Validate the brief through CI.
4. Preserve the artifact as source-of-truth DML.
5. Keep rights and real-sample loading behind a hard gate.
6. Keep every production step verifiable by `npm run verify` and GitHub Actions.

## Scope
- Stop treating `site/index.html` as the final product target; it is the first web product surface.
- Keep all existing DML validators and generated artifacts as internal fixtures, not product goals.
- Add a production product path contract.
- Add a production release gate document.
- Keep `devctl` as the operational ledger for active scope, verified outcome, and next action.
- Keep CI as the automatic safety rail.

## GitHub working mode
- Repository: `stamplace/dkey-music-layer`.
- Default source of truth: `main`.
- Work mode: branch → PR → CI → merge.
- Terminal use: only when local verification or sync is needed.
- GitHub direct writes are allowed for docs, workflow, product-surface, validators, and small deterministic code changes.

## Definition of Done for this control-plane wave
- A production path document exists.
- A release gate document exists.
- The web surface no longer presents itself as merely a demo.
- CI still runs `npm run verify`.
- The next work unit is a real product build step, not another narrow demo wave.

## Boundaries
- No fake claim of WAV/audio generation until the engine can produce it.
- No real sample loading without rights manifest and asset gate.
- No separate public site repository unless explicitly approved.
- No more detached demo waves as the main product path.

## Next action
Build the first production vertical slice: web product surface → first-song artifact → arrangement/performance/MIDI path → downloadable project bundle.
