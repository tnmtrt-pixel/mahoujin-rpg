/* =====================================================================
   無限の塔の試練（決定 11/20）：アウル・スコープを付けて、10階ごとの写しそこないに会うと試練になる
   ・ボスの近くをタップすると正体が見え、その間だけダメージが通る（20Fのアウルムと同じ）
   ・勝つと、ノイズがはがれて本当のマイスターの姿が現れ、「マイスターの図面」（段階6・陸）を授かる。解読は特許と同じスライドパズル
   ・クーラ＝ぷるぷるの鎧／タコナイン＝八本足の隊列ブーツ／フェアリー＝青い蝶の髪かざり／シャドー＝影音の手甲／ソウル＝青炎の杖
   ・V3_OPEN の間だけ
   ===================================================================== */
TIER_MUL[6]=4.2;KANJI_TIER[6]='陸';
const MT=V3_OPEN?[ // [ボス, レシピ, マイスター, 名前, 種類, 部位/技, 加工, 要る練度, 材料, 効果, ひとこと]
 ['x_kura', 'mt_kura', 'kura',  'ぷるぷるの鎧',     'armor','body',  ['mirror','quench'],9,{noise:6,mcrys:30,core:4},'受けるダメージ−15%。10%の確率で攻撃をぷるんとはじく（0ダメージ）','……ぷる。よく、見つけてくれた。この鎧、次の者に。'],
 ['x_tako', 'mt_tako', 'tako',  '八本足の隊列ブーツ','armor','feet',  ['block','edm'],9,{noise:6,mcrys:30,carbon:4},'移動の速さ+12%。止まっている間、攻撃+10%','隊列を組め。ひとりでは、建てられなかった。……この足、使え。'],
 ['x_fairy','mt_fairy','fairy', '青い蝶の髪かざり', 'armor','head',  ['laser','mirror'],9,{noise:6,mcrys:30,cell:4},'最大体力+60。10秒ごとの回復+2','蝶は、花から花へ。技も、人から人へ。……どうぞ。'],
 ['x_shadow','mt_shadow','shadow','影音の手甲',     'gen',  'shadow',['edm','laser'],10,{noise:8,mcrys:40,core:5},'シャドーの技（爪撃と爆音）が使える','音は消えても、ひびきは残る。……続きを、たのむ。'],
 ['x_soul', 'mt_soul', 'soul',  '青炎の杖',         'gen',  'soul',  ['quench','laser'],10,{noise:8,mcrys:40,core:5},'ソウルの技（蒼炎斬）が使える。マイスターの装備5つを全部つけると、全員の攻撃+10%','青い炎は、受けつがれて燃える。……未来の職人へ。']]:[];
MT.forEach(([b,id,who,n,kind,x,ps,lv,mats,fx])=>{RECIPES[id]={n,kind,tier:6,vol:3,secret:true,patent:true,legend:true,needLv:lv,mats,shape:'ch',area:'inf',proc:ps[0],procs:ps,tools:[...new Set(ps.flatMap(p=>PROC_MAIN[p]))],...(kind==='armor'?{slot:x}:{impl:x})};
 RECIPE_ORDER.push(id);PT_FX[id]=fx;if(kind==='armor')ARMOR_IC[id]='ar_'+id;else GEN_IC[id]='wg_'+id});
const mtArm=id=>typeof armId==='function'&&['head','body','feet'].some(s=>armId(s)===id);
const mtAll=()=>MT.length>0&&MT.every(([,id,,,kind])=>kind==='armor'?mtArm(id):genEqList().includes(id));
{const _ab=teamAb;teamAb=function(){const a=_ab();if(typeof armId!=='function')return a;
 if(armId('body')==='mt_kura')a.cut=(a.cut||0)+.15;if(armId('feet')==='mt_tako')a.wspd=(a.wspd||0)+.12;if(armId('head')==='mt_fairy'){a.hp=(a.hp||0)+60;a.regen=(a.regen||0)+2}
 if(G&&G.genEq&&mtAll())a.teamAtk=(a.teamAtk||0)+.1;return a}}
{const _h=fHurt;fHurt=function(v,src){v=_h(v,src);if(v>0&&typeof armId==='function'&&armId('body')==='mt_kura'&&Math.random()<.1){if(FD&&FD.pops.length<90)FD.pops.push({x:FD.x,y:FD.y-40,v:'ぷるん',t:0,heal:1});return 0}return v}}
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(typeof armId==='function'&&armId('feet')==='mt_tako'&&typeof FIN!=='undefined'&&!FIN.dx&&!FIN.dy)d*=1.1;return _fd(e,d,kx,ky)}}

/* ---------- 試練：スコープを付けて写しそこないに勝つ ---------- */
const trialBoss=()=>{if(!V3_OPEN||!FD||!FD.run||towerAt()!=='inf'||!FD.boss||FD.boss.hp<=0||!scopeOn())return null;const k=FD.boss.k;return MT.some(m=>m[0]===k)&&!G.flags['mt_'+k]?FD.boss:null};
{const _k=fKill;fKill=function(e){if(V3_OPEN&&FD&&e&&e.boss&&towerAt()==='inf'&&scopeOn()&&MT.some(m=>m[0]===e.k)&&!G.flags['mt_'+e.k])FD.trialK=e.k;return _k(e)}}
{const _fs=fStairs;fStairs=async function(){const D=FD;if(D&&D.trialK&&!D.climbing&&towerAt()==='inf'){const k=D.trialK;D.trialK=null;const m=MT.find(x=>x[0]===k);D.paused=true;fReleaseStick();
  try{const [,id,who,n,,,,,,,line]=m;G.flags['mt_'+k]=1;G.bpRaw=G.bpRaw||[];if(!G.bps.includes(id)&&!G.bpRaw.includes(id))G.bpRaw.push(id);save();
   await talk([N_('アウル・スコープのレンズの中で、ノイズがはがれていく。\nモザイクの体の奥から、ひとりの職人の姿が現れた。'),[who,CHARS[who]?CHARS[who].name:'？？？',line],
    [ 'robot','メカロボ','ピ……記録、照合。塔ヲ建テタ時代ノ、まいすたー、デス。'],N_(`マイスターの図面「${n}」を授かった！（工房で解読できる）`)])}catch(_){} }
 return _fs.apply(this,arguments)}}
/* スコープの「正体を明かす」を、試練のボスにも使えるようにする */
{const _tap=$('fcv');let t0=0,x0=0,y0=0;
 _tap.addEventListener('pointerdown',e=>{t0=performance.now();x0=e.clientX;y0=e.clientY});
 _tap.addEventListener('pointerup',e=>{const B=trialBoss();if(!B||FD.paused)return;if(performance.now()-t0>280||Math.hypot(e.clientX-x0,e.clientY-y0)>14)return;
  const wx=FD.x+(e.clientX-fW/2)/fZ,wy=FD.y+(e.clientY-fH/2)/fZ;FD.scopeFx={x:wx,y:wy,t:0};
  if(Math.hypot(wx-B.x,wy-B.y)<B.r+110){FD.reveal=210;tone(1600,.12,'sine',.06,2400);fBanner('正体が見えた！ 今だ！',90,'pt_owlscope')}else tone(500,.08,'triangle',.03)})}
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(e&&e.boss&&e===trialBoss())d*=(FD.reveal>0?1.5:.2);return _fd(e,d,kx,ky)}}
{const _b=fBossCome;fBossCome=async function(){const r=await _b.apply(this,arguments);if(trialBoss())setTimeout(()=>{if(trialBoss())fBanner('試練：ボスの近くをタップすると正体が見える。見えている間だけダメージが通る',300,'pt_owlscope')},700);return r}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const B=trialBoss();if(!B)return;g.save();
 if(D.reveal>0){g.globalAlpha=.8;g.strokeStyle='#ffe066';g.lineWidth=4;g.beginPath();g.arc(B.x,B.y,B.r+18,-Math.PI/2,-Math.PI/2+TAU*D.reveal/210);g.stroke()}
 if(D.scopeFx){const k=D.scopeFx.t/24;g.globalAlpha=1-k;g.strokeStyle='#ffd25a';g.lineWidth=3;g.beginPath();g.arc(D.scopeFx.x,D.scopeFx.y,20+60*k,0,TAU);g.stroke()}g.restore()}}
{const _u=fUpdate;fUpdate=function(f){_u(f);if(FD&&FD.run&&!FD.paused&&towerAt()==='inf'){if(FD.reveal>0)FD.reveal-=f;if(FD.scopeFx){FD.scopeFx.t+=f;if(FD.scopeFx.t>24)FD.scopeFx=null}}}}
/* 解読（スライドパズル）用の図面の絵と大きさ */
Object.assign(PATQ_ART,{
 mt_kura:(x,S)=>{x.beginPath();x.moveTo(S*.3,S*.18);x.lineTo(S*.7,S*.18);x.lineTo(S*.84,S*.34);x.lineTo(S*.74,S*.46);x.lineTo(S*.72,S*.84);x.lineTo(S*.28,S*.84);x.lineTo(S*.26,S*.46);x.lineTo(S*.16,S*.34);x.closePath();x.stroke();
  x.beginPath();x.arc(S*.5,S*.2,S*.08,0,Math.PI);x.stroke();for(let i=0;i<3;i++){x.beginPath();x.ellipse(S*.5,S*(.5+i*.11),S*.16,S*.04,0,0,TAU);x.stroke()}return[[S*.5,S*.2,'1'],[S*.78,S*.38,'2'],[S*.5,S*.6,'3'],[S*.3,S*.84,'4']]},
 mt_tako:(x,S)=>{x.beginPath();x.moveTo(S*.36,S*.14);x.lineTo(S*.36,S*.6);x.quadraticCurveTo(S*.36,S*.74,S*.5,S*.74);x.lineTo(S*.84,S*.74);x.lineTo(S*.84,S*.62);x.lineTo(S*.56,S*.56);x.lineTo(S*.56,S*.14);x.closePath();x.stroke();
  for(let i=0;i<4;i++){x.beginPath();x.arc(S*(.42+i*.12),S*.82,S*.04,0,TAU);x.stroke()}x.strokeRect(S*.36,S*.14,S*.2,S*.06);return[[S*.46,S*.17,'1'],[S*.46,S*.4,'2'],[S*.7,S*.66,'3'],[S*.54,S*.82,'4']]},
 mt_fairy:(x,S)=>{const c=S*.5;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{x.beginPath();x.ellipse(c+a*S*.16,c+b*S*.12,S*(b<0?.16:.11),S*(b<0?.13:.09),a*b*.5,0,TAU);x.stroke()});
  x.beginPath();x.moveTo(c,c-S*.16);x.lineTo(c,c+S*.2);x.stroke();x.beginPath();x.moveTo(c,c-S*.16);x.quadraticCurveTo(c-S*.06,c-S*.3,c-S*.12,c-S*.32);x.moveTo(c,c-S*.16);x.quadraticCurveTo(c+S*.06,c-S*.3,c+S*.12,c-S*.32);x.stroke();
  x.beginPath();x.arc(c,c+S*.32,S*.08,Math.PI,TAU);x.stroke();return[[c-S*.12,c-S*.32,'1'],[c-S*.18,c-S*.12,'2'],[c+S*.16,c+S*.12,'3'],[c,c+S*.28,'4']]},
 mt_shadow:(x,S)=>{x.beginPath();x.moveTo(S*.3,S*.84);x.lineTo(S*.3,S*.46);x.lineTo(S*.24,S*.3);x.lineTo(S*.36,S*.22);x.lineTo(S*.66,S*.22);x.lineTo(S*.74,S*.34);x.lineTo(S*.7,S*.84);x.closePath();x.stroke();
  for(let i=0;i<4;i++){x.beginPath();x.moveTo(S*(.34+i*.1),S*.22);x.lineTo(S*(.32+i*.1),S*.08);x.stroke()}for(let i=1;i<=3;i++){x.beginPath();x.arc(S*.74,S*.56,S*.06*i,-.7,.7);x.stroke()}
  return[[S*.36,S*.1,'1'],[S*.5,S*.3,'2'],[S*.86,S*.56,'3'],[S*.5,S*.8,'4']]},
 mt_soul:(x,S)=>{x.beginPath();x.moveTo(S*.5,S*.3);x.lineTo(S*.5,S*.9);x.stroke();x.strokeRect(S*.46,S*.3,S*.08,S*.08);
  x.beginPath();x.moveTo(S*.5,S*.08);x.quadraticCurveTo(S*.66,S*.18,S*.6,S*.28);x.quadraticCurveTo(S*.5,S*.34,S*.4,S*.28);x.quadraticCurveTo(S*.34,S*.18,S*.5,S*.08);x.stroke();
  x.beginPath();x.moveTo(S*.5,S*.14);x.quadraticCurveTo(S*.58,S*.2,S*.5,S*.26);x.quadraticCurveTo(S*.42,S*.2,S*.5,S*.14);x.stroke();x.strokeRect(S*.44,S*.62,S*.12,S*.06);
  return[[S*.5,S*.1,'1'],[S*.5,S*.34,'2'],[S*.5,S*.65,'3'],[S*.5,S*.88,'4']]}});
Object.assign(PATQ_SIZE,{mt_kura:6,mt_tako:6,mt_fairy:6,mt_shadow:6,mt_soul:6});
