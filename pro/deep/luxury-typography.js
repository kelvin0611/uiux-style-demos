/* Luxury Typography · 可變字體（Bodoni Moda wght 400→900 跟游標距離）＋ 產品相液態溶解切換（WebGL） */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  D.font('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap');
  const h1 = D.$('.hero h1');
  if (h1) {
    const lines = D.$$('.ln', h1);
    if (!D.$$('.ch', h1).length && window.SplitText) SplitText.create(lines.length ? lines : h1, { type: 'chars', charsClass: 'ch' });
    if (D.proximity(h1, { near: 900, far: 400, radius: 280 })) D.hint('↔ 將滑鼠移過個大標題', D.$('.hero .actions'));
  }
  D.css(`.cards .card-media{position:relative;overflow:hidden}.cards .card-media .emo{position:relative;z-index:1;color:#fff;mix-blend-mode:difference}`);
  const frag = D.GLSL_NOISE + `
uniform float u_k;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; float n=fbm(uv*3.5+vec2(0.,u_time*.04))+(uv.y-.5)*.35;
  vec3 A=mix(vec3(.8,.75,.66),vec3(.92,.89,.84),uv.y), B=mix(vec3(.72,.61,.37),vec3(.07,.06,.05),pow(uv.y,.6));
  if(u_k>.5){vec3 s=A;A=B;B=s;}
  float th=u_hover*1.4-.2; float e=smoothstep(th-.05,th+.05,n);
  vec3 col=mix(B,A,e);
  col+=smoothstep(.05,0.,abs(n-th))*u_hover*(1.-u_hover)*3.*vec3(.95,.8,.5);
  float g=hash(uv*u_res+u_time)*.04; col+=g-.02;
  gl_FragColor=vec4(col,1.);}`;
  let n = 0;
  D.$$('.cards .card-media').forEach((m, i) => {
    const txt = m.textContent.trim(); m.innerHTML = `<span class="emo">${txt}</span>`;
    const c = D.canvasIn(m, 0);
    if (!D.shader(c, frag, { uniforms: { u_k: i === 1 ? 1 : 0 }, scale: .8, hoverTarget: m.closest('.card') })) c.remove(); else n++;
  });
  if (n) D.hint('滑鼠放喺產品相上面 —— 液態溶解切換', D.$$('.sec-title')[1]);
})();
