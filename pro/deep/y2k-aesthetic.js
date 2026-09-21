/* Y2K · 全息閃卡（跟角度反射彩虹 + 閃光）＋ 鉻金屬字反光跟住滑鼠移動 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  D.css(`.holo{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;opacity:.22;transition:opacity .5s;mix-blend-mode:color-dodge;
  background:repeating-linear-gradient(115deg,#ff9ecf 0%,#9fd8ff 7%,#c6ffdd 14%,#fff5a8 21%,#e0b3ff 28%,#ff9ecf 35%),radial-gradient(rgba(255,255,255,.9) 1px,transparent 1.5px) 0 0/14px 14px;
  background-size:400% 400%,14px 14px;background-position:var(--mx,50%) var(--my,50%),0 0;filter:saturate(1.5)}
.holo::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.95),transparent 38%);mix-blend-mode:overlay}
.card:hover .holo{opacity:.55}
.cards .card>*:not(.holo):not(.pro-spot){position:relative;z-index:3}
.hero h1 .ch{background-size:100% 220%!important;background-position:0 var(--gy,30%)!important}`);
  D.$$('.cards .card, .grid .card').forEach(c => {
    if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
    const h = document.createElement('i'); h.className = 'holo'; c.append(h);
    if (!D.fine) gsap.to(c, { '--mx': '100%', '--my': '0%', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });
  const h1 = D.$('.hero h1');
  if (h1 && D.fine) { const q = gsap.quickTo(h1, '--gy', { duration: .8, ease: 'power3' }); gsap.set(h1, { '--gy': '30%' }); addEventListener('pointermove', e => q(e.clientY / innerHeight * 100 + '%')); }
  D.hint('✦ 將滑鼠放喺卡上面郁 —— 睇下全息反光', D.$$('.sec-title')[1]);
})();
