(() => {
  const SR = 44100;
  const BPM = 90;
  const BEAT = 60 / BPM;

  const NOTE = {
    B1: 61.735, D2: 73.416, E2: 82.407, F2: 87.307, Fs2: 92.499, G2: 97.999, A2: 110.0, B2: 123.47,
    D3: 146.83, E3: 164.81, Fs3: 185.0, G3: 196.0, A3: 220.0, B3: 246.94,
    D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.0, A4: 440.0, B4: 493.88,
    D5: 587.33, E5: 659.25, Fs5: 739.99
  };

  function gainEnv(ctx, time, dur, peak = 0.25, attack = 0.01, release = 0.2) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + attack);
    g.gain.exponentialRampToValueAtTime(0.001, time + Math.max(attack + 0.02, dur - release));
    g.gain.linearRampToValueAtTime(0, time + dur);
    return g;
  }

  function osc(ctx, freq, time, dur, type, gain, dest) {
    const o = ctx.createOscillator();
    const g = gainEnv(ctx, time, dur, gain, 0.008, 0.22);
    o.type = type;
    o.frequency.setValueAtTime(freq, time);
    o.connect(g).connect(dest);
    o.start(time);
    o.stop(time + dur + 0.05);
  }

  function bass(ctx, freq, time, dur, dest) {
    const o = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = gainEnv(ctx, time, dur, 0.22, 0.004, 0.08);
    o.type = "sawtooth";
    f.type = "lowpass";
    f.frequency.setValueAtTime(420, time);
    o.frequency.setValueAtTime(freq, time);
    o.connect(f).connect(g).connect(dest);
    o.start(time);
    o.stop(time + dur + 0.03);
  }

  function kick(ctx, time, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(120, time);
    o.frequency.exponentialRampToValueAtTime(42, time + 0.16);
    g.gain.setValueAtTime(0.8, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.32);
    o.connect(g).connect(dest);
    o.start(time);
    o.stop(time + 0.34);
  }

  function noiseHit(ctx, time, dur, gain, hp, dest) {
    const buffer = ctx.createBuffer(1, Math.floor(SR * dur), SR);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = gainEnv(ctx, time, dur, gain, 0.002, dur * 0.65);
    filter.type = "highpass";
    filter.frequency.setValueAtTime(hp, time);
    src.buffer = buffer;
    src.connect(filter).connect(g).connect(dest);
    src.start(time);
  }

  function chord(ctx, notes, time, dur, dest) {
    notes.forEach((n, i) => {
      osc(ctx, n, time + i * 0.01, dur, "triangle", 0.075, dest);
      osc(ctx, n * 2, time + i * 0.012, dur, "sine", 0.035, dest);
    });
  }

  function makeBus(ctx) {
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    master.gain.value = 0.78;
    comp.threshold.value = -18;
    comp.knee.value = 16;
    comp.ratio.value = 3;
    comp.attack.value = 0.01;
    comp.release.value = 0.25;
    master.connect(comp).connect(ctx.destination);
    return master;
  }

  async function renderFirstSong() {
    const bars = 16;
    const duration = bars * 4 * BEAT + 2;
    const ctx = new OfflineAudioContext(2, Math.ceil(duration * SR), SR);
    const bus = makeBus(ctx);

    const progression = [
      { root: NOTE.B1, chord: [NOTE.B3, NOTE.D4, NOTE.Fs4] },
      { root: NOTE.G2, chord: [NOTE.G3, NOTE.B3, NOTE.D4] },
      { root: NOTE.D2, chord: [NOTE.D3, NOTE.Fs3, NOTE.A3] },
      { root: NOTE.A2, chord: [NOTE.A3, NOTE.D4, NOTE.E4] }
    ];

    for (let bar = 0; bar < bars; bar++) {
      const t = bar * 4 * BEAT;
      const p = progression[bar % progression.length];

      chord(ctx, p.chord, t, 4 * BEAT * 0.92, bus);

      for (let b = 0; b < 4; b++) {
        const bt = t + b * BEAT;
        bass(ctx, p.root, bt, BEAT * 0.72, bus);
        if (b === 0 || b === 2) kick(ctx, bt, bus);
        if (b === 1 || b === 3) noiseHit(ctx, bt, 0.14, 0.22, 1000, bus);
        noiseHit(ctx, bt + BEAT / 2, 0.045, 0.05, 7000, bus);
      }

      const melody = [NOTE.Fs4, NOTE.A4, NOTE.B4, NOTE.D5, NOTE.B4, NOTE.A4, NOTE.Fs4, NOTE.E4];
      melody.forEach((m, i) => {
        const mt = t + i * (BEAT / 2);
        osc(ctx, m, mt, BEAT * 0.42, "sine", bar < 4 ? 0.05 : 0.09, bus);
      });
    }

    return ctx.startRendering();
  }

  function encodeWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const length = buffer.length * numChannels * 2 + 44;
    const ab = new ArrayBuffer(length);
    const view = new DataView(ab);
    let offset = 0;

    const writeStr = s => { for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i)); };
    const write16 = v => { view.setUint16(offset, v, true); offset += 2; };
    const write32 = v => { view.setUint32(offset, v, true); offset += 4; };

    writeStr("RIFF");
    write32(length - 8);
    writeStr("WAVE");
    writeStr("fmt ");
    write32(16);
    write16(1);
    write16(numChannels);
    write32(SR);
    write32(SR * numChannels * 2);
    write16(numChannels * 2);
    write16(16);
    writeStr("data");
    write32(length - 44);

    const channels = [];
    for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

    for (let i = 0; i < buffer.length; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, channels[c][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: "audio/wav" });
  }

  function ensurePanel() {
    let panel = document.getElementById("dkey-audio-output");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "dkey-audio-output";
    panel.dir = "rtl";
    panel.style.cssText = `
      margin: 24px auto;
      max-width: 820px;
      padding: 22px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(20,28,36,.92), rgba(8,12,18,.96));
      color: #f4f7fb;
      box-shadow: 0 20px 60px rgba(0,0,0,.35);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    `;
    panel.innerHTML = `
      <h2 style="margin:0 0 8px;font-size:24px">מנוע אודיו ראשון</h2>
      <p style="margin:0 0 16px;color:#b9c5d6;line-height:1.6">
        יצירת WAV אמיתי בדפדפן: Bm · 90BPM · תופים · בס · פסנתר · שכבת אווירה.
      </p>
      <button id="dkey-render-wav" style="
        width:100%;border:0;border-radius:22px;padding:18px 22px;
        font-size:20px;font-weight:800;cursor:pointer;color:#041016;
        background:linear-gradient(90deg,#70f0d8,#7bb7ff);
      ">הפק WAV ראשון</button>
      <div id="dkey-render-status" style="margin-top:14px;color:#b9c5d6">מוכן.</div>
      <div id="dkey-player-wrap" style="margin-top:16px"></div>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  async function runRender() {
    const panel = ensurePanel();
    const status = panel.querySelector("#dkey-render-status");
    const wrap = panel.querySelector("#dkey-player-wrap");
    const btn = panel.querySelector("#dkey-render-wav");

    btn.disabled = true;
    btn.textContent = "מפיק אודיו...";
    status.textContent = "מרנדר WAV מקורי בצד הדפדפן. זה יכול לקחת כמה שניות.";

    try {
      const audioBuffer = await renderFirstSong();
      const wav = encodeWav(audioBuffer);
      const url = URL.createObjectURL(wav);

      wrap.innerHTML = `
        <audio controls src="${url}" style="width:100%;margin:10px 0 14px"></audio>
        <a download="dkey-first-song-bm-90bpm.wav" href="${url}" style="
          display:block;text-align:center;text-decoration:none;border-radius:18px;
          padding:15px 18px;font-weight:800;color:#f4f7fb;
          background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);
        ">הורד WAV</a>
      `;
      status.textContent = "נוצר קובץ WAV אמיתי. אפשר לנגן ולהוריד.";
    } catch (err) {
      console.error(err);
      status.textContent = "שגיאה ביצירת האודיו: " + (err?.message || err);
    } finally {
      btn.disabled = false;
      btn.textContent = "הפק WAV מחדש";
    }
  }

  function wire() {
    const panel = ensurePanel();
    panel.querySelector("#dkey-render-wav")?.addEventListener("click", runRender);

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!target) return;
      const text = (target.innerText || target.value || "").trim();
      if (text.includes("צור שיר ראשון")) {
        event.preventDefault();
        runRender();
      }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  window.DKEY_RENDER_FIRST_WAV = runRender;
})();
