# DKey Music Layer

**Mode:** PRODUCTION foundation  
**Status:** Bootstrap / architecture-first  

DKey Music Layer is not another song generator and not a sound-pack manager.

It is a living studio runtime:

- full DAW direction
- mobile studio controller
- human intent and conversation layer
- asset/sample vault
- performance engine
- arrangement engine
- stems/render pipeline
- mix/master/export boundary
- long-term foundation for the “live arranger of 2036”

## Core claim

Suno creates a result.  
**DKey Music Layer creates the controllable living layer from which a result is born, edited, performed, mixed and exported.**

## Production principle

The system starts simple, but not small:

```text
Human intent
  -> DML project format
  -> arrangement plan
  -> performance plan
  -> asset/sample engine
  -> stems/render boundary
  -> DAW/mobile control surfaces
```

## Current repo scope

This repository is the first production-grade foundation, not the full final DAW.
It includes:

- monorepo structure
- source docs
- devctl work ledger
- DML project format
- DML pack format
- basic intent/arrangement/performance pipeline
- sample pack validation
- render smoke test
- CI workflow
- roadmap for production waves

## Quick start

```bash
npm run doctor
npm test
npm run smoke
```

## Expected first smoke output

```text
DML render smoke: OK
project: demo-hasidic-modern
tracks: drums,bass,piano,strings,guitar
exports: stems,mix,project
```

## Repo commands

```bash
npm run doctor       # verify repo structure and state files
npm test             # run unit/smoke tests
npm run smoke        # run end-to-end text render smoke
npm run pack:check   # validate demo DML pack
npm run devctl       # inspect work ledger
```

## Not in scope yet

- training a proprietary Suno-like model from scratch
- direct decoding of closed/proprietary Korg files
- real audio DSP rendering
- mobile app store packaging
- commercial licensing implementation

These are future waves after the core format and runtime are stable.

## Source of truth

1. code
2. docs
3. devctl state
4. tests/smoke output
5. git history
