# DKey Music Layer — Production Product Path

## Position
DKey Music Layer is a production product, not a demo. Internal demo fixtures may exist for verification, but they are not the destination.

The product must become a full music creation system where a human musical intention can travel through a verified pipeline:

`intent → song brief → arrangement → performance → MIDI/event plan → sample/right gate → render plan → project bundle → audio/stems`

## Product principle
The human remains the conductor. The system does not replace taste, choice, or musical judgment. It turns decisions into structured, inspectable, reproducible artifacts.

## Production vertical slice
The first production slice must not be a toy. It must be a narrow but real end-to-end workflow:

1. User opens the web product surface.
2. User enters a song idea.
3. System creates a first-song DML artifact.
4. System validates the artifact.
5. System converts it toward arrangement/performance/MIDI structures.
6. System packages a downloadable project bundle.
7. System blocks real samples/audio until rights and engine gates are satisfied.

## Current hard truth
The repository already contains many deterministic internal validators and fixtures. That is useful engineering groundwork, but it is not enough for product.

The next stage must stop expanding isolated validation waves and start joining the pieces into one visible workflow.

## Required production surfaces

### 1. Web product surface
A user-facing web entry point. This is not merely a static demo page; it is the first product UI surface.

Minimum requirements:
- Clear product identity.
- First-song creation flow.
- Downloadable DML/project artifact.
- Visible pipeline status.
- Honest boundary labels for unavailable audio features.

### 2. Product bundle artifact
A generated artifact that represents a real project, not only a brief.

Minimum contents:
- song brief
- arrangement intent
- performance plan
- MIDI/event plan reference
- sample-slot/rights status
- next render status

### 3. CI gate
Every product step must remain verifyable.

Minimum requirements:
- `npm run verify` passes.
- GitHub Actions runs on PR and main.
- Generated artifacts are uploaded for inspection.
- No fake success for unavailable audio rendering.

### 4. devctl gate
`devctl` remains the operational ledger.

Minimum requirements:
- active work is explicit
- current scope is locked
- next action is production-oriented
- close only after verified outcome

## Release levels

### Alpha Product Surface
User can open the product surface, create a song artifact, download it, and validate it in CI.

### Project Bundle Alpha
User can generate a richer downloadable bundle that includes song, arrangement, performance, MIDI/event plan, and rights state.

### Audio Engine Alpha
System can render deterministic placeholder audio or sample-slot previews without claiming real production audio.

### Real Sample Loading Alpha
System can load real samples only when rights manifest and asset provenance are valid.

### Production Audio Alpha
System can produce stems or audio output with clear source, rights, and repeatable render settings.

## Non-negotiables
- No more treating the word demo as the product destination.
- No fake audio claims.
- No hidden sample loading.
- No unverified work unit closure.
- No separate public site repository unless explicitly approved.
- No long manual terminal loops when GitHub and CI can perform the work.

## Immediate next build
Build the first production vertical slice:

`web product surface → first-song artifact → project bundle artifact → CI validation → downloadable bundle`
