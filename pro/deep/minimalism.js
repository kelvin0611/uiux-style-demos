/* Minimalism · 「View →」游標標籤 ＋ 格仔／列表切換（GSAP Flip 流暢變形） */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  D.cursorLabel('.cards .card, .grid .card', 'View →', '#111', '#fff');
  const cards = D.$('.cards, .grid'), title = D.$$('.sec-title')[1]; if (!cards || !title || !window.Flip) return;
  D.css(`.cards.is-list{grid-template-columns:1fr!important;gap:12px}
.cards.is-list .card{display:grid;grid-template-columns:96px 1fr auto;column-gap:22px;align-items:center;padding:16px 20px}
.cards.is-list .card-media{aspect-ratio:1;margin:0;grid-row:span 2}
.cards.is-list .card h3{margin:0}.cards.is-list .card p{margin:0;grid-column:2}
.cards.is-list .card a{grid-column:3;grid-row:1/3}`);
  const bar = document.createElement('div'); bar.className = 'deep-bar';
  bar.innerHTML = '<button class="deep-btn" type="button" aria-pressed="true" data-v="grid"><span>▦ 格仔</span></button><button class="deep-btn" type="button" aria-pressed="false" data-v="list"><span>☰ 列表</span></button>';
  title.insertAdjacentElement('afterend', bar);
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.getAttribute('aria-pressed') === 'true') return;
    const state = Flip.getState('.cards .card, .cards .card-media, .cards .card h3, .cards .card p');
    cards.classList.toggle('is-list', b.dataset.v === 'list');
    bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    Flip.from(state, { duration: D.reduce ? 0 : .8, ease: 'expo.inOut', stagger: .04, nested: true, absolute: false });
  });
})();
