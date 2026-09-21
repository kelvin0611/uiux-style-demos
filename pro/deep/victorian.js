/* Victorian · 跟 scroll 變形嘅金色花紋（MorphSVG）＋ 提交表單蓋火漆印 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const after = D.afterBlock(1);
  const SH = {
    diamond: 'M100 20 L180 100 L100 180 L20 100 Z',
    quatre: 'M100 30 C130 30 140 60 140 60 C140 60 170 70 170 100 C170 130 140 140 140 140 C140 140 130 170 100 170 C70 170 60 140 60 140 C60 140 30 130 30 100 C30 70 60 60 60 60 C60 60 70 30 100 30 Z',
    fleur: 'M100 20 C115 50 140 60 150 90 C160 120 130 140 115 130 C120 150 110 170 100 185 C90 170 80 150 85 130 C70 140 40 120 50 90 C60 60 85 50 100 20 Z',
    star: 'M100 15 L118 78 L185 80 L130 118 L150 182 L100 142 L50 182 L70 118 L15 80 L82 78 Z'
  };
  D.css(`.orn-sec{text-align:center}
.orn-svg{width:clamp(140px,22vw,230px);display:block;margin:10px auto}
.orn-svg path{fill:#C9A227;stroke:#6D1A36;stroke-width:3;filter:drop-shadow(0 4px 0 rgba(42,30,23,.25))}
.orn-cap{font:italic 20px 'IM Fell English',serif;color:#1F3B2D}
.seal{position:absolute;right:22px;top:-34px;width:92px;height:92px;border-radius:50%;display:grid;place-items:center;font:28px 'EB Garamond',serif;color:#f3d6a0;z-index:5;
  background:radial-gradient(circle at 35% 30%,#c0392b,#8e1b1b 55%,#5e0f0f);box-shadow:0 0 0 5px #8e1b1b,0 0 0 7px rgba(94,15,15,.6),4px 8px 14px rgba(0,0,0,.35);text-shadow:0 1px 0 #5e0f0f}
.sealed{font:italic 17px 'IM Fell English',serif;color:#6D1A36;margin:0}`);
  if (after && window.MorphSVGPlugin) {
    const s = D.section('Ornament · 花紋變奏', after, 'orn-sec');
    s.insertAdjacentHTML('beforeend', `<svg class="orn-svg" viewBox="0 0 200 200" aria-hidden="true"><path d="${SH.diamond}"/></svg><p class="orn-cap">❦ 碌落去，花紋會慢慢變形 ❦</p>`);
    const p = D.$('.orn-svg path', s);
    if (!D.reduce && window.ScrollTrigger) {
      gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 85%', end: 'bottom 15%', scrub: 1 } })
        .to(p, { morphSVG: SH.quatre, ease: 'none' }).to(p, { morphSVG: SH.fleur, ease: 'none' }).to(p, { morphSVG: SH.star, ease: 'none' })
        .to('.orn-svg', { rotation: 180, ease: 'none', duration: 3 }, 0);
    }
  }
  const form = D.$('.form');
  if (form) {
    if (getComputedStyle(form).position === 'static') form.style.position = 'relative';
    form.addEventListener('submit', () => {
      D.$$('.seal, .sealed', form).forEach(n => n.remove());
      const seal = document.createElement('div'); seal.className = 'seal'; seal.textContent = '✠'; form.append(seal);
      const note = document.createElement('p'); note.className = 'sealed'; note.textContent = '✉ 已蓋火漆印 · Sealed with care'; form.append(note);
      if (D.reduce) return;
      gsap.timeline()
        .from(seal, { scale: 3, opacity: 0, rotation: -40, duration: .38, ease: 'power4.in' })
        .to(seal, { scaleX: 1.12, scaleY: .88, duration: .08 })
        .to(seal, { scaleX: 1, scaleY: 1, duration: .6, ease: 'elastic.out(1,.35)' })
        .fromTo(form, { y: 4 }, { y: 0, duration: .4, ease: 'elastic.out(1,.3)', clearProps: 'transform' }, .38)
        .from(note, { opacity: 0, y: 8, duration: .6 }, .5);
    });
    D.hint('✉ 撳「提交」會蓋火漆印', form, 'beforebegin');
  }
})();
