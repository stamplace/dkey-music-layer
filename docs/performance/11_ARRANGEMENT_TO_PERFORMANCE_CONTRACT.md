# Arrangement-to-Performance Contract

## Purpose
This contract turns arrangement decisions into playable performance behavior.

DKey Music Layer must not only decide what plays. It must describe how the music should feel under performance:
timing, velocity, articulation, humanize, section behavior, and render policy.

## Core Flow

Arrangement:
> chorus strings: wide octave lift

Performance:
- articulation: long_octave_lift
- velocity range: 70–98
- timing feel: slightly behind
- humanize: low
- performance note: emotional lift behind the vocal

## Product Rule
Performance state remains editable. The system should preserve human control before final mix, stem rendering, or flattening.

## Wave 04 Boundary
This wave adds a contract and validation only. It does not implement real DSP rendering, sample playback, or DAW UI.
