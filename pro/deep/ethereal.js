/* Ethereal · WebGL 極光背景：柔和粉彩霧流動，游標位置有一團光 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const hero = D.$('.hero'); if (!hero) return;
  const c = D.canvasIn(hero, 0);
  // 全螢幕闊 + 上下羽化：極光唔再係一個有硬邊嘅盒
  hero.style.overflow = 'visible';
  c.style.setProperty('left', 'calc(50% - 50vw)', 'important');
  c.style.setProperty('right', 'auto', 'important');
  c.style.setProperty('width', '100vw', 'important');
  c.style.webkitMaskImage = c.style.maskImage = 'linear-gradient(to bottom, transparent 0, #000 14%, #000 80%, transparent 100%)';
  const gl = D.shader(c, D.GLSL_NOISE + `
void main(){
  float asp=u_res.x/u_res.y; vec2 uv=gl_FragCoord.xy/u_res; vec2 p=uv*vec2(asp,1.)*1.4; vec2 m=u_mouse*vec2(asp,1.)*1.4; float t=u_time*.05;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(3.1,7.2)-t)); float f=fbm(p+2.5*q+vec2(t*2.,0.));
  vec3 base=vec3(.984,.98,.972),lav=vec3(.9,.82,1.),sky=vec3(.78,.9,1.),pink=vec3(1.,.82,.92),mint=vec3(.84,1.,.95);
  vec3 col=mix(lav,sky,smoothstep(.3,.7,q.x)); col=mix(col,pink,smoothstep(.4,.8,q.y)); col=mix(col,mint,smoothstep(.55,.85,f)*.5);
  float band=smoothstep(.38,0.,abs(uv.y-.55-sin(p.x*1.4+u_time*.18)*.12-(f-.5)*.35));
  col=mix(base,col,.45+.45*band);
  col=mix(col,base,smoothstep(.2,0.,uv.y)*.8);
  float d=length(p-m); col=mix(col,vec3(1.),exp(-d*d*3.)*.4);
  gl_FragColor=vec4(col,1.);}
`, { globalMouse: true, scale: .5, dpr: 1 });
  if (!gl) { c.remove(); return; }
  const aura = D.$('.deco.aura'); if (aura) aura.style.visibility = 'hidden';
})();
