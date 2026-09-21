/* Synthwave · 真 synthwave 音樂（WebAudio 即時合成：kick、snare、bass、arp + delay、pad）
   太陽、地平線、網格同卡片等化器跟節拍跳 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'deep-sound';
  Object.assign(btn.style, { background: 'rgba(13,2,33,.88)', border: '1px solid #FF2E97', boxShadow: '0 0 14px rgba(255,46,151,.6)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '.08em' });
  btn.textContent = '▶ 播放 SYNTHWAVE'; document.body.append(btn);
  const cta = D.$('.cta'); if (cta) D.hint('🎹 撳左下角播放 —— 音樂由瀏覽器即時合成，太陽同等化器會跟節拍跳', cta, 'afterend');

  let ctx, master, an, delay, noiseBuf, playing = false, next = 0, step = 0, timer = null, raf = null;
  const bpm = 96, s16 = 60 / bpm / 4;
  const prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];   // Am · F · C · G
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const init = () => {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = .18;
    const comp = ctx.createDynamicsCompressor(); an = ctx.createAnalyser(); an.fftSize = 64; an.smoothingTimeConstant = .7;
    master.connect(comp); comp.connect(an); an.connect(ctx.destination);
    delay = ctx.createDelay(1); delay.delayTime.value = s16 * 3;
    const fb = ctx.createGain(); fb.gain.value = .38; const dg = ctx.createGain(); dg.gain.value = .5;
    delay.connect(fb); fb.connect(delay); delay.connect(dg); dg.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .25, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  };
  const voice = (f, t, dur, type, vol, cut, toDelay) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = f; fl.type = 'lowpass';
    fl.frequency.setValueAtTime(cut, t); fl.frequency.exponentialRampToValueAtTime(Math.max(80, cut * .25), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(fl); fl.connect(g); g.connect(master); if (toDelay) g.connect(delay);
    o.start(t); o.stop(t + dur + .05);
  };
  const kick = t => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .22); g.gain.setValueAtTime(.95, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g); g.connect(master); o.start(t); o.stop(t + .32); };
  const snare = t => { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 1500; g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + .2); s.connect(f); f.connect(g); g.connect(master); g.connect(delay); s.start(t); s.stop(t + .22); };
  const pulse = t => setTimeout(() => {
    gsap.fromTo('.horizon', { boxShadow: '0 0 46px 12px #FF2E97' }, { boxShadow: '0 0 14px 3px #FF2E97', duration: .5, ease: 'power2.out' });
    gsap.fromTo('.sun-glow', { opacity: 1 }, { opacity: .75, duration: .5, ease: 'power2.out' });
    gsap.fromTo('.lines', { opacity: 1 }, { opacity: .7, duration: .45 });
    gsap.fromTo('.logo', { textShadow: '0 0 16px #00F0FF, 0 0 40px #00F0FF' }, { textShadow: '0 0 8px #00F0FF, 0 0 22px rgba(0,240,255,.6)', duration: .5 });
  }, Math.max(0, (t - ctx.currentTime) * 1000));
  const sched = () => {
    while (next < ctx.currentTime + .12) {
      const bar = Math.floor(step / 16) % 4, s = step % 16, ch = prog[bar];
      if (s % 4 === 0) { kick(next); pulse(next); }
      if (s === 4 || s === 12) snare(next);
      if (s % 2 === 0) voice(hz(ch[0] - 24), next, s16 * 1.8, 'sawtooth', .32, 700);
      const arp = ch[[0, 1, 2, 1][s % 4]] + (s % 8 < 4 ? 12 : 24);
      voice(hz(arp), next, s16 * .9, 'square', .07, 2600, true);
      if (s === 0) ch.forEach(n => voice(hz(n), next, s16 * 16, 'sawtooth', .045, 1600));
      next += s16; step++;
    }
  };
  const bars = D.$$('.eq i'), data = new Uint8Array(32);
  const eqLoop = () => {
    an.getByteFrequencyData(data);
    bars.forEach((b, i) => { b.style.height = (12 + data[(i % 10) * 2 + 1] / 255 * 88) + '%'; });
    raf = requestAnimationFrame(eqLoop);
  };
  btn.addEventListener('click', () => {
    if (!ctx) init();
    playing = !playing;
    if (playing) {
      ctx.resume(); next = ctx.currentTime + .06; timer = setInterval(sched, 25);
      bars.forEach(b => { b.style.animation = 'none'; }); eqLoop();
      btn.textContent = '❚❚ 暫停 SYNTHWAVE';
    } else {
      clearInterval(timer); cancelAnimationFrame(raf); bars.forEach(b => { b.style.animation = ''; b.style.height = ''; });
      btn.textContent = '▶ 播放 SYNTHWAVE';
    }
    btn.setAttribute('aria-pressed', String(playing));
  });
})();
