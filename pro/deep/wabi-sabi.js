/* Wabi-Sabi · 游標好似毛筆：墨水喺紙上暈開、慢慢褪去 ＋ 雙擊畫一筆禪圓（ensō） */
(() => {
  const D = window.DEEP; if (!D || !D.ok || D.reduce) return;
  D.css(`.ink{position:absolute;left:0;top:0;pointer-events:none;z-index:-1}`);
  const cv = document.createElement('canvas'); cv.className = 'ink'; cv.setAttribute('aria-hidden', 'true'); document.body.append(cv);
  const cx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 1.5);
  const fit = () => { const W = document.documentElement.scrollWidth, H = document.documentElement.scrollHeight; if (cv.width === (W * dpr | 0) && cv.height === (H * dpr | 0)) return; cv.width = W * dpr | 0; cv.height = H * dpr | 0; cv.style.width = W + 'px'; cv.style.height = H + 'px'; };
  fit(); new ResizeObserver(fit).observe(document.body);
  const blots = []; let lx = null, ly = null;
  const drop = (x, y, r, a) => blots.push({ x: x * dpr, y: y * dpr, r: r * dpr, a, life: 0, max: 36 + Math.random() * 30 });
  addEventListener('pointermove', e => {
    const x = e.pageX, y = e.pageY;
    if (lx === null) { lx = x; ly = y; return; }
    const sp = Math.hypot(x - lx, y - ly), n = Math.min(6, 1 + sp / 10 | 0);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      drop(lx + (x - lx) * t + (Math.random() - .5) * 3, ly + (y - ly) * t + (Math.random() - .5) * 3, Math.max(2, 12 - sp * .28) * (.6 + Math.random() * .7), .05 + Math.random() * .05);
    }
    lx = x; ly = y;
    if (blots.length > 700) blots.splice(0, blots.length - 700);
  }, { passive: true });
  addEventListener('dblclick', e => {
    if (e.target.closest('a,button,input,select')) return;
    const cx0 = e.pageX, cy0 = e.pageY, R = 70 + Math.random() * 30, a0 = Math.random() * 6.28, o = { t: 0 };
    gsap.to(o, { t: 1, duration: 1.3, ease: 'power2.inOut', onUpdate: () => {
      const a = a0 + o.t * Math.PI * 1.88, w = 18 * (1 - o.t * .85) + 3;
      for (let k = 0; k < 4; k++) drop(cx0 + Math.cos(a) * (R + (Math.random() - .5) * 5), cy0 + Math.sin(a) * (R + (Math.random() - .5) * 5), w * (.5 + Math.random() * .6), .14 + Math.random() * .08);
    } });
  });
  let frame = 0;
  const loop = () => {
    if (!document.hidden) {
      if (++frame % 3 === 0) { cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = 'rgba(0,0,0,.018)'; cx.fillRect(0, 0, cv.width, cv.height); }
      cx.globalCompositeOperation = 'source-over';
      for (let i = blots.length - 1; i >= 0; i--) {
        const b = blots[i]; b.life++;
        const k = b.life / b.max, r = b.r * (1 + k * 1.6), a = b.a * (1 - k) * .5;
        const g = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        g.addColorStop(0, `rgba(40,38,34,${a})`); g.addColorStop(.6, `rgba(59,58,54,${a * .5})`); g.addColorStop(1, 'rgba(59,58,54,0)');
        cx.fillStyle = g; cx.beginPath(); cx.arc(b.x, b.y, r, 0, 6.283); cx.fill();
        if (b.life >= b.max) blots.splice(i, 1);
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  D.hint('🖌 郁滑鼠好似毛筆寫字 —— 雙擊畫一個禪圓（ensō）', D.$('.hero .actions'));
})();
