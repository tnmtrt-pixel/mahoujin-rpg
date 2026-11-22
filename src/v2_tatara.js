/* =====================================================================
   鍛錬の間（たたら島）ver3.1.0
   ・世界地図の「いたずらの島（ハロウィンの塔）」を置きかえ。マイスターの塔をクリア（ch1）すると開く
   ・1回の火入れ＝5分。20秒ごとに敵が一段増える（15段）。4分で鞴鬼（仲間にしたあとは炭ゴーレムの群れ）
   ・倒した敵が落とす炭を拾うと、炉の温度が上がる。温度は時間とともに下がる。5分たつと、平均温度で玉鋼 1〜3個
   ・5分のあと「次の火入れ／帰る」。続けるほど敵が強くなり、玉鋼の倍率が上がる（×1.5, ×2 …）。やられたら、その火入れの分だけなくなる
   ・玉鋼の使い道：工房の「鍛錬」。SSまでは出来ばえを1段ずつ、SSからは＋1〜＋10（1つにつき強さ＋3%）
   ・はじめての火入れはチュートリアル（1分・倒れない・鞴鬼なし）。帰ったら工房で鍛錬を1回
   ・物語：ドド先輩の修業時代の炉。師匠の村下・鉄斎（てっさい）。島にいた時間の合計でチャットが開く
   ===================================================================== */
const TT={STAGE:300,TUT:60,STEP:20,BOSS:240,SUMI:5,DROP:.45,DECAY0:1,DECAY1:.03,RANK_COST:{D:1,C:1,B:2,A:3,S:4},PLUS_MAX:10,PLUS:.03};
/* ---------- 人と敵と素材 ---------- */
Object.assign(CHARS,{tessai:{name:'鉄斎',img:'img/tessai.webp',job:'kaji',pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['鉄は、待つ者にしか応えん。']}});
FACES.tessai=['neutral','smile','worry','serious','surprise'];
Object.assign(MATS,{tama:{n:'玉鋼',d:'たたら島の炉でできる、混じりけの少ない鋼。工房の「鍛錬」で装備を強くする'}});
UI_IC.tama='u_tama';if(!MAT_ORDER.includes('tama'))MAT_ORDER.push('tama');
Object.assign(FFOE,{
 t_flame:{hp:24, spd:1.3, dmg:10,xp:2, r:18},
 t_bat:  {hp:18, spd:1.75,dmg:9, xp:2, r:16,fly:1},
 t_slag: {hp:64, spd:.65, dmg:14,xp:4, r:23},
 t_golem:{hp:200,spd:.55, dmg:22,xp:24,r:38,big:1},
 t_fuigo:{hp:1000,spd:.7, dmg:30,xp:90,r:60,big:1}});
Object.assign(FOES,{t_flame:{n:'炎の精',col:'#ffa030'},t_bat:{n:'火の粉コウモリ',col:'#ff6a30'},t_slag:{n:'スラグ',col:'#c06a2a'},t_golem:{n:'炭ゴーレム',col:'#ff5a20'},t_fuigo:{n:'鞴鬼',col:'#e03a2a'}});
FOE_IMG_OK.push('t_flame','t_bat','t_slag','t_golem','t_fuigo');
Object.assign(AREAS,{tt:{n:'たたら場',need:null,lv:'',bossLv:0,tier:3,boss:null,bg:'#1e120a'}});
LAYER_NAME.tt='たたら場';
FAREA.tt={mix:[[0,['t_flame','t_bat'],1.6]],elite:'t_golem',boss:null,drop:{scrap:.02,plate:.01,brass:.008},chestTool:null,ground:['#1e120a','255,140,50']};
FLOOR_IMG.tatara='img/floor/tatara.webp';FLOOR_TINT.tt=['tatara','rgba(0,0,0,.05)'];
/* 敵の強さ：いちばん進んでいる塔に合わせる（マイスターの塔クリア直後で、第1章の頂上の少し下から） */
function ttBase(){const tw=G.tw||{},j=(tw.judge&&tw.judge.floor)|0,s=(tw.sougi&&tw.sougi.floor)|0;return Math.max(14,j?14+1.5*j:0,s?44+1.5*s:0)}
const ttEff=()=>{const T=FD&&FD.tr;return ttBase()+(T?.45*Math.floor(T.tk/TT.STEP)+3.5*(T.stage-1):0)};
TW_TABLE.tatara={FLOORS:[null,{n:'たたら場',area:'tt',step:0,stair:600,boss:false}],FLOOR_MATS:{1:['scrap','plate']},BOSS_HP:{},REC_POW:{1:0},HELPER_FL:{},FLOOR_LINES:{},START_LV:{},feff:()=>ttEff()};
TOWERS.tatara={n:'鍛錬の間',ready:true,go:()=>ttGo()};
/* ---------- 世界地図：新しい絵に合わせて位置を直す。いたずらの島 → たたら島 ---------- */
{const P=WMAP.places,at=(k,x,y)=>{const p=P.find(q=>q.k===k);if(p)Object.assign(p,{x,y})};
 at('tetto',.43,.70);at('judge',.21,.13);at('sougi',.83,.24);at('inf',.54,.05);
 const i=P.findIndex(q=>q.k==='hw'),tt={k:'tatara',tw:'tatara',x:.83,y:.60,r:.13,n:'たたら島',t:'鍛錬の間',
  d:'ドド先輩が若いころ修業した、古いたたら製鉄の炉がある島。敵を倒して炭をくべ、5分ごとに火を守りきると玉鋼ができる。玉鋼は工房の「鍛錬」で装備を強くする。',
  open:()=>!!(G.flags&&G.flags.ch1),hint:'海の向こうに、細い煙が一すじ上がっている……'};
 if(i>=0)P.splice(i,1,tt);else P.push(tt)}
{const _w=openWorldMap;openWorldMap=function(sortie){const r=_w.apply(this,arguments);const b=document.querySelector('#wmap [data-wm="tatara"]');
 if(b)b.addEventListener('click',()=>{const s=document.querySelector('#wmD .wmgo span');if(s)s.textContent=`玉鋼 ${G.mats.tama|0}個`});return r}}

/* ---------- 出撃 ---------- */
async function ttGo(again){enterTower('tatara');if(TW)TW.busy=true;
 if(!G.flags.ttOpen){G.flags.ttOpen=1;save();await talk(TT_OPEN)}else if(!again)await talk(TT_OPEN.slice(0,-1));  /* 3.1.7：入るたびに、はじまりの話（もう一度の火入れでは出さない） */
 await say(`${UIMG('u_tatara',44)} たたら島へ……${G.flags.ttTut?'':'<br><span style="font-size:13px">はじめての火入れ（1分）</span>'}`,800);startFloor(1)}
{const _s=startFloor;startFloor=function(fl){const r=_s.apply(this,arguments);if(towerAt()==='tatara'&&FD){const D=FD;D.stairs=null;
 D.tr={stage:1,tk:0,heat:15,hsum:0,step:0,gT:60,bossOut:false,got:0,sumiN:0,tut:!G.flags.ttTut,tutS:0,tutT:0,ending:0};
 fBanner(D.tr.tut?'ドド先輩「敵が落とす黒い炭を拾ってみて〜。拾うと炉にくべられるよ」':(G.flags.ttOni?'第1火　鞴鬼が炉に風を送ってくれている！（温度が下がりにくい）':'第1火　炉に火が入った！ 敵を倒して炭をくべろ'),220,'u_heat')}return r}}
/* 敵の波：20秒ごとに一段（チュートリアルはゆるやか） */
{const _w=waveNow;waveNow=function(){const T=FD&&FD.tr;if(!T)return _w();const s=Math.floor(T.tk/TT.STEP),
 P=s<3?['t_flame','t_bat']:s<6?['t_flame','t_bat','t_slag']:['t_slag','t_flame','t_bat','t_slag'];return[0,P,(T.tut?1.4:1.6+.42*s)*(1+.25*(T.stage-1))]}}
const ttNoRust=fn=>{const r0=FT.RUST;FT.RUST=1e9;try{return fn()}finally{FT.RUST=r0}};
/* 敵の体力：ふつうの塔は「その階にいた時間」で体力が増えるが、たたら場ではそれを使わない（強さは20秒ごとの段と火入れの回数で上がる） */
{const _sp=fSpawn;fSpawn=function(){const a=arguments,tr=FD&&FD.tr,e=tr?ttNoRust(()=>_sp.apply(this,a)):_sp.apply(this,a);if(e&&tr&&!e.boss){const k=1+fSearchT()/60;e.hp/=k;e.max/=k}return e}}
/* 錆はない：錆のしくみ（FT.RUST）を、たたら場の間だけ止める */
{const _u=fUpdate;fUpdate=function(f){const D=FD,T=D&&D.tr;if(!T)return _u(f);ttNoRust(()=>_u(f));
 if(FD!==D||!D.run||D.ending||T.ending)return;
 T.tk+=f/60;D.st=Math.min(T.tk,FLOOR_MAX-61);
 const dec=(TT.DECAY0+T.heat*TT.DECAY1)*(G.flags.ttOni?.75:1);T.heat=Math.max(0,T.heat-dec*f/60);T.hsum+=T.heat*f/60;
 const s=Math.floor(T.tk/TT.STEP);if(s>T.step){T.step=s;if(!T.tut&&s<15)fBanner(`敵が増えてきた！（${s+1}/15）`,90,'n_boss')}
 if(!T.tut&&T.tk>=T.gT){T.gT+=60;fSpawn('t_golem')}
 if(!T.tut&&!T.bossOut&&T.tk>=TT.BOSS){T.bossOut=true;
  if(G.flags.ttOni){for(let i=0;i<3;i++)fSpawn('t_golem',i/3*TAU,null);fBanner('炭ゴーレムの群れが来た！ 鞴鬼が風を強めている',200,'n_boss')}
  else{const e=fSpawn('t_fuigo');if(e)e.oni=1;fBanner('鞴鬼が現れた！ 炉の番人が暴れている',220,'n_boss');tone(110,.5,'sawtooth',.08,70)}}
 if(T.tut)ttTutStep(D,T);
 if(T.tk>=(T.tut?TT.TUT:TT.STAGE))ttStageEnd()}}
{const _d=fDraw;fDraw=function(){const D=FD,T=D&&D.tr;if(!T)return _d();ttNoRust(_d);if(FD!==D)return;
 const len=T.tut?TT.TUT:TT.STAGE,rem=Math.max(0,Math.ceil(len-T.tk)),hc=T.heat<35?'#ff6a3a':T.heat<70?'#ffb040':'#fff2c0',hp=Math.round(T.heat);
 const h=`${UIMG('u_heat',22)}<span class="ffl">第${T.stage}火</span> <span class="ftm ${rem<=30?'warn':''}">${Math.floor(rem/60)}:${String(rem%60).padStart(2,'0')}</span><span class="tth" style="display:inline-block;width:72px;height:10px;border-radius:5px;background:#0009;border:1px solid #fff3;margin-left:6px;vertical-align:middle;overflow:hidden"><i style="display:block;height:100%;width:${hp}%;background:${hc}"></i></span><b style="font-size:12px;margin-left:4px;color:${hc}">${ttHeatName(T.heat)}</b>`;
 const te=$('fTime');if(te&&(te._tt!==h||te._ttHo!==te._h)){te.innerHTML=h;te._tt=h;te._ttHo=te._h}}}
const ttHeatName=v=>v<35?'赤':v<70?'橙':'白';
/* 炉：開始の場所（0,0）に置く。床の上に描く */
{const _f=fDrawRuleFloor;fDrawRuleFloor=function(g,D,cx0,cy0,z){_f.apply(this,arguments);const T=D&&D.tr;if(!T)return;const t=D.t,k=T.heat/100;
 g.save();const gr=g.createRadialGradient(0,-10,10,0,-10,120+80*k);gr.addColorStop(0,`rgba(255,${140+80*k|0},60,${.25+.4*k})`);gr.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=gr;g.beginPath();g.arc(0,-10,200,0,TAU);g.fill();
 const s=fspr('img/ui/f_tatara.webp',140);if(s)g.drawImage(s,-60,-92,120,120*s.height/s.width);
 if(G.flags.ttOni){const o=fspr('img/foe/t_fuigo.webp',110),ph=(t*1.6)%1,push=Math.sin(ph*TAU),ox=78,oy=-8;
  /* 鞴を押す：体を縮めたり伸ばしたり。押すたびに風（白い息）が炉へ流れる */
  if(o){g.save();g.translate(ox,oy);g.scale(-1,1);g.scale(1+.05*push,1-.06*push);g.drawImage(o,-42,-84,84,84);g.restore()}
  for(let i=0;i<3;i++){const q=(ph+i/3)%1,x=ox-30-q*60,y=oy-30-Math.sin(q*Math.PI)*10;g.globalAlpha=(1-q)*.7;g.fillStyle='#fff';g.beginPath();g.arc(x,y,5+q*7,0,TAU);g.fill()}
  g.globalAlpha=1;g.font='bold 12px sans-serif';g.textAlign='center';const lb='鞴鬼 手伝い中',w=g.measureText(lb).width+14;
  g.fillStyle='rgba(30,120,60,.9)';g.beginPath();g.roundRect?g.roundRect(ox-w/2,oy-104,w,18,9):g.rect(ox-w/2,oy-104,w,18);g.fill();g.fillStyle='#fff';g.fillText(lb,ox,oy-91)}
 g.restore()}}
/* 炭：倒すと落ちる。拾うと炉の温度が上がる */
{const _k=fKill;fKill=function(e){const r=_k.apply(this,arguments);const D=FD,T=D&&D.tr;if(!T||!e)return r;
 const n=e.k==='t_fuigo'?12:e.big?5:Math.random()<TT.DROP?1:0;for(let i=0;i<n;i++)D.items.push({x:e.x+(n>1?Math.random()*50-25:0),y:e.y+(n>1?Math.random()*50-25:0),k:'sumi'});
 if(e.oni&&!G.flags.ttOni){G.flags.ttOni=1;save();ttTalk(TT_ONI)}return r}}
{const _g=fGot;fGot=function(it){const T=FD&&FD.tr;if(it.k!=='sumi'||!T)return _g.apply(this,arguments);
 T.heat=Math.min(100,T.heat+TT.SUMI);T.sumiN++;tone(520+T.heat*6,.04,'triangle',.03);if(T.sumiN%5===0)FD.pops.push({x:FD.x,y:FD.y-44,v:'炉の温度 '+Math.round(T.heat),t:0,heal:1})}}
{const _di=drawItem;drawItem=function(g,it,t){if(it.k!=='sumi')return _di.apply(this,arguments);const s=fspr('img/ui/f_sumi.webp',26),y=it.y+Math.sin(t*4+it.x)*2;
 if(s)g.drawImage(s,it.x-11,y-11,22,22);else{g.fillStyle='#222';g.fillRect(it.x-7,y-5,14,10)}}}
/* チュートリアルでは倒れない */
{const _h=fHurt;fHurt=function(v,src){v=_h(v,src);const T=FD&&FD.tr;if(T&&T.tut)v=Math.max(0,Math.min(v,FD.hp-1));return v}}
function ttTutStep(D,T){T.tutT+=1;const say2=(t)=>{if(D.warn<40)fBanner(t,160,'u_heat')};
 if(T.tutS===0){say2(`ドド先輩「黒い炭を拾ってみて〜。拾うと炉にくべられるよ」（${Math.min(3,T.sumiN)}/3）`);if(T.sumiN>=3){T.tutS=1;D.warn=0}}
 else if(T.tutS===1){say2('ドド先輩「上の温度計を見てね。赤から橙へ。熱いほど鉄がよく育つよ〜」');if(T.heat>=35){T.tutS=2;T.tutT=0;D.warn=0}}
 else if(T.tutS===2){say2('ドド先輩「炭が途切れると、すぐ冷めちゃう。のんびりしすぎないでね〜」');if(T.tutT>420){T.tutS=3;D.warn=0}}
 else say2('ドド先輩「いい感じ〜。そのまま火を守ってね。もうすぐ鉧（けら）ができるよ」')}
/* 戦いの途中の会話（止めて、終わったら続き） */
async function ttTalk(L){const D=FD;if(!D)return;D.paused=true;fReleaseStick();try{await talk(L)}finally{if(FD===D&&D.run&&!(D.tr&&D.tr.ending)){D.paused=false;fLast=0;show('field');resizeField();if(!fRaf)fRaf=requestAnimationFrame(fLoop)}}}
/* ---------- 5分たった：鉧ができる → 次の火入れ／帰る ---------- */
async function ttStageEnd(){const D=FD,T=D.tr;if(T.ending)return;T.ending=1;D.paused=true;D.warn=0;fReleaseStick();
 const avg=T.hsum/Math.max(1,T.tk),base=T.tut?3:avg>=60?3:avg>=30?2:1,mult=1+.5*(T.stage-1),n=Math.round(base*mult);
 G.mats.tama=(G.mats.tama|0)+n;T.got+=n;G.ttTime=(G.ttTime|0)+Math.round(T.tk);if(!T.tut)G.ttBest=Math.max(G.ttBest|0,T.stage);save();
 sfx.win&&sfx.win();
 await say(`${UIMG('u_tama',52)} 鉧（けら）ができた！<br><span style="font-size:13px">炉の温度 平均 ${Math.round(avg)}（${ttHeatName(avg)}）</span><br><b style="font-size:22px">玉鋼 ×${n}</b>${mult>1?`<br><span style="font-size:13px">第${T.stage}火なので ×${mult}</span>`:''}`,1800);
 if(FD!==D)return;
 await ttStory(T);
 if(FD!==D)return;
 if(T.tut){G.flags.ttTut=1;save();fEnd('retreat');return}
 if(!await ttChoice(T)){fEnd('retreat');return}
 Object.assign(T,{stage:T.stage+1,tk:0,hsum:0,step:0,gT:60,bossOut:false,ending:0});D.st=0;D.hp=Math.min(D.maxhp,D.hp+Math.round(D.maxhp*.2));
 fBanner(`第${T.stage}火　敵がさらに強くなる！ 玉鋼は ×${1+.5*(T.stage-1)}`,220,'u_heat');
 D.paused=false;fLast=0;show('field');resizeField();renderFHud();if(!fRaf)fRaf=requestAnimationFrame(fLoop)}
function ttChoice(T){return new Promise(res=>{let el=$('fNext');if(!el){el=document.createElement('div');el.className='fov';el.id='fNext';$('fPause').parentNode.appendChild(el)}const D=FD,m=1+.5*T.stage;
 el.innerHTML=`<div class="fcard"><div class="fnx">${UIMG('u_tama',40)}<div><b>第${T.stage}火 おわり</b><small>この挑戦で 玉鋼 ×${T.got}</small></div></div>
  <div class="note fnn">次の火入れは、敵がさらに強く、多くなる。そのかわり玉鋼は <b>×${m}</b>。<br>やられたら、その火入れの分だけなくなる（いままでの玉鋼は持ち帰れる）<br>体力 ${Math.ceil(D.hp)}/${D.maxhp}　Lv${D.lv}</div>
  <button class="btn gold" id="fnGo">次の火入れへ（第${T.stage+1}火）</button><button class="btn" id="fnHome">帰る<small class="bsm">玉鋼 ×${T.got} を持ち帰る</small></button></div>`;
 el.classList.add('on');$('fnGo').onclick=()=>{el.classList.remove('on');res(true)};$('fnHome').onclick=()=>{el.classList.remove('on');res(false)}})}
/* 終わり：とちゅうで帰ったら、その時点の分だけ少し。結果画面をたたら島用に */
{const _e=fEnd;fEnd=function(why){const D=FD,T=D&&D.tr;if(!T||D.ending)return _e.apply(this,arguments);
 let part=0;if(!T.ending){G.ttTime=(G.ttTime|0)+Math.round(T.tk);if(why!=='dead'&&!T.tut){const avg=T.hsum/Math.max(1,T.tk),base=avg>=60?3:avg>=30?2:1;part=Math.floor(base*(1+.5*(T.stage-1))*T.tk/TT.STAGE);if(part){G.mats.tama=(G.mats.tama|0)+part;T.got+=part}}save()}
 const st=T.stage,got=T.got,dead=why==='dead';const r=_e.apply(this,arguments);
 const q=s=>document.querySelector('#resP '+s);const fl=q('.rzfl');if(fl)fl.innerHTML=`${st}<small>火</small>`;
 const ti=q('.rzti b');if(ti)ti.textContent=dead?'火が消えた':st>1||T.ending?'火を守りきった':'たたら島から帰った';
 const sb=q('.rzsb');if(sb)sb.innerHTML=`第${st}火まで　たたら島にいた時間 合計 ${Math.floor((G.ttTime|0)/60)}分`+(dead?'<br>この火入れの玉鋼はなくなった（それまでの分は持ち帰れた）':part?`<br>とちゅうで帰ったので、玉鋼は少しだけ（×${part}）`:'');
 const gz=q('.rzg');if(gz&&got){if(!gz.querySelector('.rzt'))gz.innerHTML='';gz.insertAdjacentHTML('afterbegin',`<div class="rzt gold">${MIC('tama',34)}<b>×${got}</b><i>玉鋼</i></div>`)}
 const nx=q('.rznx');if(nx)nx.innerHTML=`${UIMG('u_tama',26)}<span>玉鋼 <b>${G.mats.tama|0}個</b>　工房の「鍛錬」で装備を強くできる</span>`;
 const b=$('resBtns');if(b){b.innerHTML='';addBtn('もう一度 火入れ',()=>{$('result').classList.remove('fres');ttGo(true)},'gold');addBtn('ホームへ',afterField)}
 return r}}
/* はじめての火入れのあと：工房で鍛錬を1回 */
{const _a=afterField;afterField=async function(){if(G.flags.ttTut&&!G.flags.ttTut2){G.flags.ttTut2=1;save();$('result').classList.remove('fres');openHome();await talk(TT_TUT_FORGE);shopTab='tforge';openShop('tab');return}return _a.apply(this,arguments)}}

/* ---------- 工房：鍛錬（玉鋼で出来ばえを上げる・SSから＋） ---------- */
function ttGear(){const L=[];ownedAll().forEach(m=>{const w=m.weapon;if(w&&w.rid&&RECIPES[w.rid]&&w.rank)L.push({o:w,rid:w.rid,kind:'w',lb:CHARS[m.id].name})});
 Object.keys(G.gen||{}).forEach(r=>{const o=G.gen[r];if(o&&o.rank&&RECIPES[r])L.push({o,rid:r,kind:'g',lb:'汎用'})});
 Object.keys(G.arm||{}).forEach(s=>{const a=G.arm[s];if(a&&a.rid&&a.rank&&RECIPES[a.rid])L.push({o:a,rid:a.rid,kind:'a',lb:'防具'})});return L}
const ttCost=o=>o.rank!=='SS'?TT.RANK_COST[o.rank]||1:(o.tp|0)<TT.PLUS_MAX?3+(o.tp|0):0;
const ttRankTxt=o=>o.rank+((o.tp|0)?'＋'+o.tp:'');
function ttForgeHTML(){const L=ttGear(),have=G.mats.tama|0;
 let h=`<div class="note">${MIC('tama',22)} 玉鋼 <b>${have}個</b>　たたら島で火を守るとできる。<br>出来ばえを1段ずつ上げられる（SSまで）。SSになったら＋1〜＋${TT.PLUS_MAX}を重ねられる（1つにつき強さ＋3%）。装備しているものだけ鍛えられる。</div>`;
 if(!L.length)return h+'<div class="note">鍛えられる装備がない。工房で装備をつくって、装備しよう</div>';
 L.forEach((x,i)=>{const o=x.o,c=ttCost(o),R=RECIPES[x.rid],mx=o.rank==='SS'&&(o.tp|0)>=TT.PLUS_MAX;
  h+=`<div class="rcp"><div class="rh" style="align-items:center;gap:8px">${RIC(x.rid,36)}<span style="flex:1;line-height:1.3"><b>${R.n}</b><br><small>${x.lb}　出来ばえ <b style="color:var(--gold)">${ttRankTxt(o)}</b>　強さ ×${(+o.mul).toFixed(2)}</small></span>
   ${mx?'<small style="color:var(--gold)">極めた！</small>':`<button class="btn" data-tf="${i}" ${have<c?'disabled':''} style="width:auto;margin:0;padding:8px 10px;font-size:13px;line-height:1.2">${o.rank==='SS'?'＋'+((o.tp|0)+1)+'にする':RANK_ORDER[RANK_ORDER.indexOf(o.rank)+1]+'に上げる'}<br><small>${MIC('tama',14)}×${c}</small></button>`}</div></div>`});
 return h}
function ttForge(i){const x=ttGear()[i];if(!x)return;const o=x.o,c=ttCost(o);if(!c||(G.mats.tama|0)<c)return;G.mats.tama-=c;
 if(o.rank!=='SS'){const nr=RANK_ORDER[RANK_ORDER.indexOf(o.rank)+1];o.mul=+(o.mul*RANK_MUL[nr]/RANK_MUL[o.rank]).toFixed(3);o.rank=nr}
 else{const p=o.tp|0;o.mul=+(o.mul/(1+TT.PLUS*p)*(1+TT.PLUS*(p+1))).toFixed(3);o.tp=p+1}
 if(x.kind==='w'){o.v=Math.round(o.mul*5);o.bv=o.v;o.name=RECIPES[x.rid].n+'（'+ttRankTxt(o)+'）'}
 save();tone(660,.08,'square',.06);setTimeout(()=>tone(990,.15,'triangle',.08,1480),90);renderShop();
 say(`${UIMG('u_tforge',44)} カーン！ 「${RECIPES[x.rid].n}」を鍛えた<br><b style="font-size:20px">出来ばえ ${ttRankTxt(o)}</b>`,1100)}
{const _r=renderShop;renderShop=function(){const tf=shopTab==='tforge';if(tf)shopTab='__tf';_r.apply(this,arguments);if(tf)shopTab='tforge';
 if(!G.flags||!G.flags.ttOpen)return;const tabs=$('shopBody').querySelector('.stabs');
 if(tabs&&!tabs.querySelector('[data-t3="tforge"]')){const b=document.createElement('button');b.className='stab'+(tf?' on':'');b.dataset.t3='tforge';b.textContent='鍛錬';
  const rec=tabs.querySelector('[data-t="rec"]');tabs.insertBefore(b,rec);b.onclick=()=>{shopTab='tforge';renderShop()}}
 if(tf){$('shopBody').insertAdjacentHTML('beforeend',ttForgeHTML());$('shopBody').querySelectorAll('[data-tf]').forEach(b=>b.onclick=()=>ttForge(+b.dataset.tf))}}}

/* ---------- 物語 ---------- */
const tD='dodo',tDN='ドド先輩',tW='wolf',tWN='ウルフ',tTS='tessai',tTSN='鉄斎';
const TT_OPEN=[N_('鉄灯の街の港から、小舟で東の海へ。細い煙の上がる小さな島に、古いたたら場があった。'),
 [tD,tDN,'……あ〜、やっぱり。ここ、ぼくが昔、修業してた炉だよ〜。'],[tW,tWN,'先輩、ここで修業してたのか？'],
 [tD,tDN,'うん。鉄斎師匠のところでね。……でも、火はずっと前に消えたはずなんだけどな〜。なんで煙が出てるんだろ。'],
 N_('炉は半分だけ燃えていた。そのまわりを、炎の精やスラグがうろついている。'),
 [tD,tDN,'炉の残り火から生まれちゃったんだね。番をする人がいなくて、勝手に燃えてるんだ〜。'],
 N_('炉の柱に、古い木札がかかっていた。'),[null,'木札','「鉄は、待つ者にしか応えん。三日三晩、火を守れ。——鉄斎」'],
 [tD,tDN,'……師匠の字だ。よーし、ぼくたちで火を守ろっか。敵を倒して炭をくべ続ければ、炉が鉄を育ててくれるよ〜。'],
 [tD,tDN,'できた鉄のかたまりを鉧（けら）、その中のいちばんいいところを玉鋼（たまはがね）っていうんだ。玉鋼があれば、装備をもっと強く鍛えられるよ。'],
 [tD,tDN,'まずは1分だけ、火を入れてみよっか。あせらなくていいよ〜。ぼくの言うとおりにやってみてね。']];
const TT_TUT_END=[[tD,tDN,'いい鉧ができたね〜。これを割ると……ほら、玉鋼だよ。'],[tD,tDN,'出口はいつでも開いてるよ。できた分は持って帰れるし、長くいるほど、たくさん取れるからね〜。'],
 [tD,tDN,'ほんとの火入れは5分。20秒ごとに敵が増えて、4分たつと……炉の番人が来るかもしれない。気をつけてね〜。']];
const TT_TUT_FORGE=[[tD,tDN,'工房に「鍛錬」ができたよ〜。玉鋼で、装備の出来ばえを1段ずつ上げられるんだ。'],[tD,tDN,'さっそく1つ鍛えてみよっか。SSまで上げたら、そこから先は＋を重ねられるよ。極めたくなったら、また火を守りに行こうね〜。']];
const TT_S1=[[tD,tDN,'ふぅ〜、5分、火を守りきったね。……師匠は、これを三日三晩やってたんだよ。'],[tW,tWN,'三日三晩！？ 寝ないで？'],
 [tD,tDN,'うん。村下（むらげ）っていってね、炉の親方は火の色だけ見て、ずっと風と炭を加減するんだ。片目が細くなっちゃうくらいね。……ぼくには、絶対むりだな〜。']];
const TT_ONI=[N_('鞴鬼が膝をついた。赤い顔から、すうっと怒りが抜けていく。'),[null,'鞴鬼','……フゥ……フゥ……。火ノ番……戻ッタカ……。'],
 [tD,tDN,'あっ、きみ、師匠の鞴（ふいご）を押してた番人さんだ！ 番がいなくて、ひとりで暴れてたんだね。'],[null,'鞴鬼','鉄斎……イナイ……。風、送ル相手、イナカッタ……。'],
 [tD,tDN,'そっか〜、さみしかったよね。じゃあ、ぼくたちに風を送ってくれる？ いっしょに火を守ろうよ。'],
 N_('鞴鬼が炉のそばに座り、大きな鞴を押しはじめた。\n\n（これからは鞴鬼が手伝ってくれる：炉の温度が下がりにくくなる）')];
const TT_M1=[[tD,tDN,'……ねぇ、きみ。ぼく、昔ここで、炉をひとつだめにしちゃったんだ。'],
 [tD,tDN,'三日目の夜にね、師匠に「少しだけ火の番をたのむ」って言われたの。……なのに、ぼく、炉の前で昼寝しちゃって。'],
 [tD,tDN,'起きたら、火が落ちてた。鉄は固まりそこねて、ぼろぼろ。三日三晩が、ぜんぶむだになっちゃった。'],
 [tD,tDN,'師匠はなんにも怒らなかった。「鉄は、待つ者にしか応えん」って、それだけ。……それが、いちばんこたえたな〜。'],
 [tD,tDN,'次の日、ぼく、島を出たんだ。それっきり。'],[tW,tWN,'……だから先輩は、前に立つときだけは寝ないのか。'],
 [tD,tDN,'えへへ〜、どうかな。……でも、うん。もう、だれかの火を落としたくないんだ。']];
const TT_M2=[N_('火入れを終えたあと。小屋の陰から、白いひげの老人がゆっくりと歩いてきた。'),
 [tTS+':neutral',tTSN,'……ええ火やった。'],[tD,tDN,'えっ……し、師匠！？'],
 [tTS+':smile',tTSN,'鞴の音が聞こえての。火の番が戻ったと思うて、見に来たんじゃ。'],
 [tD,tDN,'師匠……あのときは、ごめんなさい。ぼく……'],
 [tTS+':serious',tTSN,'謝るな。おまえは、待てるようになった。火の色を見れば、わかる。'],
 [tTS+':worry',tTSN,'わしはな、目がもう、炎の色を見分けられん。だから炉を閉じて、島を出た。'],
 [tTS+':neutral',tTSN,'……じゃが、おまえらの火なら、まかせられる。この炉は、おまえらのものじゃ。'],
 [tTS+':surprise',tTSN,'そうじゃ、ひとつだけ。雲の上の塔から、ときどき妙な鉄が流れつく。……いつか、あれを打てる職人が来ると、わしは思うとる。'],
 [tD,tDN,'……うん。まかせて、師匠。今度は、寝ないよ〜。'],N_('（鉄斎は、ときどき島の小屋にいるようになった）')];
async function ttStory(T){const f=G.flags;
 if(T.tut){await talk(TT_TUT_END);return}
 if(!f.ttS1){f.ttS1=1;save();await talk(TT_S1)}
 if((G.ttTime|0)>=1800&&!f.ttM1){f.ttM1=1;save();await talk(TT_M1)}
 if((G.ttTime|0)>=3600&&f.ttM1&&!f.ttM2){f.ttM2=1;save();await talk(TT_M2)}}
/* ストーリーをふりかえる */
{const _ss=storyScenes;storyScenes=function(){const S=_ss(),f=G.flags||{};
 if(f.ttOpen)S.push({n:400,lb:'た',t:'たたら島　師匠の炉',run:()=>talk(TT_OPEN)});
 if(f.ttS1)S.push({n:401,lb:'た',t:'三日三晩',run:()=>talk(TT_S1)});
 if(f.ttOni)S.push({n:402,lb:'た',t:'鞴鬼',run:()=>talk(TT_ONI)});
 if(f.ttM1)S.push({n:403,lb:'た',t:'ドド先輩の昔話',run:()=>talk(TT_M1)});
 if(f.ttM2)S.push({n:404,lb:'た',t:'鉄斎',run:()=>talk(TT_M2)});
 return S.sort((a,b)=>a.n-b.n)}}
/* セーブの補い */
{const _fx=fixV2;fixV2=function(g){const r=_fx.apply(this,arguments);if(g){g.ttTime=g.ttTime|0;if(g.mats)g.mats.tama=g.mats.tama|0}return r}}
