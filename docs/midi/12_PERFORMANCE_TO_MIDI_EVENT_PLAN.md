# Performance-to-MIDI Event Plan

## Purpose
This contract turns performance behavior into explicit musical events.

DKey Music Layer must preserve the chain:

Human intent → arrangement → performance → MIDI event plan → future render

## Core Event Fields
Each MIDI event describes:
- section
- track
- tick
- type
- note
- duration
- velocity
- articulation
- humanize offset

## Product Rule
MIDI event plans are not final music. They are inspectable, editable, and renderable intermediate state.

## Wave 05 Boundary
This wave adds a MIDI event plan and validator only. It does not write a `.mid` file yet and does not implement sample playback.
