/* =====================================================================
   プレゼントコード（メニュー →「プレゼントコード」）
   ・コードそのものはここに書かず、ハッシュだけを置く（src/make_gift.py で作る）。リポジトリは公開なので
   ・1つのコードは、同じ端末で1回だけ（セーブを消しても残る記録＋セーブの中の記録）
   ・ごほうび：coins（コイン）、ch（特別なキャラ）＋st（★の数。持っていれば★を上げる）、bp（図面のIDの配列）
   ・サイコロ版とは別のコード（ハッシュの前につける文字がちがう）
   ===================================================================== */
const GIFTS2=[
 /* {h:'ハッシュ',coins:0,ch:'キャラID',st:1}  ← 作った日とコードの用途をコメントで残す（コードは書かない） */
 {h:'99a6eef7bddb106da110bdf6517b4c070dd1cb6e1f37c73085917280064b6658',coins:0,ch:'soul',st:5}/* 2026-11-15 ソウル★5（配り方は先生が決める。コードは公開しない） */,
 {h:'54b68eb2b340810f0018c99af73701c6b010396bc0107d3601c645865c0fe852',coins:0,bp:['soul_up']}/* 2026-11-15 ソウルの強化版の図面「蒼炎刀・鬼火丸」（コードは公開しない） */,
 {h:'a177ce2afaa88fbd8868225b480ce3c3b79ab5ec446d8a528f14618b0d062861',coins:0,ch:'fairy',st:5}/* 2026-11-15 フェアリー★5（コードは公開しない） */,
 {h:'423d883d4cf9c545f530647bb7306aa62afcac8a97e018f73839ac285151c5f8',coins:0,ch:'shadow',st:5}/* 2026-11-15 シャドー★5（コードは公開しない） */,
];
const GIFT_KEY='mmrpg2_gifts';
const giftNorm=c=>String(c||'').normalize('NFKC').trim().toUpperCase().replace(/[\s\-ー－]/g,'');
async function giftHash2(c){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('meister-tower2:'+c));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function giftUsed2(){let a=[];try{a=JSON.parse(localStorage.getItem(GIFT_KEY)||'[]')}catch(e){}return Array.isArray(a)?a:[]}
function giftMark2(h){const a=giftUsed2();if(!a.includes(h))a.push(h);try{localStorage.setItem(GIFT_KEY,JSON.stringify(a.slice(-100)))}catch(e){}G.gifts=[...new Set([...(G.gifts||[]),h])].slice(-100)}
function giftChar(id,st){if(!CHARS[id])return '';const m=owned(id),nm=CHARS[id].name;
 if(!m){const n=newMember(id,1);n.star=Math.max(1,st|0);n.shard=0;(G.party.length<PARTY_MAX?G.party:G.bench).push(n);return (CHARS[id].art?`<img src="${CHARS[id].art}" alt="" style="width:240px;max-width:70vw;display:block;margin:6px auto">`:'')+`「${nm}」（★${n.star}）が仲間になった！`}
 if((m.star||1)<st){m.star=st;return `「${nm}」が★${st}になった！`}
 const g=SHARD_GAIN[st]||1;m.shard=(m.shard||0)+g;return `「${nm}」のかけらを${g}こもらった`}
let giftBusy2=false;
function openGift(){$('sheetT').textContent='プレゼントコード';
 $('sheetB').innerHTML=`<div class="gift"><div class="note">運営からもらったコードを入れると、プレゼントが受け取れます。1つのコードは1回だけ使えます。</div>
  <input id="giftIn" maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="コードを入力">
  <button class="btn gold" id="giftGo">受け取る</button></div>`;
 const inp=$('giftIn');
 $('giftGo').onclick=async()=>{if(giftBusy2)return;const c=giftNorm(inp.value);if(c.length<4){say('コードを入れてください',1000);return}
  giftBusy2=true;try{const h=await giftHash2(c),g=GIFTS2.find(x=>x.h===h);
   if(!g){tone(180,.15,'square',.05);say('コードがちがうようです',1300);return}
   if(giftUsed2().includes(h)||(G.gifts||[]).includes(h)){say('このコードはもう使っています',1400);return}
   const msg=[];if(g.coins){G.coin=(G.coin|0)+g.coins;msg.push(`${g.coins}コインをもらった！`)}
   if(g.ch){const t=giftChar(g.ch,g.st||1);if(t)msg.push(t)}
   (g.bp||[]).forEach(b=>{if(!RECIPES[b])return;if(!(G.bps||[]).includes(b)){G.bps=[...(G.bps||[]),b];msg.push(`図面「${RECIPES[b].n}」を手に入れた！<br><span style="font-size:13px">工房でつくれる</span>`)}else msg.push(`図面「${RECIPES[b].n}」はもう持っている`)});
   giftMark2(h);save();tone(880,.2,'triangle',.08,1320);closeSheet();
   say(`プレゼント<br>${msg.join('<br>')||'受け取りました'}`,2400);if($('home').classList.contains('on'))openHome()}
  finally{giftBusy2=false}};
 $('sheet').classList.add('on');setTimeout(()=>inp.focus(),200)}
