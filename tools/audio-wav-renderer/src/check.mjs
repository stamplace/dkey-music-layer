#!/usr/bin/env node
import fs from 'node:fs';

const [,, wavPath = 'generated/audio/hasidic-modern/first-song.wav'] = process.argv;

function fail(message) {
  console.error('Audio WAV check failed:', message);
  process.exit(1);
}

if (!fs.existsSync(wavPath)) fail(`missing file: ${wavPath}`);

const buffer = fs.readFileSync(wavPath);
if (buffer.length < 44) fail('file is too small to contain a WAV header');
if (buffer.toString('ascii', 0, 4) !== 'RIFF') fail('missing RIFF chunk');
if (buffer.toString('ascii', 8, 12) !== 'WAVE') fail('missing WAVE format marker');
if (buffer.toString('ascii', 12, 16) !== 'fmt ') fail('missing fmt chunk');
if (buffer.readUInt16LE(20) !== 1) fail('only PCM format is accepted');

const channels = buffer.readUInt16LE(22);
const sampleRate = buffer.readUInt32LE(24);
const bitsPerSample = buffer.readUInt16LE(34);
const dataMarker = buffer.toString('ascii', 36, 40);
const dataSize = buffer.readUInt32LE(40);
const riffSize = buffer.readUInt32LE(4);

if (channels !== 2) fail(`expected stereo output, got ${channels}`);
if (sampleRate !== 44100) fail(`expected 44100Hz, got ${sampleRate}`);
if (bitsPerSample !== 16) fail(`expected 16-bit PCM, got ${bitsPerSample}`);
if (dataMarker !== 'data') fail('missing data chunk');
if (dataSize < sampleRate * channels * 2) fail('audio payload is shorter than one second');
if (riffSize + 8 !== buffer.length) fail('RIFF size does not match file length');

console.log('Audio WAV check: OK');
console.log('file:', wavPath);
console.log('bytes:', buffer.length);
console.log('sample_rate:', sampleRate);
console.log('channels:', channels);
console.log('bits_per_sample:', bitsPerSample);
console.log('duration_seconds:', (dataSize / (sampleRate * channels * (bitsPerSample / 8))).toFixed(2));
