/* =====================================================================
   ガチャ vol.3 の仲間10人（第3章「創技の塔」とともに登場）＝ ② 仲間とガチャ
   ・工具を武器にしない。バイク・燕の翼・メス・盾・杖・鎖・拳・短刀・狐火・放電で戦う
   ・V3_OPEN が false の間は、ガチャ・図鑑・図面に出さない（いまは ?sougi のテスト版だけ）
   ・創技の塔では、階で出会った仲間が「お助け」として一緒に戦う
   ===================================================================== */
var V3_OPEN=S_LIVE;
Object.assign(CHARS.raika,    {pass:{n:'黒閃',d:'',k:''}});
Object.assign(CHARS.tsubasa,  {pass:{n:'三日目の朝',d:'',k:''}});
Object.assign(CHARS.shiranagi,{pass:{n:'執刀医',d:'',k:''}});
Object.assign(CHARS.safegear, {pass:{n:'指差し確認',d:'',k:''}});
Object.assign(CHARS.gennou,   {pass:{n:'千年の手',d:'',k:''}});
Object.assign(CHARS.raiga,    {pass:{n:'焼き入れ',d:'',k:''}});
Object.assign(CHARS.kuromio,  {pass:{n:'影鏡',d:'',k:''}});
Object.assign(CHARS.shion,    {pass:{n:'狐火',d:'',k:''}});
Object.assign(CHARS.pukari,   {pass:{n:'深雷',d:'',k:''}});
Object.assign(CHARS.sakamata, {pass:{n:'鯱王',d:'',k:''}});
Object.assign(TYPE_IC,{'突進':'w_raika','ブーメラン':'w_tsubasa','斬撃':'w_shiranagi','停止':'w_safegear','引力':'w_gennou','焼き':'w_raiga','鏡写し':'w_kuromio','軌跡':'w_shion','間合い':'w_pukari','投げ':'w_sakamata'});
Object.assign(ATK,{
 raika:    {n:'黒閃ライド',   type:'突進',     ic:'pen',d:['バイクで前へ走りぬけ、ひいた敵を吹き飛ばす。走った跡に黒い稲妻が残る','跡が長く残る','威力アップ','間隔が短くなる','2台で走る（左右に分かれる）']},
 tsubasa:  {n:'燕返し',       type:'ブーメラン',ic:'pen',d:['燕の翼を投げる。前へ飛んでから戻ってきて、行きと帰りの2回当たる','2つ投げる','威力アップ','投げる間隔が短くなる','遠くまで飛び、大きくなる']},
 shiranagi:{n:'雷のメス',     type:'斬撃',     ic:'pen',d:['電気のメスで、前方の敵を細い線でまっすぐ切りさく（左右交互）','威力アップ','線が長くなる','切る間隔が短くなる','2本同時に切る']},
 safegear: {n:'指差し停止',   type:'停止',     ic:'pen',d:['いちばん近づいてきた敵を指差し、青い光で2秒止める','2体を同時に止める','止める時間がのびる','間隔が短くなる','止めた敵が受けるダメージ+30%']},
 gennou:   {n:'星霜の渦',     type:'引力',     ic:'pen',d:['紫の渦で、まわりの敵を1か所へ引き寄せて削る','渦が大きくなる','威力アップ','間隔が短くなる','渦が長く続く']},
 raiga:    {n:'雷鎚の焼入れ', type:'焼き',     ic:'pen',d:['拳で地面をたたき、焼けた円で敵を焼く。最後に冷やしの湯気で敵を押し出す','円が大きくなる','威力アップ','間隔が短くなる','湯気の威力2倍・範囲が広がる']},
 kuromio:  {n:'影鏡の刃',     type:'鏡写し',   ic:'pen',d:['短刀を前へ投げ、反対側にも影の刃が鏡写しに飛ぶ','威力アップ','つらぬく数が増える','投げる間隔が短くなる','左右にも鏡写し（4方向）']},
 shion:    {n:'狐火の切り絵', type:'軌跡',     ic:'pen',d:['狐火の光が、狐の顔の形をえがいて自分のまわりを走る。光にふれた敵を切る','形が大きくなる','威力アップ','光が速く走る','光が2つになる']},
 pukari:   {n:'深雷の間合い', type:'間合い',   ic:'pen',d:['自分から少しはなれた輪の上だけに放電する。ちょうどいい距離の敵を削り続ける','輪の幅が広がる','威力アップ','放電が速くなる','輪が2重になる']},
 sakamata: {n:'鯱王チェーン', type:'投げ',     ic:'pen',d:['鎖で強い敵を引っかけ、ほかの敵の上へ投げつける。落ちた場所のまわりにもダメージ','威力アップ','落ちた場所の範囲が広がる','間隔が短くなる','2体続けて投げる']}});
Object.assign(ABIL,{
 raika:    ab4(['wspd',.05],['teamAtk',.05],['wspd',.08],['teamAtk',.1]),
 tsubasa:  ab4(['regen',1],['xp',.05],['hp',10],['teamAtk',.08]),
 shiranagi:ab4(['teamAtk',.05],['healUp',.2],['teamAtk',.05],['teamAtk',.1]),
 safegear: ab4(['cut',.05],['hp',15],['eslow',.05],['cut',.1]),
 gennou:   ab4(['xp',.05],['pick',.1],['xp',.1],['teamAtk',.08]),
 raiga:    ab4(['hp',10],['teamAtk',.05],['cut',.05],['teamAtk',.12]),
 kuromio:  ab4(['teamAtk',.05],['xp',.05],['teamAtk',.05],['teamAtk',.1]),
 shion:    ab4(['pick',.1],['teamAtk',.05],['xp',.05],['teamAtk',.1]),
 pukari:   ab4(['regen',1],['cut',.05],['hp',10],['flat',4]),
 sakamata: ab4(['hp',15],['teamAtk',.05],['cut',.08],['teamAtk',.1])});

/* ---------- 専用武器（見習い → 段階2〜4）。図面は創技の塔で見つかる ---------- */
Object.assign(WNAME,{raika:'グローブ',tsubasa:'燕翼',shiranagi:'ガントレット',safegear:'盾',gennou:'杖',raiga:'ナックル',kuromio:'短刀',shion:'鈴',pukari:'宝玉',sakamata:'鎖'});
Object.assign(BASEW,{raika:'黒革のグローブ',tsubasa:'紺の燕翼',shiranagi:'白雷のガントレット',safegear:'安全の盾',gennou:'古木の杖',raiga:'鉄のナックル',kuromio:'影の短刀',shion:'狐火の鈴',pukari:'クラゲの宝玉',sakamata:'牙の鎖'});
{const M2={titan:3,scrap:2},M3={cell:2,titan:2,core:1},M4={carbon:3,cell:2,core:2};
 const W=[ // [id, 名前2,3,4, 加工2,3,4, 図面のエリア2,3,4, 形]
  ['raika',    '黒閃のグローブ','稲妻のグローブ','黒雷の騎手グローブ',['cut'],['cut','weld'],['weld','hit'],   's1','s3','s5','yami'],
  ['tsubasa',  '疾風の燕翼','双燕の翼','燕王の翼',                ['cut'],['cut','trace'],['cut','wire'], 's1','s3','s5','me'],
  ['shiranagi','診雷のガントレット','蒼雷のガントレット','無影のガントレット',['hit'],['hit','wire'],['hit','weld'],'s2','s3','s6','de'],
  ['safegear', '確認の盾','鉄壁の盾','不動の守護盾',              ['hit'],['hit','drill'],['hit','weld'], 's2','s3','s6','me'],
  ['gennou',   '星霜の杖','千年の杖','創世の宝杖',                ['lathe'],['lathe','trace'],['lathe','wire'],'s3','s4','s7','hikari'],
  ['raiga',    '雷鎚のナックル','紅鋼のナックル','雷牙の鋼拳',    ['hit'],['hit','weld'],['hit','drill'], 's5','s6','s7','ch'],
  ['kuromio',  '影鏡の短刀','黒鏡の短刀','無影の双刃',            ['cut'],['cut','lathe'],['cut','trace'],'s5','s6','s7','ma'],
  ['shion',    '紫焔の鈴','九尾の鈴','狐火の大鈴',                ['lathe'],['lathe','wire'],['lathe','trace'],'s5','s6','s8','yami'],
  ['pukari',   '深雷の宝玉','蒼海の宝玉','海神の宝玉',            ['drill'],['drill','wire'],['drill','tap'],'s5','s6','s8','de'],
  ['sakamata', '鯱牙の鎖','鯱王の鎖','大海の錨鎖',                ['weld'],['weld','hit'],['weld','cut'], 's5','s7','s8','ch']];
 W.forEach(([id,n2,n3,n4,p2,p3,p4,a2,a3,a4,sh])=>{[[2,n2,p2,a2,M2],[3,n3,p3,a3,M3],[4,n4,p4,a4,M4]].forEach(([t,n,ps,area,mats])=>{const k='v3_'+id+t;
  RECIPES[k]={n,kind:'weapon',who:id,tier:t,vol:3,mats:{...mats},area,shape:sh,proc:ps[0],procs:ps.length>1?ps:undefined,tools:[...new Set(ps.flatMap(p=>PROC_MAIN[p]))]};if(!RECIPES[k].procs)delete RECIPES[k].procs;RECIPE_ORDER.push(k)})})}

/* ---------- ガチャ vol.3 ---------- */
const GACHA_POOL3=[...VOL3];
GACHA_BANNERS[2]=V3_OPEN?{id:'v3',vol:3,n:'創技のなかまガチャ',img:'img/gacha-v3.webp',pool:GACHA_POOL3}:{id:'v3',vol:3,n:'近日登場',soon:true};

/* ---------- 絆覚醒 5組 ---------- */
EVO.push(['raika','tsubasa','黒燕疾走','黒い稲妻の跡の上を燕が通ると、雷をまとって速く飛び、威力2倍'],
 ['shiranagi','safegear','無影の執刀','セーフ・ギアが止めた敵へ、雷のメスがすぐ飛んで威力2倍で切る'],
 ['gennou','sakamata','千年錨','渦が出ているあいだ、鎖が錨になって渦のまん中へ落ち、集めた敵全部に威力2倍'],
 ['raiga','kuromio','紅影双刃','短刀が焼けた円を通ると焼けた刃になり、威力2倍で敵をつらぬいて進む'],
 ['shion','pukari','狐雷花火','狐火の光が放電の輪と交わった場所で、花火のようにはじけて威力2倍']);
Object.assign(EVO_IC,{raika:'u_evo',shiranagi:'u_evo',gennou:'u_evo',raiga:'u_evo',shion:'u_evo'});
Object.assign(BOND_CHAT,{raika:'c_b_raika',shiranagi:'c_b_shiranagi',gennou:'c_b_gennou',raiga:'c_b_raiga',shion:'c_b_shion'});

/* ===================== 技の動き ===================== */
/* 狐の顔の形（-1〜1）。耳→あご→耳と一周する */
const FOX_PATH=[[-1,-.2],[-.72,-1],[-.32,-.45],[.32,-.45],[.72,-1],[1,-.2],[.55,.5],[0,.92],[-.55,.5]];
const FOX_LEN=(()=>{const L=[0];for(let i=0;i<FOX_PATH.length;i++){const a=FOX_PATH[i],b=FOX_PATH[(i+1)%FOX_PATH.length];L.push(L[i]+Math.hypot(b[0]-a[0],b[1]-a[1]))}return L})();
function foxPt(u,R){const T=FOX_LEN[FOX_LEN.length-1],s=((u%1)+1)%1*T;let i=0;while(i<FOX_PATH.length-1&&FOX_LEN[i+1]<s)i++;
 const a=FOX_PATH[i],b=FOX_PATH[(i+1)%FOX_PATH.length],k=(s-FOX_LEN[i])/((FOX_LEN[i+1]-FOX_LEN[i])||1);return[(a[0]+(b[0]-a[0])*k)*R,(a[1]+(b[1]-a[1])*k)*R]}
function segD2(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1;let t=((px-x1)*dx+(py-y1)*dy)/l;t=Math.max(0,Math.min(1,t));const x=x1+dx*t,y=y1+dy*t;return(px-x)**2+(py-y)**2}
function v3Slash(V,x,y,a,len,dmg){const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;
 for(const e of FD.foes)if(segD2(e.x,e.y,x,y,x2,y2)<(e.r+9)**2)fDamage(e,dmg,Math.cos(a)*4,Math.sin(a)*4);
 V.fx.push({k:'slash',x,y,x2,y2,t:0,life:10});tone(1800,.04,'sawtooth',.025,2600)}
function v3Attacks(f){const D=FD,A=D.atk,c=D.cd,cm=fCd(),E=D.evo||{};
 D.v3=D.v3||{rides:[],trail:[],booms:[],vort:[],throws:[],hot:[],blades:[],fx:[],side:1,fp:0,fhit:{},pt:0,tt:0,fw:0,fpos:[],ftrail:[]};const V=D.v3;
 /* ライカ：黒閃ライド */
 if(A.raika){c.raika=(c.raika||0)-f;if(c.raika<=0){const L=A.raika,a=v2Dir(320),dmg=26*(L>=3?1.4:1)*fPow('raika'),n=L>=5?2:1;
   for(let i=0;i<n;i++)V.rides.push({x:D.x,y:D.y,a:a+(n>1?(i?.35:-.35):0),t:0,life:26,dmg,hit:[]});tone(160,.2,'sawtooth',.05,80);c.raika=(L>=4?110:150)*cm}}
 for(const r of V.rides){r.t+=f;r.x+=Math.cos(r.a)*12*f;r.y+=Math.sin(r.a)*12*f;if(Math.floor(r.t/2)!==Math.floor((r.t-f)/2))V.trail.push({x:r.x,y:r.y,t:0,life:(A.raika>=2?150:90)});
  for(const e of D.foes){if(r.hit.includes(e.id))continue;if((e.x-r.x)**2+(e.y-r.y)**2<(e.r+22)**2){fDamage(e,r.dmg,Math.cos(r.a)*14,Math.sin(r.a)*14);r.hit.push(e.id)}}}
 V.rides=V.rides.filter(r=>r.t<r.life);
 V.tt+=f;if(V.tt>=20){V.tt=0;if(V.trail.length){const td=3*fPow('raika');for(const e of D.foes)if(V.trail.some(p=>(e.x-p.x)**2+(e.y-p.y)**2<(e.r+14)**2))fDamage(e,td,0,0)}}
 for(const p of V.trail)p.t+=f;V.trail=V.trail.filter(p=>p.t<p.life);if(V.trail.length>140)V.trail.splice(0,V.trail.length-140);
 /* つばさ：燕返し */
 if(A.tsubasa){c.tsubasa=(c.tsubasa||0)-f;if(c.tsubasa<=0){const L=A.tsubasa,n=L>=2?2:1,Rg=L>=5?300:220,a=v2Dir(Rg),dmg=12*(L>=3?1.4:1)*fPow('tsubasa');
   for(let i=0;i<n;i++)V.booms.push({x:D.x,y:D.y-10,a:a+(n>1?(i?.3:-.3):0),d:0,max:Rg,back:false,dmg,hit:[],boost:0,rot:0,big:L>=5});tone(1200,.05,'triangle',.03,700);c.tsubasa=(L>=4?50:70)*cm}}
 for(const b of V.booms){const sp=(b.boost?1.6:1)*7*f;b.rot+=.4*f;
  if(!b.back){b.x+=Math.cos(b.a)*sp;b.y+=Math.sin(b.a)*sp;b.d+=sp;if(b.d>=b.max){b.back=true;b.hit=[]}}
  else{const dx=D.x-b.x,dy=D.y-10-b.y,d=Math.hypot(dx,dy)||1;b.x+=dx/d*Math.min(d,sp);b.y+=dy/d*Math.min(d,sp);if(d<18)b.done=1}
  /* 黒燕疾走：稲妻の跡にふれると雷をまとう */
  if(E.raika&&!b.boost&&V.trail.some(p=>(p.x-b.x)**2+(p.y-b.y)**2<26*26)){b.boost=1;V.fx.push({k:'zap',x:b.x,y:b.y,t:0,life:12});tone(1500,.05,'square',.03,900)}
  const R=b.big?24:16;for(const e of D.foes){if(b.hit.includes(e.id))continue;if((e.x-b.x)**2+(e.y-b.y)**2<(e.r+R)**2){fDamage(e,b.dmg*(b.boost?2:1),Math.cos(b.a)*3,Math.sin(b.a)*3);b.hit.push(e.id)}}}
 V.booms=V.booms.filter(b=>!b.done&&b.d<b.max*4);
 /* シラナギ：雷のメス */
 if(A.shiranagi){c.shiranagi=(c.shiranagi||0)-f;if(c.shiranagi<=0){const L=A.shiranagi,len=L>=3?260:180,dmg=14*(L>=2?1.4:1)*fPow('shiranagi'),t=nearestFoes(1,D.x,D.y,len)[0];
   if(t){const a=Math.atan2(t.y-D.y,t.x-D.x);V.side=-V.side;v3Slash(V,D.x,D.y-10,a+V.side*.18,len,dmg);if(L>=5)v3Slash(V,D.x,D.y-10,a-V.side*.18,len,dmg)}
   c.shiranagi=(L>=4?32:45)*cm}}
 /* セーフ・ギア：指差し停止 */
 if(A.safegear){c.safegear=(c.safegear||0)-f;if(c.safegear<=0){const L=A.safegear,n=L>=2?2:1,dur=L>=3?150:120;
   const cand=nearestFoes(10,D.x,D.y,260).filter(e=>!(e.stop>0)).sort((a,b)=>(a.boss?1:0)-(b.boss?1:0)).slice(0,n);
   cand.forEach(e=>{e.stop=e.boss?40:dur;fDamage(e,4*fPow('safegear'),0,0);V.fx.push({k:'beam',x:D.x,y:D.y-14,x2:e.x,y2:e.y,t:0,life:14});
    /* 無影の執刀：止めた敵へメスが飛ぶ */
    if(E.shiranagi&&A.shiranagi){const a=Math.atan2(e.y-D.y,e.x-D.x),d=Math.hypot(e.x-D.x,e.y-D.y);v3Slash(V,D.x,D.y-10,a,d+30,28*(A.shiranagi>=2?1.4:1)*fPow('shiranagi'))}});
   if(cand.length)tone(880,.08,'sine',.04,1320);c.safegear=(L>=4?110:150)*cm}}
 /* ゲンノウ：星霜の渦 */
 if(A.gennou){c.gennou=(c.gennou||0)-f;if(c.gennou<=0){const L=A.gennou,t=nearestFoes(1,D.x,D.y,260)[0];
   if(t)V.vort.push({x:t.x,y:t.y,R:L>=2?140:110,t:0,life:L>=5?240:150,dmg:5*(L>=3?1.4:1)*fPow('gennou'),tt:0});tone(220,.3,'sine',.04,110);c.gennou=(L>=4?180:240)*cm}}
 for(const v of V.vort){v.t+=f;v.tt+=f;const tick=v.tt>=20;if(tick)v.tt=0;
  for(const e of D.foes){const dx=v.x-e.x,dy=v.y-e.y,d=Math.hypot(dx,dy);if(d>v.R+e.r)continue;if(!e.boss&&d>8){const p=Math.min(d,(e.big?.6:1.5)*f);e.x+=dx/d*p;e.y+=dy/d*p}if(tick)fDamage(e,v.dmg,0,0)}}
 V.vort=V.vort.filter(v=>v.t<v.life);
 /* サカマタ：鯱王チェーン（渦があれば千年錨） */
 if(A.sakamata){c.sakamata=(c.sakamata||0)-f;if(c.sakamata<=0){const L=A.sakamata,dmg=30*(L>=2?1.4:1)*fPow('sakamata'),Rl=L>=3?95:70;
   if(E.gennou&&V.vort.length){const v=V.vort[V.vort.length-1];V.fx.push({k:'anchor',x:v.x,y:v.y,r:v.R,t:0,life:24});D.shake=Math.max(D.shake||0,9);tone(70,.35,'square',.08,40);
    for(const e of D.foes)if((e.x-v.x)**2+(e.y-v.y)**2<(v.R+e.r)**2)fDamage(e,dmg*2,0,0)}
   else{const cand=nearestFoes(20,D.x,D.y,260),used=[];for(let k=0;k<(L>=5?2:1);k++){const t=cand.filter(e=>!e.boss&&!used.includes(e)&&!e.thrown).sort((a,b)=>b.hp-a.hp)[0]||(k===0?cand.find(e=>e.boss):null);if(!t)break;used.push(t);
     V.fx.push({k:'chain',x:D.x,y:D.y-10,x2:t.x,y2:t.y,t:0,life:12});
     if(t.boss){fDamage(t,dmg,0,0);continue}
     const o=cand.filter(e=>e!==t&&(e.x-t.x)**2+(e.y-t.y)**2>60*60)[0];const a=Math.atan2(t.y-D.y,t.x-D.x),x1=o?o.x:t.x+Math.cos(a)*120,y1=o?o.y:t.y+Math.sin(a)*120;
     t.thrown=1;V.throws.push({e:t,x0:t.x,y0:t.y,x1,y1,t:0,life:20,dmg,R:Rl})}tone(300,.12,'sawtooth',.05,150)}
   c.sakamata=(L>=4?120:160)*cm}}
 for(const th of V.throws){th.t+=f;const k=Math.min(1,th.t/th.life),e=th.e;if(e.hp>0){e.x=th.x0+(th.x1-th.x0)*k;e.y=th.y0+(th.y1-th.y0)*k-Math.sin(k*Math.PI)*60}
  if(k>=1&&!th.done){th.done=1;e.thrown=0;fDamage(e,th.dmg,0,0);V.fx.push({k:'land',x:th.x1,y:th.y1,r:th.R,t:0,life:16});D.shake=Math.max(D.shake||0,5);tone(90,.15,'square',.06,50);
   for(const o of D.foes)if(o!==e&&(o.x-th.x1)**2+(o.y-th.y1)**2<(th.R+o.r)**2)fDamage(o,th.dmg*.8,(o.x-th.x1)*.1,(o.y-th.y1)*.1)}}
 V.throws=V.throws.filter(th=>!th.done);
 /* 雷牙：雷鎚の焼入れ */
 if(A.raiga){c.raiga=(c.raiga||0)-f;if(c.raiga<=0){const L=A.raiga;V.hot.push({x:D.x,y:D.y+6,R:L>=2?100:80,t:0,life:120,dmg:5*(L>=3?1.4:1)*fPow('raiga'),tt:0,steam:L>=5?2:1});
   D.shake=Math.max(D.shake||0,5);tone(120,.15,'square',.06,60);c.raiga=(L>=4?150:200)*cm}}
 for(const h of V.hot){h.t+=f;h.tt+=f;if(h.tt>=15){h.tt=0;for(const e of D.foes)if((e.x-h.x)**2+(e.y-h.y)**2<(h.R+e.r*.5)**2)fDamage(e,h.dmg,0,0)}
  if(h.t>=h.life&&!h.done){h.done=1;const R=h.R*(h.steam>1?1.6:1.25),dmg=20*h.steam*(A.raiga>=3?1.4:1)*fPow('raiga');V.fx.push({k:'steam',x:h.x,y:h.y,r:R,t:0,life:20});tone(400,.25,'sine',.04,1200);
   for(const e of D.foes){const d=Math.hypot(e.x-h.x,e.y-h.y);if(d<R+e.r)fDamage(e,dmg,(e.x-h.x)/(d||1)*18,(e.y-h.y)/(d||1)*18)}}}
 V.hot=V.hot.filter(h=>!h.done);
 /* クロミオ：影鏡の刃（焼けた円を通ると紅影双刃） */
 if(A.kuromio){c.kuromio=(c.kuromio||0)-f;if(c.kuromio<=0){const L=A.kuromio,t=nearestFoes(1,D.x,D.y,380)[0],a=t?Math.atan2(t.y-D.y,t.x-D.x):(D.mva!=null?D.mva:Math.PI/2);
   const dirs=[a,a+Math.PI].concat(L>=5?[a+Math.PI/2,a-Math.PI/2]:[]),dmg=11*(L>=2?1.4:1)*fPow('kuromio');
   dirs.forEach((d,i)=>V.blades.push({x:D.x,y:D.y-10,vx:Math.cos(d)*9,vy:Math.sin(d)*9,life:55,dmg,pierce:L>=3?4:2,hit:[],hot:0,shadow:i>0}));tone(1400,.04,'triangle',.03,2000);c.kuromio=(L>=4?36:50)*cm}}
 for(const b of V.blades){b.x+=b.vx*f;b.y+=b.vy*f;b.life-=f;
  if(E.raiga&&!b.hot&&V.hot.some(h=>(b.x-h.x)**2+(b.y-h.y)**2<h.R*h.R)){b.hot=1;b.dmg*=2;b.pierce=99}
  for(const e of D.foes){if(e.hp<=0||b.hit.includes(e.id))continue;if((e.x-b.x)**2+(e.y-b.y)**2<(e.r+9)**2){fDamage(e,b.dmg,b.vx*.5,b.vy*.5);b.hit.push(e.id);if(b.hit.length>=b.pierce){b.life=0;break}}}}
 V.blades=V.blades.filter(b=>b.life>0);
 /* シオン：狐火の切り絵 */
 V.fpos=[];if(A.shion){const L=A.shion,R=L>=2?115:90,dmg=6*(L>=3?1.4:1)*fPow('shion');V.fp=(V.fp+f/(L>=4?90:120))%1;V.fR=R;
  for(const k in V.fhit){V.fhit[k]-=f;if(V.fhit[k]<=0)delete V.fhit[k]}
  [V.fp].concat(L>=5?[(V.fp+.5)%1]:[]).forEach(u=>{const[px,py]=foxPt(u,R),x=D.x+px,y=D.y-6+py;V.fpos.push([x,y]);V.ftrail.push({x,y,t:0});
   for(const e of D.foes){if(V.fhit[e.id]>0)continue;if((e.x-x)**2+(e.y-y)**2<(e.r+16)**2){fDamage(e,dmg,0,0);V.fhit[e.id]=20}}})}
 for(const p of V.ftrail)p.t+=f;V.ftrail=V.ftrail.filter(p=>p.t<26);
 /* ぷかり：深雷の間合い（狐火と交わると狐雷花火） */
 V.pkR=null;if(A.pukari){const L=A.pukari,w=L>=2?30:22,rings=[110].concat(L>=5?[170]:[]);V.pkR=rings;V.pkW=w;V.pt+=f;
  if(V.pt>=(L>=4?14:20)){V.pt=0;const dmg=4*(L>=3?1.4:1)*fPow('pukari');let z=0;
   for(const e of D.foes){const d=Math.hypot(e.x-D.x,e.y-D.y);if(rings.some(rr=>Math.abs(d-rr)<w+e.r*.5)){fDamage(e,dmg,0,0);if(z++<6)V.fx.push({k:'zap',x:e.x,y:e.y,t:0,life:8})}}}
  V.fw=(V.fw||0)-f;if(E.shion&&A.shion&&V.fw<=0){for(const[x,y]of V.fpos){const d=Math.hypot(x-D.x,y-D.y);if(rings.some(rr=>Math.abs(d-rr)<w)){V.fw=25;const dmg=12*2*(A.shion>=3?1.4:1)*fPow('shion');
    V.fx.push({k:'fire',x,y,r:60,t:0,life:20});tone(1000+Math.random()*600,.08,'triangle',.04,400);for(const e of D.foes)if((e.x-x)**2+(e.y-y)**2<(60+e.r)**2)fDamage(e,dmg,0,0);break}}}}
 for(const p of V.fx)p.t+=f;V.fx=V.fx.filter(p=>p.t<p.life)}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);if(FD&&FD.run)v3Attacks(f)}}
/* 止められた敵は動かない（ボスは少しだけ） */
{const _vs=v2Slow;v2Slow=function(){_vs();for(const e of FD.foes){if(e.stop>0){e.spd=e.boss?e.spd*.3:0;e.dsh=0;e.stop--}}}}
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(e&&e.stop>0&&FD&&FD.atk&&FD.atk.safegear>=5)d*=1.3;return _fd(e,d,kx,ky)}}
/* 階が変わったら片づける */
const v3Clear=()=>{if(FD&&FD.v3){const V=FD.v3;['rides','trail','booms','vort','throws','hot','blades','fx','ftrail'].forEach(k=>V[k]=[])}};
{const _s=startFloor;startFloor=function(fl){const r=_s.apply(this,arguments);v3Clear();return r}}
{const _a=fAdvance;fAdvance=async function(fl){v3Clear();return _a.apply(this,arguments)}}

/* ===================== 描く ===================== */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.v3;if(!V)return;const t=D.t;g.save();
 /* 焼けた円 */
 for(const h of V.hot){const k=h.t/h.life;g.globalAlpha=.25+.15*Math.sin(t*10);const gr=g.createRadialGradient(h.x,h.y,0,h.x,h.y,h.R);gr.addColorStop(0,'rgba(255,240,180,.9)');gr.addColorStop(.6,'rgba(255,120,30,.6)');gr.addColorStop(1,'rgba(255,60,0,0)');
  g.fillStyle=gr;g.beginPath();g.arc(h.x,h.y,h.R,0,TAU);g.fill();g.globalAlpha=.8*(1-k*.5);g.strokeStyle='#ff9a3a';g.lineWidth=3;g.beginPath();g.arc(h.x,h.y,h.R,0,TAU);g.stroke()}
 /* 渦 */
 for(const v of V.vort){const k=Math.min(1,v.t/20,(v.life-v.t)/20);g.globalAlpha=.55*k;g.strokeStyle='#b07aff';g.lineWidth=3;
  for(let i=0;i<4;i++){g.beginPath();for(let j=0;j<=24;j++){const a=t*3+i*Math.PI/2+j*.18,r=v.R*(1-j/26);const x=v.x+Math.cos(a)*r,y=v.y+Math.sin(a)*r*.7;j?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
  g.globalAlpha=.15*k;g.fillStyle='#7a4ad0';g.beginPath();g.ellipse(v.x,v.y,v.R,v.R*.7,0,0,TAU);g.fill()}
 /* 放電の輪 */
 if(V.pkR){for(const rr of V.pkR){g.globalAlpha=.35;g.strokeStyle='#8fd6ff';g.lineWidth=V.pkW*.6;g.setLineDash([6,10]);g.lineDashOffset=-t*40;g.beginPath();g.arc(D.x,D.y,rr,0,TAU);g.stroke();g.setLineDash([]);
  g.globalAlpha=.8;g.strokeStyle='#fff';g.lineWidth=1.5;for(let i=0;i<5;i++){const a=t*2+i*1.3+Math.random()*.2;g.beginPath();g.moveTo(D.x+Math.cos(a)*(rr-8),D.y+Math.sin(a)*(rr-8));g.lineTo(D.x+Math.cos(a+.05)*(rr+8),D.y+Math.sin(a+.05)*(rr+8));g.stroke()}}}
 /* 稲妻の跡 */
 for(const p of V.trail){const k=1-p.t/p.life;g.globalAlpha=.7*k;g.fillStyle='#2a1a3a';g.beginPath();g.arc(p.x,p.y,9,0,TAU);g.fill();g.globalAlpha=k;g.fillStyle='#d8c0ff';g.fillRect(p.x-1.5+Math.random()*3-1.5,p.y-5,3,10)}
 /* 狐火の軌跡 */
 for(const p of V.ftrail){const k=1-p.t/26;g.globalAlpha=.5*k;g.fillStyle='#c79bff';g.beginPath();g.arc(p.x,p.y,7*k+2,0,TAU);g.fill()}
 g.globalAlpha=1;for(const[x,y]of V.fpos){const gr=g.createRadialGradient(x,y,0,x,y,16);gr.addColorStop(0,'#fff');gr.addColorStop(.4,'#d4a8ff');gr.addColorStop(1,'rgba(160,90,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,16,0,TAU);g.fill()}
 /* バイク */
 for(const r of V.rides){const s=fspr(`img/walk/raika_${Math.cos(r.a)<0?'left':'right'}.webp`,48);g.globalAlpha=1;if(s){const h=44,w=h*s.width/s.height;g.drawImage(s,r.x-w/2,r.y-h/2-6,w,h)}else{g.fillStyle='#222';g.beginPath();g.arc(r.x,r.y,14,0,TAU);g.fill()}}
 /* 燕の翼 */
 const ws=fspr('img/ui/w_tsubasa.webp',40);for(const b of V.booms){const S=b.big?40:30;g.save();g.translate(b.x,b.y);if(b.boost){g.globalAlpha=.6;g.fillStyle='#fff27a';g.beginPath();g.arc(0,0,S*.7,0,TAU);g.fill()}g.globalAlpha=1;g.rotate(b.rot);
  if(ws)g.drawImage(ws,-S/2,-S/2,S,S);else{g.fillStyle='#24346a';g.fillRect(-10,-4,20,8)}g.restore()}
 /* 短刀 */
 for(const b of V.blades){g.save();g.translate(b.x,b.y);g.rotate(Math.atan2(b.vy,b.vx));g.globalAlpha=b.shadow&&!b.hot?.6:1;g.fillStyle=b.hot?'#ff8a2a':b.shadow?'#3a2a4a':'#1a1622';g.strokeStyle=b.hot?'#fff0a0':'#b8a8d8';g.lineWidth=1.5;
  g.beginPath();g.moveTo(12,0);g.lineTo(-6,-4);g.lineTo(-10,0);g.lineTo(-6,4);g.closePath();g.fill();g.stroke();g.restore()}
 /* 止められた敵 */
 g.globalAlpha=.85;g.strokeStyle='#6fd0ff';g.lineWidth=3;for(const e of D.foes)if(e.stop>0){g.beginPath();g.arc(e.x,e.y,e.r+6,0,TAU);g.stroke();g.beginPath();g.moveTo(e.x-6,e.y-e.r-14);g.lineTo(e.x+6,e.y-e.r-14);g.stroke()}
 /* 投げられている敵の鎖 */
 g.strokeStyle='#c8c8d0';g.lineWidth=2;g.setLineDash([5,4]);for(const th of V.throws){if(th.e.hp>0){g.globalAlpha=.6;g.beginPath();g.moveTo(D.x,D.y-10);g.lineTo(th.e.x,th.e.y);g.stroke()}}g.setLineDash([]);
 /* 一瞬の効果 */
 for(const p of V.fx){const k=p.t/p.life;
  if(p.k==='slash'){g.globalAlpha=1-k;g.strokeStyle='#bff0ff';g.lineWidth=5*(1-k)+1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x2,p.y2);g.stroke();g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke()}
  else if(p.k==='beam'){g.globalAlpha=1-k;g.strokeStyle='#4ab8ff';g.lineWidth=4;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x2,p.y2);g.stroke()}
  else if(p.k==='chain'){g.globalAlpha=1-k;g.strokeStyle='#e0e0e8';g.lineWidth=3;g.setLineDash([6,4]);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x2,p.y2);g.stroke();g.setLineDash([])}
  else if(p.k==='land'){g.globalAlpha=(1-k)*.6;g.fillStyle='#d0e8ff';g.beginPath();g.arc(p.x,p.y,p.r*(.4+.6*k),0,TAU);g.fill()}
  else if(p.k==='anchor'){const y=p.y-200*(1-Math.min(1,k*3));g.globalAlpha=1-Math.max(0,k-.5)*2;g.strokeStyle='#d8d0b0';g.lineWidth=7;g.beginPath();g.moveTo(p.x,y-60);g.lineTo(p.x,y+20);g.moveTo(p.x-28,y+6);g.quadraticCurveTo(p.x,y+40,p.x+28,y+6);g.stroke();
   if(k>.33){g.globalAlpha=(1-k)*.6;g.fillStyle='#b07aff';g.beginPath();g.arc(p.x,p.y,p.r*(k+.3),0,TAU);g.fill()}}
  else if(p.k==='steam'){g.globalAlpha=(1-k)*.6;g.fillStyle='#f4f4f4';for(let i=0;i<10;i++){const a=i/10*TAU;g.beginPath();g.arc(p.x+Math.cos(a)*p.r*k,p.y+Math.sin(a)*p.r*k,14+10*k,0,TAU);g.fill()}}
  else if(p.k==='zap'){g.globalAlpha=1-k;g.strokeStyle='#fff8a0';g.lineWidth=2;g.beginPath();g.moveTo(p.x-8,p.y-10);g.lineTo(p.x+2,p.y-2);g.lineTo(p.x-3,p.y+2);g.lineTo(p.x+8,p.y+10);g.stroke()}
  else if(p.k==='fire'){for(let i=0;i<12;i++){const a=i/12*TAU;g.globalAlpha=1-k;g.fillStyle=i%2?'#d4a8ff':'#8fd6ff';g.beginPath();g.arc(p.x+Math.cos(a)*p.r*k,p.y+Math.sin(a)*p.r*k,4,0,TAU);g.fill()}}}
 g.restore()}}

/* ===================== 創技の塔のお助け（出会った階で一緒に戦う） ===================== */
Object.assign(TW_TABLE.sougi.HELPER_FL,{1:'raika',2:'tsubasa',3:'tsubasa',4:'shiranagi',5:'safegear',6:'safegear',7:'gennou',8:'gennou',9:'gennou',
 11:'raiga',12:'kuromio',13:'kuromio',14:'shion',15:'pukari',16:'pukari',17:'sakamata',18:'sakamata',19:'sakamata'});
/* 出会いの会話は、お助けとして話しかけたときに流す（階に入ったときの会話からはずす） */
Object.entries({1:'raika',2:'tsubasa',4:'shiranagi',5:'safegear',7:'gennou',11:'raiga',12:'kuromio',14:'shion',15:'pukari',17:'sakamata'}).forEach(([fl,id])=>{JOIN_TALK[id]=S_MEET[fl];delete S_MEET[fl]});
Object.assign(HELPER_AGAIN,{raika:'また会ったわね。後ろ、乗ってく？',tsubasa:'あ、また会えた！ 今日も直して、飛ばすよ！',shiranagi:'また来たか。診る。……切る。',safegear:'再会ヲ確認。指差シ、ヨシ。',
 gennou:'ほっほ、また会うたのう。……前にも会うたかの？',raiga:'おう。焼きが要るなら言え。',kuromio:'……また、一緒に。',shion:'こんこん、また会えたね！',pukari:'ぴりぴり……また来た。',sakamata:'おう！ オレが来たからには最強だぜ！'});
/* ふりかえり：お助けとして出会った場面 */
{const _ss=storyScenes;storyScenes=function(){const S=_ss(),f=G.flags||{},seen={};Object.entries(TW_TABLE.sougi.HELPER_FL).forEach(([n,id])=>{if(seen[id])return;seen[id]=1;
  if(f['hp_'+id]&&JOIN_TALK[id])S.push({n:400+(+n)+.2,lb:'創'+n+'F',t:`${CHARS[id].name}と出会う`,run:()=>talk(JOIN_TALK[id])})});return S.sort((a,b)=>a.n-b.n)}}

/* ===================== チャット（絆5・補足10・後日談10） ===================== */
const NE3='ネロ',HY3='ハヤテ',KG3='クロガネ',SP3='スピノボーン',OK3='オカジュン';
{const RK='ライカ',TS='つばさ',SN='シラナギ',SG='セーフ・ギア',GN='ゲンノウ',RG='雷牙',KM='クロミオ',SH='シオン',PK='ぷかり',SK='サカマタ',N=t=>[null,'',t];
 CHATS.push(
  /* 絆のチャット（2人の武器がSランク以上で出る） */
  {id:'c_b_raika',t:'黒燕疾走',st:0,who:['raika','tsubasa'],L:[N('工房の前で、ライカがバイクのエンジンをかけた。ドゥン……ドゥ、ドゥン。'),['tsubasa',TS,'あれ？ 今の音、ちょっとぶれたよね！'],['raika:worry',RK,'……図面をもらったあとも、走るとときどき、こうなるのよ。'],
   ['tsubasa:serious',TS,'それ、振動でボルトがゆるんでる！ あたしの飛行機と同じ！ ちょっと貸して！'],N('つばさは、受け取ったばかりの「不動ハードロックナット」で、一本ずつしめ直していく。'),['raika',RK,'……静かになった。前より、速い。'],
   ['tsubasa:smile',TS,'「直しても三日で壊れる」は、もう終わり！ ……ねえ、ライカが走ったあと、あたしの燕、すっごく速く飛べる気がする！'],['raika:smile',RK,'じゃあ、追いかけてきなさい。置いてかないから。']]},
  {id:'c_b_shiranagi',t:'無影の執刀',st:0,who:['shiranagi','safegear'],L:[['safegear',SG,'以前、私ノ確認ヲスリヌケタ事故ガ一件アリマシタ。ヒトリノ確認ハ、イツカ見落トシマス。'],['shiranagi',SN,'診断も同じ。……ひとりの目は、いつか見落とす。'],
   ['shiranagi:serious',SN,'だから二人でやる。あなたが止める。私が切る。'],['safegear',SG,'確認、二重。……動カナイ相手ナラ、メスハ外レマセン。'],['shiranagi:smile',SN,'無影灯の下では、影はできない。……指差し、よし。'],['safegear:smile',SG,'指差シ、ヨシ。']]},
  {id:'c_b_gennou',t:'千年前の船',st:0,who:['gennou','sakamata'],L:[['sakamata',SK,'おい、じいさん！ この船の図面、オレのブロック工法とおんなじ考えじゃねぇか！'],N('保管庫の古い図面。そのすみに、かすれた字で「ゲンノウ」とあった。'),['gennou:worry',GN,'……わしが描いたのか。さっぱり覚えとらん。'],
   ['sakamata:worry',SK,'オレが最強の工法を編み出したと思ってたのによ……元はあんたかよ。'],['gennou:smile',GN,'わしは忘れても、おぬしの手が続きを覚えとった。それで十分じゃ。'],['sakamata:smile',SK,'……ちっ。じゃあ、オレがでっかくして返してやる！ じいさんの渦に、錨をぶちこんでな！']]},
  {id:'c_b_raiga',t:'焼いて、研ぐ',st:0,who:['raiga','kuromio'],L:[['raiga',RG,'オレの焼き入れは鉄を鋼にする。……だが、どうしても少しゆがむ。それだけが気に食わねぇ。'],['kuromio',KM,'……ゆがみは、わたしが消す。'],
   N('雷牙が焼いた刃を、クロミオが砥石で仕上げていく。やがて、影まで映る面になった。'),['raiga:smile',RG,'……こいつは、オレひとりじゃ出せねぇ顔だ。'],['kuromio:smile',KM,'……焼きがいいから、研げる。'],['kuromio',KM,'……あと、葉巻。煙で、砥石がくもる。'],['raiga:worry',RG,'お、おう……。']]},
  {id:'c_b_shion',t:'さわらずに、切る',st:0,who:['shion','pukari'],L:[['shion:smile',SH,'こんこん、ぷにぷに〜。'],['pukari:worry',PK,'ぴりっ！'],N('シオンのしっぽが、ぼさぼさにふくらんだ。'),['pukari',PK,'……だから、さわらないでって。'],
   ['shion',SH,'わたしの狐火もね、さわらないで鉄を切るの。……あれ？ いっしょだ。'],['pukari:smile',PK,'ぴりぴり……いっしょ。さわらないで、けずる。'],['shion:smile',SH,'じゃあ、いっしょにやったら、もっときれいかも！'],
   N('その夜、港の空に、紫の狐火と青い稲妻の花火が、いくつも咲いた。')]},
  /* 補足：ちがう章の仲間どうし（2人とも持っていて、創技の塔の10F／20Fクリアで出る） */
  {id:'c_x_candy',t:'飴の味',tw:'sougi',fl:10,st:7,who:['raika','nero'],L:[N('まだ創技の塔に来る前のこと。止まったバイクの横で、ライカが座りこんでいた。'),['nero',NE3,'ねえ、そのバイク動かないの？ はい、飴。あまいの食べたら、ちょっとはましになるよ〜。'],
   ['raika',RK,'……いらない。子どもじゃないんだから。'],['nero:smile',NE3,'じゃあ置いとくね。あたしの飴、ほしくなったらいつでも言って〜。'],N('ライカは、だまってひとつ口に入れた。'),['raika:worry',RK,'……甘すぎ。'],
   N('今。'),['nero',NE3,'まだそれ、くわえてるの？'],['raika',RK,'……走るとき、口がさびしいのよ。'],['nero:smile',NE3,'ふふ。じゃあ、今日のぶん。']]},
  {id:'c_x_check',t:'確認、確認',tw:'sougi',fl:10,st:7,who:['safegear','hayate'],L:[['wolf','ウルフ','オカジュン、もう一回腕相撲だ！ 今度の審判は……'],['hayate',HY3,'僕と、セーフ・ギアさんでやります。まず、ひじの位置を確認します。'],['safegear',SG,'ヒジノ位置、確認。指差シ、ヨシ。'],
   ['hayate',HY3,'次に、手の組み方を確認して……'],['safegear',SG,'手ノ組ミ方、確認。指差シ、ヨシ。机ノ強度モ、確認シマス。'],['wolf:worry','ウルフ','……二人になったら、倍かかってねぇか？'],['hayate:smile',HY3,'はい。確認が二重なので、安全も二倍です。あと五十四項目です。']]},
  {id:'c_x_ouchin',t:'ニャボの往診',tw:'sougi',fl:10,st:7,who:['shiranagi','kurogane'],L:[['kurogane',KG3,'先生、この子が動かないニャ……。'],['shiranagi:serious',SN,'診る。……呼吸、正常。駆動、正常。プログラムに「昼寝」。'],['kurogane:worry',KG3,'そ、それはオイラが書いたニャ……。'],
   ['shiranagi',SN,'異常なし。……診断名、「ねむい」。'],['kurogane:smile',KG3,'ニャハッ、先生、まじめに診てくれたニャ！'],['shiranagi:smile',SN,'どんな患者も、まじめに診る。……それが医者だ。']]},
  {id:'c_x_saikyo',t:'最強はどっちだ',tw:'sougi',fl:20,st:7,who:['sakamata','spino'],L:[['sakamata',SK,'オレが最強だっつってんだろ！'],['spino',SP3,'ガラガラ……一億年前の王者、オレさまが最強に決まってるだろ！'],['sakamata:serious',SK,'海じゃオレが最強だ！'],['spino:serious',SP3,'川じゃオレさまが最強だ！'],
   N('一時間後。'),['sakamata:worry',SK,'……はぁ、はぁ……つ、つかれた……。'],['spino:worry',SP3,'……ガラ……ガラ……。'],N('二人は工房の床に並んで、大の字で寝ていた。')]},
  {id:'c_x_kitsune',t:'きつねどうし',tw:'sougi',fl:20,st:7,who:['shion','fox'],L:[['fox','ギアフォックス','はい、シオン！ 出撃前の手順表、設計どおり！'],['shion:smile',SH,'こんこん、ありがと〜。'],N('しばらくして。'),['fox','ギアフォックス','……ねえ、手順表のすみに、狐の顔の落書きがあるんだけど。'],
   ['shion:smile',SH,'こんこん。手順、ひとつ足しといたの。「笑う」って。'],['fox','ギアフォックス','……もう。……でも、それ、いい手順かも。']]},
  {id:'c_x_kobushi',t:'拳の話',tw:'sougi',fl:20,st:7,who:['raiga','okajun'],L:[N('工房の外。雷牙とオカジュンが、向かい合って立っていた。'),['okajun',OK3,'……。'],['raiga',RG,'……。'],N('二人は、だまって拳を見せ合った。傷だらけの、ごつごつした拳だった。'),
   ['raiga:smile',RG,'……いい拳だ。'],['okajun:smile',OK3,'……あんたもな。'],['wolf:worry','ウルフ','……え、それだけ？ 何も話してねぇよな？'],['mouse','チュータ','男の会話は、むずかしいチュー……。']]},
  {id:'c_x_shiriai',t:'古い知り合い',tw:'sougi',fl:10,st:7,who:['gennou'],L:[['owl','ホー博士','ホッホッ。久しぶりじゃのう、ゲンノウ。'],['gennou',GN,'……はて。どちらさまじゃったかの。'],['owl','ホー博士','わしが若いころ、ずいぶん世話になった。図面の引き方を、一から教わったんじゃ。'],
   ['gennou:worry',GN,'……すまんのう。さっぱり思い出せん。'],['owl','ホー博士','ホッホッ、かまわん。わしが覚えておる。……それで十分じゃろう。'],['gennou:smile',GN,'……その笑い方、なんだか懐かしい気がするわい。']]},
  {id:'c_x_tenken',t:'三日目の点検',tw:'sougi',fl:10,st:7,who:['tsubasa'],L:[['tsubasa',TS,'直してから、今日で三日目！ 点検、手伝って！'],['mouse','チュータ','プログラムを読むチュー。……異常なし、チュー！'],['robot','メカロボ','ピ……ナットノ締メ具合、異常ナシ。ユガミノ線、検出ナシ。'],
   ['tsubasa:smile',TS,'やったー！ 三日たっても壊れてない！ プログラムとナット、両方そろってばっちり！'],['mouse','チュータ','中身と外側、両方大事だチュー。']]},
  {id:'c_x_kagetsuki',t:'影と月',tw:'sougi',fl:20,st:7,who:['kuromio','tsukiyo'],L:[N('夜の工房。クロミオは刃を研ぎ、その横で、ツキヨが窓から星を見ていた。'),N('……しゃっ、しゃっ。砥石の音だけが、静かにひびく。'),['tsukiyo','ツキヨ','……ふふ。'],['kuromio',KM,'……。'],
   N('二人は、何も話さなかった。'),N('研ぎ上がった刃に、月が映った。'),['kuromio:smile',KM,'……きれい。'],['tsukiyo','ツキヨ','ふふ。星も、そう言ってる。']]},
  {id:'c_x_fuwafuwa',t:'ふわふわ',tw:'sougi',fl:20,st:7,who:['pukari','dodo'],L:[['dodo','ドド先輩','ぷかりちゃん、ふわふわ浮いてて、いいね〜。'],['pukari',PK,'……ぷかぷか。'],['dodo','ドド先輩','ぼくも浮けたらな〜。'],['pukari',PK,'……ドド先輩は、ねころがるのが、じょうず。'],
   ['dodo','ドド先輩','えへへ〜。じゃあ、ぼくはここでねころがるね〜。'],N('その日の午後。日なたで、ドドがねころがり、その上で、ぷかりがぷかぷか浮いていた。')]},
  /* 後日談（前半の5人は10Fクリア、後半の5人は20Fクリアで出る） */
  {id:'c_s_raika',t:'相棒、再始動',tw:'sougi',fl:10,st:3,who:['raika'],L:[N('ドゥルルルン……！ 新しいエンジンを積んだバイクが、港町の通りを走りぬけた。'),['raika:smile',RK,'……走った。相棒が、走ってる。'],['tsubasa',TS,'ライカー！ 後ろ、乗せてー！'],
   ['raika',RK,'……しっかりつかまってなさい。'],N('二人を乗せたバイクは、港町をぐるりと一周した。')]},
  {id:'c_s_tsubasa',t:'三日目の朝',tw:'sougi',fl:10,st:3,who:['tsubasa'],L:[['tsubasa:smile',TS,'みんなー！ 聞いて聞いて！ 直してから三日目の朝なのに、飛行機、壊れてないの！'],['wolf','ウルフ','おお、よかったじゃねぇか。'],['tsubasa:smile',TS,'でしょ！ 博士にも、チュータにも、メカロボにも言ってくる！'],
   N('その日、つばさは工房じゅうを飛び回って、同じ話を十回した。')]},
  {id:'c_s_shiranagi',t:'診断名',tw:'sougi',fl:10,st:3,who:['shiranagi'],L:[N('シラナギが、オシロスコープの画面をじっと見ていた。波の形が、ときどき、ぐにゃりとゆがむ。'),['shiranagi:serious',SN,'これが、ゆがみの波形。……病名がついた。'],['shiranagi:smile',SN,'なら、治せる。'],
   N('シラナギはカルテに、無限の塔の線の形を、ていねいに書きとめた。'),['shiranagi',SN,'……根っこを診るには、もっと上が要る。いつか、必ず。']]},
  {id:'c_s_safegear',t:'仕組みに任せる',tw:'sougi',fl:10,st:3,who:['safegear'],L:[['safegear',SG,'事故ノ記録ヲ、読ミ返シマシタ。'],['robot','メカロボ','ピ……何カ、分カリマシタカ。'],['safegear',SG,'確認ヲ仕組ミニ任セルノハ、怠ケデハナイ。……人ガ、ホカノコトヲ見ルタメ。'],
   ['safegear:smile',SG,'鉄壁AEBSガ止メルアイダ、私ハ、人ノ顔ヲ見マス。指差シ、ヨシ。']]},
  {id:'c_s_gennou',t:'名前の数',tw:'sougi',fl:10,st:3,who:['gennou'],L:[N('ゲンノウは、保管庫の図面に残る自分の名前を、一枚ずつ数えていた。'),['gennou',GN,'……百二十、百二十一……。'],['gennou:worry',GN,'……もう、よいか。数えたところで、どうせ忘れる。'],
   ['gennou',GN,'じゃが……この中の一枚に、塔を建てた若者の図面があった気がするのう。'],['onmyo','オンミョウ','……塔を、建てた者？'],['gennou',GN,'はて。……どの塔じゃったか。']]},
  {id:'c_s_raiga',t:'オレの名前で',tw:'sougi',fl:20,st:7,who:['raiga'],L:[N('炉の前に、若い職人が立っていた。'),['raiga',RG,'弟子入り？ ……オレの焼き入れを、習いたいだと。'],N('若い職人は、深く頭を下げた。財布を、ぎゅっとにぎりしめている。'),
   ['raiga:smile',RG,'しまっとけ。だれでも使えるようにした技だ。教えるのに金はいらねぇ。'],['raiga',RG,'そのかわり、オレより上手くなれ。オレの名前は、それで残る。']]},
  {id:'c_s_kuromio',t:'映るもの',tw:'sougi',fl:20,st:7,who:['kuromio'],L:[N('クロミオは、磨き上げた鉄の面を、じっと見ていた。'),N('そこに映っていたのは、自分の顔だった。'),['kuromio',KM,'……いつも、刃の面ばかり見てた。'],
   N('クロミオは、映った自分に向かって、ほんの少しだけ、口のはしを上げてみた。'),['kuromio:smile',KM,'……へんな顔。'],['kuromio:smile',KM,'……でも、悪くない。']]},
  {id:'c_s_shion',t:'港の看板',tw:'sougi',fl:20,st:7,who:['shion'],L:[['shion:smile',SH,'こんこん、見て見て！'],N('シオンの狐火が、鉄の板を、すいすいと切っていく。'),N('できあがったのは、新しい港町の看板だった。「黄金の港町　発明の町」'),
   ['shion',SH,'さびた看板じゃ、だれも来たくないでしょ。'],N('看板がかかった次の日、港に、ひさしぶりに船が三そう、入ってきた。')]},
  {id:'c_s_pukari',t:'さわってもいい',tw:'sougi',fl:20,st:7,who:['pukari'],L:[['mouse','チュータ','ぷかりちゃん、ぷにぷにしてて、さわってみたいチュー……。'],['pukari:worry',PK,'……ぴりぴり。'],['mouse','チュータ','ご、ごめんチュー！'],
   ['pukari',PK,'……ちょっとなら。'],N('チュータは、そっと、ほんの少しだけさわった。ぴりっ、とはしなかった。'),['pukari:smile',PK,'……ぷにぷに。'],['mouse','チュータ','ぷにぷにだチュー！']]},
  {id:'c_s_sakamata',t:'進水式',tw:'sougi',fl:20,st:7,who:['sakamata'],L:[N('大ドックに、みんなで組み上げた大きな船が浮かんでいた。今日は、進水式だ。'),['sakamata:smile',SK,'見ろ！ 最強の船だ！'],N('船体には、大きな字で、名前が刻まれていた。ひとりではなく、全員の名前が。'),
   ['wolf','ウルフ','おまえの名前だけにしなくていいのか？'],['sakamata',SK,'へっ。最強の船だぞ。……オレひとりの名前じゃ、足りねぇ。']]});
}
VOL3.forEach(id=>{if(!ATK[id])console.warn('vol3 no atk',id)});
