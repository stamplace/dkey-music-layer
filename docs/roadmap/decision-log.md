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
