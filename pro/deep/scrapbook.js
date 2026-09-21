/* Scrapbook · 相片可以用力掟出去：Draggable + Inertia，拖拉速度決定旋轉角度 ＋ 亂灑／整理返 */
(() => {
  const D = window.DEEP; if (!D || !D.ok || !window.Draggable) return;
  const cards = D.$$('.cards .card, .grid .card'); if (!cards.length) return;
  const drags = cards.map(card => Draggable.create(card, {
    type: 'x,y', inertia: true, bounds: '.wrap', edgeResistance: .7, zIndexBoost: true,
    onPress() { gsap.to(card, { scale: 1.06, duration: .2 }); },
    onDrag() { gsap.to(card, { rotation: gsap.utils.clamp(-28, 28, this.deltaX * 2.4), duration: .35, overwrite: 'auto' }); },
    onRelease() { gsap.to(card, { scale: 1, duration: .4 }); if (!this.tween) settle(card); },
    onThrowComplete() { settle(card); }
  })[0]);
  function settle(card) { gsap.to(card, { rotation: gsap.utils.random(-8, 8), duration: 1, ease: 'elastic.out(1,.4)' }); }
  const anchor = D.$('.drag-hint') || D.$$('.sec-title')[1];
  const bar = document.createElement('div'); bar.className = 'deep-bar';
  bar.innerHTML = '<button class="btn btn-secondary" type="button" data-a="mess">🎲 亂灑</button><button class="btn" type="button" data-a="tidy">📐 整理返</button>';
  anchor.insertAdjacentElement('afterend', bar);
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const mess = b.dataset.a === 'mess';
    cards.forEach((c, i) => gsap.to(c, {
      x: mess ? gsap.utils.random(-220, 220) : 0, y: mess ? gsap.utils.random(-60, 180) : 0, rotation: mess ? gsap.utils.random(-25, 25) : 0,
      duration: D.reduce ? 0 : 1.1, delay: i * .06, ease: mess ? 'back.out(1.4)' : 'expo.inOut', onComplete: () => drags[i].update()
    }));
  });
})();
