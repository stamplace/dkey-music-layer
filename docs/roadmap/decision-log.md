# Decision Log

## 0001 — Own DML internal format first

Decision: DML will use its own explicit `.dml.json` formats before attempting to import Korg/SFZ/Kontakt-like ecosystems.

Reason: Keeps product independent, inspectable and testable.

## 0002 — Production runtime before model training

Decision: Build controllable DAW/intent/render foundation before training any proprietary music model.

Reason: Model training is expensive and legally sensitive; the product advantage is human-controlled production runtime.

## 0003 — Assets require rights metadata

Decision: No real commercial asset enters the repo without explicit ownership and usage metadata.

Reason: Prevents future commercial/legal blockers.

## Wave 01 Decision — Product Control Layer

Decision: strengthen devctl before expanding product implementation.

Reason:
DKey Music Layer is a long-term production system, not a one-off demo. Before adding large DAW, mobile, audio, or AI features, the repo needs a reliable work ledger, status command, pick/close loop, and repeatable verification path.

Selected path:
- Keep the current foundation small and stable.
- Add operational scripts around devctl.
- Keep verification as a single repeatable command.
- Use GitHub Issue #1 as the public work unit for Wave 01.

Rejected for this wave:
- Training an audio model.
- Building a full UI.
- Importing real Korg formats.
- Adding large binary sample assets.

## Wave 02 Decision — DML Format First

Decision: strengthen the internal DML project and asset-vault contracts before building larger UI/audio features.

Reason:
DKey Music Layer must be able to describe a real musical project before it can reliably generate, edit, render, or control one. The project format is the stable product memory between human intent, arrangement, assets, tracks, stems, mix, and export.

Selected path:
- Add project.dml.json as the first project contract.
- Add asset-vault.dml.json as the first source asset and rights contract.
- Add validation before deeper feature work.
- Keep all assets as demo placeholders until ownership is explicit.

Rejected for this wave:
- Real commercial samples.
- Full DAW UI.
- External arranger import.
- Audio model training.

## Wave 03 Decision — Editable Arrangement State

Decision: create an explicit arrangement contract before building performance, rendering, or UI layers.

Reason:
The system must preserve the musical decision path from human intent to song sections and track behavior. Without editable arrangement state, DKey Music Layer would collapse toward opaque generation instead of becoming a controllable studio runtime.

Selected path:
- Add arrangement.dml.json as the first editable arrangement contract.
- Validate sections, track states, energy, density, and revision policy.
- Keep arrangement language human-readable and machine-checkable.
- Preserve human override as a product rule.

Rejected for this wave:
- Full DAW UI.
- Audio rendering implementation.
- Model training.
- Real commercial samples.

## Wave 04 Decision — Performance State Before Rendering

Decision: add explicit performance state before implementing MIDI rendering or sample playback.

Reason:
DKey Music Layer must preserve not only what should play, but how it should feel. Timing, velocity, articulation, and humanize settings are core to the product's live-studio identity.

Selected path:
- Add performance.dml.json as the first playable performance contract.
- Validate playable sections, articulation, velocity range, timing feel, and humanize.
- Preserve human approval before final mix or flattening.
- Keep rendering as smoke-only for this wave.

Rejected for this wave:
- Real DSP rendering.
- Full DAW UI.
- Audio model training.
- Real commercial samples.

## Wave 05 Decision — MIDI Event Plan Before MIDI File Export

Decision: create inspectable MIDI event state before writing a real .mid artifact.

Reason:
DKey Music Layer needs a visible and testable bridge from performance feel to machine-renderable note events. This keeps the system simple, verifiable, and editable before binary file export.

Selected path:
- Add midi-events.dml.json as the first event contract.
- Validate ticks, notes, velocity, duration, articulation, tracks, and sections.
- Keep the output as JSON for this wave.
- Defer actual .mid export to the next wave.

Rejected for this wave:
- Binary MIDI file writing.
- Sample playback.
- Full DAW UI.
- Audio model training.

## Wave 06 Decision — Debug Artifact Before Binary MIDI Export

Decision: add a debug MIDI renderer before writing Standard MIDI Files.

Reason:
A JSON debug artifact keeps the system inspectable and easy to verify. It proves event grouping by tracks and sections before introducing binary MIDI generation, DAW import concerns, or playback.

Selected path:
- Add debug MIDI renderer.
- Generate a small committed debug artifact.
- Add artifact validation.
- Defer Standard MIDI File export to Wave 07.

Rejected for this wave:
- Binary MIDI file writing.
- Sample playback.
- DAW UI.
- Audio rendering.
