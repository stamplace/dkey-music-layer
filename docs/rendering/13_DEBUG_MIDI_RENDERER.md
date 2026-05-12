# Debug MIDI Renderer

## Purpose
The debug MIDI renderer proves that DKey Music Layer can turn an inspectable MIDI event plan into a generated artifact.

This is not yet a Standard MIDI File writer. It is a safe intermediate render step that groups events by track and section so the system can verify the musical pipeline before binary export.

## Pipeline
Human intent → arrangement → performance → MIDI event plan → debug MIDI render artifact

## Artifact
The generated artifact is committed because it is small, inspectable, and useful for product/debug review.

## Boundary
Wave 06 does not implement MIDI file export, audio rendering, sample playback, or DAW UI.
