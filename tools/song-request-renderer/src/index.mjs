#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [,, requestPath = 'generated/requests/song-request.dml.json', outputPath = 'generated/song-midi-events/song-request/midi-events.dml.json'] = process.argv;

const NOTE_ROOTS = {
  C: 60,
  D: 62,
  E: 64,
  F: 65,
  G: 67,
  A: 69,
  B: 71
};

const MINOR_OFFSETS = [0, 3, 7, 10];
const MAJOR_OFFSETS = [0, 4, 7, 11];
const PPQ = 480;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseKey(key) {
  const normalized = String(key || 'Bm').trim();
  const match = normalized.match(/^([A-G])(#|b)?(m)?$/i);
  assert(match, `Unsupported key: ${key}`);
  let root = NOTE_ROOTS[match[1].toUpperCase()];
  if (match[2] === '#') root += 1;
  if (match[2] === 'b') root -= 1;
  return { root, mode: match[3] ? 'minor' : 'major', label: normalized };
}

function safeNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function readRequest(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      schema: 'dml.product_song_request.v1',
      title: 'First Generated Song',
      musical_intent: { key: 'Bm', bpm: 90, emotion: 'warm, clear, rising' },
      production_direction: 'piano, bass, drums, strings, guitar, wide chorus'
    };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function event(section, track, tick, note, duration, velocity, articulation, humanize_ms = 0) {
  return { section, track, tick, type: 'note', note, duration, velocity, articulation, humanize_ms };
}

function buildMidiEvents(request) {
  const title = request.title || 'Untitled DKey Song';
  const intent = request.musical_intent || {};
  const { root, mode, label } = parseKey(intent.key || request.key || 'Bm');
  const bpm = safeNumber(intent.bpm || request.bpm, 90, 55, 170);
  const offsets = mode === 'minor' ? MINOR_OFFSETS : MAJOR_OFFSETS;

  const rootLow = root - 24;
  const rootMid = root - 12;
  const third = root + offsets[1] - 12;
  const fifth = root + offsets[2] - 12;
  const seventh = root + offsets[3] - 12;
  const melodyRoot = root;
  const melodyLift = root + 7;
  const melodyHigh = root + 12;

  const events = [];
  // Intro: recognizable motif.
  events.push(event('intro', 'piano', 0, melodyRoot, 480, 58, 'motif_open', 6));
  events.push(event('intro', 'piano', 480, third, 480, 54, 'motif_answer', 9));
  events.push(event('intro', 'strings', 0, fifth + 12, 1440, 42, 'soft_pad', 14));

  // Verse: pulse + harmonic identity.
  events.push(event('verse', 'bass', 1440, rootLow, 480, 72, 'root_pulse', 1));
  events.push(event('verse', 'drums', 1440, 36, 120, 54, 'soft_kick', 0));
  events.push(event('verse', 'piano', 1440, rootMid, 480, 62, 'broken_chord', 5));
  events.push(event('verse', 'piano', 1920, fifth, 480, 60, 'broken_chord', 7));
  events.push(event('verse', 'guitar', 2400, third, 480, 46, 'light_texture', 11));

  // Chorus: stronger hook and wider energy.
  events.push(event('chorus', 'drums', 2880, 36, 120, 100, 'full_kick', 0));
  events.push(event('chorus', 'bass', 2880, rootLow, 960, 94, 'solid_root', 0));
  events.push(event('chorus', 'piano', 2880, melodyLift, 480, 88, 'hook_1', 2));
  events.push(event('chorus', 'piano', 3360, melodyHigh, 480, 92, 'hook_2', 3));
  events.push(event('chorus', 'strings', 2880, melodyHigh + 7, 1440, 84, 'wide_lift', 10));
  events.push(event('chorus', 'guitar', 2880, seventh, 960, 72, 'open_strum', 8));

  // Final tag: audible ending.
  events.push(event('final_chorus', 'drums', 4320, 36, 120, 92, 'final_hit', 0));
  events.push(event('final_chorus', 'bass', 4320, rootLow, 960, 88, 'final_root', 0));
  events.push(event('final_chorus', 'strings', 4320, melodyHigh, 1440, 78, 'final_pad', 12));
  events.push(event('final_chorus', 'piano', 4800, melodyLift, 960, 78, 'final_resolve', 6));

  return {
    schema: 'dml.midi_events.v0',
    midi_event_plan_id: `product-render-${Date.now()}`,
    source_request: title,
    timebase: { ppq: PPQ, bpm, time_signature: '4/4' },
    render_scope: {
      sections: ['intro', 'verse', 'chorus', 'final_chorus'],
      tracks: ['piano', 'bass', 'drums', 'strings', 'guitar'],
      policy: 'product_request_render_v1'
    },
    request_summary: {
      title,
      key: label,
      bpm,
      emotion: intent.emotion || request.emotion || '',
      production_direction: request.production_direction || ''
    },
    events,
    smoke_expectations: {
      min_events: 12,
      required_tracks: ['piano', 'bass', 'drums', 'strings', 'guitar'],
      required_sections: ['intro', 'verse', 'chorus']
    },
    export_policy: {
      renderable_to_wav: true,
      real_samples_loaded: false,
      rights_gate_required_for_real_assets: true
    }
  };
}

const request = readRequest(requestPath);
const midiEvents = buildMidiEvents(request);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(midiEvents, null, 2)}\n`);

console.log('DML song request render: OK');
console.log('request:', requestPath);
console.log('output:', outputPath);
console.log('title:', midiEvents.request_summary.title);
console.log('key:', midiEvents.request_summary.key);
console.log('bpm:', midiEvents.timebase.bpm);
console.log('events:', midiEvents.events.length);
console.log('tracks:', midiEvents.render_scope.tracks.join(','));
