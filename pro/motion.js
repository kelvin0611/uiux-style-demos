/* UIUX Style · Pro 動效引擎（GSAP + ScrollTrigger + SplitText + Lenis）
   每頁用 window.PRO 設定自己嘅「動效性格」。
   冇 GSAP（CDN 失敗）或者用戶開咗「減少動畫」→ 保持靜態版，內容照樣完整。 */
(() => {
  const C = Object.assign({
    ease: 'expo.out', dur: 1.2, stagger: .08,
    intro: 'rise',            // rise | lines | bounce | pop | stamp | steps | type | scramble | ink | write | fade
    reveal: 'rise',           // rise | fade | scale | pop | steps | blur | skew | rotate | clip | none
    revealEase: null,
    lerp: .09,                // Lenis 平滑度；0 = 唔用
    magnetic: .25, tilt: 0, spotlight: false, spot: 'rgba(255,255,255,.18)',
    cursor: 'none',           // glow | ink | dot | ring | trail | pixel | none
    cursorColor: 'rgba(255,255,255,.2)', cursorBlend: 'normal', glowSize: 560, glowZ: -1, ringSize: 36, inkSize: 40,
    trail: ['✦'], trailColors: ['#fff'], trailSize: 22, trailRate: 45, trailGlow: false, trailStroke: false,
    parallax: 20, decoScroll: 120, heroOut: true, velocitySkew: 0, counters: null,
    curtain: null, curtainDur: 1.1, curtainEase: 'expo.inOut', curtainDelay: .25,
    grain: 0, sticky: true, headBg: null, headBlur: false, headerHide: false, progress: null,
    drag: null, dragHandle: null, dragRotate: false, mediaReveal: false
  }, window.PRO || {});

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const curtain = $('.pro-curtain');
  const PROX = window.PROX = { C, reduce, fine, ok: false };
  if (!window.gsap || reduce) { if (curtain) curtain.remove(); return; }
  PROX.ok = true;
  const ST = window.ScrollTrigger, SPLIT = window.SplitText, R = gsap.utils.random;
  gsap.registerPlugin(...[ST, SPLIT].filter(Boolean));
  if (curtain) curtain.style.animation = 'none';

  /* ---------- translate 合成器 ----------
     磁吸、視差、拖拉全部用 CSS「translate」屬性，唔會搶走每個 style 自己 hover 用緊嘅 transform。 */
  const T = new Map();
  const reg = el => {
    if (!T.has(el)) {
      const cs = getComputedStyle(el).translate;
      const [bx = '0px', by = '0px'] = (!cs || cs === 'none') ? [] : cs.split(' ');
      T.set(el, { bx, by, x: 0, y: 0, px: 0, py: 0, sy: 0 });
    }
    return T.get(el);
  };
  gsap.ticker.add(() => T.forEach((o, el) => {
    el.style.translate = `calc(${o.bx} + ${(o.x + o.px).toFixed(2)}px) calc(${o.by} + ${(o.y + o.py + o.sy).toFixed(2)}px)`;
  }));

  /* ---------- 小工具 ---------- */
  const spawn = (x, y, html, o = {}) => {
    const p = document.createElement('span');
    p.className = 'pro-p ' + (o.cls || ''); p.innerHTML = html;
    if (o.color) p.style.color = o.color;
    if (o.size) p.style.fontSize = o.size + 'px';
    document.body.append(p);
    gsap.set(p, { x, y, xPercent: -50, yPercent: -50, rotation: o.rot || 0 });
    gsap.to(p, { x: x + (o.dx || 0), y: y + (o.y ?? -60), rotation: (o.rot || 0) + (o.spin || 0), opacity: 0,
      scale: o.scale ?? .6, duration: o.dur || 1, ease: o.ease || 'power2.out', onComplete: () => p.remove() });
  };
  const GL = '!<>-_\\/[]{}=+*^?#01ABCDEFXYZ';
  const scrambleText = (el, final, dur = .6) => {
    const o = { p: 0 };
    el._scr && el._scr.kill();
    el._scr = gsap.to(o, { p: 1, duration: dur, ease: 'none',
      onUpdate() { const n = Math.floor(o.p * final.length); el.textContent = final.slice(0, n) + [...final.slice(n)].map(c => c === ' ' ? ' ' : GL[Math.random() * GL.length | 0]).join(''); },
      onComplete() { el.textContent = final; } });
  };
  const split = (el, type, mask) => SPLIT ? SPLIT.create(el, { type, mask, charsClass: 'ch', wordsClass: 'wd', linesClass: 'ln' }) : null;
  const unmask = el => { if (!el) return; el.querySelectorAll('*').forEach(n => { const cs = getComputedStyle(n); if ((cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.clipPath !== 'none') && n.children.length) { n.style.overflow = 'visible'; n.style.clipPath = 'none'; } }); };
  Object.assign(PROX, { T, reg, spawn, scrambleText, split, unmask });

  /* ---------- Lenis 平滑滾動 ---------- */
  /* 關掉 lag smoothing：第一格 delta 好大時 GSAP 會夾硬當 33ms，時間軸會幾乎唔行（過場幕唔走）。
     有 Lenis 嗰陣一定要關，冇 Lenis 都一樣要，否則靜態風格一開頁就卡住。 */
  gsap.ticker.lagSmoothing(0);
  if (C.lerp > 0 && window.Lenis) {
    const lenis = PROX.lenis = new Lenis({ lerp: C.lerp });
    if (ST) lenis.on('scroll', ST.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
  }

  /* ---------- 噪點、閱讀進度條 ---------- */
  if (C.grain) { const g = document.createElement('div'); g.className = 'pro-grain'; g.style.opacity = C.grain; document.body.append(g); }
  if (C.progress && ST) {
    const b = document.createElement('div'); b.className = 'pro-progress'; b.style.background = C.progress; document.body.append(b);
    document.documentElement.classList.add('has-pro');   // 有 GSAP 進度條 → 純 CSS 版讓路
    gsap.to(b, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
  }

  /* ---------- Header：sticky、捲動後加底色、向下碌收埋 ---------- */
  const head = $('.site-header');
  if (head) {
    if (C.sticky) head.classList.add('pro-sticky');
    let last = 0, hidden = false, on = false;
    const onScroll = () => {
      const y = scrollY, s = y > 40;
      if (s !== on) {
        on = s; head.classList.toggle('pro-scrolled', s);
        if (C.headBg && C.sticky) {
          head.style.background = s ? C.headBg : '';
          head.style.paddingInline = s ? '20px' : '';
          head.style.webkitBackdropFilter = head.style.backdropFilter = s && C.headBlur ? 'blur(12px) saturate(160%)' : '';
        }
      }
      if (C.sticky && C.headerHide) {
        const h = y > last && y > 400;
        if (h !== hidden) { hidden = h; gsap.to(head, { yPercent: h ? -180 : 0, duration: .45, ease: 'power3.out' }); }
      }
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 載入幕 + 轉頁過場 ---------- */
  const tl = PROX.tl = gsap.timeline({ defaults: { ease: C.ease } });
  if (curtain) {
    tl.to(curtain, { yPercent: -100, duration: C.curtainDur, ease: C.curtainEase, delay: C.curtainDelay });
    addEventListener('pageshow', e => { if (e.persisted) gsap.set(curtain, { yPercent: -100 }); });
    $$('a[href$=".html"]').forEach(a => a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
      e.preventDefault();
      gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: C.curtainEase, onComplete: () => { location.href = a.href; } });
    }));
  }
  const at0 = curtain ? C.curtainDelay + C.curtainDur * .55 : 0;
  PROX.at0 = at0;

  /* ---------- 入場編排：大標題 ---------- */
  const h1 = $('.hero h1');
  const introH1 = () => {
    if (!h1) return;
    let s;
    const mark = () => h1.classList.add('is-split');
    switch (C.intro) {
      case 'rise':
        if ((s = split(h1, 'lines,chars', 'lines'))) { mark(); tl.from(s.chars, { yPercent: 115, duration: C.dur, stagger: .03 }, at0); return; } break;
      case 'lines':
        if ((s = split(h1, 'lines', 'lines'))) { mark(); tl.from(s.lines, { yPercent: 105, duration: C.dur * 1.2, stagger: .14 }, at0); return; } break;
      case 'bounce':
        if ((s = split(h1, 'chars'))) { mark(); tl.from(s.chars, { y: -160, opacity: 0, rotation: () => R(-25, 25), duration: C.dur, stagger: .04, ease: 'bounce.out' }, at0); return; } break;
      case 'pop':
        if ((s = split(h1, 'chars'))) { mark(); tl.from(s.chars, { scale: 0, opacity: 0, rotation: () => R(-30, 30), duration: .8, stagger: .04, ease: 'back.out(3)' }, at0); return; } break;
      case 'stamp':
        if ((s = split(h1, 'chars'))) {
          mark();
          tl.from(s.chars, { scale: 2.8, opacity: 0, rotation: () => R(-14, 14), duration: .38, stagger: .07, ease: 'power4.in' }, at0)
            .to(h1, { x: 6, duration: .05, repeat: 5, yoyo: true, ease: 'none', clearProps: 'x' });
          return;
        } break;
      case 'steps':
        if ((s = split(h1, 'chars'))) { mark(); tl.from(s.chars, { y: -48, opacity: 0, duration: .45, stagger: .05, ease: 'steps(4)' }, at0); return; } break;
      case 'type':
        if ((s = split(h1, 'chars'))) {
          mark();
          const caret = document.createElement('span'); caret.className = 'pro-caret'; caret.textContent = '█'; h1.append(caret);
          gsap.set(s.chars, { opacity: 0 });
          tl.to(s.chars, { opacity: 1, duration: .01, stagger: .07, ease: 'none' }, at0);
          return;
        } break;
      case 'scramble':
        if ((s = split(h1, 'chars'))) {
          mark();
          s.chars.forEach((c, i) => {
            const real = c.textContent; if (!real.trim()) return;
            const o = { p: 0 }; c.textContent = GL[Math.random() * GL.length | 0];
            tl.to(o, { p: 1, duration: .5 + Math.random() * .7, ease: 'none',
              onUpdate: () => { c.textContent = GL[Math.random() * GL.length | 0]; },
              onComplete: () => { c.textContent = real; } }, at0 + i * .025);
          });
          return;
        } break;
      case 'ink':
        if ((s = split(h1, 'chars'))) { mark(); tl.from(s.chars, { opacity: 0, filter: 'blur(14px)', y: 12, duration: C.dur, stagger: .06, ease: 'power2.out', clearProps: 'filter' }, at0); return; } break;
      case 'write':
        if ((s = split(h1, 'lines'))) {
          mark();
          tl.fromTo(s.lines, { clipPath: 'inset(-20% 100% -20% -5%)' }, { clipPath: 'inset(-20% -5% -20% -5%)', duration: C.dur, stagger: C.dur * .6, ease: 'power2.inOut', clearProps: 'clipPath' }, at0);
          return;
        } break;
      case 'fade':
        if ((s = split(h1, 'words'))) { mark(); tl.from(s.words, { opacity: 0, y: 14, filter: 'blur(8px)', duration: C.dur, stagger: .06, clearProps: 'filter' }, at0); return; } break;
    }
    tl.from(h1, { y: 40, opacity: 0, duration: C.dur }, at0);
  };
  introH1();
  tl.eventCallback('onComplete', () => unmask(h1));

  /* ---------- 入場：其他 hero 元素 ---------- */
  const stepsLike = C.intro === 'steps' || C.intro === 'type';
  if (head) tl.from(head, { y: -30, opacity: 0, duration: C.dur * .8, ease: stepsLike ? 'steps(4)' : C.ease, clearProps: 'opacity,transform' }, at0);
  const bits = $$('.hero .eyebrow, .hero .lead, .hero .actions, .hero > .note, .hero > .pull, .hero > .orn');
  tl.from(bits, { y: 26, opacity: 0, duration: C.dur, stagger: C.stagger + .04, ease: stepsLike ? 'steps(4)' : C.ease, clearProps: 'opacity,transform' }, at0 + .35);
  const decos = $$('.hero .deco');
  tl.from(decos, { opacity: 0, filter: 'blur(12px)', duration: C.dur * 1.2, stagger: .12, clearProps: 'filter' }, at0 + .2);

  /* ---------- Hero 視差（滑鼠 + scroll） ---------- */
  const hero = $('.hero');
  const decoO = decos.map((d, i) => ({ o: reg(d), k: (i % 3 + 1) / 2 }));
  if (fine && C.parallax) {
    const q = decoO.map(({ o }) => ({ x: gsap.quickTo(o, 'px', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(o, 'py', { duration: 1.2, ease: 'power3' }) }));
    addEventListener('pointermove', e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      decoO.forEach((d, i) => { q[i].x(nx * C.parallax * d.k * 2); q[i].y(ny * C.parallax * d.k * 2); });
    });
  }
  if (ST && hero) {
    if (C.decoScroll) decoO.forEach(d => gsap.to(d.o, { sy: C.decoScroll * d.k, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } }));
    if (C.heroOut) gsap.to(hero, { y: () => hero.offsetHeight * .22, opacity: .45, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  }

  /* ---------- Scroll reveal ---------- */
  if (ST) {
    const RV = {
      rise: { y: 70, opacity: 0 }, fade: { opacity: 0 }, scale: { scale: .86, opacity: 0 }, pop: { scale: .6, opacity: 0 },
      steps: { y: 48, opacity: 0 }, blur: { opacity: 0, filter: 'blur(16px)', y: 30 }, skew: { y: 110, skewY: 7, opacity: 0 },
      rotate: { y: 140, rotation: () => R(-16, 16), opacity: 0 }, clip: { clipPath: 'inset(100% 0% 0% 0%)', y: 30 }
    };
    const rvEase = C.revealEase || ({ steps: 'steps(4)', pop: 'back.out(1.7)', rotate: 'back.out(1.4)', blur: 'power2.out', fade: 'power2.out' })[C.reveal] || C.ease;
    const rvDur = C.reveal === 'steps' ? .5 : C.dur;
    const reveal = (targets, trigger, start = 'top 85%', extra = {}) => {
      if (!targets.length || C.reveal === 'none') return;
      gsap.from(targets, Object.assign({}, RV[C.reveal] || RV.rise, {
        duration: rvDur, ease: rvEase, stagger: C.stagger + .04, clearProps: 'transform,opacity,filter,clipPath',
        scrollTrigger: { trigger, start } }, extra));
    };
    $$('.sec-title').forEach(t => {
      const s = C.reveal !== 'none' ? split(t, 'lines', 'lines') : null;
      if (s) gsap.from(s.lines, { yPercent: 110, duration: rvDur, ease: C.reveal === 'steps' ? 'steps(4)' : 'expo.out', stagger: .1, onComplete: () => unmask(t), scrollTrigger: { trigger: t, start: 'top 88%' } });
    });
    reveal($$('.cards .card'), '.cards');
    reveal($$('.btn-row .state'), '.btn-row', 'top 90%');
    reveal($$('.form'), '.form', 'top 92%');
    /* 12 block 全頁版（P1+）：每個 block 內嘅 .rv 逐格入場（hero 除外，佢由入場時間軸負責） */
    $$('.block:not(.hero)').forEach(b => { const t = $$('.rv', b); if (t.length) reveal(t, b, 'top 80%'); });
    reveal($$('.site-footer'), '.site-footer', 'top 100%', { stagger: 0 });
    if (C.mediaReveal) $$('.card-media').forEach(m => gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: m, start: 'top 90%' } }));
    if (C.counters) $$(C.counters).forEach(el => {
      const m = el.textContent.trim().match(/^(\d+(?:\.\d+)?)(.*)$/); if (!m) return;
      const to = +m[1], suf = m[2], o = { v: 0 };
      el.textContent = '0' + suf;
      gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v) + suf; }, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  }

  /* ---------- 跑馬燈 + scroll 速度感 ---------- */
  const boost = { v: 0 };
  const mqs = $$('.pro-marquee .pro-track').map(tr => {
    const box = tr.parentElement, dir = +(box.dataset.dir || 1);
    return gsap.fromTo(tr, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: +(box.dataset.dur || 20), ease: 'none', repeat: -1 });
  });
  const cardsEl = $('.cards') || $('.grid');   // 新全頁版用 .grid，舊版用 .cards
  const skew = C.velocitySkew && cardsEl ? gsap.quickTo(cardsEl, 'skewY', { duration: .5, ease: 'power3' }) : null;
  let skewReset;
  if (ST && (mqs.length || skew)) ST.create({ onUpdate: s => {
    const v = s.getVelocity(); boost.v = Math.min(Math.abs(v) / 250, 6);
    if (skew) { skew(gsap.utils.clamp(-C.velocitySkew, C.velocitySkew, v / -200)); skewReset && skewReset.kill(); skewReset = gsap.delayedCall(.15, () => skew(0)); }
  } });
  if (mqs.length) gsap.ticker.add(() => { boost.v *= .93; mqs.forEach(m => m.timeScale(1 + boost.v)); });

  /* ---------- 卡片：光斑 + 3D 傾側 ---------- */
  if (C.tilt && cardsEl) cardsEl.style.perspective = '1000px';
  $$('.card').forEach(c => {   // 兩種結構都食（.cards .card ／ .grid .card）
    if (C.spotlight) {
      if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
      const sp = document.createElement('i'); sp.className = 'pro-spot'; sp.style.setProperty('--spot', C.spot); c.append(sp);
    }
    if (!fine || (!C.spotlight && !C.tilt)) return;
    const rx = C.tilt ? gsap.quickTo(c, 'rotationX', { duration: .8, ease: 'power3' }) : null;
    const ry = C.tilt ? gsap.quickTo(c, 'rotationY', { duration: .8, ease: 'power3' }) : null;
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
      if (C.tilt) { ry((px - .5) * C.tilt * 2); rx((.5 - py) * C.tilt * 2); }
    });
    c.addEventListener('pointerleave', () => { if (C.tilt) { rx(0); ry(0); } });
  });

  /* ---------- 磁吸按鈕 ---------- */
  if (fine && C.magnetic) $$('.btn:not(:disabled):not(.is-hover):not(.is-active):not(.is-focus), .site-header nav a').forEach(b => {
    const o = reg(b), k = b.classList.contains('btn') ? C.magnetic : C.magnetic * .5;
    const x = gsap.quickTo(o, 'x', { duration: .6, ease: 'elastic.out(1,.35)' }), y = gsap.quickTo(o, 'y', { duration: .6, ease: 'elastic.out(1,.35)' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * k); y((e.clientY - r.top - r.height / 2) * k * 1.2); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  /* ---------- 拖拉（Cybercore 視窗、Scrapbook 相片） ---------- */
  if (C.drag) $$(C.drag).forEach(el => {
    const h = C.dragHandle ? $(C.dragHandle, el) : el; if (!h) return;
    const o = reg(el); h.style.cursor = 'grab'; h.style.touchAction = 'none';
    let sx = null, sy, ox, oy;
    h.addEventListener('pointerdown', e => {
      if (e.target.closest('a,button,input,select')) return;
      sx = e.clientX; sy = e.clientY; ox = o.x; oy = o.y;
      h.setPointerCapture(e.pointerId); h.style.cursor = 'grabbing';
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.zIndex = PROX.z = (PROX.z || 20) + 1;
      gsap.to(el, { scale: 1.04, duration: .2 });
    });
    h.addEventListener('pointermove', e => { if (sx === null) return; o.x = ox + e.clientX - sx; o.y = oy + e.clientY - sy; });
    const up = () => {
      if (sx === null) return; sx = null; h.style.cursor = 'grab';
      gsap.to(el, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)', clearProps: 'transform' });
      if (C.dragRotate) el.style.rotate = R(-7, 7).toFixed(1) + 'deg';
    };
    h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
  });

  /* ---------- 游標效果 ---------- */
  if (fine && C.cursor !== 'none') {
    const mk = (cls, css) => { const d = document.createElement('div'); d.className = cls; Object.assign(d.style, css); document.body.append(d); return d; };
    const follow = (el, dur) => {
      const x = gsap.quickTo(el, 'x', { duration: dur, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: dur, ease: 'power3' });
      el.style.opacity = 0;
      addEventListener('pointermove', e => { el.style.opacity = 1; x(e.clientX); y(e.clientY); });
      document.documentElement.addEventListener('pointerleave', () => { el.style.opacity = 0; });
    };
    const hoverScale = (el, s) => $$('a,button,input,select,.card').forEach(t => {
      t.addEventListener('pointerenter', () => gsap.to(el, { scale: s, duration: .4, ease: 'power3' }));
      t.addEventListener('pointerleave', () => gsap.to(el, { scale: 1, duration: .4, ease: 'power3' }));
    });
    if (C.cursor === 'glow' || C.cursor === 'ink') {
      const ink = C.cursor === 'ink', s = ink ? C.inkSize : C.glowSize;
      const g = mk('pro-glow', { width: s + 'px', height: s + 'px', marginLeft: -s / 2 + 'px', marginTop: -s / 2 + 'px',
        background: `radial-gradient(circle, ${C.cursorColor}, transparent 65%)`, zIndex: ink ? 97 : C.glowZ, mixBlendMode: C.cursorBlend });
      follow(g, ink ? .35 : .8);
    }
    if (C.cursor === 'dot') {
      const d = mk('pro-dot', { width: '12px', height: '12px', margin: '-6px 0 0 -6px', background: C.cursorColor, mixBlendMode: C.cursorBlend });
      follow(d, .35); hoverScale(d, 3.2);
    }
    if (C.cursor === 'ring') {
      const d = mk('pro-dot', { width: '5px', height: '5px', margin: '-2.5px 0 0 -2.5px', background: C.cursorColor });
      const r = mk('pro-ring', { width: C.ringSize + 'px', height: C.ringSize + 'px', margin: `${-C.ringSize / 2}px 0 0 ${-C.ringSize / 2}px`, border: `1.5px solid ${C.cursorColor}` });
      follow(d, .08); follow(r, .45); hoverScale(r, 1.7);
    }
    if (C.cursor === 'trail' || C.cursor === 'pixel') {
      let last = 0;
      addEventListener('pointermove', e => {
        const now = performance.now(); if (now - last < C.trailRate) return; last = now;
        const col = C.trailColors[Math.random() * C.trailColors.length | 0];
        if (C.cursor === 'pixel') spawn(e.clientX, e.clientY, '', { cls: 'pro-px', color: col, y: 28, dur: .6, ease: 'steps(4)', scale: 0 });
        else spawn(e.clientX, e.clientY, C.trail[Math.random() * C.trail.length | 0], {
          color: col, size: C.trailSize * R(.7, 1.25), y: -R(40, 90), dx: R(-30, 30), spin: R(-90, 90), dur: R(.8, 1.3), scale: .3,
          cls: (C.trailGlow ? 'pro-glowtxt ' : '') + (C.trailStroke ? 'pro-stroke' : '') });
      });
    }
  }
})();
