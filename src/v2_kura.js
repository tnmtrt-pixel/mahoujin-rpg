/* =====================================================================
   特別なキャラ「クーラ」（プレゼントコード限定・★5）
   ・設定：工場の切削液（クーラント）のタンクから生まれた、味方の緑のスライム。
     切削液は刃物と金属を冷やし、錆も防ぐ → 錆が大きらい。元気で人なつっこい。語尾「〜ぷる！」
   ・技「クーラント連射」：向いている方向へ、緑の液体を連射する。Lv5 は当たった所に水たまり（敵が遅くなる）
   ・ガチャ・図鑑には出ない（SECRET_CH）。武器は「錆止めのしずく」（工具ではない）
   ===================================================================== */
SECRET_CH.push('kura');
CHARS.kura={name:'クーラ',img:'img/kura.webp',job:'senban',pass:{n:'錆止めの体',d:'',k:''},sp:{n:'',d:'',shape:'mizu'},art:'img/kura.webp',secret:true,
 lines:['クーラだぷる！ 錆はきらいぷる。ぜーんぶ、ぴかぴかに流してやるぷる！']};
TYPE_IC['液']='w_kura';
ATK.kura={n:'クーラント連射',type:'液',ic:'pen',d:['向いている方向へ、緑の液体をビュビュッと連射する','弾が2つずつになる','つらぬく','連射が速くなる','当たった所に水たまりが残り、敵が遅くなる']};
ABIL.kura=ab4(['cut',.08],['regen',1],['eslow',.06],['rustRes',.3]);
WNAME.kura='しずく';BASEW.kura='錆止めのしずく';
function kuraDir(D){if(D.mva!=null)return D.mva;return {down:Math.PI/2,up:-Math.PI/2,left:Math.PI,right:0}[D.face]??-Math.PI/2}
function kuraAttack(f){const D=FD,A=D.atk;if(!A.kura)return;const V=D.ku||(D.ku={b:[],p:[]}),L=A.kura,c=D.cd;
 c.kura=(c.kura||0)-f;
 if(c.kura<=0){const a=kuraDir(D),n=L>=2?2:1,dmg=7*(L>=3?1.3:1)*fPow('kura');
  for(let i=0;i<n;i++){const aa=a+(Math.random()-.5)*.14,off=(n>1?(i-.5)*12:0);
   V.b.push({x:D.x+Math.cos(a+Math.PI/2)*off,y:D.y-12+Math.sin(a+Math.PI/2)*off,vx:Math.cos(aa)*9,vy:Math.sin(aa)*9,life:55,dmg,pierce:L>=3?2:1,hit:new Set(),r:5+Math.random()*2})}
  if(Math.random()<.4)tone(700+Math.random()*200,.03,'sine',.025,350);c.kura=(L>=4?7:10)*fCd()}
 for(const s of V.b){s.x+=s.vx*f;s.y+=s.vy*f;s.life-=f;
  for(const e of D.foes){if(e.hp<=0||s.hit.has(e.id)||s.pierce<=0)continue;if((e.x-s.x)**2+(e.y-s.y)**2<(e.r+s.r+2)**2){s.hit.add(e.id);s.pierce--;fDamage(e,s.dmg,s.vx*.25,s.vy*.25);
    if(L>=5&&V.p.length<24)V.p.push({x:e.x,y:e.y+6,t:0,life:150});if(s.pierce<=0)s.life=0}}}
 V.b=V.b.filter(s=>s.life>0);
 for(const p of V.p){p.t+=f;for(const e of D.foes)if((e.x-p.x)**2+(e.y-p.y)**2<(e.r+26)**2)e.trap=Math.max(e.trap||0,2)}
 V.p=V.p.filter(p=>p.t<p.life)}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);kuraAttack(f)}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.ku;if(!V)return;g.save();
 for(const p of V.p){const k=Math.min(1,(p.life-p.t)/30);g.globalAlpha=.45*k;g.fillStyle='#9ee03a';g.beginPath();g.ellipse(p.x,p.y,28,11,0,0,TAU);g.fill();
  g.globalAlpha=.6*k;g.fillStyle='#e8ffb0';g.beginPath();g.ellipse(p.x-8,p.y-3,7,2.5,0,0,TAU);g.fill()}
 g.globalAlpha=1;
 for(const s of V.b){const a=Math.atan2(s.vy,s.vx);g.save();g.translate(s.x,s.y);g.rotate(a);
  g.fillStyle='#5f9e10';g.beginPath();g.ellipse(-4,0,s.r+5,s.r*.75,0,0,TAU);g.fill();
  g.fillStyle='#b8f03c';g.beginPath();g.ellipse(-3,0,s.r+3,s.r*.6,0,0,TAU);g.fill();
  g.fillStyle='#f0ffd0';g.beginPath();g.ellipse(0,-s.r*.25,2.2,1.4,0,0,TAU);g.fill();g.restore()}
 g.restore()}}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(FD)FD.ku=null;return r}}
