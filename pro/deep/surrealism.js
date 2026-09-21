/* Surrealism · WebGL 夢境相片：每張卡嘅相係即時 shader（天空、雲、月、星），游標經過會好似水咁波動 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  D.css(`.cards .card-media{position:relative;overflow:hidden}.cards .card-media .emo{position:relative;z-index:1}`);
  const frag = D.GLSL_NOISE + `
uniform float u_k;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; vec2 m=u_mouse; float d=distance(uv,m);
  float amp=.01+.035*u_hover; uv+=normalize(uv-m+.0001)*sin(d*38.-u_time*3.5)*exp(-d*5.)*amp;
  vec3 a=vec3(.53,.81,.92),b=vec3(.97,.77,.8); float night=0.;
  if(u_k>.5&&u_k<1.5){a=vec3(.11,.1,.2);b=vec3(.29,.48,.72);night=1.;} else if(u_k>1.5){a=vec3(.97,.77,.8);b=vec3(.71,.54,.39);}
  vec3 col=mix(b,a,smoothstep(0.,1.,uv.y));
  float cl=fbm(uv*vec2(3.,6.)+vec2(u_time*.04,0.));
  col=mix(col,vec3(1.),smoothstep(.55,.8,cl)*mix(.75,.22,night));
  col=mix(col,vec3(1.,.98,.92),smoothstep(.1,.09,distance(uv,vec2(.68,.78)))*(1.-night));
  col+=step(.994,hash(floor(uv*110.)))*night*(.6+.4*sin(u_time*3.+uv.x*40.));
  col=mix(col,vec3(.12,.1,.14),smoothstep(.25,0.,uv.y)*.25*(u_k>1.5?1.:0.));
  col+=.14*exp(-d*9.)*u_hover;
  gl_FragColor=vec4(col,1.);}`;
  let n = 0;
  D.$$('.cards .card-media').forEach((m, i) => {
    const txt = m.textContent.trim(); m.innerHTML = `<span class="emo">${txt}</span>`;
    const c = D.canvasIn(m, 0);
    const k = i % 3;
    if (!D.shader(c, frag, { uniforms: { u_k: k }, scale: .7, hoverTarget: m.closest('.card') })) c.remove(); else n++;
  });
  if (n) D.hint('〰 將滑鼠放上啲相 —— 會好似水咁波動', D.$$('.sec-title')[1]);
})();
