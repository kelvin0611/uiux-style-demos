/* Pixel Art · 可以玩嘅小遊戲：← → 行、空白鍵跳、食金幣 ＋ 8-bit 音效 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const hero = D.$('.hero'), hero_sprite = D.$('.deco.hero-sprite'); if (!hero || !hero_sprite) return;
  D.css(`.coin{position:absolute;bottom:64px;width:20px;height:20px;background:#FFEC27;box-shadow:inset -4px -4px 0 #FFA300,0 -4px 0 #000,0 4px 0 #000,-4px 0 0 #000,4px 0 0 #000;z-index:1;animation:coin .6s steps(2) infinite}
@keyframes coin{50%{transform:scaleX(.4)}}`);
  const A = D.audio;
  const sp = hero_sprite;
  sp.style.animation = 'none'; sp.style.right = 'auto';
  let x = hero.clientWidth * .7, vy = 0, y = 0, jumping = false; const keys = {};
  const setX = () => { sp.style.left = x + 'px'; };
  setX();
  const coins = [];
  const addCoin = () => { const c = document.createElement('i'); c.className = 'deco coin'; c.style.left = (40 + Math.random() * (hero.clientWidth - 80)) + 'px'; hero.append(c); coins.push(c); };
  for (let i = 0; i < 4; i++) addCoin();
  const hud = () => D.$('.px-hud');
  const addScore = n => { const h = hud(); if (!h) return; const v = (parseInt(h.textContent.replace(/\D/g, ''), 10) || 0) + n; h.textContent = 'SCORE ' + String(v).padStart(6, '0'); gsap.fromTo(h, { scale: 1.4 }, { scale: 1, duration: .4, ease: 'steps(3)' }); };
  const heroVisible = () => hero.getBoundingClientRect().bottom > 120;
  addEventListener('keydown', e => {
    if (e.target.closest('input,select,textarea') || !heroVisible()) return;
    if (['ArrowLeft', 'ArrowRight', ' ', 'ArrowUp'].includes(e.key)) e.preventDefault();
    keys[e.key] = true;
    if ((e.key === ' ' || e.key === 'ArrowUp') && !jumping) { jumping = true; vy = 11; A.tone(330, .18, 'square', .05, 0, 880); }
  });
  addEventListener('keyup', e => { keys[e.key] = false; });
  gsap.ticker.add(() => {
    if (keys.ArrowLeft) x -= 5; if (keys.ArrowRight) x += 5;
    x = Math.max(0, Math.min(hero.clientWidth - 48, x));
    if (jumping) { y += vy; vy -= .6; if (y <= 0) { y = 0; jumping = false; } }
    sp.style.left = Math.round(x / 4) * 4 + 'px';
    sp.style.transform = `translateY(${-Math.round(y / 4) * 4}px)` + (keys.ArrowLeft ? ' scaleX(-1)' : '');
    const r = sp.getBoundingClientRect();
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i], cr = c.getBoundingClientRect();
      if (r.left < cr.right && r.right > cr.left && r.top < cr.bottom && r.bottom > cr.top) {
        coins.splice(i, 1); A.tone(988, .08, 'square', .05); A.tone(1319, .25, 'square', .05, .08);
        D.$('.hero') && window.PROX && PROX.spawn && PROX.spawn(cr.left + 10, cr.top, '+500', { cls: 'xp-pop', y: -60, ease: 'steps(6)', dur: .8, scale: 1 });
        c.remove(); addScore(500); setTimeout(addCoin, 1200);
      }
    }
  });
  D.$$('.btn').forEach(b => { b.addEventListener('pointerenter', () => A.tone(660, .05, 'square', .03)); b.addEventListener('click', () => A.tone(523, .08, 'square', .05)); });
  A.toggle('8-bit 音效');
  D.hint('🎮 ← → 行、空白鍵跳，食晒啲金幣！', D.$('.hero .actions'));
})();
