/* Cybercore · 有慣性嘅 Win98 視窗（Draggable + Inertia）＋ 靜止 15 秒出現星空屏保 ＋ 開機音效 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const A = D.audio;
  if (window.Draggable) D.$$('.cards .card, .grid .card').forEach(card => {
    const h = card.querySelector('h3'); if (!h) return;
    h.style.cursor = 'grab'; h.style.touchAction = 'none';
    Draggable.create(card, { type: 'x,y', trigger: h, inertia: true, bounds: 'main', edgeResistance: .65, zIndexBoost: true,
      onPress() { A.tone(1200, .02, 'square', .03); h.style.cursor = 'grabbing'; }, onRelease() { h.style.cursor = 'grab'; } });
  });
  A.onchange = on => { if (on) [523, 659, 784, 1047].forEach((f, i) => A.tone(f, .6, 'sine', .06, i * .13)); };
  A.toggle('Win98 音效');
  D.$$('.btn').forEach(b => b.addEventListener('click', () => A.tone(1500, .03, 'square', .03)));
  if (D.reduce) return;

  D.css(`.ss{position:fixed;inset:0;z-index:120;background:#000;display:none;cursor:none}
.ss canvas{width:100%;height:100%;display:block}
.ss p{position:absolute;bottom:18px;left:0;right:0;text-align:center;color:#777;font:12px Tahoma,sans-serif;margin:0}`);
  const cards = D.$('.cards, .grid');
  if (cards) D.hint('💤 唔好郁 15 秒 —— 會出 Win98 星空屏保', cards);
  const ov = document.createElement('div'); ov.className = 'ss'; ov.innerHTML = '<canvas></canvas><p>Starfield Simulation · 郁一郁滑鼠返回</p>'; document.body.append(ov);
  const cv = ov.querySelector('canvas'), cx = cv.getContext('2d');
  let active = false, shownAt = 0, raf, timer;
  const stars = Array.from({ length: 420 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), pz: 0 }));
  const draw = () => {
    const W = cv.width = innerWidth, H = cv.height = innerHeight, hx = W / 2, hy = H / 2;
    cx.fillStyle = 'rgba(0,0,0,.35)'; cx.fillRect(0, 0, W, H);
    cx.strokeStyle = '#fff';
    for (const s of stars) {
      s.pz = s.z; s.z -= .012;
      if (s.z <= .02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; s.pz = 1; }
      const sx = hx + s.x / s.z * hx * .6, sy = hy + s.y / s.z * hy * .6, px = hx + s.x / s.pz * hx * .6, py = hy + s.y / s.pz * hy * .6;
      cx.lineWidth = (1 - s.z) * 2.2; cx.globalAlpha = 1 - s.z;
      cx.beginPath(); cx.moveTo(px, py); cx.lineTo(sx, sy); cx.stroke();
    }
    cx.globalAlpha = 1; raf = requestAnimationFrame(draw);
  };
  const show = () => { active = true; shownAt = performance.now(); ov.style.display = 'block'; draw(); A.tone(220, .4, 'sine', .04); };
  const hide = () => { active = false; ov.style.display = 'none'; cancelAnimationFrame(raf); };
  const reset = () => {
    if (active) { if (performance.now() - shownAt < 400) return; hide(); }
    clearTimeout(timer); timer = setTimeout(show, 15000);
  };
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'].forEach(ev => addEventListener(ev, reset, { passive: true }));
  reset();
})();
