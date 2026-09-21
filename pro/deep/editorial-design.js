/* Editorial Design · 橫向 scroll 專題：章節釘住，碌落去內容打橫行，相片有內部視差 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const after = D.afterBlock(1); if (!after) return;
  D.css(`.hs{position:relative;left:50%;width:100vw;margin-left:-50vw;background:#1A1A1A;color:#FAF7F2;overflow:hidden}
.hs-pin{width:100vw;height:100vh;background:#1A1A1A;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:28px;padding-block:60px}
.hs-head{display:flex;justify-content:space-between;align-items:baseline;padding-inline:clamp(16px,5vw,64px);font:600 12px Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#b9b2a6}
.hs-head b{font:italic 400 clamp(26px,3vw,40px) 'Playfair Display',serif;letter-spacing:0;text-transform:none;color:#FAF7F2}
.hs-track{display:flex;gap:4vw;padding-inline:clamp(16px,5vw,64px);width:max-content}
.hs-panel{width:min(72vw,860px);display:grid;grid-template-columns:1.1fr 1fr;gap:32px;align-items:end}
.hs-frame{aspect-ratio:4/5;overflow:hidden;position:relative}
.hs-photo{position:absolute;inset:0 -14%;filter:grayscale(1) contrast(1.1)}
.hs-no{font:900 clamp(64px,9vw,140px)/.85 'Playfair Display',serif;color:#C8102E}
.hs-panel h3{font:700 clamp(26px,3vw,42px)/1.1 'Playfair Display',serif;margin:.3em 0}
.hs-panel p{font:18px/1.7 'Source Serif 4',Georgia,serif;color:#d9d4cc;margin:0}
.hs-prog{height:2px;margin-inline:clamp(16px,5vw,64px);background:rgba(250,247,242,.15)}
.hs-prog i{display:block;height:100%;background:#C8102E;transform-origin:left;transform:scaleX(0)}
@media(max-width:700px){.hs-panel{width:84vw;grid-template-columns:1fr}.hs-frame{aspect-ratio:16/10}}`);
  const ch = [['課堂', '由「背書」到「動手做」', '學生唔再抄筆記，而係用 AI 工具砌出自己嘅作品。', '135deg,#2b2b2b,#8a8580'],
    ['教師', '老師變成教練', '備課時間減半，將精力放返喺每個學生身上。', '160deg,#6e6a64,#d9d4cc'],
    ['家長', '睇得見嘅進步', '每星期一份學習報告，唔再靠估。', '20deg,#1a1a1a,#b9b2a6'],
    ['學校', '由試點到全校', '三個月內，由一班擴展到全級。', '200deg,#3d3a35,#e6dfd3'],
    ['未來', '2030 年嘅課室', '人人都識同 AI 合作，而唔係被 AI 取代。', '90deg,#0e0e0e,#8a8580']];
  const sec = document.createElement('section'); sec.className = 'hs';
  sec.innerHTML = `<div class="hs-pin"><div class="hs-head"><b>橫向專題：STEM 教育嘅五個章節</b><span class="hs-count">Chapter 01 / 05</span></div>
<div class="hs-track">${ch.map(([k, h, p, g], i) => `<article class="hs-panel"><div class="hs-frame"><div class="hs-photo" style="background:linear-gradient(${g})"></div></div><div><div class="hs-no">0${i + 1}</div><small style="letter-spacing:.16em;text-transform:uppercase;font:600 12px Inter,sans-serif;color:#b9b2a6">${k}</small><h3>${h}</h3><p>${p}</p></div></article>`).join('')}</div>
<div class="hs-prog"><i></i></div></div>`;
  after.insertAdjacentElement('afterend', sec);
  const track = D.$('.hs-track', sec), prog = D.$('.hs-prog i', sec), count = D.$('.hs-count', sec);
  if (D.reduce || !window.ScrollTrigger) { sec.querySelector('.hs-pin').style.height = 'auto'; sec.style.overflowX = 'auto'; return; }
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: sec.querySelector('.hs-pin'), scrub: 1, invalidateOnRefresh: true,
    onUpdate: s => { prog.style.transform = `scaleX(${s.progress})`; count.textContent = `Chapter 0${Math.min(5, 1 + Math.floor(s.progress * 5))} / 05`; } } });
  D.$$('.hs-panel', sec).forEach(p => {
    gsap.fromTo(p.querySelector('.hs-photo'), { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    gsap.from(p.querySelector('.hs-no'), { yPercent: 60, opacity: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 90%', end: 'left 45%', scrub: true } });
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
})();
