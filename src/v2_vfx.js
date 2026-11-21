/* ---------- 技のエフェクト（スタンプ） ----------
   img/fx/*.webp を、当たり・撃破・レベルアップ・既存の技の上に重ねて描く。
   数が増えすぎないよう、敵ごとの間引きと全体の上限をつける。 */
const VFX_ADD={hit:1,crit:1,slash_b:1,slash_o:1,boom:1,ring:1,bolt:1,spark:1,bflame:1,circle_p:1,circle_g:1,heal:1,glitch:1};
const VFX_MAX=70;
function vfx(k,x,y,s0,s1,life,o){const D=FD;if(!D)return;D.vfx=D.vfx||[];if(D.vfx.length>=VFX_MAX){if(!o||!o.must)return;D.vfx.shift()}
 D.vfx.push(Object.assign({k,x,y,s0,s1,life,t:0,rot:Math.random()*TAU,spin:0,a:1},o||{}))}
function vfxImg(k){return fspr('img/fx/'+k+'.webp',128)}
/* 当たったときの火花・大きい一撃 */
{const _d=fDamage;fDamage=function(e,d,kx,ky){const alive=e&&e.hp>0;_d(e,d,kx,ky);if(!alive||!FD)return;const t=FD.t;
 const big=d>=e.max*(e.boss?.03:.25);
 if(big&&(!e.vfxC||t-e.vfxC>.25)){e.vfxC=t;vfx('crit',e.x,e.y-e.r*.3,e.r*1.4,e.r*2.6+30,14)}
 else if(!e.vfxH||t-e.vfxH>.12){e.vfxH=t;vfx('hit',e.x+(Math.random()-.5)*e.r,e.y-e.r*.3+(Math.random()-.5)*e.r,e.r*.9+10,e.r*1.6+22,10)}}}
/* 倒したときのかけら */
{const _k=fKill;fKill=function(e){const r=_k.apply(this,arguments);if(!FD||!e)return r;const inf=towerAt()==='inf';
 if(e.boss){vfx('boom',e.x,e.y,e.r*2,e.r*5+120,34,{must:1});vfx('ring',e.x,e.y,e.r*2,e.r*7+160,40,{must:1,rot:0});vfx('shard',e.x,e.y,e.r*2,e.r*5+80,30,{must:1})}
 else if(e.big){vfx('dust',e.x,e.y+e.r*.3,e.r*1.5,e.r*3.5+40,28,{must:1});vfx('ring',e.x,e.y,e.r,e.r*4+50,22,{rot:0});vfx(inf?'glitch':'shard',e.x,e.y,e.r*1.4,e.r*3+40,20)}
 else vfx(inf?'glitch':'shard',e.x,e.y,e.r*1.2,e.r*2.6+24,16);
 return r}}
/* レベルアップ：足元に緑の魔法陣 */
{const _g=fGainXp;fGainXp=function(v){const lv=FD?FD.lv:0;_g(v);if(FD&&FD.lv>lv){vfx('circle_g',0,0,40,150,45,{must:1,follow:1,spin:.06,rot:0});vfx('heal',0,-10,30,90,40,{must:1,follow:1,rot:0})}}}
/* 時間を進める */
{const _u=fUpdate;fUpdate=function(f){_u(f);const D=FD;if(!D||!D.vfx)return;for(const v of D.vfx){v.t+=f;v.rot+=v.spin*f}D.vfx=D.vfx.filter(v=>v.t<v.life)}}
/* 描く：既存の技（雷・爆発・回復）にもスタンプを重ねる */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);g.save();
 for(const p of D.fx){if(p.t>1.5)continue;if(p.vfx)continue;p.vfx=1;
  if(p.k==='bolt')vfx('bolt',p.x2,p.y2,40,90,12,{rot:0});
  else if(p.k==='heal')vfx('heal',p.x,p.y,(p.r||40)*.8,(p.r||40)*1.8,20,{rot:0});
  else if(p.k!=='beam'&&p.r>=40)vfx('boom',p.x,p.y,p.r*.8,p.r*2.2,18)}
 for(const v of D.vfx||[]){const s=vfxImg(v.k);if(!s)continue;const k=v.t/v.life,e=1-(1-k)*(1-k),sz=v.s0+(v.s1-v.s0)*e;
  g.globalAlpha=v.a*(k<.15?1:Math.max(0,1-(k-.15)/.85));g.globalCompositeOperation=VFX_ADD[v.k]?'lighter':'source-over';
  const x=v.follow?D.x+v.x:v.x,y=v.follow?D.y+v.y:v.y;g.save();g.translate(x,y);g.rotate(v.rot);g.drawImage(s,-sz/2,-sz/2,sz,sz);g.restore()}
 g.restore()}}
