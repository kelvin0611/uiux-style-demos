/* Bohemian · 藤蔓跟住 scroll 沿頁邊生長：主莖逐段畫出，枝葉同小花經過時長出嚟 */
(() => {
  const D = window.DEEP; if (!D || !D.ok || D.reduce || !window.ScrollTrigger) return;
  if (innerWidth < 900) return;
  D.css(`.vines{position:absolute;left:0;top:0;width:100%;pointer-events:none;z-index:-1;overflow:visible}
.vines .stem{fill:none;stroke:#7d9468;stroke-width:3;stroke-linecap:round}
.vines .twig{fill:none;stroke:#8a9f77;stroke-width:2;stroke-linecap:round}`);
  const NS = 'http://www.w3.org/2000/svg';
  const H = document.documentElement.scrollHeight, W = document.documentElement.clientWidth;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'vines'); svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.height = H + 'px'; document.body.append(svg);
  const leaf = 'M0 0 C 8 -10 20 -10 28 0 C 20 10 8 10 0 0 Z';
  const grow = (x0, side, seed) => {
    let d = `M${x0} 0`, x = x0, y = 0; const nodes = [];
    while (y < H) { const ny = y + 110, nx = x0 + Math.sin((ny + seed) / 170) * 16 * side; d += ` Q ${x + side * 26} ${y + 55} ${nx} ${ny}`; nodes.push([nx, ny]); x = nx; y = ny; }
    const stem = document.createElementNS(NS, 'path'); stem.setAttribute('d', d); stem.setAttribute('class', 'stem'); svg.append(stem);
    const L = stem.getTotalLength();
    gsap.set(stem, { strokeDasharray: L, strokeDashoffset: L * (1 - Math.min(1, innerHeight / H)) });
    gsap.to(stem, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
    nodes.forEach(([nx, ny], i) => {
      const g = document.createElementNS(NS, 'g');
      const dir = i % 2 ? side : side * .6, len = 34 + (i * 37 % 30);
      const tw = document.createElementNS(NS, 'path'); tw.setAttribute('class', 'twig');
      tw.setAttribute('d', `M${nx} ${ny} q ${dir * len * .4} -12 ${dir * len} -${len * .7}`); g.append(tw);
      const lf = document.createElementNS(NS, 'path'); lf.setAttribute('d', leaf);
      lf.setAttribute('fill', i % 3 === 0 ? '#C2703D' : '#9CAF88');
      lf.setAttribute('transform', `translate(${nx + dir * len} ${ny - len * .7}) rotate(${side > 0 ? -35 - i * 7 % 40 : 215 + i * 7 % 40})`); g.append(lf);
      if (i % 4 === 1) { const f = document.createElementNS(NS, 'circle'); f.setAttribute('cx', nx - dir * 14); f.setAttribute('cy', ny + 10); f.setAttribute('r', 5); f.setAttribute('fill', '#D4A017'); g.append(f); }
      svg.append(g);
      gsap.from(g.children, { scale: 0, transformOrigin: `${nx}px ${ny}px`, duration: 1, stagger: .12, ease: 'back.out(2)', scrollTrigger: { trigger: document.body, start: () => Math.max(0, ny - innerHeight * .85) + ' top', once: true } });
    });
  };
  grow(34, 1, 0); grow(W - 34, -1, 90);
})();
