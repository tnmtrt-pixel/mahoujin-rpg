/* =====================================================================
   特別なキャラ「フェアリー」（プレゼントコード限定・★5）
   ・設定：無限の塔を建てた時代のマイスターのひとり。始原の陣に残った記憶が、光の姿で現れた。おっとり、ていねい、少し不思議。一人称「わたし」
     昔のことは多くを語らない（2.0.15 で設定を合わせた）
   ・技「蝶の舞」：青い光の蝶が、ゆらゆら揺れながらまわりを飛ぶ
   ・ガチャ・図鑑には出ない（SECRET_CH）。武器は「星月の杖」（工具ではない）
   ===================================================================== */
SECRET_CH.push('fairy');
CHARS.fairy={name:'フェアリー',img:'img/fairy.webp',job:'hozen',pass:{n:'光の妖精',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},art:'img/fairy.webp',secret:true,
 lines:['こんにちは。ずっと昔のことを、少しだけ覚えているの。……蝶たちも、一緒に行きたいって。']};
TYPE_IC['蝶']='w_fairy';
ATK.fairy={n:'蝶の舞',type:'蝶',ic:'pen',d:['青い光の蝶が、ゆらゆらとまわりを飛ぶ。ふれた敵を削る','蝶が増える','威力アップ','蝶が増え、飛ぶ範囲が広がる','敵を倒すと蝶が光り、少し回復する']};
ABD.fveil=()=>'光のヴェール：体力が3割を切りそうなとき、1回だけ受けるダメージ−70%（階ごと）';
ABIL.fairy=ab4(['regen',1],['xp',.08],['cut',.08],['fveil',1]);
WNAME.fairy='杖';BASEW.fairy='星月の杖';
function fairyAttack(f){const D=FD,A=D.atk;if(!A.fairy)return;const V=D.fy||(D.fy={b:[]}),L=A.fairy;
 const n=3+(L>=2?1:0)+(L>=4?2:0),R=L>=4?110:80,dmg=6*(L>=3?1.4:1)*fPow('fairy');
 while(V.b.length<n)V.b.push({a:Math.random()*TAU,ph:Math.random()*TAU,sp:.025+Math.random()*.012,hit:{},x:D.x,y:D.y,glow:0});
 V.b.length=n;
 V.b.forEach((b,i)=>{b.a+=b.sp*f;b.ph+=.06*f;b.glow=Math.max(0,b.glow-f);const r=R*(.75+.25*Math.sin(b.ph*.7+i));
  b.x=D.x+Math.cos(b.a)*r+Math.sin(b.ph*1.3)*14;b.y=D.y-10+Math.sin(b.a)*r*.8+Math.cos(b.ph)*12;
  for(const k in b.hit){b.hit[k]-=f;if(b.hit[k]<=0)delete b.hit[k]}
  for(const e of D.foes){if(e.hp<=0||b.hit[e.id])continue;if((e.x-b.x)**2+(e.y-b.y)**2<(e.r+12)**2){const kill=e.hp<=dmg;fDamage(e,dmg,(e.x-D.x)*.02,(e.y-D.y)*.02);b.hit[e.id]=24;
    if(kill&&L>=5){b.glow=20;if(typeof v2Heal==='function'&&D.t-(V.lh||0)>.25){V.lh=D.t;v2Heal(1)}}}}})}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);fairyAttack(f)}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.fy;if(!V)return;const t=D.t;g.save();
 for(const b of V.b){const fl=Math.abs(Math.sin(t*14+b.ph)),w=9*(.35+.65*fl);g.save();g.translate(b.x,b.y);g.scale(1.5,1.5);
  g.shadowColor=b.glow?'#ffffff':'#5ab8ff';g.shadowBlur=b.glow?18:10;g.globalAlpha=.92;
  g.fillStyle=b.glow?'#e8f8ff':'#4aa8ff';
  [-1,1].forEach(s=>{g.beginPath();g.ellipse(s*w*.6,-3,w,7,s*.5,0,TAU);g.fill();g.beginPath();g.ellipse(s*w*.45,5,w*.7,5,-s*.4,0,TAU);g.fill()});
  g.fillStyle='#eaf6ff';g.beginPath();g.ellipse(0,0,1.8,6,0,0,TAU);g.fill();g.restore()}
 g.restore()}}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(FD){FD.fy=null;FD.veilUsed=false}return r}}
/* 光のヴェール */
{const _h=fHurt;fHurt=function(v,src){v=_h(v,src);const D=FD;if(D&&D.ab&&D.ab.fveil&&!D.veilUsed&&v>0&&D.hp-v<D.maxhp*.3){D.veilUsed=true;v*=.3;
 if(D.pops.length<90)D.pops.push({x:D.x,y:D.y-50,v:'光のヴェール',t:0,heal:1});tone(1046,.2,'sine',.05,1568)}return v}}
