/* Neumorphism · 可以轉嘅旋鈕：Draggable 旋轉 + 慣性 + 每度一下「咔」聲 */
(() => {
  const D = window.DEEP; if (!D || !D.ok || !window.Draggable) return;
  const knob = D.$('.deco.knob'), span = knob && knob.querySelector('span'); if (!span) return;
  D.css(`.deco.knob{pointer-events:auto!important;cursor:grab}
.knob-ring{position:absolute;inset:0;border-radius:50%}
.knob-ring i{position:absolute;top:12px;left:50%;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#6C63FF;box-shadow:0 0 12px #6C63FF}
.knob-val{position:relative;z-index:1;pointer-events:none}
.knob-ticks{position:absolute;inset:-26px;border-radius:50%;pointer-events:none;background:repeating-conic-gradient(from -140deg,rgba(74,85,104,.35) 0 1deg,transparent 1deg 14deg);-webkit-mask:radial-gradient(circle,transparent 60%,#000 61% 66%,transparent 67%);mask:radial-gradient(circle,transparent 60%,#000 61% 66%,transparent 67%)}`);
  D.$$('.knob-dot', span).forEach(n => n.remove());
  const oldText = [...span.childNodes].find(n => n.nodeType === 3); if (oldText) oldText.remove();
  const val = document.createElement('b'); val.className = 'knob-val'; val.textContent = '24°';
  const ring = document.createElement('div'); ring.className = 'knob-ring'; ring.innerHTML = '<i></i>';
  const ticks = document.createElement('div'); ticks.className = 'knob-ticks';
  span.append(ring, val); knob.append(ticks);
  let lastDeg = 24;
  const update = rot => {
    const deg = Math.round(10 + (rot + 140) / 280 * 25);
    val.textContent = deg + '°';
    if (deg !== lastDeg) { D.audio.tone(900 + deg * 12, .03, 'square', .025); lastDeg = deg; }
  };
  gsap.set(ring, { rotation: 0 });
  Draggable.create(ring, {
    type: 'rotation', inertia: true, trigger: knob, bounds: { minRotation: -140, maxRotation: 140 },
    onDrag() { update(this.rotation); }, onThrowUpdate() { update(this.rotation); },
    onPress() { knob.style.cursor = 'grabbing'; }, onRelease() { knob.style.cursor = 'grab'; }
  });
  D.audio.toggle('旋鈕手感聲');
  D.hint('↻ 用滑鼠轉右邊個旋鈕 —— 用力甩佢會有慣性', D.$('.hero .actions'));
})();
