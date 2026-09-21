/* UIUX Style · Deep 層 —— 物理、WebGL shader、SVG 變形、版面變形、聲音
   依賴：GSAP（+ Draggable / InertiaPlugin / Flip / MorphSVGPlugin / SplitText），貼紙池用 Matter.js
   冇 WebGL／library 載入失敗／用戶開咗「減少動畫」→ 自動退返 Pro 版效果 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.DEEP = { reduce, fine, $, $$, ok: !!window.gsap };
  if (!D.ok) return;
  gsap.registerPlugin(...['ScrollTrigger', 'Draggable', 'InertiaPlugin', 'Flip', 'MorphSVGPlugin', 'SplitText'].map(n => window[n]).filter(Boolean));

  D.css = s => { const st = document.createElement('style'); st.textContent = s; document.head.append(st); };
  D.font = href => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.append(l); };
  D.css(`
.deep-hint{display:inline-flex;gap:8px;align-items:center;margin:14px 0 0;padding:7px 14px;border-radius:999px;font:500 12px/1.4 -apple-system,"PingFang HK",system-ui,sans-serif;background:rgba(0,0,0,.74);color:#fff;letter-spacing:0;text-transform:none;position:relative;z-index:3}
.deep-sound{position:fixed;left:16px;bottom:16px;z-index:99;border:0;border-radius:999px;padding:9px 15px;font:600 12px -apple-system,"PingFang HK",system-ui,sans-serif;background:rgba(0,0,0,.8);color:#fff;cursor:pointer;letter-spacing:0;text-transform:none}
.deep-sound:focus-visible,.deep-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
.deep-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
.hero>.deep-canvas,.card-media>.deep-canvas,.bg>.deep-canvas{position:absolute!important;inset:0!important;z-index:0!important}
.deep-clabel{position:fixed;left:0;top:0;width:86px;height:86px;margin:-43px 0 0 -43px;border-radius:50%;display:grid;place-items:center;pointer-events:none;z-index:98;font:600 13px -apple-system,system-ui,sans-serif;background:var(--lbg,#111);color:var(--lfg,#fff)}
.deep-sec{position:relative}
.deep-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 18px}
.deep-btn{font:600 13px -apple-system,"PingFang HK",system-ui,sans-serif;padding:8px 14px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;letter-spacing:0;text-transform:none}
.deep-btn[aria-pressed="true"]{background:currentColor}
.deep-btn[aria-pressed="true"] span{filter:invert(1)}
`);

  /* ---------- 共用滑鼠 ---------- */
  D.mouse = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, vy: 0 };
  addEventListener('pointermove', e => { D.mouse.vx = e.clientX - D.mouse.x; D.mouse.vy = e.clientY - D.mouse.y; D.mouse.x = e.clientX; D.mouse.y = e.clientY; }, { passive: true });

  D.whenVisible = (el, cb) => { const io = new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { rootMargin: '120px' }); io.observe(el); };
  D.hint = (html, anchor, where = 'afterend') => { const h = document.createElement('div'); h.className = 'deep-hint'; h.innerHTML = html; if (anchor) anchor.insertAdjacentElement(where, h); else document.body.append(h); return h; };
  D.section = (title, afterEl, cls = '') => {
    const s = document.createElement('section'); s.className = 'block deep-sec ' + cls; s.innerHTML = `<h2 class="sec-title">${title}</h2>`;
    afterEl.insertAdjacentElement('afterend', s);
    if (window.ScrollTrigger && !reduce) gsap.from(s.firstElementChild, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 85%' } });
    return s;
  };
  D.afterBlock = n => $$('main > .block')[n] || $('main > .block:last-of-type');

  /* ---------- WebGL shader runner（全螢幕 quad） ----------
     內置 uniform：u_res, u_time, u_mouse(0–1, 平滑), u_scroll, u_hover */
  D.shader = (canvas, frag, opt = {}) => {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true });
    if (!gl) return null;
    const head = 'precision highp float;uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform float u_scroll;uniform float u_hover;\n';
    const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('[deep shader]', gl.getShaderInfoLog(s)); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'), f = sh(gl.FRAGMENT_SHADER, head + frag);
    if (!v || !f) return null;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const u = { res: U('u_res'), time: U('u_time'), mouse: U('u_mouse'), scroll: U('u_scroll'), hover: U('u_hover') };
    const extra = {}; Object.keys(opt.uniforms || {}).forEach(k => { extra[k] = U(k); });
    const dpr = Math.min(devicePixelRatio || 1, opt.dpr || 1.5) * (opt.scale || 1);
    const st = { mx: .5, my: .5, tx: .5, ty: .5, hover: 0, th: 0, t0: performance.now(), vis: true };
    const resize = () => { const r = canvas.getBoundingClientRect(); canvas.width = Math.max(1, r.width * dpr | 0); canvas.height = Math.max(1, r.height * dpr | 0); gl.viewport(0, 0, canvas.width, canvas.height); };
    resize(); addEventListener('resize', resize);
    const hoverEl = opt.hoverTarget || canvas.parentElement;
    addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      if (opt.globalMouse || (x >= -0.1 && x <= 1.1 && y >= -0.1 && y <= 1.1)) { st.tx = x; st.ty = y; }
    }, { passive: true });
    if (hoverEl) { hoverEl.addEventListener('pointerenter', () => { st.th = 1; }); hoverEl.addEventListener('pointerleave', () => { st.th = 0; }); }
    D.whenVisible(canvas, vis => { st.vis = vis; });
    const frame = now => {
      if (st.vis && !document.hidden) {
        st.mx += (st.tx - st.mx) * .08; st.my += (st.ty - st.my) * .08; st.hover += (st.th - st.hover) * .06;
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.time, reduce ? 3 : (now - st.t0) / 1000);
        gl.uniform2f(u.mouse, st.mx, st.my); gl.uniform1f(u.scroll, scrollY / innerHeight); gl.uniform1f(u.hover, st.hover);
        for (const [k, fn] of Object.entries(opt.uniforms || {})) {
          const val = typeof fn === 'function' ? fn() : fn;
          if (Array.isArray(val)) gl['uniform' + val.length + 'f'](extra[k], ...val); else gl.uniform1f(extra[k], val);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!reduce) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return { gl, st, resize };
  };
  D.canvasIn = (host, z = 0) => {
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const c = document.createElement('canvas'); c.className = 'deep-canvas'; c.style.zIndex = z; c.setAttribute('aria-hidden', 'true');
    host.prepend(c); return c;
  };
  D.GLSL_NOISE = `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}
`;

  /* ---------- 聲音（WebAudio 即時合成，預設靜音） ---------- */
  const A = D.audio = { on: false, ctx: null, onchange: null };
  A.ensure = () => { if (!A.ctx) A.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (A.ctx.state === 'suspended') A.ctx.resume(); return A.ctx; };
  A.tone = (f, d = .12, type = 'square', vol = .05, when = 0, slide = 0) => {
    if (!A.on) return;
    const c = A.ensure(), t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .03);
  };
  A.toggle = (label = '音效') => {
    const b = document.createElement('button'); b.className = 'deep-sound'; b.type = 'button';
    const set = () => { b.textContent = (A.on ? '🔊 ' : '🔇 ') + label; b.setAttribute('aria-pressed', String(A.on)); };
    set(); b.addEventListener('click', () => { A.on = !A.on; if (A.on) A.ensure(); set(); A.onchange && A.onchange(A.on); });
    document.body.append(b); return b;
  };

  /* ---------- 物理（Matter.js）：DOM 元素變成有重量嘅物件 ---------- */
  D.physics = (box, els, opt = {}) => {
    const M = window.Matter; if (!M || reduce) return null;
    const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body } = M;
    const engine = Engine.create(); engine.gravity.y = opt.gravity ?? 1;
    let W = box.clientWidth, H = box.clientHeight; const T = 400;
    const floor = Bodies.rectangle(W / 2, H + T / 2, W * 4, T, { isStatic: true });
    const left = Bodies.rectangle(-T / 2, 0, T, H * 6, { isStatic: true }), right = Bodies.rectangle(W + T / 2, 0, T, H * 6, { isStatic: true });
    Composite.add(engine.world, [floor, left, right]);
    const place = (it, i) => { Body.setPosition(it.body, { x: 60 + Math.random() * (W - 120), y: -120 - i * 70 }); Body.setVelocity(it.body, { x: (Math.random() - .5) * 4, y: 0 }); Body.setAngle(it.body, (Math.random() - .5) * 1.2); Body.setAngularVelocity(it.body, (Math.random() - .5) * .2); };
    const items = els.map((el, i) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const o = { restitution: .45, friction: .15, frictionAir: .01 };
      const body = el.dataset.shape === 'circle' ? Bodies.circle(0, 0, w / 2, o) : Bodies.rectangle(0, 0, w, h, Object.assign({ chamfer: { radius: Math.min(w, h) * .18 } }, o));
      Composite.add(engine.world, body);
      Object.assign(el.style, { position: 'absolute', left: '0', top: '0', margin: '0' });
      const it = { el, body, w, h }; place(it, i); return it;
    });
    const mouse = Mouse.create(box);
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach(ev => mouse.element.removeEventListener(ev, mouse.mousewheel));
    if (!fine) { mouse.element.removeEventListener('touchmove', mouse.mousemove); mouse.element.removeEventListener('touchstart', mouse.mousedown); mouse.element.removeEventListener('touchend', mouse.mouseup); }
    Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: .2, render: { visible: false } } }));
    let running = false, last = performance.now();
    D.whenVisible(box, v => { running = v; });
    const tick = now => {
      const dt = Math.min(32, now - last); last = now;
      if (running && !document.hidden) {
        Engine.update(engine, dt);
        for (const it of items) { const p = it.body.position; it.el.style.transform = `translate(${p.x - it.w / 2}px,${p.y - it.h / 2}px) rotate(${it.body.angle}rad)`; }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    addEventListener('resize', () => { W = box.clientWidth; H = box.clientHeight; Body.setPosition(floor, { x: W / 2, y: H + T / 2 }); Body.setPosition(right, { x: W + T / 2, y: 0 }); });
    return { engine, items, drop: () => items.forEach(place), M };
  };

  /* ---------- 可變字體跟游標距離 ---------- */
  D.proximity = (el, o = {}) => {
    if (!fine || reduce || !el) return null;
    let chars = $$('.ch', el);
    if (!chars.length && window.SplitText) chars = SplitText.create(el, { type: 'chars', charsClass: 'ch' }).chars;
    if (!chars.length) return null;
    const R = o.radius || 240, near = o.near ?? 900, far = o.far ?? 300;
    const st = chars.map(c => ({ c, v: far }));
    gsap.ticker.add(() => {
      for (const s of st) {
        const r = s.c.getBoundingClientRect();
        const d = Math.hypot(D.mouse.x - (r.left + r.width / 2), D.mouse.y - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / R), target = far + (near - far) * t * t;
        s.v += (target - s.v) * .14;
        s.c.style.fontVariationSettings = `'wght' ${s.v.toFixed(0)}` + (o.extra ? ', ' + o.extra(t) : '');
      }
    });
    return chars;
  };

  /* ---------- 游標變標籤 ---------- */
  D.cursorLabel = (sel, text, bg = '#111', fg = '#fff') => {
    if (!fine) return null;
    const l = document.createElement('div'); l.className = 'deep-clabel'; l.textContent = text;
    l.style.setProperty('--lbg', bg); l.style.setProperty('--lfg', fg); document.body.append(l);
    gsap.set(l, { scale: 0, opacity: 0 });
    const x = gsap.quickTo(l, 'x', { duration: .35, ease: 'power3' }), y = gsap.quickTo(l, 'y', { duration: .35, ease: 'power3' });
    addEventListener('pointermove', e => { x(e.clientX); y(e.clientY); });
    $$(sel).forEach(t => {
      t.addEventListener('pointerenter', () => gsap.to(l, { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2)' }));
      t.addEventListener('pointerleave', () => gsap.to(l, { scale: 0, opacity: 0, duration: .25 }));
    });
    return l;
  };
})();
