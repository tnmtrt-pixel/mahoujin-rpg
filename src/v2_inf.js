/* ===================== 無限の塔（ver2.1.0 予定）：終わりのない塔 =====================
 * ・審判の塔の20Fをクリアすると、地図の奥（雲海）に開く。ver2.1.0 で公開（?inf をつけると、審判の塔をクリアしていなくても入れるテスト用）
 * ・毎回1階から。レベルもLv1から。階段で上へ登り続ける。倒れたら次は1階から
 * ・中断できる：階に入るたびに挑戦の続き（G.infRun）を残す。帰っても、アプリを閉じても、次は同じ挑戦の続きから
 * ・敵：第1章・第2章の敵の「バグ版」（色ずれ・横線のノイズ・ちらつき）。10階ごとのボスは、塔を建てた時代のマイスターを
 *   写しそこなったバグ（10 クーラ、20 タコナイン、30 フェアリー、40 シャドー、50 ソウル。そのあとは同じ順でくり返す）
 * ・強さ：1F は第1章の中ごろ、20F で審判の塔の頂上、50F で審判の塔の頂上の約2倍。その先も1階ごとに強くなり続ける
 * ・長くいると「ノイズLv」（錆Lv と同じしくみ）、5分で「陣のゆがみ」（錆の大波と同じ削れ方）
 * ・ごほうび：ふつうのコインと素材、ノイズの欠片（第3章で使う）、記憶の結晶（1階で1個、ボスで+5、50Fより上は1階で2個。第3章で使う）
 * ・ランキング：1回の挑戦で着いたいちばん高い階（G.infBest）をサーバーへ送る */
const INF_TEST=/[?&]inf\b/.test(location.search),INF_LIVE=true;  /* 2.1.0 で公開 */
const INF_N=999,INF_BOSS=['x_kura','x_tako','x_fairy','x_shadow','x_soul'];
const infLayer=f=>Math.floor(((f|0)-1)/10)%5;              /* 0〜4：10階ごとに次の層 */
const infArea=f=>'i'+(infLayer(f)+1);
const INF_FN=['ゆらぐ回廊','欠けた階段','くり返す広間','文字化けの間','ずれた床','ほどけた通路','写しの間','ノイズの吹きぬけ','記録の残骸'];
const IFLOORS=[null];for(let f=1;f<=INF_N;f++){const b=f%10===0;IFLOORS.push({n:b?'写しの玉座':INF_FN[(f*7)%INF_FN.length],area:infArea(f),step:Math.min(3,Math.floor(((f-1)%10)/3)),stair:1400+((f-1)%10)*40,boss:b})}
Object.assign(LAYER_NAME,{i1:'記憶の層',i2:'隊列の層',i3:'光の層',i4:'残響の層',i5:'蒼炎の層'});
Object.assign(AREAS,{
 i1:{n:'記憶の層',need:null,lv:'',bossLv:0,tier:4,boss:'x_kura',bg:'#0c1a1c'},
 i2:{n:'隊列の層',need:null,lv:'',bossLv:0,tier:4,boss:'x_tako',bg:'#1c0c14'},
 i3:{n:'光の層',  need:null,lv:'',bossLv:0,tier:4,boss:'x_fairy',bg:'#0c1222'},
 i4:{n:'残響の層',need:null,lv:'',bossLv:0,tier:4,boss:'x_shadow',bg:'#16101c'},
 i5:{n:'蒼炎の層',need:null,lv:'',bossLv:0,tier:4,boss:'x_soul',bg:'#0a1024'}});
/* 写しそこないのボス（本人の絵にノイズ。名前は文字化け） */
Object.assign(FFOE,{
 x_kura:  {hp:1000,spd:.85,dmg:30,xp:150,r:54,big:1,boss:1,src:'img/kura.webp',ring:140,noflip:1},
 x_tako:  {hp:1000,spd:.8, dmg:32,xp:160,r:56,big:1,boss:1,src:'img/tako.webp',call:380,ring:150,noflip:1},
 x_fairy: {hp:1000,spd:1.0,dmg:32,xp:170,r:54,big:1,boss:1,fly:1,src:'img/fairy.webp',ring:120,noflip:1},
 x_shadow:{hp:1000,spd:1.0,dmg:34,xp:180,r:56,big:1,boss:1,src:'img/shadow.webp',ring:100,noflip:1},
 x_soul:  {hp:1000,spd:1.1,dmg:36,xp:200,r:56,big:1,boss:1,fly:1,src:'img/soul.webp',ring:95,call:420,noflip:1}});
Object.assign(FOES,{x_kura:{n:'■ー■',col:'#9ee03a'},x_tako:{n:'タ■■■ン',col:'#ff4a4a'},x_fairy:{n:'■ェ■■ー',col:'#7fb0ff'},x_shadow:{n:'シ■■ー',col:'#c0c4d0'},x_soul:{n:'■ウ■',col:'#4a8aff'}});
/* ふつうの敵と強敵：第1章・第2章の層から集めて、バグ版として出す */
const INF_POOL=(()=>{const s=new Set(),el=new Set();['alley','factory','under','upper','sky','jk','jt','jm','jb','js','jr','jg'].forEach(k=>{const A=FAREA[k];if(!A)return;(A.mix||[]).forEach(m=>(m[1]||[]).forEach(x=>{if(FFOE[x]&&!FFOE[x].boss)s.add(x)}));if(A.elite)el.add(A.elite)});
 Object.keys(FAREA).forEach(k=>{const A=FAREA[k];if(A&&A.mix&&!/^i\d$/.test(k))A.mix.forEach(m=>(m[1]||[]).forEach(x=>{if(FFOE[x]&&!FFOE[x].boss&&!FFOE[x].big)s.add(x)}));if(A&&A.elite&&FFOE[A.elite])el.add(A.elite)});
 return{foes:[...s].filter(x=>!FFOE[x].big),elites:[...el]}})();
{let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,pk=(a,n)=>{const c=a.slice(),o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(rnd()*c.length),1)[0]);return o};
 const ID={scrap:.02,titan:.008,cell:.008,carbon:.008,core:.006,noise:.012};
 ['i1','i2','i3','i4','i5'].forEach((k,i)=>{const P=pk(INF_POOL.foes,8);
  FAREA[k]={mix:[[0,P.slice(0,2),1.5],[25,P.slice(1,4),2.2],[70,P.slice(3,6),3],[130,P.slice(4,7),3.7],[200,[P[7],P[0],P[5]].filter(Boolean),4.6]],
   elite:INF_POOL.elites[i%INF_POOL.elites.length]||'j_scale',boss:INF_BOSS[i],drop:ID,chestTool:null,ground:['#0a1418','90,220,230']}})}
FLOOR_IMG.inf='img/floor/inf.webp';
Object.assign(FLOOR_TINT,{i1:['inf','rgba(0,0,0,.05)'],i2:['inf','rgba(80,0,40,.18)'],i3:['inf','rgba(0,40,120,.18)'],i4:['inf','rgba(40,0,80,.22)'],i5:['inf','rgba(0,10,60,.30)']});
/* ノイズの欠片・記憶の結晶（どちらも今は使えない。第3章で使う） */
Object.assign(MATS,{noise:{n:'ノイズの欠片',d:'無限の塔で拾える、ノイズのかたまり。今の技では扱えない（第3章で使えるようになる）'},
 mcrys:{n:'記憶の結晶',d:'無限の塔の陣に残っていた記憶のかけらが固まったもの。ノイズが混じっていて、今の技では扱えない（第3章で使えるようになる）'}});
Object.assign(UI_IC,{noise:'m_noise',mcrys:'m_mcrys'});
MAT_ORDER.splice(MAT_ORDER.indexOf('core')+1,0,'noise','mcrys');
Object.assign(SVG_IC,{
 noise:'<rect x="5" y="7" width="22" height="18" rx="2" fill="#142024" stroke="#5ae6e6" stroke-width="1.5"/><path d="M7 11h9M18 11h7M7 15h4M13 15h12M7 19h11M20 19h5M7 23h6" stroke="#ff4ad8" stroke-width="1.6"/><path d="M8 13h6M17 17h7" stroke="#5ae6e6" stroke-width="1.2"/>',
 mcrys:'<polygon points="16,3 25,12 21,29 11,29 7,12" fill="#3a6ad8" stroke="#bfe0ff" stroke-width="1.5"/><polygon points="16,3 19,12 16,29 13,12" fill="#8ac4ff" opacity=".8"/><path d="M8 18h3M21 15h3" stroke="#ff4ad8" stroke-width="1.4"/>'});
/* 強さ：1F＝第1章の中ごろ（eff 10）→ 20F＝審判の塔の頂上（eff 48）→ そのあと1階ごとに +0.95 */
const infEff=f=>(f||1)<=20?8+(f||1)*2:48+((f||1)-20)*.95;
TW_TABLE.inf={
 FLOORS:IFLOORS,
 FLOOR_MATS:Object.fromEntries(Array.from({length:INF_N},(_,i)=>[i+1,[['titan','cell','carbon'][i%3],'noise']])),
 BOSS_HP:Object.fromEntries(Array.from({length:INF_N/10|0},(_,i)=>{const f=(i+1)*10;return[f,+FSCALE(infEff(f)).hp.toFixed(2)]})),
 REC_POW:Object.fromEntries(Array.from({length:INF_N},(_,i)=>{const h=FSCALE(infEff(i+1)).hp/FSCALE(20).hp;return[i+1,Math.round(2200*h/50)*50]})),
 HELPER_FL:{},FLOOR_LINES:{},START_LV:{},
 feff:infEff};
TOWERS.inf={n:'無限の塔',ready:INF_LIVE,soon:'ver2.1.0 で公開',go:()=>{enterTower('inf');openDest()}};
{const p=WMAP.places.find(q=>q.k==='inf');if(p)Object.assign(p,{tw:'inf',n:'雲海',t:'無限の塔',d:'すべての塔のもとになった「始原の陣」の塔。陣は今も伸び続け、伸びたところからバグが生まれている。てっぺんは見えない。',
 open:()=>INF_TEST||!!(G.flags&&G.flags.tw_judge),hint:'雲の上に、てっぺんの見えない塔の影がある……'})}

/* ---------- 出撃先：毎回1階から。中断した挑戦があれば続きから ---------- */
const infRun=()=>G&&G.infRun&&G.infRun.fl>0?G.infRun:null;
{const _od=openDest;openDest=function(){if(towerAt()!=='inf')return _od.apply(this,arguments);show('dest');const R=infRun(),best=G.infBest|0;
 const t=$('destTw');if(t)t.textContent='無限の塔';
 $('destList').innerHTML=`<div class="note" style="margin-bottom:6px">終わりのない塔。毎回<b>1階から、Lv1から</b>登る。階段で上へ進み続け、倒れたら挑戦はおしまい。とちゅうで帰ったりアプリを閉じたりしても、次は同じ挑戦の続きから。長くいると「ノイズLv」が上がって敵が強くなり、5分をこえると「陣のゆがみ」でHPがけずれ続ける。</div>`+
  (R?`<button class="flr next" id="infCont"><span class="fn">${R.fl}F</span><span class="ft"><b>続きから（${R.fl}階）</b><small>Lv${R.lv}　体力 ${Math.round((R.hp||1)*100)}%　この挑戦で ${R.got|0} 個の記憶の結晶</small><span class="drec ${teamPow()>=REC_POW[R.fl]?'ok':'ng'}">推奨戦力 ${REC_POW[R.fl]}　いま ${teamPow()}</span></span><span class="fs">${UIMG('n_floor',26)}再開</span></button>`:'')+
  `<button class="flr ${R?'':'next'}" id="infNew"><span class="fn">1F</span><span class="ft"><b>${R?'はじめから（1階）':'1階から挑戦'}</b><small>${R?'いまの挑戦はおしまいになる':'Lv1 から登る'}</small><span class="drec ok">推奨戦力 ${REC_POW[1]}〜　いま ${teamPow()}</span></span><span class="fs">${UIMG('n_unlock',26)}出撃</span></button>`+
  `<div class="note" style="text-align:center;margin-top:8px">この塔での最高：${best}F　／　記憶の結晶 ${G.mats.mcrys|0} 個</div>`;
 const c=$('infCont');if(c)c.onclick=()=>infGo(true);
 $('infNew').onclick=()=>{if(infRun()&&!confirm('いまの挑戦をやめて、1階からやり直しますか？'))return;infGo(false)}}}
async function infGo(cont){const R=cont?infRun():null;if(!R){G.infRun={fl:1,lv:1,got:0,t0:Date.now()};save()}G.infResume=!!R;await goFloor(R?R.fl:1)}
/* 階に入ったら挑戦の続きを残す。再開のときはレベル・技・体力を戻す */
function infSnap(){const D=FD;if(!D||towerAt()!=='inf')return;const R=G.infRun||(G.infRun={got:0,t0:Date.now()});
 Object.assign(R,{fl:D.floor,lv:D.lv,xp:D.xp,need:D.need,atk:{...D.atk},ps:{...D.ps},hp:D.maxhp?D.hp/D.maxhp:1,kills:D.kills|0,pend:D.pendingLv|0});save()}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(towerAt()==='inf'&&FD){const R=infRun();
  if(G.infResume&&R&&R.fl===fl){const D=FD;D.lv=R.lv||1;D.xp=R.xp||0;D.need=R.need||D.need;if(R.atk)Object.assign(D.atk,R.atk);if(R.ps)Object.assign(D.ps,R.ps);D.hp=Math.max(1,Math.round(D.maxhp*(R.hp||1)));D.kills=R.kills|0;D.pendingLv=R.pend|0;D.startFl=R.startFl||1;renderFHud()}
  G.infResume=false;FD.infStart=(infRun()&&infRun().startFl)||1;infSnap()}return r}}
{const _a=fAdvance;fAdvance=async function(nf){const r=await _a.apply(this,arguments);if(towerAt()==='inf')infSnap();return r}}
/* 階をクリアしたら結晶。ランキング用の最高記録も */
function infGain(fl){const n=(fl>50?2:1)+(fl%10===0?5:0);G.mats.mcrys=(G.mats.mcrys|0)+n;if(G.infRun)G.infRun.got=(G.infRun.got|0)+n;if(FD)FD.infGot=(FD.infGot|0)+n;if(fl>(G.infBest|0)){G.infBest=fl;if(G.prof)G.prof.dirty=1}
 if(FD)FD.pops.push({x:FD.x,y:FD.y-60,v:`記憶の結晶 +${n}`,t:0});return n}
/* 終わりのない階段：頂上の判定をせず、ボスのあとは「続ける／中断して帰る」 */
{const _fs=fStairs;fStairs=async function(){if(towerAt()!=='inf')return _fs.apply(this,arguments);const D=FD;if(!D||D.climbing)return;D.climbing=true;D.paused=true;fReleaseStick();
 const fl=D.floor,FLR=FLOORS[fl],k=D.area;const first=commitFloor(fl);infGain(fl);sfx.win&&sfx.win();
 try{if(FLR.boss){if(first&&BOSS_WIN[k])await talk(storyFit(BOSS_WIN[k],null,['onmyo','takumi','mouse','robot']));
   if(fl>=50&&!G.flags.inf50){G.flags.inf50=1;save();await talk(storyFit(INF_50,null,['onmyo','takumi','mouse','robot']),'ev_inf_50')}
   if(!await fChoice(fl)){infSnap();Object.assign(G.infRun,{fl:fl+1,hp:Math.min(1,(D.hp+D.maxhp*.2)/D.maxhp)});save();fEnd('home');return}}
  await fAdvance(fl+1)}
 finally{if(FD===D&&D.run)D.climbing=false}}}
/* 終わり：倒れたら挑戦はおしまい。帰っただけなら続きから */
{const _e=fEnd;fEnd=function(why){const D0=FD||{},inf=towerAt()==='inf'&&FD&&!FD.ending;if(inf&&why==='dead'){G.infLast=G.infRun?{fl:FD.floor,got:G.infRun.got|0}:null;G.infRun=null;save()}
 const r=_e.apply(this,arguments);
 if(inf){const R=infRun(),b=$('resBtns'),gz=document.querySelector('#resP .rzg'),gn=D0.infGot|0;
  if(gz&&gn){if(!gz.querySelector('.rzt'))gz.innerHTML='';gz.insertAdjacentHTML('beforeend',`<div class="rzt">${MIC('mcrys',34)}<b>×${gn}</b><i>記憶の結晶</i></div>`)}if(b){b.innerHTML='';addBtn(R?`続きから（${R.fl}階）`:'1階から挑戦',()=>{$('result').classList.remove('fres');enterTower('inf');infGo(!!R)},'gold');addBtn('ホームへ',afterField)}
  let nx=document.querySelector('#resP .rznx');if(!nx){const rz=document.querySelector('#resP .rz');if(rz){nx=document.createElement('div');nx.className='rznx';rz.appendChild(nx)}}if(nx)nx.innerHTML=`${UIMG('n_floor',26)}<span>${R?`次は <b>${R.fl}階</b> から続きを登れる`:'挑戦はおしまい。次は1階から'}</span>　<em>最高 ${G.infBest|0}F</em>`}
 return r}}
{const _fc=fChoice;fChoice=function(fl){const p=_fc(fl);if(towerAt()==='inf'){const h=$('fnHome');if(h)h.innerHTML='中断して帰る<small class="bsm">次は '+(fl+1)+'階から続きを登れる</small>'}return p}}

/* ---------- ことば：錆 → ノイズ、錆の大波 → 陣のゆがみ ---------- */
const I_BANNER={'錆の大波が近づいている…… あと1分でこの階は錆にのまれる':'陣のゆがみが近づいている…… あと1分でこの階がゆがむ',
 '錆の大波！ この階はもう持たない':'陣のゆがみ！ 床がほどけていく','錆が濃くなってきた…… 長居すると敵がどんどん強くなる':'ノイズが濃くなってきた…… 長居すると敵がどんどん強くなる'};
{const _b=fBanner;fBanner=function(t,...a){if(towerAt()==='inf'){if(I_BANNER[t])t=I_BANNER[t];else t=String(t).replace(/錆Lv/g,'ノイズLv')}return _b(t,...a)}}
/* 陣のゆがみ：画面にノイズの帯が走る */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(towerAt()!=='inf')return;const W=g.canvas.width,H=g.canvas.height;g.save();g.setTransform(1,0,0,1,0,0);
 const k=D.wave&&!D.boss?1:.25;for(let i=0;i<(D.wave?7:2);i++){if(Math.random()>.5*k)continue;const y=Math.random()*H,h=2+Math.random()*(D.wave?14:5);g.globalAlpha=.10+.2*k;g.fillStyle=Math.random()<.5?'#5ae6e6':'#ff4ad8';g.fillRect(0,y,W,h)}
 if(D.wave&&!D.boss){g.globalAlpha=.12+.06*Math.sin(D.t*9);g.fillStyle='#08262c';g.fillRect(0,0,W,H)}g.restore()}}

/* ---------- バグ版の絵：色ずれ（赤と青）・横線のぬけ。ボスは影のように暗く ---------- */
const GLITCH={};
function glitchOf(base,key,dark){const ks=key+(dark?'#d':'#g');if(GLITCH[ks])return GLITCH[ks];const W=base.width,H=base.height,out=[];
 for(let v=0;v<3;v++){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),off=Math.max(2,Math.round(W*.03))*(v===1?-1:1);
  g.globalCompositeOperation='source-over';g.globalAlpha=.65;g.drawImage(base,off,0);g.globalCompositeOperation='source-atop';g.fillStyle='#ff2a6a';g.fillRect(0,0,W,H);
  g.globalCompositeOperation='destination-over';g.globalAlpha=.65;const c2=document.createElement('canvas');c2.width=W;c2.height=H;const g2=c2.getContext('2d');g2.drawImage(base,-off,0);g2.globalCompositeOperation='source-atop';g2.fillStyle='#2ae6ff';g2.fillRect(0,0,W,H);g.drawImage(c2,0,0);
  g.globalCompositeOperation='source-over';g.globalAlpha=1;g.drawImage(base,0,0);
  if(dark){g.globalCompositeOperation='source-atop';g.globalAlpha=.62;g.fillStyle='#0a0418';g.fillRect(0,0,W,H);g.globalAlpha=1}
  g.globalCompositeOperation='destination-out';let s=(v+1)*977;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<(dark?9:5);i++){const y=r()*H;g.fillRect(0,y,W,1+r()*Math.max(2,H*.025))}
  g.globalCompositeOperation='source-over';for(let i=0;i<3;i++){const y=r()*H,h=2+r()*H*.05,dx=(r()-.5)*W*.12;g.drawImage(base,0,y,W,h,dx,y,W,h)}
  out.push(c)}
 return GLITCH[ks]=out}
{const _f=fspr;fspr=function(src,size){const s=_f(src,size);if(!s||typeof towerAt!=='function'||towerAt()!=='inf'||!/^img\/foe\//.test(src))return s;
 const m=/^img\/foe\/(\w+)\.webp$/.exec(src),k=m&&m[1],dark=k&&k.startsWith('x_');const v=glitchOf(s,src+'@'+size,dark);const t=performance.now();
 /* ほとんどは1枚目。ときどきちらつく */
 const i=(Math.floor(t/90)+(size*7))%23<3?1+((Math.floor(t/60))%2):0;return v[i]}}

/* ---------- 物語：はじまり・10階ごとのボス・50階 ---------- */
const MO='mouse',MN='チュータ',RB='robot',RN='メカロボ',IW='wolf',IWN='ウルフ',IT='takumi',ITN='匠';
const INF_OPEN=[N_('霧が晴れた地図の奥。雲をつきぬけて、どこまでも高い塔が立っていた。'),
 [MO,MN,'ここが、無限の塔……。てっぺんが見えないチュー。'],[IW,IWN,'創技の塔へ行く前に、敵がどんなもんか見ておこうぜ。'],
 [RB,RN,'ピ……塔ノ陣ヲ、読ミトリ中……。'],[MO,MN,'待って、ロボ。この陣、今も伸びてる……！ 伸びたところから、バグが生まれてるチュー。'],
 [IT+':serious',ITN,'やはり、今は直しきれない。……でも、伸びる先のバグなら、倒して止められる。'],
 [RB,RN,'ピピ……陣ノ奥ニ、知ラナイ記録ガ、アリマス。'],[MO,MN,'ボクとロボで、少しずつ読んでみるチュー。登れば、きっと何か分かるチュー！'],
 [IW,IWN,'よし。行けるところまで、行ってみようぜ。']];
Object.assign(BOSS_TALK,{
 i1:[[null,'■ー■','ピ……ギギ……さ、び……キラ……ぷ……る……']],
 i2:[[null,'タ■■■ン','ゼン……イン……タイレ、ツ……ヲ……■■■'],N_('八つの影が、ばらばらの向きで襲ってくる。')],
 i3:[[null,'■ェ■■ー','コ……ン……ニチ……ハ……ちょう……たち、も……■■'],N_('ノイズの中を、青い蝶がちらちらと舞う。')],
 i4:[[null,'シ■■ー','キ……コエ、ヌ……オト、ハ……ナ、イ……■■■■'],N_('耳ざわりな爆音が、ひびいては途切れる。')],
 i5:[[null,'■ウ■','ケ……ケッ……サ、ビ……キカ、ナ……■■■'],N_('青い炎の斬撃が、ノイズを裂いて飛んでくる。')]});
Object.assign(BOSS_WIN,{
 i1:[[MO,MN,'ことばの終わりが「ぷる」……。だれかのまねをしてるみたいだったチュー。'],[RB,RN,'ピ……記録ヲ一部、読ミトリ。「この塔は、わたしたちが建てた」']],
 i2:[[IW,IWN,'さっきの、まるで隊列を組もうとして、組めなかったみたいだったな。'],[RB,RN,'ピ……記録。「ひとりでは、建てられなかった」']],
 i3:[[MO,MN,'青い蝶……。こわれてるのに、きれいだったチュー。'],[RB,RN,'ピ……記録。「わたしたちの技を、陣に刻んだ」']],
 i4:[[IT+':serious',ITN,'……あの音、ひびの場所を探していた。腕のいい職人の耳だ。'],[RB,RN,'ピ……記録。「陣は、止まらずに伸びていく」']],
 i5:[[MO,MN,'ロボ、今までの記録を、全部つなげてみるチュー！'],
  [RB,RN,'ピ……ピ……「この塔は、わたしたちが建てた。ひとりでは、建てられなかった。わたしたちの技を、陣に刻んだ。陣は、止まらずに伸びていく。——未来の職人へ、続きをたのむ。初代マイスター」']]});
const INF_50=[[IW,IWN,'……続きを、たのむ、か。'],[IT+':serious',ITN,'ボスたちは、この人たちを写しそこなったものなんだ。……今の技じゃ、それ以上は読めない。'],
 [MO,MN,'新しい技を身につけたら、きっと全部読めるチュー。創技の塔へ、行かなきゃ！'],N_('それでも塔は、雲の上へ伸び続けている。\n\n（50階より上は、どこまで登れるかの勝負。ランキングで競おう）')];
/* 層に入るとき（10階ごと） */
Object.assign(AREA_INTRO,{
 i1:[N_('記憶の層。床も壁も、ときどき文字化けしたようにゆらぐ。')],
 i2:[N_('隊列の層。どこかで、そろわない足音がひびいている。')],
 i3:[N_('光の層。ノイズの向こうで、青い光がちらちらと舞う。')],
 i4:[N_('残響の層。遠くで、途切れ途切れの爆音が鳴っている。')],
 i5:[N_('蒼炎の層。ノイズの中に、青い炎が見えかくれする。')]});
/* はじめて入るとき */
{const _g=goFloor;goFloor=async function(f){if(towerAt()==='inf'&&!G.flags.infOpen){G.flags.infOpen=1;save();await talk(storyFit(INF_OPEN,null,['mouse','robot','takumi','wolf']),'ev_inf_open')}return _g.apply(this,arguments)}}
/* 会話で写しそこないが話すとき、暗くノイズのかかった本人の絵 */
Object.keys(FOES).filter(k=>k.startsWith('x_')).forEach(k=>{TALK_FOE[FOES[k].n]=k});
/* セーブの補い */
{const _fx=fixV2;fixV2=function(g){const r=_fx.apply(this,arguments);if(g){g.infBest=g.infBest|0;if(g.mats){g.mats.noise=g.mats.noise|0;g.mats.mcrys=g.mats.mcrys|0}}return r}}
/* ストーリーをふりかえる：無限の塔（ラベルは「無○F」） */
{const _ss=storyScenes;storyScenes=function(){const S=_ss(),f=G.flags||{};
 if(f.infOpen)S.push({n:300,lb:'無',t:'無限の塔　はじまり',run:()=>talk(storyFit(INF_OPEN,null,['mouse','robot','takumi','wolf']),'ev_inf_open')});
 ['i1','i2','i3','i4','i5'].forEach((k,i)=>{const fl=(i+1)*10;if(G.cleared.includes(INF_BOSS[i]))S.push({n:300+fl+.5,lb:'無'+fl+'F',t:'写しをたおした',run:()=>talk(storyFit(BOSS_WIN[k],null,['onmyo','takumi','mouse','robot']))})});
 if(f.inf50)S.push({n:351,lb:'無50F',t:'初代マイスターの記録',run:()=>talk(storyFit(INF_50,null,['onmyo','takumi','mouse','robot']),'ev_inf_50')});
 return S.sort((a,b)=>a.n-b.n)}}
