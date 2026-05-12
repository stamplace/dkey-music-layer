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
