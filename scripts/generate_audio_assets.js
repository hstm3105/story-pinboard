const fs = require('fs');
const path = require('path');

// Generate valid PCM WAV file helper
function createWavBuffer(durationSec = 2, sampleRate = 22050, freq = 440, type = 'sine') {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataByteSize = numSamples * 2; // 16-bit mono
  const buffer = Buffer.alloc(44 + dataByteSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteSize, 40);

  // Generate PCM samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * freq * t);
    } else if (type === 'noise') {
      sample = Math.random() * 2 - 1;
    } else if (type === 'heartbeat') {
      const pulse = (t % 0.8 < 0.1) ? Math.sin(2 * Math.PI * 60 * t) : 0;
      sample = pulse;
    }

    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, intSample)), 44 + i * 2);
  }

  return buffer;
}

const sfxDir = path.join(__dirname, '../public/audio/sfx');
const epDir = path.join(__dirname, '../public/audio/episodes');

fs.mkdirSync(sfxDir, { recursive: true });
fs.mkdirSync(epDir, { recursive: true });

// SFX files
fs.writeFileSync(path.join(sfxDir, 'rain.mp3'), createWavBuffer(3, 22050, 0, 'noise'));
fs.writeFileSync(path.join(sfxDir, 'door_creak.mp3'), createWavBuffer(2, 22050, 220, 'sine'));
fs.writeFileSync(path.join(sfxDir, 'footsteps.mp3'), createWavBuffer(2, 22050, 150, 'sine'));
fs.writeFileSync(path.join(sfxDir, 'blast_door.mp3'), createWavBuffer(3, 22050, 80, 'sine'));
fs.writeFileSync(path.join(sfxDir, 'sirens.mp3'), createWavBuffer(3, 22050, 600, 'sine'));
fs.writeFileSync(path.join(sfxDir, 'thunder.mp3'), createWavBuffer(3, 22050, 50, 'noise'));
fs.writeFileSync(path.join(sfxDir, 'heartbeat.mp3'), createWavBuffer(4, 22050, 60, 'heartbeat'));
fs.writeFileSync(path.join(sfxDir, 'sparks.mp3'), createWavBuffer(2, 22050, 0, 'noise'));

// Full Episode 1 sample audio file
fs.writeFileSync(path.join(epDir, 'episode_1.mp3'), createWavBuffer(12, 22050, 300, 'sine'));

console.log('Audio asset files generated successfully in public/audio/');
