/* Cyberpunk · 粒子文字：幾千粒霓虹粒子砌出「NIGHT//CITY」，游標／手指會吹散佢哋，放開就重組 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const hero = D.$('.hero'); if (!hero) return;
  const s = D.section('Neural Link · 粒子矩陣', hero);
  D.css(`.pt-box{position:relative;height:clamp(260px,34vw,400px);border:1px solid #2A2A3A;border-left:3px solid #FCEE0A;background:linear-gradient(rgba(0,240,255,.05) 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,rgba(0,240,255,.05) 1px,transparent 1px) 0 0/32px 32px,#07070c;clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));touch-action:pan-y}
.pt-box canvas{position:absolute;inset:0;width:100%;height:100%}`);
  const box = document.createElement('div'); box.className = 'pt-box'; const cv = document.createElement('canvas'); box.append(cv); s.append(box);
  D.hint('▸ 游標（或手指）掃過啲粒子 —— 會散開再重組', box);
  const cx = cv.getContext('2d'); const dpr = Math.min(devicePixelRatio || 1, 1.5);
  let P = [], W = 0, H = 0, vis = false, mx = -9999, my = -9999;
  const COLS = ['#00F0FF', '#00F0FF', '#FCEE0A', '#FF003C', '#E0E0E0'];
  const build = async () => {
    try { await document.fonts.load('900 100px Orbitron'); } catch (e) {}
    W = cv.width = box.clientWidth * dpr; H = cv.height = box.clientHeight * dpr;
    const o = document.createElement('canvas'); o.width = W; o.height = H; const oc = o.getContext('2d');
    const fs = Math.min(W / 7.2, H * .42);
    oc.fillStyle = '#fff'; oc.textAlign = 'center'; oc.textBaseline = 'middle'; oc.font = `900 ${fs}px Orbitron, sans-serif`;
    oc.fillText('NIGHT//CITY', W / 2, H / 2);
    const img = oc.getImageData(0, 0, W, H).data, gap = Math.max(3, Math.round(W / 320)) * 1;
    const old = P; P = [];
    for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) if (img[(y * W + x) * 4 + 3] > 128) {
      const q = old[P.length] || { x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0 };
      P.push({ x: q.x, y: q.y, vx: q.vx, vy: q.vy, hx: x, hy: y, c: COLS[Math.random() * COLS.length | 0], s: gap * .55 });
    }
  };
  box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); mx = (e.clientX - r.left) * dpr; my = (e.clientY - r.top) * dpr; });
  box.addEventListener('pointerleave', () => { mx = my = -9999; });
  D.whenVisible(box, v => { vis = v; });
  const R = 90 * dpr;
  const loop = () => {
    if (vis && !document.hidden) {
      cx.globalCompositeOperation = 'source-over'; cx.fillStyle = 'rgba(7,7,12,.34)'; cx.fillRect(0, 0, W, H);
      cx.globalCompositeOperation = 'lighter';
      for (const p of P) {
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 6; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.vx += (p.hx - p.x) * .045; p.vy += (p.hy - p.y) * .045; p.vx *= .84; p.vy *= .84;
        p.x += p.vx; p.y += p.vy;
        cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s);
      }
    }
    requestAnimationFrame(loop);
  };
  build().then(() => { if (D.reduce) { P.forEach(p => { p.x = p.hx; p.y = p.hy; }); } loop(); });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
})();
