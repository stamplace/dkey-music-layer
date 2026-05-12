# Intent-to-Arrangement Contract

## Purpose
This contract turns human musical intent into an editable arrangement plan.

DKey Music Layer is not a one-shot generator. It must preserve the path from human intent to musical decisions:
sections, tracks, density, energy, entry, exit, and revision.

## Core Flow

Human intent:
> quiet verse, wide chorus, live strings, stable piano and bass

Becomes arrangement state:
- intro
- verse
- pre_chorus
- chorus
- bridge
- final_chorus

Each section controls:
- energy
- density
- bars
- track state
- musical pattern description

## Product Rule
The arrangement remains editable. The system must not flatten a controlled musical plan into a single opaque audio result without explicit human approval.

## Wave 03 Boundary
This wave adds the first editable arrangement contract and validation. It does not implement a full DAW UI, real audio rendering, commercial samples, or model training.
