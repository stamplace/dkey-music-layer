# Asset Rights Manifest

## Purpose
Wave 10 adds a rights gate before real sample loading.

The system already has MIDI events, Standard MIDI export, a playback plan, and a sample-slot preview. Before it can load actual samples, every sample slot needs a rights record.

## Boundary
This wave does not load audio.

It only records:
- which sample slots exist
- which tracks and sections use them
- whether real assets are attached
- whether rights are cleared
- what is allowed
- what is blocked

## Current Policy
All demo slots are placeholders.

Allowed:
- local development
- metadata preview
- validation
- non-audio planning

Blocked:
- real sample loading
- audio rendering
- commercial release
- redistribution as sample pack

## Product Rule
No real sample loading is allowed until the rights manifest permits it explicitly.
