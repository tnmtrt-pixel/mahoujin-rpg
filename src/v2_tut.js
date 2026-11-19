/* ===================== チュートリアル（練習場）と無料ガチャ（ver2.4.0） =====================
 * ・はじまりの会話のあと、練習場（1階だけの塔 'tut'）へ。ホー博士の通信で、ひとつずつ教える
 *   1 なぞって動く（光る印まで）→ 2 敵を3体倒す → 3 レベルアップで技を選ぶ → 4 落ちたものを拾う → 5 出口に入る
 *   練習場では倒れない（体力は1で止まる）・錆の知らせや強敵や箱は出ない。上の「とばす」でいつでも終われる
 * ・練習場を出たら、はじめての無料ガチャ（1回）。そのあとは毎日1回、無料で引ける（日本時間の日付で切りかわる）
 * ・前からのセーブ：はじまりの会話を読み終えていれば、練習場は終わったことにする */
Object.assign(AREAS,{t0:{...AREAS.alley,n:'練習場',boss:null}});
LAYER_NAME.t0='練習場';FLOOR_IMG.t0=FLOOR_IMG.alley;
FAREA.t0={mix:[[0,['slime'],1.2]],elite:'golem',boss:null,drop:{scrap:.03},chestTool:null,ground:FAREA.alley.ground};
TW_TABLE.tut={FLOORS:[null,{n:'練習場',area:'t0',step:1,stair:500,boss:false}],FLOOR_MATS:{1:['scrap']},BOSS_HP:{},REC_POW:{1:0},HELPER_FL:{},FLOOR_LINES:{},START_LV:{},feff:()=>1};
const TUT_STEPS=['画面をなぞって、光る印まで歩いてみよう','攻撃は自動じゃ。敵に近づいて、3体倒してみよう','光る石を拾うと経験値。レベルが上がったら、強くする技を1つ選ぼう','倒した敵が落とした、コインや素材を拾ってみよう','出口が開いた。矢印の方へ進んで、出口に入ろう'];
const tutOn=()=>towerAt()==='tut'&&FD&&FD.run;
function tutBox(){let el=document.getElementById('tutBox');if(!el){el=document.createElement('div');el.id='tutBox';document.body.appendChild(el)}return el}
function tutShow(){const D=FD,el=tutBox();if(!tutOn()){el.classList.remove('on');return}const s=D.tut.s;
 el.innerHTML=`<img src="${FACE('owl')}" alt=""><div><small>練習場　${Math.min(s+1,5)}/5</small><b>${TUT_STEPS[Math.min(s,4)]}</b></div><button id="tutSkip">とばす</button>`;el.classList.add('on');
 $('tutSkip').onclick=()=>{if(confirm('練習場を終えて、ホームへ行きますか？'))tutFinish(true)}}
async function tutStart(){if(!G)return;G.flags.ai_t0=1;enterTower('tut');await goFloor(1)}
/* 練習場の始まり：強敵・箱・階段はあとで出す */
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(towerAt()==='tut'&&FD){const D=FD;D.elite=FT.ELITE.length;D.chestN=FT.CHEST.length;D.stairs=null;D.stairShown=true;
  D.tut={s:0,mx:D.x,my:D.y-230,k0:D.kills|0};tutShow()}else tutBox().classList.remove('on');return r}}
/* 1歩ずつ進める */
{const _u=fUpdate;fUpdate=function(f){_u(f);const D=FD;if(!D||!D.tut||towerAt()!=='tut'||!D.run||D.paused)return;const T=D.tut,s0=T.s;
 if(T.s===0&&Math.hypot(D.x-T.mx,D.y-T.my)<60){T.s=1;T.k0=D.kills|0}
 else if(T.s===1&&(D.kills|0)-T.k0>=3){T.s=2;T.lv0=D.lv;for(let i=0;i<14;i++){const a=i/14*TAU;D.gems.push({x:D.x+Math.cos(a)*120,y:D.y+Math.sin(a)*120,v:2})}}
 else if(T.s===2&&D.lv>T.lv0&&!(D.pendingLv>0)){T.s=3;const a=D.mva!=null?D.mva:-Math.PI/2;T.items=[];for(let i=0;i<4;i++){const it={x:D.x+Math.cos(a)*(140+i*30)+(i%2?20:-20),y:D.y+Math.sin(a)*(140+i*30),k:i<3?'coin':'scrap',v:i<3?COIN_DROP:undefined};D.items.push(it);T.items.push(it)}}
 else if(T.s===3&&T.items.every(it=>it.got)){T.s=4;const a=Math.random()*TAU;D.stairs={x:D.x+Math.cos(a)*280,y:D.y+Math.sin(a)*280,open:true};D.stairShown=true;tone(990,.2,'triangle',.1,1480)}
 if(T.s!==s0){tutShow();try{tone(1320,.08,'triangle',.06,1760)}catch(_){}}
}}
/* 練習場では倒れない・知らせの帯は出さない */
{const _h=fHurt;fHurt=function(v,src){const r=_h(v,src);if(towerAt()==='tut'&&FD)return Math.max(0,Math.min(r,FD.hp-1));return r}}
{const _b=fBanner;fBanner=function(t,...a){if(towerAt()==='tut')return;return _b(t,...a)}}  /* 練習場では上の案内だけを出す */
/* 光る印（手順1） */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(!D.tut||towerAt()!=='tut'||D.tut.s!==0)return;const T=D.tut,k=.5+.5*Math.sin(D.t*5);g.save();
 g.strokeStyle='#ffd25a';g.lineWidth=4;g.globalAlpha=.5+.5*k;g.beginPath();g.arc(T.mx,T.my,34+8*k,0,TAU);g.stroke();g.fillStyle='rgba(255,210,90,.25)';g.beginPath();g.arc(T.mx,T.my,28,0,TAU);g.fill();g.restore()}}
/* 出口に入ったら終わり */
{const _fs=fStairs;fStairs=async function(){if(towerAt()!=='tut')return _fs.apply(this,arguments);const D=FD;if(!D||D.climbing)return;D.climbing=true;tutFinish(false)}}
/* 結果画面は出さずに、ホームへ。そのあと無料ガチャの案内 */
async function tutFinish(skip){const D=FD;tutBox().classList.remove('on');if(D&&D.run){D.tut=null;try{fEnd('home')}catch(_){}}
 G.flags.tut=1;G.flags.tutNew=1;G.flags.freeG=1;save();
 const r=$('result');if(r&&r.classList.contains('on')){r.classList.remove('on','fres')}
 openHome();await talk([['owl','ホー博士',skip?'ホッホッ、もう分かっておるか。頼もしいのう。':'ホッホッ、上出来じゃ！ これで塔を登る準備はできた。'],['owl','ホー博士','さて、ひとりで登るのは心細かろう。工房の「ガチャ」で、仲間を呼んでみるのじゃ。\nはじめの1回は、わしのおごりじゃよ。'],[null,'','（ガチャは、このあとも毎日1回、無料で引けます）']]);
 goTab('gacha')}
/* はじまりの会話のあと／続きから で、まだ練習場が終わっていなければ */
{const _pi=playIntro;playIntro=async function(){await _pi.apply(this,arguments);if(G&&G.flags.tut===0)await tutStart()}}
{const _rg=resumeGame;resumeGame=async function(){if(G&&G.flags.intro===1&&G.flags.tut===0){openHome();await tutStart();return}return _rg.apply(this,arguments)}}
{const _fx=fixV2;fixV2=function(g){const r=_fx.apply(this,arguments);if(g&&g.flags&&g.flags.tut==null)g.flags.tut=g.flags.intro?1:0;return r}}

/* ---------- 無料ガチャ：はじめての1回＋毎日1回 ---------- */
const jstDay=()=>new Date(Date.now()+9*3600e3).toISOString().slice(0,10);
const freeGacha=()=>!!(G&&(G.flags.freeG||G.freeDay!==jstDay()));
{const _dg=doGacha;doGacha=function(n){const B=GACHA_BANNERS[gaBan];if(n===1&&freeGacha()&&!(B&&B.soon)){if(G.flags.freeG)G.flags.freeG=0;else G.freeDay=jstDay();G.coin=(G.coin|0)+GACHA_COST}return _dg.apply(this,arguments)}}
{const _rc=renderCharGacha;renderCharGacha=function(){_rc.apply(this,arguments);if(!freeGacha())return;const b=$('gaBody').querySelector('.gab:not(.ten)'),B=GACHA_BANNERS[gaBan];if(!b||(B&&B.soon))return;
 b.disabled=false;b.classList.add('free');b.innerHTML=`<b>1回</b><small>${G.flags.freeG?'はじめての無料':'今日の無料'}</small>`}}

/* ---------- 編成・工房の、はじめての説明（2.4.1）：その画面を初めて開いたときに一回だけ ---------- */
const SCR_GUIDE={
 party:{t:'編成のしかた',ic:FACE('wolf'),st:['パーティは最大5人。上の枠をタップして、下の一覧から入れる仲間を選ぶ','いちばん左がリーダー。リーダーの技は、出撃の最初からLv2で使える','仲間を選ぶと、技・能力・装備が見られる。コインで「強化」すると、レベルが上がって強くなる','武器や防具は工房で作って装備する。武器をSランク以上にすると、出撃中に技を「覚醒」できる','組み合わせの2人を入れると、金色の枠で「絆覚醒」の説明が出る']},
 shop:{t:'工房の使い方',ic:FACE('fox'),st:['「つくる」：図面と素材で、武器や防具を作る。加工はミニゲームで、うまくできるほどランクが上がる','「解読」：塔で拾った図面は、問題を解いて読み解くと、作れるようになる','「工具」：加工に使う道具。使うほど練度が上がって、その加工が楽になる','「素材」：持っている素材の一覧。足りない素材は、塔で拾える','「換金所」：いらない装備や素材を、コインに替えられる']}};
function scrGuide(k){const g=SCR_GUIDE[k];if(!g||!G||G.flags['gd_'+k])return;G.flags['gd_'+k]=1;save();
 setTimeout(()=>{$('gpBody').innerHTML=`<div class="rdh"><img src="${g.ic}" alt="" style="width:52px;height:52px;object-fit:contain"><div><b>${g.t}</b><small>はじめての説明</small></div></div><ol class="pgd">${g.st.map(x=>`<li>${x}</li>`).join('')}</ol><div class="gpf"><button class="btn gold" id="sgOk">わかった！</button></div>`;
  $('genPick').classList.add('on');$('sgOk').onclick=()=>$('genPick').classList.remove('on')},350)}
{const _op=openParty;openParty=function(){const r=_op.apply(this,arguments);scrGuide('party');return r}}
{const _os=openShop;openShop=function(){const r=_os.apply(this,arguments);scrGuide('shop');return r}}
/* 前からのセーブには出さない */
{const _fx=fixV2;fixV2=function(g){const r=_fx.apply(this,arguments);if(g&&g.flags&&g.flags.tut===1&&g.flags.gd_party==null&&g.flags.tutNew!==1){g.flags.gd_party=1;g.flags.gd_shop=1}return r}}
