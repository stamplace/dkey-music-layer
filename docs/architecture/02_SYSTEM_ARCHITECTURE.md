# System Architecture

## Layers

```text
apps/
  web-studio           visual DAW shell
  mobile-controller    studio command surface
  desktop-daw          future native/pro DAW surface

packages/
  core                 shared types and project factory
  formats              DML project/pack validation
  intent-engine        human text -> musical intent
  arrangement-engine   intent -> arrangement plan
  performance-engine   arrangement -> performance plan
  sample-engine        asset pack loading and validation
  render-engine        render boundary and export plan
  mixer                mix/master instruction boundary
  dml-cli              future command line interface

tools/
  devctl               work ledger and doctor
  pack-validator       validates packs
  render-smoke         end-to-end smoke test
```

## Internal formats

DML owns its internal formats before importing external ecosystems.

- `*.project.dml.json` — project format
- `*.pack.dml.json` — asset/sample pack format
- `*.instrument.dml.json` — future instrument map format
- `*.arrangement.dml.json` — future arrangement format

## Why not start from Korg files

Korg-like `.SET`, `.PCM`, `.STY` are inspiration and future import targets. They are not the core format. The core must be independent, explicit and testable.

## Why not train a model first

A proprietary Suno-like model requires large datasets, GPU budget and legal clarity. DML starts from a controllable production runtime and can later integrate/generate audio through multiple model backends.
