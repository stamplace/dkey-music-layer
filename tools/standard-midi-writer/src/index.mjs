#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'assets/demo-midi-events/hasidic-modern/midi-events.dml.json';
const outputPath = process.argv[3] || 'generated/standard-midi/hasidic-modern/demo-hasidic-modern.mid';

function fail(message) {
  console.error(`Standard MIDI write failed: ${message}`);
  process.exit(1);
}

function u16(value) {
  return Buffer.from([(value >> 8) & 0xff, value & 0xff]);
}

function u32(value) {
  return Buffer.from([
    (value >> 24) & 0xff,
    (value >> 16) & 0xff,
    (value >> 8) & 0xff,
    value & 0xff
  ]);
}

function vlq(value) {
  const bytes = [value & 0x7f];
  value >>= 7;
  while (value > 0) {
    bytes.unshift((value & 0x7f) | 0x80);
    value >>= 7;
  }
  return Buffer.from(bytes);
}

function metaText(text) {
  const data = Buffer.from(text, 'utf8');
  return Buffer.concat([Buffer.from([0xff, 0x01]), vlq(data.length), data]);
}

function tempoMeta(bpm) {
  const mpqn = Math.round(60000000 / bpm);
  return Buffer.from([
    0xff, 0x51, 0x03,
    (mpqn >> 16) & 0xff,
    (mpqn >> 8) & 0xff,
    mpqn & 0xff
  ]);
}

function timeSignatureMeta(signature) {
  const [numRaw, denRaw] = String(signature || '4/4').split('/');
  const numerator = Number(numRaw) || 4;
  const denominator = Number(denRaw) || 4;
  const denominatorPower = Math.round(Math.log2(denominator));
  return Buffer.from([0xff, 0x58, 0x04, numerator, denominatorPower, 24, 8]);
}

function trackChunk(events) {
  const body = Buffer.concat(events);
  return Buffer.concat([Buffer.from('MTrk'), u32(body.length), body]);
}

function midiNoteOn(channel, note, velocity) {
  return Buffer.from([0x90 | channel, note & 0x7f, velocity & 0x7f]);
}

function midiNoteOff(channel, note) {
  return Buffer.from([0x80 | channel, note & 0x7f, 0]);
}

if (!fs.existsSync(inputPath)) {
  fail(`missing input ${inputPath}`);
}

const plan = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

if (plan.schema !== 'dml.midi_events.v0') fail('input schema must be dml.midi_events.v0');
if (!Array.isArray(plan.events) || plan.events.length === 0) fail('input events are required');

const ppq = plan.timebase?.ppq || 480;
const bpm = plan.timebase?.bpm || 90;
const signature = plan.timebase?.time_signature || '4/4';

const channelByTrack = {
  piano: 0,
  strings: 1,
  bass: 2,
  drums: 9,
  guitar: 3
};

const absoluteEvents = [];

absoluteEvents.push({
  tick: 0,
  order: 0,
  bytes: tempoMeta(bpm)
});

absoluteEvents.push({
  tick: 0,
  order: 1,
  bytes: timeSignatureMeta(signature)
});

absoluteEvents.push({
  tick: 0,
  order: 2,
  bytes: metaText(`DKey Music Layer debug MIDI export: ${plan.midi_event_plan_id}`)
});

for (const event of plan.events) {
  if (event.type !== 'note') continue;

  const channel = channelByTrack[event.track] ?? 0;
  const shiftedTick = Math.max(0, event.tick + Math.round((event.humanize_ms || 0) * ppq / 60000 * bpm));

  absoluteEvents.push({
    tick: shiftedTick,
    order: 10,
    bytes: midiNoteOn(channel, event.note, event.velocity)
  });

  absoluteEvents.push({
    tick: shiftedTick + event.duration,
    order: 5,
    bytes: midiNoteOff(channel, event.note)
  });
}

absoluteEvents.push({
  tick: Math.max(...absoluteEvents.map((event) => event.tick)) + ppq,
  order: 99,
  bytes: Buffer.from([0xff, 0x2f, 0x00])
});

absoluteEvents.sort((a, b) => a.tick - b.tick || a.order - b.order);

let lastTick = 0;
const encodedEvents = [];

for (const event of absoluteEvents) {
  const delta = event.tick - lastTick;
  encodedEvents.push(Buffer.concat([vlq(delta), event.bytes]));
  lastTick = event.tick;
}

const header = Buffer.concat([
  Buffer.from('MThd'),
  u32(6),
  u16(0),
  u16(1),
  u16(ppq)
]);

const midi = Buffer.concat([header, trackChunk(encodedEvents)]);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, midi);

console.log('Standard MIDI write: OK');
console.log('input:', inputPath);
console.log('output:', outputPath);
console.log('bytes:', midi.length);
console.log('events:', plan.events.length);
console.log('ppq:', ppq);
