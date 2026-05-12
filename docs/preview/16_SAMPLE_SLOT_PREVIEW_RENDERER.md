# Sample Slot Preview Renderer

## Purpose
Wave 09 adds a deterministic preview layer for sample-slot playback planning.

It does not render audio. It turns the playback plan into a timeline that shows which sample slot would be triggered, when, and through which velocity layer.

## Pipeline
Human intent → arrangement → performance → MIDI events → Standard MIDI export → sample trigger map → playback plan → sample-slot preview

## Boundary
The preview artifact is metadata only:
- no audio DSP
- no WAV rendering
- no real sample loading
- no decoding
- no DAW UI

## Product Rule
Before real playback, the system must preserve inspectable sample-slot intent.
