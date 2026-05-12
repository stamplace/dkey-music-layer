#!/usr/bin/env node
import fs from 'node:fs';

const midiPath = process.argv[2] || 'generated/standard-midi/hasidic-modern/demo-hasidic-modern.mid';

function fail(message) {
  console.error(`Standard MIDI check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(midiPath)) {
  fail(`missing file ${midiPath}`);
}

const data = fs.readFileSync(midiPath);

if (data.length < 22) fail('file too small');
if (data.subarray(0, 4).toString('ascii') !== 'MThd') fail('missing MThd header');
if (data.readUInt32BE(4) !== 6) fail('invalid header length');
if (data.readUInt16BE(8) !== 0) fail('expected MIDI format 0');
if (data.readUInt16BE(10) !== 1) fail('expected one track');
if (data.readUInt16BE(12) !== 480) fail('expected ppq 480');
if (data.subarray(14, 18).toString('ascii') !== 'MTrk') fail('missing MTrk chunk');

const trackLength = data.readUInt32BE(18);
if (trackLength <= 0) fail('empty track');
if (22 + trackLength !== data.length) fail('track length mismatch');

const hasEndOfTrack = data.includes(Buffer.from([0xff, 0x2f, 0x00]));
if (!hasEndOfTrack) fail('missing end-of-track meta event');

console.log('Standard MIDI check: OK');
console.log('file:', midiPath);
console.log('bytes:', data.length);
console.log('track_bytes:', trackLength);
console.log('format:', data.readUInt16BE(8));
console.log('tracks:', data.readUInt16BE(10));
console.log('ppq:', data.readUInt16BE(12));
