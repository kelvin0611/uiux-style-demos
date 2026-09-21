/* Claymorphism · WebGL 3D 黏土球：raymarch + smooth union，會溶埋一齊，有一粒跟住游標 */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const hero = D.$('.hero'); if (!hero) return;
  const c = D.canvasIn(hero, 0);
  // 全螢幕闊：黏土球擺喺畫面兩邊，唔會俾內容欄切走
  hero.style.overflow = 'visible';
  c.style.setProperty('left', 'calc(50% - 50vw)', 'important');
  c.style.setProperty('right', 'auto', 'important');
  c.style.setProperty('width', '100vw', 'important');
  c.style.webkitMaskImage = c.style.maskImage = 'linear-gradient(to bottom, #000 78%, transparent 100%)';
  const gl = D.shader(c, `
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float asp;
float map(vec3 p){
  float t=u_time*.55;
  vec2 m=(u_mouse-.5)*vec2(asp*3.2,3.2);
  float d=length(p-vec3(-asp*1.15+sin(t)*.35,.25+cos(t*.8)*.45,0.))-.72;
  d=smin(d,length(p-vec3(asp*1.2+cos(t*.7)*.3,.35+sin(t*1.1)*.5,.2))-.62,.7);
  d=smin(d,length(p-vec3(asp*.95+sin(t*1.3+2.)*.35,-1.05+cos(t*.6)*.25,-.2))-.5,.7);
  d=smin(d,length(p-vec3(-asp*.9+cos(t*.9)*.3,-1.0+sin(t)*.3,.1))-.48,.7);
  d=smin(d,length(p-vec3(m.x,m.y,.4))-.42,.8);
  return d;}
vec3 nor(vec3 p){vec2 e=vec2(.003,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
void main(){
  asp=u_res.x/u_res.y;
  vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;
  vec3 ro=vec3(0.,0.,4.),rd=normalize(vec3(uv*1.6,-2.));
  float t=0.,hit=0.;
  for(int i=0;i<60;i++){float d=map(ro+rd*t);if(d<.003){hit=1.;break;}t+=d;if(t>9.)break;}
  if(hit<.5){gl_FragColor=vec4(0.);return;}
  vec3 p=ro+rd*t,n=nor(p),l=normalize(vec3(-.6,.8,.75));
  float dif=clamp(dot(n,l),0.,1.),rim=pow(1.-max(dot(n,-rd),0.),2.4),spec=pow(max(dot(reflect(-l,n),-rd),0.),20.);
  vec3 base=mix(vec3(1.,.71,.79),vec3(.72,.88,1.),smoothstep(-2.,2.,p.x));
  base=mix(base,vec3(.76,.95,.8),smoothstep(-.2,1.2,p.y)*.55);
  base=mix(base,vec3(1.,.91,.66),smoothstep(.2,-1.4,p.y)*.5);
  vec3 col=base*(.58+.5*dif)+rim*vec3(1.,.96,1.)*.3+spec*.4+vec3(.07,.02,.09)*(1.-dif);
  gl_FragColor=vec4(col,1.);}
`, { globalMouse: true, scale: .75, dpr: 1 });
  if (!gl) { c.remove(); return; }
  D.$$('.hero .deco').forEach(d => { d.style.visibility = 'hidden'; });
  D.hint('🖱️ 郁下滑鼠 —— 有粒黏土跟住你，掂到其他會溶埋一齊', D.$('.hero .actions'));
})();
