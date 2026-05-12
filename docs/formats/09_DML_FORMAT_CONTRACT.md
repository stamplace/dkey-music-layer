# DML Format Contract

## Purpose
DML files are the internal contract of DKey Music Layer.

The product is not built around a single generator output. It is built around controlled musical state:
intent, project structure, tracks, assets, performance rules, stems, mix, export, and human revision.

## Format Family

- `project.dml.json` — describes a musical project.
- `pack.dml.json` — describes an asset/sample pack.
- `asset-vault.dml.json` — describes source assets and rights metadata.
- Future: `instrument.dml.json`, `arrangement.dml.json`, `performance.dml.json`.

## Core Rule
No real commercial source asset enters the repo without rights metadata.

## Wave 02 Boundary
This wave hardens the internal contract only. It does not import real commercial samples, train an audio model, or implement a full DAW UI.
