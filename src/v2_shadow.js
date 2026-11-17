/* =====================================================================
   特別なキャラ「シャドー」（プレゼントコード限定・★5）
   ・設定：無限の塔を建てた時代のマイスターのひとり（始原の陣に残った記憶が形になった）。銀色の狼。ヘッドホンで雑音を消し、ひびや錆の音だけを聞き分ける打音検査の名人（保全）。
     赤いソファにふんぞり返る王様気質。一人称「俺様」
   ・技「爪撃と爆音」：近くの敵を爪で引っかく（体を使う攻撃）＋ときどきヘッドホンから爆音の音波
   ・ガチャ・図鑑には出ない（SECRET_CH）。武器は「銀狼のヘッドホン」（工具ではない）
   ===================================================================== */
SECRET_CH.push('shadow');
CHARS.shadow={name:'シャドー',img:'img/shadow.webp',job:'hozen',pass:{n:'銀狼の耳',d:'',k:''},sp:{n:'',d:'',shape:'yami'},art:'img/shadow.webp',secret:true,
 lines:['ふん、この俺様の耳に聞こえぬ音はない。……錆のきしむ音がうるさくて眠れん。片づけに行くぞ。']};
TYPE_IC['格闘']='w_shadow';
ATK.shadow={n:'爪撃と爆音',type:'格闘',ic:'bite',d:['近くの敵を爪で引っかく。ときどきヘッドホンから爆音の音波を出し、まわりを吹き飛ばす','引っかく相手が増える','威力アップ','引っかく速さと爆音の間隔が短くなる','爆音が広がり、もう一度こだまする']};
ABD.bossDmg=v=>`ボスに与えるダメージ+${Math.round(v*100)}%`;
ABIL.shadow=ab4(['teamAtk',.08],['cut',.08],['xp',.08],['bossDmg',.15]);
WNAME.shadow='ヘッドホン';BASEW.shadow='銀狼のヘッドホン';
function shadowAttack(f){const D=FD,A=D.atk;if(!A.shadow)return;const V=D.sd||(D.sd={cl:[],rg:[],echo:0}),L=A.shadow,c=D.cd;
 const pw=fPow('shadow');
 /* 爪 */
 c.shadow=(c.shadow||0)-f;
 if(c.shadow<=0){const n=1+(L>=2?1:0)+(L>=5?1:0),dmg=14*(L>=3?1.4:1)*pw,ts=nearestFoes(n,D.x,D.y,110);
  for(const t of ts){const a=Math.atan2(t.y-D.y,t.x-D.x);fDamage(t,dmg,Math.cos(a)*2,Math.sin(a)*2);V.cl.push({x:t.x,y:t.y,a,t:0})}
  if(ts.length)tone(300,.05,'square',.035,140);c.shadow=(ts.length?(L>=4?24:34):8)*fCd()}
 /* 爆音 */
 c.shadowB=(c.shadowB==null?60:c.shadowB)-f;
 const boom=()=>{V.rg.push({r:10,R:L>=5?190:L>=3?150:125,dmg:20*(L>=3?1.4:1)*pw,hit:new Set()});tone(110,.25,'sawtooth',.06,55)};
 if(c.shadowB<=0){boom();if(L>=5)V.echo=30;c.shadowB=(L>=4?170:240)*fCd()}
 if(V.echo>0){V.echo-=f;if(V.echo<=0)boom()}
 for(const r of V.rg){r.r+=7*f;
  for(const e of D.foes){if(e.hp<=0||r.hit.has(e.id))continue;const d=Math.hypot(e.x-D.x,e.y-D.y);if(d<r.r+e.r&&d>r.r-30){r.hit.add(e.id);const a=Math.atan2(e.y-D.y,e.x-D.x);fDamage(e,r.dmg,Math.cos(a)*6,Math.sin(a)*6)}}}
 V.rg=V.rg.filter(r=>r.r<r.R);V.cl.forEach(s=>s.t+=f);V.cl=V.cl.filter(s=>s.t<12)}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);shadowAttack(f)}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.sd;if(!V)return;g.save();
 for(const r of V.rg){const k=1-r.r/r.R;g.globalAlpha=.85*k;g.lineWidth=6;g.strokeStyle='#ff3a4a';g.shadowColor='#ff2030';g.shadowBlur=14;
  g.beginPath();g.arc(D.x,D.y-10,r.r,0,TAU);g.stroke();g.lineWidth=2;g.strokeStyle='#ffd0d4';g.beginPath();g.arc(D.x,D.y-10,Math.max(1,r.r-12),0,TAU);g.stroke()}
 g.shadowBlur=0;
 for(const s of V.cl){const k=1-s.t/12;g.save();g.translate(s.x,s.y);g.rotate(s.a+Math.PI/2);g.globalAlpha=k;g.strokeStyle='#f4f4ff';g.lineWidth=3;g.lineCap='round';
  for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(i*7-6,-16);g.lineTo(i*7+6,16);g.stroke()}
  g.strokeStyle='#ff4a5a';g.lineWidth=1.5;for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(i*7-5,-14);g.lineTo(i*7+5,14);g.stroke()}g.restore()}
 g.restore()}}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(FD){FD.sd=null;if(FD.cd)FD.cd.shadowB=null}return r}}
/* ボスへのダメージアップ */
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(e&&e.boss&&FD&&FD.ab&&FD.ab.bossDmg)d*=1+FD.ab.bossDmg;return _fd(e,d,kx,ky)}}
