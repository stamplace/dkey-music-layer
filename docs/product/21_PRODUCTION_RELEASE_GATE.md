# DKey Music Layer — Production Release Gate

## Purpose
This gate prevents the project from drifting into endless small demos. A work unit is production-relevant only if it moves the system toward a user-visible, verified, end-to-end music creation workflow.

## Release gate checklist
A production work unit must answer all of the following:

1. What user-facing product capability changed?
2. What source-of-truth artifact was created or changed?
3. How is it verified locally?
4. How is it verified in CI?
5. What can the user see or download?
6. What is still blocked and why?
7. What is the next production step?

## Required status vocabulary
Use these statuses only:

- INTAKE
- DISCOVERY
- DECIDE
- ARCHITECT
- BUILD
- VERIFY
- PACKAGE
- BLOCKED
- LOCKED

## Production acceptance levels

### Product Surface Accepted
A user can open the web surface and perform a meaningful action.

### Artifact Accepted
A user action produces a structured artifact that can be validated and reused.

### Pipeline Accepted
An artifact can move to the next deterministic layer.

### Bundle Accepted
The system can package the work into a downloadable project bundle.

### Audio Accepted
Only valid when an actual audio render path exists, rights are checked, and output is inspectable.

## Hard blocks
The following cannot be called production-complete:

- a page that only explains the idea
- a validator with no user-visible path
- a generated JSON with no product surface
- a CI workflow that passes but does not protect a product capability
- a fake audio claim
- a separate repo or deployment path not approved as source-of-truth

## Current production target
The next accepted target is:

`Product Surface + First Song Artifact + Project Bundle + CI Gate`

This is the minimum credible production alpha path.
