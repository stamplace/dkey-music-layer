# Standard MIDI Export Boundary

## Purpose
Wave 07 adds the first Standard MIDI File writer.

This proves that DKey Music Layer can move from an inspectable MIDI event plan into a real export artifact that can later be imported into DAWs or playback tools.

## Pipeline
Human intent → arrangement → performance → MIDI event plan → debug render artifact → Standard MIDI file

## Boundary
The generated MIDI file is a proof artifact. It is not final musical output, not sample playback, and not audio rendering.

## Product Rule
Binary export must remain behind verifiable DML state. The system should always preserve the editable event plan before writing export artifacts.
