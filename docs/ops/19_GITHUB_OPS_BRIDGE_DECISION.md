# Wave 11A Decision — GitHub Ops Bridge

## Decision
Build a GitHub-based operations bridge before adding the next product-facing music feature.

## Reason
The repo now has many verification steps. Long mobile terminal paste blocks are becoming the operational bottleneck. GitHub Actions should become the repeatable execution terminal while the phone remains the control surface.

## Selected Path

- Make CI run the full `npm run verify` path.
- Add a manual GitHub Actions workflow for safe whitelisted operations.
- Add an ops runner that rejects unknown commands.
- Upload generated reports and artifacts from Actions.
- Document a simple mobile workflow.

## Rejected For This Wave

- Arbitrary shell execution from GitHub Actions.
- Real sample loading.
- WAV rendering.
- Public product site deployment.

## Next Product Step
After this bridge is verified, continue with a product-facing path:

- visible demo surface
- first song creation path
- inspectable project artifact
- later real sample loading only behind the rights gate
