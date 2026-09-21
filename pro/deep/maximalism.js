/* Maximalism · 彩紙炮（canvas 物理粒子）＋ 不停變形嘅 SVG 貼紙（MorphSVG） */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const hero = D.$('.hero'); if (!hero) return;
  /* --- 變形貼紙 --- */
  const SH = {
    blob: 'M100 25 C150 20 185 60 178 105 C172 150 140 182 95 178 C50 174 18 142 22 97 C26 52 55 30 100 25 Z',
    star: 'M100 10 L124 72 L190 74 L138 114 L156 180 L100 142 L44 180 L62 114 L10 74 L76 72 Z',
    flower: 'M100 20 C130 20 140 60 170 70 C195 80 185 125 160 135 C150 165 120 190 100 175 C80 190 50 165 40 135 C15 125 5 80 30 70 C60 60 70 20 100 20 Z',
    heart: 'M100 175 C60 140 20 115 20 75 C20 45 45 25 70 25 C85 25 95 35 100 45 C105 35 115 25 130 25 C155 25 180 45 180 75 C180 115 140 140 100 175 Z'
  };
  D.css(`.deco.morph{left:3%;bottom:6%;width:clamp(90px,13vw,170px);filter:drop-shadow(6px 6px 0 #111)}
@media(max-width:760px){.deco.morph{display:none}}
.confetti{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:94}`);
  hero.insertAdjacentHTML('afterbegin', `<svg class="deco morph" viewBox="0 0 200 200" aria-hidden="true"><path fill="#FFD60A" stroke="#111" stroke-width="6" d="${SH.blob}"/></svg>`);
  const path = D.$('.deco.morph path');
  if (window.MorphSVGPlugin && !D.reduce) {
    const seq = [['star', '#FF8FAB'], ['flower', '#2A9D8F'], ['heart', '#E63946'], ['blob', '#FFD60A']];
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .4 });
    seq.forEach(([k, c]) => tl.to(path, { morphSVG: SH[k], fill: c, duration: 1.1, ease: 'elastic.out(1,.55)' }).to({}, { duration: .9 }));
    gsap.to('.deco.morph', { rotation: 360, duration: 24, repeat: -1, ease: 'none' });
  }
  /* --- 彩紙炮 --- */
  const cv = document.createElement('canvas'); cv.className = 'confetti'; cv.setAttribute('aria-hidden', 'true'); document.body.append(cv);
  const cx = cv.getContext('2d'); const COLS = ['#FFD60A', '#E63946', '#2A9D8F', '#F4A261', '#FF8FAB', '#6A4C93', '#fff'];
  let parts = [], running = false;
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; }; size(); addEventListener('resize', size);
  const burst = (x, y, n = 140) => {
    if (D.reduce) return;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * 1.8, sp = 6 + Math.random() * 12;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: COLS[Math.random() * COLS.length | 0], circle: Math.random() < .3 });
    }
    if (!running) { running = true; requestAnimationFrame(loop); }
  };
  const loop = () => {
    cx.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      p.vy += .38; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
      if (p.circle) { cx.beginPath(); cx.arc(0, 0, p.w / 2, 0, 6.283); cx.fill(); } else { cx.scale(1, Math.cos(p.r * 2)); cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      cx.restore();
    }
    parts = parts.filter(p => p.y < cv.height + 40);
    if (parts.length) requestAnimationFrame(loop); else { running = false; cx.clearRect(0, 0, cv.width, cv.height); }
  };
  const actions = D.$('.hero .actions');
  if (actions) {
    const big = document.createElement('button'); big.type = 'button'; big.className = 'btn btn-primary'; big.textContent = '🎉 開 Party！';
    big.style.background = '#FF8FAB'; actions.append(big);
    D.hint('撳任何按鈕都會開彩紙炮 🎊', actions);
  }
  D.$$('.btn:not(:disabled)').forEach(b => b.addEventListener('click', e => burst(e.clientX, e.clientY, b.textContent.includes('Party') ? 260 : 120)));
})();
