/* =====================================================================
   刻印メダルとピックアップガチャ（決定 11/20）
   ・本当のエンディングでアウルムから「記憶の結晶をコインに鋳なおす技」を教わると開く
   ・鋳なおし：記憶の結晶10個 → 刻印メダル1枚（ガチャの画面で）
   ・1回＝刻印メダル3枚、11回＝30枚。出るのは塔を建てた時代のマイスター5人（ソウル・フェアリー・シャドー・クーラ・タコナイン）、同じ確率。かぶったら★が上がる
   ・V3_OPEN の間だけ
   ===================================================================== */
const MEDAL={mint:10,one:3,ten:30},PK_POOL=['soul','fairy','shadow','kura','tako'];
const pkOpen=()=>V3_OPEN&&G&&G.flags&&G.flags.s_true;
const medalIc=s=>`<img class="ic" src="img/ui/u_medal.webp" alt="" style="width:${s}px;height:${s}px;vertical-align:middle">`;
if(V3_OPEN)GACHA_BANNERS[3]={id:'pk',vol:'刻印',n:'刻印メダルガチャ（塔を建てたマイスター）',img:'img/gacha-pk.webp',pool:PK_POOL};
{const _r=renderCharGacha;renderCharGacha=function(){if(GACHA_BANNERS[3]&&!pkOpen()&&gaBan===3)gaBan=0;
 const keep=GACHA_BANNERS[3];if(keep&&!pkOpen())GACHA_BANNERS.length=3;try{_r.apply(this,arguments)}finally{if(keep&&GACHA_BANNERS.length===3)GACHA_BANNERS[3]=keep}
 const vb=$('gaBody').querySelector('[data-gb="3"]');if(vb)vb.textContent='刻印';if(GACHA_BANNERS[gaBan]&&GACHA_BANNERS[gaBan].id==='pk'){const sp=$('gaBody').querySelector('.gaban span');if(sp)sp.textContent=GACHA_BANNERS[gaBan].n}
 if(GACHA_BANNERS[gaBan]&&GACHA_BANNERS[gaBan].id==='pk'){const m=G.medal|0,c=G.mats.mcrys|0,mx=Math.floor(c/MEDAL.mint);
  const bt=$('gaBody').querySelector('.gabtns');if(bt)bt.innerHTML=`<button class="gab" id="pk1" ${m<MEDAL.one?'disabled':''}><b>1回</b><small>${medalIc(16)} ${MEDAL.one}</small></button><button class="gab ten" id="pk11" ${m<MEDAL.ten?'disabled':''}><b>11回</b><small>${medalIc(16)} ${MEDAL.ten}</small></button>`;
  bt.insertAdjacentHTML('afterend',`<div class="rcp" style="margin-top:8px"><div class="rh" style="align-items:center;gap:8px;flex-wrap:wrap"><span style="flex:1">${medalIc(26)} 刻印メダル <b style="font-size:18px">${m}</b><br><small>${MIC('mcrys',16)}記憶の結晶 ${c}　（${MEDAL.mint}個で1枚に鋳なおす）</small></span>
   <span style="display:flex;gap:4px"><button class="btn" id="pkMint1" ${mx<1?'disabled':''} style="width:auto;margin:0;padding:8px 10px;font-size:14px">鋳なおす</button><button class="btn" id="pkMintA" ${mx<2?'disabled':''} style="width:auto;margin:0;padding:8px 10px;font-size:14px">まとめて${mx>1?'×'+mx:''}</button></span></div></div>`);
  const mint=n=>{n=Math.min(n,Math.floor((G.mats.mcrys|0)/MEDAL.mint));if(n<1)return;G.mats.mcrys-=n*MEDAL.mint;G.medal=(G.medal|0)+n;save();tone(1200,.15,'triangle',.08,1800);renderGacha();say(`${medalIc(36)} 刻印メダルを ${n} 枚鋳なおした！`,900)};
  $('pkMint1').onclick=()=>mint(1);$('pkMintA').onclick=()=>mint(mx);$('pk1').onclick=()=>pkPull(1);$('pk11').onclick=()=>pkPull(11)}}}
function pkPull(n){const cost=n>1?MEDAL.ten:MEDAL.one;if((G.medal|0)<cost||!pkOpen())return;G.medal-=cost;const res=[];for(let i=0;i<n;i++)res.push(pullOnce(PK_POOL));save();showGachaResult(res);renderGacha()}
/* 本当のエンディングのあと、開いたことを知らせる */
{const _e=TW_END.sougi;TW_END.sougi=async function(){const was=G.flags.s_true;await _e.apply(this,arguments);if(!was&&G.flags.s_true&&V3_OPEN)await say(`${medalIc(44)} 「記憶の結晶をコインに鋳なおす技」を教わった！<br><span style="font-size:14px">ガチャに「刻印メダルガチャ」が出た。記憶の結晶10個で刻印メダル1枚</span>`,2600)}}
