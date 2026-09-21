/* Bento Grid · 分類篩選 ＋ 撳格仔放大（GSAP Flip：卡片流暢重新排位） */
(() => {
  const D = window.DEEP; if (!D || !D.ok || !window.Flip) return;
  const grid = D.$('.cards, .grid'), title = D.$$('.sec-title')[1]; if (!grid || !title) return;
  const tiles = D.$$('.card', grid), cats = ['idea', 'num', 'idea', 'num', 'idea'];
  tiles.forEach((t, i) => { t.dataset.cat = cats[i] || 'idea'; t.style.cursor = 'pointer'; t.tabIndex = 0; t.setAttribute('role', 'button'); t.setAttribute('aria-expanded', 'false'); });
  D.css(`.cards .card.is-open{grid-column:1/-1!important;grid-row:span 2!important;z-index:3}
.cards .card.is-open .card-media{font-size:120px}
.deep-bar .deep-btn{color:#1d1d1f}`);
  const bar = document.createElement('div'); bar.className = 'deep-bar';
  bar.innerHTML = [['all', '全部'], ['idea', '概念'], ['num', '數字']].map(([k, t], i) => `<button class="deep-btn" type="button" data-f="${k}" aria-pressed="${i === 0}"><span>${t}</span></button>`).join('')
    + '<span class="deep-hint" style="margin:0">撳任何一格放大，再撳收返</span>';
  title.insertAdjacentElement('afterend', bar);
  const flip = (mutate, extra = {}) => {
    const st = Flip.getState(tiles);
    mutate();
    Flip.from(st, Object.assign({ duration: D.reduce ? 0 : .75, ease: 'expo.inOut', stagger: .03, nested: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.6)' }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .85, duration: .4 }) }, extra));
  };
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    flip(() => tiles.forEach(t => { t.style.display = b.dataset.f === 'all' || t.dataset.cat === b.dataset.f ? '' : 'none'; }), { absolute: true });
  });
  const toggle = t => flip(() => { const open = !t.classList.contains('is-open'); tiles.forEach(x => { x.classList.remove('is-open'); x.setAttribute('aria-expanded', 'false'); }); if (open) { t.classList.add('is-open'); t.setAttribute('aria-expanded', 'true'); } });
  tiles.forEach(t => {
    t.addEventListener('click', () => toggle(t));
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(t); } });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { const o = D.$('.card.is-open', grid); if (o) toggle(o); } });
})();
