#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [,, inputPath = 'assets/demo-midi-events/hasidic-modern/midi-events.dml.json', outputPath = 'generated/audio/hasidic-modern/first-song.wav'] = process.argv;

const SAMPLE_RATE = 44100;
const CHANNELS = 2;
const BITS_PER_SAMPLE = 16;
const MASTER_GAIN = 0.22;
const TAIL_SECONDS = 1.25;

const TRACK_PROFILES = {
  piano: { wave: 'triangle', gain: 0.72, pan: -0.18, attack: 0.015, release: 0.20, octave: 0 },
  strings: { wave: 'sine', gain: 0.56, pan: 0.22, attack: 0.18, release: 0.65, octave: 0 },
  bass: { wave: 'sine', gain: 0.92, pan: 0, attack: 0.01, release: 0.15, octave: -1 },
  guitar: { wave: 'saw', gain: 0.42, pan: 0.32, attack: 0.008, release: 0.22, octave: 0 },
  drums: { wave: 'noise', gain: 0.85, pan: 0, attack: 0.002, release: 0.18, octave: 0 }
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function midiToFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function secondsFromTicks(ticks, ppq, bpm) {
  return (ticks / ppq) * (60 / bpm);
}

function envelope(t, duration, attack, release) {
  if (t < 0 || t > duration + release) return 0;
  if (t < attack) return t / Math.max(attack, 0.0001);
  if (t <= duration) return 1;
  return Math.max(0, 1 - ((t - duration) / Math.max(release, 0.0001)));
}

function oscillator(profile, phase, t) {
  if (profile.wave === 'sine') return Math.sin(phase);
  if (profile.wave === 'triangle') return 2 / Math.PI * Math.asin(Math.sin(phase));
  if (profile.wave === 'saw') return 2 * ((phase / (2 * Math.PI)) % 1) - 1;
  if (profile.wave === 'noise') {
    const seed = Math.sin((t + 1) * 12000) * 43758.5453;
    return (seed - Math.floor(seed)) * 2 - 1;
  }
  return Math.sin(phase);
}

function writeWav(filePath, left, right) {
  const frameCount = left.length;
  const blockAlign = CHANNELS * BITS_PER_SAMPLE / 8;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = frameCount * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < frameCount; i += 1) {
    const l = Math.max(-1, Math.min(1, left[i]));
    const r = Math.max(-1, Math.min(1, right[i]));
    buffer.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(r * 32767), 44 + i * 4 + 2);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

const plan = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
assert(plan?.schema === 'dml.midi_events.v0', 'Input must be a DML MIDI event plan.');
assert(Array.isArray(plan.events) && plan.events.length > 0, 'Input must contain note events.');

const ppq = plan.timebase?.ppq ?? 480;
const bpm = plan.timebase?.bpm ?? 90;
const noteEvents = plan.events.filter((event) => event.type === 'note');
const lastTick = Math.max(...noteEvents.map((event) => event.tick + event.duration));
const durationSeconds = secondsFromTicks(lastTick, ppq, bpm) + TAIL_SECONDS;
const totalFrames = Math.ceil(durationSeconds * SAMPLE_RATE);
const left = new Float32Array(totalFrames);
const right = new Float32Array(totalFrames);

for (const event of noteEvents) {
  const profile = TRACK_PROFILES[event.track] ?? TRACK_PROFILES.piano;
  const start = secondsFromTicks(event.tick, ppq, bpm) + ((event.humanize_ms ?? 0) / 1000);
  const duration = secondsFromTicks(event.duration, ppq, bpm);
  const freq = event.track === 'drums' ? 55 : midiToFrequency(event.note + (profile.octave * 12));
  const startFrame = Math.max(0, Math.floor(start * SAMPLE_RATE));
  const endFrame = Math.min(totalFrames, Math.ceil((start + duration + profile.release) * SAMPLE_RATE));
  const velocityGain = (event.velocity ?? 64) / 127;
  const pan = Math.max(-1, Math.min(1, profile.pan));
  const leftGain = Math.cos((pan + 1) * Math.PI / 4);
  const rightGain = Math.sin((pan + 1) * Math.PI / 4);

  for (let i = startFrame; i < endFrame; i += 1) {
    const t = i / SAMPLE_RATE - start;
    const amp = envelope(t, duration, profile.attack, profile.release) * velocityGain * profile.gain * MASTER_GAIN;
    const phase = 2 * Math.PI * freq * t;
    let sample = oscillator(profile, phase, t);

    if (event.track === 'drums') {
      const thump = Math.sin(2 * Math.PI * 58 * t) * Math.exp(-t * 18);
      sample = (sample * 0.45 + thump * 0.85) * Math.exp(-t * 8);
    }

    left[i] += sample * amp * leftGain;
    right[i] += sample * amp * rightGain;
  }
}

writeWav(outputPath, left, right);
const stats = fs.statSync(outputPath);
console.log('DML audio WAV render: OK');
console.log('input:', inputPath);
console.log('output:', outputPath);
console.log('bytes:', stats.size);
console.log('sample_rate:', SAMPLE_RATE);
console.log('channels:', CHANNELS);
console.log('duration_seconds:', durationSeconds.toFixed(2));
console.log('events:', noteEvents.length);
console.log('tracks:', [...new Set(noteEvents.map((event) => event.track))].join(','));
