# Audio and Asset Pipeline

## Asset principle

Samples are source assets. They are not anonymous model fuel by default.

Each asset needs:

- file path
- instrument role
- pitch or drum key
- velocity range
- articulation
- license metadata
- source owner
- allowed usage

## Pack lifecycle

```text
raw samples
  -> normalize naming
  -> create pack.dml.json
  -> validate pack
  -> index pack
  -> map instruments
  -> connect to tracks
  -> render stems
```

## Initial supported assets

- WAV placeholders
- MIDI plans
- DML pack manifests

## Future importers

- SFZ
- Kontakt-like mappings where legally allowed
- Korg-inspired SET/STY/PCM importers where legally allowed
- stem import
- loop import

## Legal boundary

No commercial sample, model or third-party asset should enter this repository unless its license is explicit and recorded.
