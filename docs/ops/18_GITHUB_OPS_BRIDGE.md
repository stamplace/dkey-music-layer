# GitHub Ops Bridge

## Purpose
Wave 11A turns GitHub into the safe operations bridge for DKey Music Layer.

The goal is to stop relying on long mobile terminal paste blocks. The phone becomes the control surface. GitHub Actions becomes the execution terminal. ChatGPT coordinates the plan, reads logs, and proposes the next small verified step.

## What Changed

### Full CI
The main CI now runs:

```bash
npm run verify
```

This is the source-of-truth verification path for the repository.

### Manual Ops Workflow
A manual workflow exists at:

```text
Actions -> DML Manual Ops -> Run workflow
```

Allowed operations:

- `status`
- `doctor`
- `format-check`
- `verify`
- `full-report`

Unknown operations are rejected by the ops runner.

## Mobile Workflow

From the phone:

1. Open GitHub.
2. Open the repository.
3. Go to Actions.
4. Choose `DML Manual Ops`.
5. Tap `Run workflow`.
6. Choose one safe operation.
7. Send the result summary or failed step back to ChatGPT.

## Safety Boundary
This bridge does not allow arbitrary shell commands.

Only whitelisted operations are supported. This prevents accidental destructive commands and keeps the execution path repeatable.

## Product Path After This Bridge
After this wave, the next product-facing work should focus on:

1. A visible demo surface.
2. A first song creation path.
3. A simple artifact the user can inspect.
4. Later: real sample loading only behind the rights gate.

## Definition of Done

- CI runs full `npm run verify`.
- Manual ops workflow exists.
- Ops runner writes a generated report.
- Unknown operations are rejected.
- The mobile workflow is documented.
