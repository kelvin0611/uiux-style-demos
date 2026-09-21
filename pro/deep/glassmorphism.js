/* Glassmorphism · WebGL 流體背景（domain-warped fbm），游標位置有漣漪 —— 玻璃後面真係有嘢流動 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const bg = D.$('.bg'); if (!bg) return;
  const c = document.createElement('canvas'); c.className = 'deep-canvas'; c.setAttribute('aria-hidden', 'true'); bg.prepend(c);
  const gl = D.shader(c, D.GLSL_NOISE + `
void main(){
  float asp=u_res.x/u_res.y; vec2 uv=gl_FragCoord.xy/u_res; vec2 p=uv*vec2(asp,1.)*1.8;
  vec2 m=u_mouse*vec2(asp,1.)*1.8; float d=length(p-m);
  p+=(p-m)*sin(u_time*2.-d*9.)*exp(-d*d*2.5)*.12;
  float t=u_time*.07;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+3.5*q+vec2(1.7,9.2)+t*1.4),fbm(p+3.5*q+vec2(8.3,2.8)-t));
  float f=fbm(p+3.5*r);
  vec3 c1=vec3(.5,.35,.94),c2=vec3(1.,.43,.78),c3=vec3(.17,.71,.49),c4=vec3(.24,.66,.99),c5=vec3(1.,.7,.28),bg=vec3(.03,.03,.1);
  vec3 col=mix(c1,c2,clamp(f*f*2.2,0.,1.));
  col=mix(col,c3,clamp(length(q)*.9-.35,0.,1.));
  col=mix(col,c4,clamp(r.x-.35,0.,1.)*.8);
  col=mix(col,c5,clamp(r.y-.6,0.,1.)*.6);
  col=mix(bg,col,smoothstep(.12,.7,f)+.1);
  col+=.22*exp(-d*d*4.)*vec3(1.,.92,1.);
  gl_FragColor=vec4(col,1.);}
`, { globalMouse: true, scale: .5, dpr: 1 });
  if (!gl) { c.remove(); return; }
  D.$$('.blob').forEach(b => { b.style.opacity = '.28'; });
})();
