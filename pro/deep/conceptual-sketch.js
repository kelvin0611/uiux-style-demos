/* Conceptual Sketch · 畫畫模式：直接喺成頁上面用鉛筆畫（速度決定粗幼、雙重筆觸似石墨） */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  D.css(`.doodle{position:absolute;left:0;top:0;z-index:60;pointer-events:none}
.doodle.on{pointer-events:auto;cursor:crosshair;touch-action:none}
.dd-bar{position:fixed;right:16px;bottom:16px;z-index:99;display:flex;gap:6px;align-items:center;padding:8px 10px;background:#fff;border:2px solid #333;border-radius:255px 15px 225px 15px/15px 225px 15px 255px;font:18px "Patrick Hand",cursive;box-shadow:3px 4px 0 #333}
.dd-bar button{font:inherit;border:2px solid #333;background:#fff;border-radius:15px 225px 15px 255px/255px 15px 225px 15px;padding:4px 12px;cursor:pointer;color:#333}
.dd-bar button[aria-pressed="true"]{background:#FFF36B}
.dd-bar .sw{width:26px;height:26px;padding:0;border-radius:50%}`);
  const cv = document.createElement('canvas'); cv.className = 'doodle'; cv.setAttribute('aria-hidden', 'true'); document.body.append(cv);
  const cx = cv.getContext('2d'); const dpr = Math.min(devicePixelRatio || 1, 2);
  const fit = () => {
    const W = document.documentElement.scrollWidth, H = document.documentElement.scrollHeight;
    if (cv.width === W * dpr && cv.height === H * dpr) return;
    const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height; if (cv.width) tmp.getContext('2d').drawImage(cv, 0, 0);
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    cx.drawImage(tmp, 0, 0); cx.lineCap = cx.lineJoin = 'round';
  };
  fit(); new ResizeObserver(fit).observe(document.body);
  let color = '#333', drawing = false, pts = [], lastT = 0;
  const bar = document.createElement('div'); bar.className = 'dd-bar';
  bar.innerHTML = '<button type="button" data-a="toggle" aria-pressed="false">✎ 畫畫模式</button>'
    + '<button type="button" class="sw" data-c="#333" style="background:#333" aria-label="黑色鉛筆"></button>'
    + '<button type="button" class="sw" data-c="#D64545" style="background:#D64545" aria-label="紅色筆"></button>'
    + '<button type="button" class="sw" data-c="#1F4E9C" style="background:#1F4E9C" aria-label="藍色筆"></button>'
    + '<button type="button" data-a="clear">🧽 清除</button>';
  document.body.append(bar);
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'toggle') { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); cv.classList.toggle('on', on); fit(); }
    if (b.dataset.a === 'clear') cx.clearRect(0, 0, cv.width, cv.height);
    if (b.dataset.c) { color = b.dataset.c; const t = bar.querySelector('[data-a="toggle"]'); if (t.getAttribute('aria-pressed') !== 'true') t.click(); }
  });
  const P = e => [e.pageX * dpr, e.pageY * dpr, performance.now()];
  cv.addEventListener('pointerdown', e => { drawing = true; cv.setPointerCapture(e.pointerId); pts = [P(e)]; });
  cv.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = P(e), q = pts[pts.length - 1]; pts.push(p);
    const sp = Math.hypot(p[0] - q[0], p[1] - q[1]) / Math.max(1, p[2] - q[2]);
    const w = Math.max(1.2, 4.2 - sp * 1.6) * dpr;
    for (const [a, j] of [[.75, 0], [.3, 1.2]]) {
      cx.globalAlpha = a; cx.strokeStyle = color; cx.lineWidth = w * (j ? .6 : 1);
      cx.beginPath(); cx.moveTo(q[0] + (Math.random() - .5) * j * dpr, q[1] + (Math.random() - .5) * j * dpr); cx.lineTo(p[0] + (Math.random() - .5) * j * dpr, p[1] + (Math.random() - .5) * j * dpr); cx.stroke();
    }
    cx.globalAlpha = 1;
  });
  ['pointerup', 'pointercancel'].forEach(ev => cv.addEventListener(ev, () => { drawing = false; }));
  D.hint('✎ 右下角開「畫畫模式」，可以直接喺頁面上面畫', D.$('.hero .actions'));
})();
