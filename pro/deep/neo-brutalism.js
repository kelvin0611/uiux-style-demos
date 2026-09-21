/* Neo-Brutalism · 物理貼紙池（Matter.js）：碌到先跌落嚟、互相碰撞、可以抓起嚟掟 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const after = D.afterBlock(1); if (!after) return;
  const s = D.section('Sticker Pit · 貼紙池', after);
  D.css(`.pit{position:relative;height:440px;border:3px solid #000;background:radial-gradient(#000 1.2px,transparent 1.5px) 0 0/22px 22px,#FFFDF5;box-shadow:8px 8px 0 #000;overflow:hidden;touch-action:pan-y}
.stk{display:inline-grid;place-items:center;padding:12px 20px;border:3px solid #000;box-shadow:4px 4px 0 #000;font:400 22px 'Archivo Black',sans-serif;color:#000;user-select:none;cursor:grab;white-space:nowrap}
.stk:active{cursor:grabbing}
.stk[data-shape="circle"]{width:96px;height:96px;padding:0;border-radius:50%;font-size:18px}
.stk.r{border-radius:999px}`);
  const bar = document.createElement('div'); bar.className = 'deep-bar';
  bar.innerHTML = '<button class="btn btn-primary" type="button">↻ 再倒一次</button><span class="deep-hint" style="margin:0">抓住貼紙掟佢！</span>';
  const pit = document.createElement('div'); pit.className = 'pit';
  const defs = [['NEW!', '#FFE600', 'circle'], ['冇廢話', '#FF6B6B'], ['BOLD', '#4ECDC4', '', 'r'], ['★', '#A388EE', 'circle'], ['HOT', '#FF6B6B', 'circle'],
    ['大膽', '#FFE600'], ['YES!', '#fff', '', 'r'], ['直接', '#4ECDC4'], ['LOUD', '#A388EE', '', 'r'], ['✦', '#FFE600', 'circle'], ['BRUTAL.', '#fff'], ['99%', '#4ECDC4', 'circle']];
  const els = defs.map(([t, bgc, shape, cls]) => { const e = document.createElement('span'); e.className = 'stk ' + (cls || ''); e.textContent = t; e.style.background = bgc; if (shape) e.dataset.shape = shape; pit.append(e); return e; });
  s.append(bar, pit);
  const ph = D.physics(pit, els);
  if (!ph) { els.forEach((e, i) => { Object.assign(e.style, { position: 'absolute', left: (i % 6) * 16 + 2 + '%', top: (i / 6 | 0) * 110 + 250 + 'px' }); }); return; }
  bar.querySelector('button').addEventListener('click', ph.drop);
})();
