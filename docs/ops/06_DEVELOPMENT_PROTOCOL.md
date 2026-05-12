# Development Protocol

## Default flow

```text
INTAKE -> DISCOVERY -> DECIDE -> ARCHITECT -> BUILD -> VERIFY -> PACKAGE -> LOCK
```

## Work rule

No wave closes without verification.

## Git rule

Small logical commits. No giant mixed commit.

## devctl rule

Use devctl to keep scope, next action and verified outcome visible.

## Verify commands

```bash
npm run doctor
npm test
npm run pack:check
npm run smoke
git status --short
```
