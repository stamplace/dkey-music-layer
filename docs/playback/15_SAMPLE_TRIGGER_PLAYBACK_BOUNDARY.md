# Sample Trigger Playback Boundary

## Purpose
Wave 08 connects MIDI event state to asset-backed sample trigger slots.

This does not render audio. It creates an inspectable playback plan that says which track event would trigger which sample slot and velocity layer.

## Pipeline
Human intent → arrangement → performance → MIDI event plan → Standard MIDI export → sample trigger map → playback plan

## Boundary
The playback plan does not load real samples, does not create WAV files, and does not run DSP. It is a verified planning layer before sample playback work.

## Product Rule
No real sample playback may occur without asset rights metadata and an explicit sample loading boundary.
