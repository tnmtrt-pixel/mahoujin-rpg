/* ===================== お助け仲間・階ごとの一言・技の進化と覚醒・磁石 ===================== */

/* ---------- 磁石：拾うと、画面のまわりの経験値を全部集める ---------- */
UI_IC.magnet='i_magnet';
const MAGNET_RATE={normal:.004,elite:.35};
{const _k=fKill;fKill=function(e){_k(e);if(!FD)return;const r=e.boss?1:e.big?MAGNET_RATE.elite:MAGNET_RATE.normal;if(Math.random()<r)FD.items.push({x:e.x+12,y:e.y-12,k:'magnet'})}}
{const _g=fGot;fGot=function(it){if(it.k==='magnet'){FD.gems.forEach(g=>g.mag=1);fBanner('磁石！ まわりの経験値を全部集める',120,'i_magnet');tone(660,.2,'triangle',.08,1320);return}return _g(it)}}

/* ---------- お助け仲間：層ごとに1人。その挑戦の間だけ一緒に戦う。パーティにいれば強化 ---------- */
const HELPER={alley:'fox',factory:'dodo',under:'owl'};
const HELPER_AGAIN={fox:'また会ったね！ 今回も手伝うよ。直す役は任せて！',dodo:'お、また来たね〜。前に立つのは先輩にまかせて〜。',owl:'ホッホッ、また会うたな。今回もわしの計算を貸そう。'};
function helperSetup(){if(!FD)return;FD.helped=FD.helped||{};const id=(typeof HELPER_FL!=='undefined'&&HELPER_FL[FD.floor])||HELPER[FD.area];if(!id||FD.helped[id]||FD.join)return;FD.join={id,shown:false,x:0,y:0,cool:0,helper:true}}
{const _j=fJoin;fJoin=async function(){const J=FD&&FD.join;if(!J||!J.helper)return _j();FD.paused=true;fReleaseStick();const id=J.id,nm=CHARS[id].name;
 try{const first=!G.flags['hp_'+id];await talk(first?(JOIN_TALK[id]||[]):[[id,nm,HELPER_AGAIN[id]]]);if(first){G.flags['hp_'+id]=1;save()}
  FD.helped[id]=true;FD.join=null;
  if(G.party.some(m=>m.id===id)||FD.atk[id]!=null){FD.atk[id]=Math.min(ATK_MAX,(FD.atk[id]||0)+2);FD.hboost=FD.hboost||{};FD.hboost[id]=1.2;
   await say(`${UIMG('u_help',44)} <span class="nw">${nm}が</span><span class="nw">力を貸してくれた！</span><br><span style="font-size:14px">${TIC(ATK[id].type,20)}${ATK[id].n} Lv+2・威力1.2倍（この挑戦の間）</span>`,1900)}
  else{const L=findOwn(G.lead),m=newMember(id,1);m.lv=(L&&L.lv)||1;FD.helperMs=FD.helperMs||{};FD.helperMs[id]=m;FD.atk[id]=2;
   await say(`${UIMG('u_help',44)} <span class="nw">お助け仲間！</span><br><span class="nw">${nm}が一緒に戦う</span><br><span style="font-size:14px">${TIC(ATK[id].type,20)}${ATK[id].n}（Lv2）が加わった。この挑戦の間だけ</span>`,2000)}}
 finally{show('field');resizeField();renderFHud();FD.paused=false;fLast=0;if(!fRaf)fRaf=requestAnimationFrame(fLoop)}}}

/* ---------- 階ごとの一言：入口・鍵を手に入れたとき・ボスの前（2回目から） ---------- */
const FLOOR_LINES={1:['錆のにおいが濃い……。気をつけて行こう','まずは強敵をさがして、階段の鍵だ'],2:['街灯が消えてる。足もとに注意だ','この先、敵がふえてくるぞ'],3:['廃材の山……ボスの気配がする','ここを越えれば下層はおしまいだ'],
 4:['ここから工場か。機械のにおいがする','中層の敵は硬い。装備は大丈夫か？'],5:['制御室……まだ動いてる機械があるな','強敵が鍵を持ってる。さがそう'],6:['クレーンが動いてる……来るぞ','中層のボスだ。気を引きしめよう'],
 7:['図面の回廊……壁一面に図面がある','上層だ。ここからが本番だ'],8:['錆の巣……空気が重い','錆が濃い。長居は禁物だ'],9:['鏡の作業台……自分の姿が映ってる','次は錆の炉だ。気を引きしめよう'],10:['錆の炉……すべての錆はここから','行こう。この塔の灯りを取りもどす']};
const KEY_LINES=['よし、鍵だ！ 上へ行こう','鍵を手に入れた！ 階段へ急ごう','これで階段が開くはず！'];
const BOSS_LINES={alley:'あのボスだ……前より強くなってる。でも負けない！',factory:'あのクレーンだ。気を抜くなよ',under:'錆の炉の主……決着をつけよう'};
function speaker(){const ps=G.party.filter(m=>m.id!==FD._lastSp),m=(ps.length?pick(ps):G.party[0]);FD._lastSp=m.id;return m.id}
function fSay(id,text){const fl=$('field');if(!fl)return;let el=$('fSay');if(!el){el=document.createElement('div');el.id='fSay';fl.appendChild(el)}
 el.innerHTML=`<span class="fsi"><img src="${FACE(id)}" alt=""></span><span class="fst"><b>${CHARS[id].name}</b>${text}</span>`;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');
 clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),3400)}
{const _b=fBossCome;fBossCome=async function(){const seen=G.flags['bt_'+AREAS[FD.area].boss];await _b();if(seen&&FD)fSay(G.lead,BOSS_LINES[FD.area]||'ボスだ！')}}

/* ---------- 技の進化と覚醒 ---------- */
/* 絆覚醒（2.2.0〜。もとの「進化」）：組み合わせの2人の技がどちらも覚醒している＋その2人の「絆のチャット」を読んでいる → 合体の動きが加わる。威力は覚醒の1.5倍のまま */
const EVO=[['wolf','onmyo','陰陽牙刃','連射の弾が敵を追いかける'],['fox','dodo','歯車の守り','まわる輪が衝撃波を出して敵をはじく'],['gorilla','rocker','雷鳴ライブ','雷のたびに音の波が広がる'],['mouse','robot','プログラム・レーザー','レーザーが次の敵へ飛び移り、少し回復'],['tsukiyo','owl','星図の陣','星の落ちた所に魔法陣が残る']];
const BOND_CHAT={wolf:'c_onmyo4',fox:'c_fox2',gorilla:'c_live3',mouse:'c_robo5',tsukiyo:'c_owl2'};  /* 組み合わせ（EVOの1人目）→ 絆のチャット */
const bondOwned=p=>p.slice(0,2).every(id=>id==='wolf'||!!owned(id)),bondRead=p=>(G.chatRead||[]).includes(BOND_CHAT[p[0]]);
const bondReady=p=>bondOwned(p)&&bondRead(p);
const EVO_IC={wolf:'ev_wolf',fox:'ev_fox',gorilla:'ev_dodo',mouse:'ev_gorilla',tsukiyo:'ev_tsukiyo'};
/* 覚醒：技が最大Lv＋その技の武器がSランク以上 → 威力1.5倍。1つの技は進化か覚醒のどちらか */
const evoOn=id=>!!(FD.evo&&EVO.some(p=>p.includes(id)&&FD.evo[p[0]]));
function fPowX(id){let m=1;if(!FD)return m;if(FD.awk&&FD.awk[id])m*=1.5;if(FD.hboost&&FD.hboost[id])m*=FD.hboost[id];return m}
function wRank(id){if(FD.helperMs&&FD.helperMs[id])return null;const g=id!==G.lead&&!G.party.some(m=>m.id===id)&&genFor(id);if(g)return g.rank;const m=findOwn(id);return m&&m.weapon&&m.weapon.rank}
function extraOpts(){const o=[];FD.evo=FD.evo||{};FD.awk=FD.awk||{};const mx=id=>(FD.atk[id]||0)>=ATK_MAX;
 Object.keys(FD.atk).forEach(id=>{if(mx(id)&&!FD.awk[id]&&!evoOn(id)&&['S','SS'].includes(wRank(id)))o.push('w:'+id)});return o}
function evoCardHTML(t,k){if(t==='e'){const p=EVO.find(x=>x[0]===k);return `<button class="fpick evo" data-k="e:${k}">${UIMG(EVO_IC[k],48)}<span><b>進化！ ${p[2]}</b><small>${ATK[p[0]].type}＋${ATK[p[1]].type}：${p[3]}。2つとも威力1.3倍</small></span><span class="lvt">${UIMG('u_evo',18)}進化</span></button>`}
 return `<button class="fpick evo awk" data-k="w:${k}"><span class="fpi"><img src="${CHARS[k].img}" alt="">${TIC(ATK[k].type,26)}</span><span><b>覚醒！ ${ATK[k].n}</b><small>武器のランク${wRank(k)}で覚醒。威力1.5倍${(()=>{const q=EVO.find(x=>x.includes(k)&&FD.awk&&FD.awk[x[0]===k?x[1]:x[0]]&&bondReady(x));return q?`。<b>絆覚醒「${q[2]}」も発動！</b>`:''})()}</small></span><span class="lvt">${UIMG('u_awk',18)}覚醒</span></button>`}
function evoPick(t,k){FD.evo=FD.evo||{};FD.awk=FD.awk||{};if(t==='e'){FD.evo[k]=true;const p=EVO.find(x=>x[0]===k);fBanner(`進化！「${p[2]}」`,170,EVO_IC[k])}else{FD.awk[k]=true;fBanner(`覚醒！「${ATK[k].n}」`,170,'u_awk');bondCheck()}tone(880,.3,'triangle',.1,1760)}
/* 覚醒がそろったら絆覚醒 */
function bondCheck(){const D=FD;if(!D)return;D.evo=D.evo||{};D.awk=D.awk||{};
 EVO.forEach(p=>{if(D.evo[p[0]]||!D.awk[p[0]]||!D.awk[p[1]]||!bondReady(p))return;D.evo[p[0]]=true;setTimeout(()=>{if(FD===D){fBanner(`絆覚醒！「${p[2]}」`,190,EVO_IC[p[0]]);tone(660,.25,'triangle',.1,1320)}},1500)})}
/* 合体の動き（進化したときだけ） */
{const _fa=fAttacks;fAttacks=function(f){const c=FD.cd,b={...c};_fa(f);const E=FD.evo;if(!E)return;const fired=id=>c[id]!=null&&b[id]!=null&&c[id]>b[id];
 if(E.wolf)FD.shots.forEach(s=>{const t=nearestFoes(1,s.x,s.y,260)[0];if(!t)return;const sp=Math.hypot(s.vx,s.vy)||7,ca=Math.atan2(s.vy,s.vx);let d=Math.atan2(t.y-s.y,t.x-s.x)-ca;d=Math.atan2(Math.sin(d),Math.cos(d));const na=ca+d*Math.min(1,.15*f);s.vx=Math.cos(na)*sp;s.vy=Math.sin(na)*sp});
 if(E.fox&&FD.orb){FD._ez=(FD._ez||0)+f;if(FD._ez>=60){FD._ez=0;const dmg=6*fPow('dodo');FD.orb.forEach(([x,y])=>FD.waves.push({x,y,r:8,max:70,dmg,kb:12,hit:new Set()}))}}
 if(E.gorilla&&fired('gorilla'))FD.waves.push({x:FD.x,y:FD.y,r:20,max:230,dmg:10*fPow('rocker'),kb:10,hit:new Set()});
 if(E.mouse&&fired('robot')){FD.hp=Math.min(FD.maxhp,FD.hp+1);let from={x:FD.x,y:FD.y-14};const hit=new Set();for(let i=0;i<3;i++){const t=FD.foes.filter(e=>!hit.has(e.id)&&(e.x-from.x)**2+(e.y-from.y)**2<(i?170:300)**2).sort((a,z)=>((a.x-from.x)**2+(a.y-from.y)**2)-((z.x-from.x)**2+(z.y-from.y)**2))[0];if(!t)break;FD.fx.push({k:'bolt',x:from.x,y:from.y,x2:t.x,y2:t.y,t:0});fDamage(t,10*fPow('mouse'),0,0);hit.add(t.id);from=t}}
 if(E.tsukiyo&&fired('tsukiyo')){const dmg=2.6*fPow('owl');nearestFoes(3,FD.x,FD.y,400).forEach(t=>FD.zones.push({x:t.x,y:t.y,r:44,t:0,life:100,dmg}))}}}

/* ---------- 毎フレームの見はり：階が変わったら、お助けの準備と入口の一言。鍵の一言 ---------- */
{const _u=fUpdate;fUpdate=function(f){const D=FD;if(D&&!D.climbing){if(D._fl!==D.floor){D._fl=D.floor;D._said=false;D._key=false;helperSetup()}
  if(!D._said&&D.t>1.2&&!D.paused){D._said=true;const L=FLOOR_LINES[D.floor];if(L)fSay(speaker(),pick(L))}
  if(D.stairs&&D.stairs.open&&!D._key&&!FLOORS[D.floor].boss){D._key=true;fSay(speaker(),pick(KEY_LINES))}}
 return _u(f)}}

/* ---------- 画面の足りないところ：鍵持ちの目印・進化／覚醒の光・お助け仲間の表示・はじめての加工の案内 ---------- */
function fDrawExtra(g,D){const t=D.t;
 /* 鍵を持った強敵：頭の上に鍵 */
 const ki=fspr('img/ui/f_key.webp',40);
 for(const e of D.foes){if(!e.key)continue;const y=e.y-e.r-30+Math.sin(t*5)*3;g.save();g.globalAlpha=.55+.45*Math.sin(t*6);g.strokeStyle='#ffc94a';g.lineWidth=2;g.beginPath();g.arc(e.x,y,17,0,TAU);g.stroke();g.globalAlpha=1;
  if(ki)g.drawImage(ki,e.x-15,y-15,30,30);else{g.fillStyle='#ffc94a';g.fillRect(e.x-6,y-6,12,12)}g.restore()}
 /* 進化・覚醒：自分のまわりに金の光。進化した連射の弾は金色の尾 */
 const n=Object.keys(D.evo||{}).filter(k=>D.evo[k]).length+Object.keys(D.awk||{}).filter(k=>D.awk[k]).length;
 if(n){g.save();g.globalAlpha=.35+.15*Math.sin(t*4);g.strokeStyle='#ffc94a';g.lineWidth=3;g.beginPath();g.arc(D.x,D.y-14,30+3*Math.sin(t*3),0,TAU);g.stroke();g.globalAlpha=1;g.fillStyle='#ffe58a';
  for(let i=0;i<n;i++){const a=t*2.4+i/n*TAU;g.beginPath();g.arc(D.x+Math.cos(a)*34,D.y-14+Math.sin(a)*34,3,0,TAU);g.fill()}g.restore()}
 if(D.evo&&D.evo.wolf){g.save();g.fillStyle='#ffd25a';for(const s of D.shots){g.globalAlpha=.5;g.beginPath();g.arc(s.x-s.vx*1.5,s.y-s.vy*1.5,4,0,TAU);g.fill();g.globalAlpha=.25;g.beginPath();g.arc(s.x-s.vx*3,s.y-s.vy*3,3,0,TAU);g.fill()}g.restore()}}
/* お助け仲間が今いること：拾った物の列の前に顔 */
{const _r=renderFHud;renderFHud=function(){_r();if(!FD)return;const ids=[...Object.keys(FD.helperMs||{}),...Object.keys(FD.hboost||{})];if(!ids.length)return;
 const h=ids.map(id=>`<span class="fhelp">${UIMG('u_help',18)}<img src="${FACE(id)}" alt="">${FD.hboost&&FD.hboost[id]?'強化':'お助け'}</span>`).join('');$('fLoot').insertAdjacentHTML('afterbegin',h)}}

/* はじめての加工の案内（本編で、その加工を初めてするときだけ） */
const PROC_GUIDE={
 file:['材料の上を、左右に大きくこする','まっすぐ・同じ速さで往復するほど、たくさん削れる','下の色が緑になったら止める。削りすぎると赤'],
 grind:['鉄の板を指で動かして、回る砥石に押し当てる','点線の形になるように削る','⟲⟳ボタンで板を45°回せる'],
 lathe:['下のハンドルを、指で円をえがくように回す','左＝刃物を左右へ、右＝刃物を深く','金色の線まで削れたら「仕上げる」'],
 hit:['輪がちぢんで、金色の円に重なった瞬間にタップ','ぴったりなほど、鉄が金色の線までのびる','輪は何度でもまたちぢむ。あわてなくていい'],
 cut:['タップで、はさみがひと切り進む','左右にドラッグすると、はさみの向きが変わる','角では止まって、向きを合わせてから切る'],
 weld:['トーチを指で動かして、つなぎ目をなぞる','下のメーターの金色の帯の速さで動かす','速すぎると細く、遅すぎると焼けすぎる'],
 wire:['同じ色の端子を、指でなぞってつなぐ','線どうしは交差できない','全部つないだら、ゲージが緑のときにタップ（はんだ付け）'],
 trace:['定規：始めから終わりまでドラッグ','コンパス：円の中心を押して、外へドラッグ','金色の点線にぴったり重ねる'],
 drill:['画面を長押しすると、刃が下がる','右のメーターを、緑の帯に保つ','赤まで押し続けると刃が折れる。少し離して調整'],
 tap:['ハンドルを、指で円をえがくように回す','右に半回転すすめたら、左に1/4もどす','もどさずに回し続けると、タップが折れる']};
function procGuide(pr){return new Promise(res=>{const st=PROC_GUIDE[pr];if(!st){res();return}
 $('gpBody').innerHTML=`<div class="rdh">${MIC(PROC_TOOL[pr],52)}<div><b>はじめての${PROC_LBL[pr]}</b><small>やり方</small></div></div><ol class="pgd">${st.map(x=>`<li>${x}</li>`).join('')}</ol>
  <div class="note">${UIMG('u_dojo',18)} 道場（工房の「加工ミニゲーム道場」）で、いつでも練習できる</div><div class="gpf"><button class="btn gold" id="pgOk">わかった！ はじめる</button></div>`;
 $('genPick').classList.add('on');$('pgOk').onclick=()=>{$('genPick').classList.remove('on');res()}})}
{const _p=runProc;runProc=async function(R,pr,st){if(typeof G!=='undefined'&&G&&!G.flags['guide_'+pr]){await procGuide(pr);G.flags['guide_'+pr]=1;save()}return _p(R,pr,st)}}

/* ---------- 世界観に合わせた台本の書きかえ（塔は昔から街に立つ／地下はない／10Fは前編の終わり） ---------- */
/* 仲間のセリフは、そのキャラが今のパーティにいるときだけ出す。だれもいなければ fb を足す */
function storyFit(L,fb,keep){const sp=l=>l[0]?String(l[0]).split(':')[0]:null,inP=id=>(typeof towerAt==='function'&&towerAt()!=='meister')||id===G.hero||(keep||[]).includes(id)||G.party.some(m=>m.id===id)||!!(typeof FD!=='undefined'&&FD&&FD.helperMs&&FD.helperMs[id]);
 const out=L.map(l=>!sp(l)||inP(sp(l))?l.slice(0,3):l[3]?[null,'',l[3]]:null).filter(Boolean);
 if(fb&&!out.some(l=>sp(l)&&sp(l)!==G.hero))out.splice(Math.max(1,out.length-3),0,...fb);
 return out}
INTRO.wolf=[
 [null,'','夜の工業の街「鉄灯（てっとう）」。\n街のまん中に、灯りの消えた古い塔が立っている。'],
 [null,'','昔、塔のてっぺんにはいつも灯りがともり、それが街の名前になった。\n十年前にその灯りが消えてから、塔の扉は閉ざされたままだ。'],
 ['wolf','ウルフ','……また停電かよ。国家資格の試験まで、あと一週間だってのに。'],
 ['wolf','ウルフ','工房の旋盤で、もう一回だけ練習を——\nん？ 塔の扉が、開いてる……？ 中から、オレンジ色のドロドロが出てきた！'],
 [null,'','金属を食らう夜の魔物「錆（サビ）」。\nそのとき、工房の棚から一枚の古い図面が光を放った。'],
 [null,'','この世界では、正確に描かれた図面が、そのまま魔法陣になる。\n図面のふちには、塔の入口と同じ言葉が刻まれていた。「夜に磨く、未来を創る力」'],
 ['wolf:serious','ウルフ','塔を建てた初代マイスターの言葉……だったか。\nよくわかんねぇけど、使えるもんは使う！ 国家資格の前に、まずはお前だ！']
];
AREA_INTRO.alley=[
 [null,'','塔の下層。中は、錆にのまれた街の路地のようになっていた。'],
 [null,'','塔は昔、街じゅうの錆を受け止めて、元の道具にもどしていたという。\n灯りが消えた今、受け止めきれなかった錆が、路地の形のまま積み上がっている。']
];
AREA_INTRO.factory=[
 [null,'','塔の中層。止まったままのベルトコンベアに、\n錆びた部品がずらりと並んでいる。ここで、錆を道具にもどしていたらしい。'],
 [null,'','「まだ使える」と誰かが書いた札が、床に落ちていた。\n奥で、何か巨大なものがきしむ音がする。']
];
AREA_INTRO.under=[
 [null,'','塔の上層。階段の先に、壁一面に図面が貼られた回廊が続いていた。'],
 [null,'','どれも、途中で描くのをやめたように、半分しかない。'],
 [null,'','さらに上から熱い風。止まったはずの炉が、赤く光っている。']
];
MIDBOSS_WIN.splice(0,MIDBOSS_WIN.length,
 [null,'','サビガルドは崩れ落ち、その胸から、\n光る図面のかけらがこぼれた。'],
 [null,'','かけらには、塔の中層の見取り図が描かれている。\n——錆を道具にもどしていた、古い工場の層だ。'],
 [null,'','下層 クリア！\n塔の中層（4F〜）へ登れるようになった。']);
FACTORY_BOSS_WIN.splice(0,FACTORY_BOSS_WIN.length,
 [null,'','ギギガントのアームが止まり、ゆっくりと床に下りた。'],
 [null,'錆クレーン ギギガント','ギ……マタ……ダレカ……ウゴカシテ……クレル……カ……'],
 [null,'','錆が落ちたクレーンの運転席に、小さな札が残っていた。\n「点検済　匠」——匠の字だ。'],
 [null,'','天井のハッチが開き、上へ続く階段が現れた。\n中層 クリア！ 塔の上層（7F〜）へ登れるようになった。']);
SELF_RUST.wolf[0]=[null,'','鏡の作業台の前で、ウルフの足が止まった。\n鏡に映った腕に、うっすらとオレンジ色の錆が浮かんでいる。'];
['dodo','fox','owl'].forEach(k=>{const l=SELF_RUST[k]&&SELF_RUST[k][0];if(l)l[2]=l[2].replace('炉の前で','鏡の作業台の前で')});
const SELF_RUST_FB=[[null,'','そのとき、ポケットの図面がかすかに光った。\nふちの言葉が目に入る。「夜に磨く、未来を創る力」'],
 [null,'','結果は一日で決まる。でも腕は、毎晩少しずつ磨かれてきた。\nそれは、もう誰にも消せない。']];
ENDING.splice(0,ENDING.length,
 [null,'','炉の炎が消えると、塔の窓の外で、東の空がうっすらと明るくなっていた。'],
 [null,'','見上げると、塔の中ほどに、小さな灯りがひとつともっている。\n十年ぶりの、鉄灯の塔の灯りだった。'],
 ['owl','ホー博士','錆は、捨てられた道具とあきらめた夢から生まれる……。\nそして、匠の図面を求めておった。','「錆は、捨てられた道具とあきらめた夢から生まれる」\n——ロストールの言葉が、耳に残っている。'],
 ['fox','ギアフォックス','図面で錆を消したいのか、それとも\n図面で「もう一度動きたい」のか……どっちなんだろ。'],
 ['dodo','ドド先輩','ま、今日のところは、みんな無事でよかったよ〜。\n……ふわぁ。帰って寝よっか。'],
 ['wolf:smile','ウルフ','おう。けど、休んだらまた磨くぞ。\n塔は、まだ上に続いてるんだからな。'],
 [null,'','そのとき、朝焼けの空を、小さな光がすっと横切った。\n鳥にしては、まっすぐすぎる。'],
 [null,'','第1章「夜の工房に灯る」前編　完'],
 [null,'','——次の夜。街じゅうの明かりが、いっせいに消えた。'],
 ['gorilla','ボルトゴリラ','ウホッ！？ 塔の上の層から、錆が電線に流れこんでやがる！\nおい、そこの職人たち、手を貸してくれ！'],
 [null,'','後編（11F〜20F）へつづく\n11Fから登れるようになった']);
JOIN_TALK.owl[1]=['owl','ホー博士','……まちがいない、匠の魔法陣じゃ。\nあやつの線は、ひと目見ればわかる。'];
