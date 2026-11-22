/* ===================== 汎用武器（だれでも使える。リーダーが2つまで装備する） =====================
   impl：どの攻撃の動きを使うか（キャラの技と同じ動き）
   proc：加工の方法。grind＝グラインダー、lathe＝旋盤、ほか（打つ・切る・つなぐ・配線）は③-3で専用の加工にする。いまは図面なぞり
   mats：先頭の素材が「主材料」。主材料で属性が決まる */
Object.assign(RECIPES,{
 g_seek: {n:'追い札の刃',   kind:'gen',impl:'onmyo',  tier:1,mats:{rubber:2,scrap:2},        tools:['snips'],          proc:'cut',  shape:'de',area:'alley',start:true},
 g_shot: {n:'鋼の投げ刃',   kind:'gen',impl:'wolf',   tier:1,mats:{scrap:3,oil:1},           tools:['grinder'],        proc:'grind',area:'alley'},
 g_area: {n:'鉄塊の拳',     kind:'gen',impl:'dodo',   tier:1,mats:{bolt:3,scrap:2},          tools:['anvil'],          proc:'hit',  shape:'ch',area:'alley'},
 g_heal: {n:'油さしの護符', kind:'gen',impl:'mouse',  tier:1,mats:{oil:2,rubber:2},          tools:['snips'],          proc:'cut',  shape:'ch',area:'alley'},
 g_orbit:{n:'回転リング',   kind:'gen',impl:'fox',    tier:2,mats:{gear:3,plate:1},          tools:['lathe'],          proc:'lathe',area:'factory'},
 g_trap: {n:'火花の陣盤',   kind:'gen',impl:'owl',    tier:2,mats:{oil:2,plate:2,gear:1},    tools:['lathe'],          proc:'lathe',area:'factory'},
 g_chain:{n:'雷の鎖',       kind:'gen',impl:'gorilla',tier:2,mats:{wire:3,plate:1},          tools:['welder'],         proc:'weld', shape:'de',area:'factory'},
 g_wave: {n:'共鳴の鐘',     kind:'gen',impl:'rocker', tier:2,mats:{spring:3,plate:2},        tools:['welder'],         proc:'weld', shape:'me',area:'factory'},
 g_fall: {n:'真鍮の流星',   kind:'gen',impl:'tsukiyo',tier:3,mats:{brass:3,spring:1,core:1}, tools:['lathe'],          proc:'lathe',area:'under'},
 g_beam: {n:'電磁の槍',     kind:'gen',impl:'robot',  tier:3,mats:{board:3,wire:2,core:1},   tools:['pliers','solder'],proc:'wire', shape:'ch',area:'under'}});
['g_seek','g_shot','g_area','g_heal','g_orbit','g_trap','g_chain','g_wave','g_fall','g_beam'].forEach(k=>{if(!RECIPE_ORDER.includes(k))RECIPE_ORDER.push(k)});
const GEN_MAX=2;
const PROC_NAME={grind:'グラインダーで削る',lathe:'旋盤で削る',cut:'切る',hit:'打つ',weld:'つなぐ',wire:'配線'};
/* 主材料 → 属性 */
const MAT_ATTR={scrap:'steel',bolt:'steel',plate:'steel',gear:'steel',oil:'fire',brass:'fire',core:'fire',wire:'thunder',board:'thunder',rubber:'wind',spring:'wind'};
const genMain=R=>Object.keys(R.mats)[0];
function genAttr(R,rank){const k=MAT_ATTR[genMain(R)]||'steel';return{k,v:+(ATTR_BASE[k]*ATTR_RANK[rank]).toFixed(3)}}
function recTag(R){return R.kind==='gen'?`汎用武器・${ATK[R.impl].type}`:R.kind==='armor'?'防具・'+SLOT_NAME[R.slot]:CHARS[R.who].name+'の武器'}
/* 装備中の汎用武器 */
const genEqList=()=>(G.genEq||[]).filter(r=>r&&G.gen&&G.gen[r]&&RECIPES[r]);
const genRid=impl=>genEqList().find(r=>RECIPES[r].impl===impl)||null;
const genFor=impl=>{const r=genRid(impl);return r?G.gen[r]:null};
/* 出撃キャラの技と同じ動きの汎用武器は使えない（重ならない） */
const genImpls=()=>genEqList().map(r=>RECIPES[r].impl).filter(k=>k!==G.lead&&!G.party.some(m=>m.id===k));
const genInParty=r=>RECIPES[r].impl!==G.lead&&G.party.some(m=>m.id===RECIPES[r].impl);
const genClash=r=>RECIPES[r].impl===G.lead;
/* 汎用武器の技が、パーティの誰かと同じ動きのとき：そのキャラの攻撃を強化する（支援） */
const GEN_SUP={C:.05,B:.08,A:.12,S:.16,SS:.2};
const genSupOf=r=>RECIPES[r]&&G.gen[r]?GEN_SUP[G.gen[r].rank]||.05:0;
const genSup=id=>{if(!G.party.some(m=>m.id===id))return 1;const r=genRid(id);return r?1+genSupOf(r):1};
function genGet(pc){G.gen=G.gen||{};G.gen[pc.rid]={rank:pc.rank,mul:pc.mul,attr:pc.attr||null};
 const eq=G.genEq||(G.genEq=[null,null]);if(!eq.includes(pc.rid)&&!eq.some(r=>r&&RECIPES[r].impl===RECIPES[pc.rid].impl)){const i=eq.findIndex(r=>!r||!G.gen[r]);if(i>=0)eq[i]=pc.rid}}
/* 汎用武器の属性も、炎以外はチームの力になる */
{const _ab=teamAb;teamAb=function(){const a=_ab();genEqList().forEach(r=>{const at=G.gen[r].attr;const k=at&&{thunder:'xp',steel:'cut',wind:'wspd'}[at.k];if(k)a[k]=(a[k]||0)+at.v});return a}}

/* ---------- 編成画面：装備の列（汎用2・防具3） ---------- */
/* 専用武器の枠は、上で選んでいる仲間のもの（リーダー以外も入れかえられる） */
const eqWho=()=>(typeof partyShow!=='undefined'&&partyShow&&findOwn(partyShow))||findOwn(G.lead);
function equipRowHTML(){const L=eqWho(),wr=L&&L.weapon&&L.weapon.rid;
 const gs=[0,1].map(i=>{const r=(G.genEq||[])[i],g=r&&G.gen[r];return `<button class="eqs ${g?'':'empty'} ${g&&G.party.some(m=>m.id===RECIPES[r].impl)?'sup':''}" data-gs="${i}">${g?RIC(r,30)+RKIC(g.rank,18):'<span class="pplus">＋</span>'}</button>`}).join('');
 const as=['head','body','feet'].map(s=>{const p=G.arm[s];return `<button class="eqs arm ${p?'':'empty'}" data-as="${s}">${p?RIC(p.rid,30)+RKIC(p.rank,18):MIC(s,24)}</button>`}).join('');
 return `<div class="peqh">チーム装備<small>（全員に効く）</small></div><div class="peq"><span class="pel">汎用</span>${gs}<span class="pel">防具</span>${as}</div>`}
function openGenPick(i){const own=Object.keys(G.gen||{}).filter(r=>RECIPES[r]);const cur=(G.genEq||[])[i];
 const other=(G.genEq||[])[1-i];
 const rows=own.map(r=>{const R=RECIPES[r],g=G.gen[r],A=ATK[R.impl],clash=genClash(r),dup=other&&other!==r&&RECIPES[other].impl===R.impl,on=r===cur;
  return `<button class="gpk ${on?'on':''}" data-gr="${r}" ${dup?'disabled':''}>${RIC(r,38)}<span class="gpn"><b>${R.n} ${RKIC(g.rank,18)}</b><small>${A.type}：${A.d[0]}　威力×${g.mul}${g.attr?'　'+attrTxt(g.attr):''}</small>${dup?'<small class="ng">もう1つの枠と同じ動き</small>':G.party.some(m=>m.id===R.impl)?`<small class="sup">支援：パーティの${CHARS[R.impl].name}の技を強化（攻撃+${Math.round((GEN_SUP[g.rank]||.05)*100)}%）</small>`:'<small>この技が使えるようになる</small>'}</span>${on?'<i>装備中</i>':''}</button>`}).join('');
 $('gpBody').innerHTML=`<div class="gph">汎用武器 枠${i+1}</div>`+(rows||`<div class="note" style="text-align:center;margin:18px 0">${UIMG('u_weapon',30)}<br>汎用武器をまだ持っていない。<br>工房の「つくる」で汎用武器をつくろう</div>`)+
  `<div class="gpf">${cur?`<button class="btn ghost" data-gr="">はずす</button>`:''}<button class="btn" id="gpClose">とじる</button></div>`;
 $('gpBody').querySelectorAll('[data-gr]').forEach(b=>b.onclick=()=>{const r=b.dataset.gr||null;G.genEq[i]=r;if(r&&G.genEq[1-i]===r)G.genEq[1-i]=null;save();$('genPick').classList.remove('on');renderParty()});
 $('gpClose').onclick=()=>$('genPick').classList.remove('on');$('genPick').classList.add('on')}

/* ===================== 工房の一覧：行をそのままタップ。種類・加工で並べかえ ===================== */
const WS={kind:'all',sort:'kind'};
const WS_KIND=[['all','すべて'],['weapon','専用'],['gen','汎用'],['armor','防具']];
const WS_SORT=[['kind','種類'],['proc','加工'],['ok','つくれる']];
const KIND_NAME={weapon:'専用武器',gen:'汎用武器',armor:'防具'};
const PROC_ORDER=['grind','lathe','hit','cut','weld','wire','trace'];
const PROC_LBL={grind:'削る',lathe:'旋盤',hit:'打つ',cut:'切る',weld:'つなぐ',wire:'配線',trace:'けがき'};
const PROC_TOOL={grind:'grinder',lathe:'lathe',hit:'anvil',cut:'snips',weld:'welder',wire:'pliers',trace:'caliper'};
/* いまの加工のしかた（切る・配線はまだなぞり） */
const procOf=R=>R.proc||(R.kind==='weapon'?'grind':'trace');
/* ウルフの牙刃は旋盤だけで加工する（グラインダーは使わない） */
[['bite1',['file']],['bite2',['file','vise']]].forEach(([k,t])=>{const R=RECIPES[k];if(R){R.proc='lathe';delete R.lathe;R.tools=t}});
/* 限定工具：持っていれば加工に特別な力 */
const limOf=R=>({dcal:hasLim('dcal'),tig:hasLim('tig'),ahammer:hasLim('ahammer')});
/* 防具は部位で加工を分ける：ヘルメット＝打つ、エプロン・コート＝切る、ベスト＝つなぐ、靴＝けがき */
Object.entries({helm:['hit',['anvil']],apron:['cut',['snips']],boots:['trace',['file']],mask:['hit',['anvil']],vest:['weld',['welder','vise']],gboots:['trace',['caliper','tap']],chelm:['hit',['anvil','welder']],coat:['cut',['snips','pliers']],jboots:['trace',['caliper','welder']]}).forEach(([k,[p,t]])=>{if(RECIPES[k]){RECIPES[k].proc=p;RECIPES[k].tools=t}});
function wsListHTML(tab){const dec=tab==='dec';
 let ids=dec?(G.bpRaw||[]).filter(id=>RECIPES[id]):RECIPE_ORDER.filter(id=>G.bps.includes(id));
 if(WS.kind!=='all')ids=ids.filter(id=>RECIPES[id].kind===WS.kind);
 const ok=id=>!dec&&canMake(id).ok;
 const key={kind:id=>['weapon','gen','armor'].indexOf(RECIPES[id].kind),proc:id=>PROC_ORDER.indexOf(procOf(RECIPES[id])),ok:id=>ok(id)?0:1}[WS.sort];
 ids.sort((a,b)=>key(a)-key(b)||RECIPES[a].tier-RECIPES[b].tier);
 const grp=id=>WS.sort==='kind'?KIND_NAME[RECIPES[id].kind]:WS.sort==='proc'?PROC_LBL[procOf(RECIPES[id])]:ok(id)?'いま加工できる':'足りないものがある';
 const nx=WS_SORT[(WS_SORT.findIndex(x=>x[0]===WS.sort)+1)%WS_SORT.length][0];
 let h=`<div class="wsbar"><div class="wsch">${WS_KIND.map(([k,n])=>`<button class="${WS.kind===k?'on':''}" data-wsk="${k}">${n}</button>`).join('')}</div>
  <button class="wssort" data-wss="${nx}">並び：<b>${WS_SORT.find(x=>x[0]===WS.sort)[1]}</b> ⇅</button></div>`;
 if(!dec)h+=`<button class="prgo" onclick="openPractice()">${UIMG('u_dojo',22)} 加工ミニゲーム道場で練習する　→</button>`+(ownedAll().some(m=>m.weapon&&m.weapon.attr)?`<button class="prgo rfgo" onclick="openReforge()">${MIC('scrap',20)} 武器の鍛え直し（属性をつけ直す）　→</button>`:'');
 if(!dec&&(G.bpRaw||[]).length)h+=`<button class="bpgo" data-t="dec">${MIC('bp',20)} 未解読の図面が ${G.bpRaw.length}枚　→ 解読へ</button>`;
 if(dec)h+=`<div class="wshint">${V2_OPEN?'図面をタップすると解読が始まる。vol.1 の図面は三面図、vol.2 の図面は展開図。正しく答えると、つくれるようになる':'図面をタップすると三面図の解読が始まる。正しい立体を選ぶと、つくれるようになる'}</div>`;
 
 /* 行をグループに分け、見出しで開け閉めする。専用武器はキャラごと */
 const ord=[...G.party.map(m=>m.id),...(G.bench||[]).map(m=>m.id)];
 const gkey=id=>{const R=RECIPES[id];if(WS.sort==='kind'&&R.kind==='weapon')return ownChar(R.who)?'w:'+R.who:'g:まだ仲間にいないキャラの専用武器|'+R.who.replace(/.*/,w=>{const b=GACHA_BANNERS.find(x=>x.pool&&x.pool.includes(w));return b?b.pool[0]:w});return 'g:'+grp(id)};
 const gname=k=>k.startsWith('w:')?CHARS[k.slice(2)].name:k.slice(2).split('|')[0];
 const grank=k=>{if(k.startsWith('g:まだ仲間にいない'))return 1e4;if(!k.startsWith('w:'))return 0;const i=ord.indexOf(k.slice(2));return i<0?999:i};
 if(WS.sort==='kind')ids.sort((a,b)=>key(a)-key(b)||grank(gkey(a))-grank(gkey(b))||RECIPES[a].tier-RECIPES[b].tier);
 const groups=[];ids.forEach(id=>{const k=gkey(id);let g=groups.find(x=>x.k===k);if(!g)groups.push(g={k,ids:[]});g.ids.push(id)});
 WS.open=WS.open||new Set(['g:いま加工できる']);
 const row=id=>{const R=RECIPES[id],pr=procOf(R),c=dec?null:canMake(id);const head='';
  const mats=Object.keys(R.mats).map(k=>{const lack=(G.mats[k]||0)<R.mats[k];return `<i class="${!dec&&lack?'lack':''}">${MIC(k,16)}${dec?'':(G.mats[k]||0)+'/'}${R.mats[k]}</i>`}).join('');
  const tools=R.tools.map(t=>`<i class="${!dec&&!hasTool(t)?'lack':''}">${MIC(useTool(t),16)}</i>`).join('');
  const cur=dec?null:R.kind==='gen'?(G.gen&&G.gen[id]):R.kind==='armor'?G.arm[R.slot]&&G.arm[R.slot].rid===id&&G.arm[R.slot]:(()=>{const m=findOwn(R.who);return m&&m.weapon&&m.weapon.rid===id&&m.weapon})();
  return head+`<button class="wsr ${dec?'dec':c.ok?'ok':''}" ${dec?`data-dec="${id}"`:`data-mk="${id}"`}>
   <span class="wsi">${RIC(id,30)}</span>
   <span class="wsm"><span class="wst"><b>${R.n}</b><small>${R.kind==='gen'?ATK[R.impl].type:R.kind==='armor'?SLOT_NAME[R.slot]:CHARS[R.who].name}・${KANJI_TIER[R.tier]}・${procsOf(R).map(p=>PROC_LBL[p]).join('→')}</small></span><span class="wsn">${mats}<em></em>${tools}</span></span>
   <span class="wss">${dec?'<b class="go bp">解読</b>':cur&&cur.rank?RKIC(cur.rank,24):''}${dec?'':c.ok?'<b class="go">加工</b>':''}</span></button>`};
 const one=groups.length<=1||dec;
 const ghtml=(g,sub)=>{const op=one||WS.open.has(g.k),w=g.k.startsWith('w:')?g.k.slice(2):null,nOk=dec?0:g.ids.filter(ok).length,away=g.k.startsWith('g:まだ仲間にいない');
  return (one?'':`<button class="wsgh ${sub?'sub':''} ${op?'op':''} ${away?'away':''}" data-wsg="${g.k}">${w?`<img src="${FACE(w)}" alt="">`:''}<b>${gname(g.k)}</b>${w?'<span class="sp">専用</span>':''}<small>${g.ids.length}</small>${away?'':nOk?`<i class="okn">加工できる ${nOk}</i>`:''}<em>${op?'▾':'▸'}</em></button>`)+(op?`<div class="wsgb">${g.ids.map(row).join('')}</div>`:'')};
 /* 専用武器は「ガチャの巻（vol1・vol2…）」→ キャラ の2段 */
 const volOf=k=>{const id=k.startsWith('w:')?k.slice(2):k.startsWith('g:まだ仲間にいない')?k.split('|')[1]:null;if(!id)return 0;if(SECRET_CH.includes(id))return 'sp';const b=GACHA_BANNERS.find(x=>x.pool&&x.pool.includes(id));return b?b.vol:1};
 const done=new Set();
 h+=groups.map(g=>{if(done.has(g.k))return '';const v=one?0:volOf(g.k);if(!v)return ghtml(g);
  const mem=groups.filter(x=>volOf(x.k)===v);mem.forEach(x=>done.add(x.k));const vk='v:'+v,op=WS.open.has(vk),n=mem.reduce((a,x)=>a+x.ids.length,0),nOk=dec?0:mem.reduce((a,x)=>a+x.ids.filter(ok).length,0);
  const bn=GACHA_BANNERS.find(x=>x.vol===v);
  return `<button class="wsgh vol ${op?'op':''}" data-wsg="${vk}"><b>${v==='sp'?'特別な仲間の専用武器':'専用武器 vol'+v}</b><span class="sp">${bn&&!bn.soon?bn.n:''}</span><small>${n}</small>${nOk?`<i class="okn">加工できる ${nOk}</i>`:''}<em>${op?'▾':'▸'}</em></button>`+(op?`<div class="wsgb vb">${mem.map(x=>ghtml(x,1)).join('')}</div>`:'')}).join('');
 if(!ids.length)h+=`<div class="note" style="text-align:center;margin:24px 0">${MIC('bp',28)}<br>${dec?'未解読の図面はない。強敵や資材の箱から図面が見つかる':'この種類の図面はまだない'}</div>`;
 if(!dec){const unk=RECIPE_ORDER.length-G.bps.length-(G.bpRaw||[]).length;if(unk>0)h+=`<div class="wshint" style="text-align:center">まだ見つけていない図面：あと ${unk}</div>`}
 return h}
function wsTap(id){const c=canMake(id);if(c.ok){makeProduct(id);return}
 const ls=[...c.lackM.map(k=>`${MIC(k,22)}${MATS[k].n} ${G.mats[k]||0}/${RECIPES[id].mats[k]}`),...c.lackT.map(t=>`${MIC(t,22)}${TOOLS[t].n}`)];
 say(`<span style="font-size:15px">足りないもの</span><br>${ls.join('<br>')}${c.noWho?'<br>'+CHARS[RECIPES[id].who].name+'がまだ仲間にいない':''}`,1500)}

/* ===================== 持ち物（つくった装備をしまっておき、あとで入れかえる） ===================== */
/* G.armInv：[{slot,rid,rank,mul}]　G.wInv：[{who,w:{…武器}}] */
const invArm=()=>G.armInv||(G.armInv=[]),invW=()=>G.wInv||(G.wInv=[]);
function weaponObj(R,pc,who){const J=JOBS[who.job]||{};return{name:R.n+'（'+pc.rank+'）',k:J.uses,v:Math.round(pc.mul*5),bv:Math.round(pc.mul*5),plus:0,rank:pc.rank,tier:R.tier,rid:pc.rid,mul:pc.mul,shape:pc.shape||null,attr:pc.attr||null}}
function invPut(p,slot){if(p&&p.rid)invArm().push({slot,rid:p.rid,rank:p.rank,mul:p.mul})}
function invPutW(m){const w=m.weapon;if(w&&w.rid)invW().push({who:m.id,w});else if(w&&!m.baseW)m.baseW=w}
function invStore(pc,who){const R=RECIPES[pc.rid];
 if(R.kind==='gen'){const old=G.gen&&G.gen[pc.rid];if(!old||RANK_ORDER.indexOf(pc.rank)>RANK_ORDER.indexOf(old.rank)){G.gen=G.gen||{};G.gen[pc.rid]={rank:pc.rank,mul:pc.mul,attr:pc.attr||null}}return}
 if(R.kind==='armor')invPut({rid:pc.rid,rank:pc.rank,mul:pc.mul},R.slot);else invW().push({who:who.id,w:weaponObj(R,pc,who)})}
const RANK_ORDER=['D','C','B','A','S','SS'];
/* 顔アイコン（ウルフは表情つきの絵） */
const FACE=id=>['wolf','fox','dodo','owl','gorilla','mouse','robot','tsukiyo','onmyo','rocker',...VOL2,...(typeof VOL3!=='undefined'?VOL3:[]),'aurum','nox','soul','fairy','shadow','kura','tako','takumi'].includes(id)?`img/face/f_${id}.webp`:CHARS[id].img;
/* 専用武器・防具の入れかえ */
function openEqPick(kind,slot){const L=eqWho();let rows='',head='';
 if(kind==='w'){head=`${CHARS[L.id].name}の専用武器`;const cur=L.weapon;
  const list=invW().map((x,i)=>[x,i]).filter(([x])=>x.who===L.id);
  rows=`<button class="gpk on" disabled>${WPIC(L.id,38,cur&&cur.rid?RECIPES[cur.rid].tier:0)}<span class="gpn"><b>${cur&&cur.rid?RECIPES[cur.rid].n+' '+RKIC(cur.rank,18):baseWeapon(L.id)}</b><small>${cur&&cur.rid?`威力×${cur.mul}${cur.attr?'　'+attrTxt(cur.attr):''}`:'はじめの武器'}</small></span><i>装備中</i></button>`+
   list.map(([x,i])=>`<button class="gpk" data-wi="${i}">${WPIC(L.id,38,RECIPES[x.w.rid].tier)}<span class="gpn"><b>${RECIPES[x.w.rid].n} ${RKIC(x.w.rank,18)}</b><small>威力×${x.w.mul}${x.w.attr?'　'+attrTxt(x.w.attr):''}</small></span></button>`).join('')+
   (cur&&cur.rid&&L.baseW?`<button class="gpk" data-wi="base">${WPIC(L.id,38,0)}<span class="gpn"><b>${baseWeapon(L.id)}</b><small>はじめの武器</small></span></button>`:'');
  if(!list.length&&!(cur&&cur.rid&&L.baseW))rows+=`<div class="note" style="text-align:center;margin:12px 0">しまってある専用武器はない。工房でつくると、ここで入れかえられる</div>`}
 else{head=`防具・${SLOT_NAME[slot]}`;const cur=G.arm[slot];
  const list=invArm().map((x,i)=>[x,i]).filter(([x])=>x.slot===slot);
  rows=(cur?`<button class="gpk on" disabled>${RIC(cur.rid,38)}<span class="gpn"><b>${RECIPES[cur.rid].n} ${RKIC(cur.rank,18)}</b><small>${ARMOR_FX[slot].d(cur.mul)}</small></span><i>装備中</i></button>`:'')+
   list.map(([x,i])=>`<button class="gpk" data-ai="${i}">${RIC(x.rid,38)}<span class="gpn"><b>${RECIPES[x.rid].n} ${RKIC(x.rank,18)}</b><small>${ARMOR_FX[slot].d(x.mul)}</small></span></button>`).join('');
  if(!cur&&!list.length)rows=`<div class="note" style="text-align:center;margin:12px 0">${MIC(slot,28)}<br>この部位の防具はまだない。工房でつくろう</div>`}
 $('gpBody').innerHTML=`<div class="gph">${head}</div>${rows}<div class="gpf">${kind==='a'&&G.arm[slot]?'<button class="btn ghost" id="gpOff">はずす</button>':''}<button class="btn" id="gpClose">とじる</button></div>`;
 const close=()=>{$('genPick').classList.remove('on');save();renderParty()};
 $('gpBody').querySelectorAll('[data-wi]').forEach(b=>b.onclick=()=>{const v=b.dataset.wi;if(v==='base'){invPutW(L);L.weapon=L.baseW}else{const x=invW()[+v];invW().splice(+v,1);invPutW(L);L.weapon=x.w}tone(700,.1,'triangle',.06,1000);close()});
 $('gpBody').querySelectorAll('[data-ai]').forEach(b=>b.onclick=()=>{const x=invArm()[+b.dataset.ai];invArm().splice(+b.dataset.ai,1);invPut(G.arm[slot],slot);G.arm[slot]={rid:x.rid,rank:x.rank,mul:x.mul};tone(700,.1,'triangle',.06,1000);close()});
 {const o=$('gpOff');if(o)o.onclick=()=>{invPut(G.arm[slot],slot);delete G.arm[slot];close()}}
 $('gpClose').onclick=()=>$('genPick').classList.remove('on');$('genPick').classList.add('on')}

/* ===================== 加工の前に、その装備の特徴を見て、つくるか決める ===================== */
const PROC_HOW={grind:'グラインダー：鉄を砥石に押し当てて、点線の形に削る',lathe:'旋盤：2つのハンドル（左右・深さ）を回して刃物を動かし、金色の線どおりに削る',hit:'金床：輪が金色の円に重なった瞬間にたたく',weld:'溶接機：トーチでつなぎ目をなぞる',cut:'金切りばさみ：タップでひと切りずつ進み、ドラッグで向きを変えて線どおりに切る',wire:'配線：同じ色の端子を交差しないようにつなぎ、はんだ付けする',trace:'けがき：定規とコンパスで、図面の線を鉄板に写す（ノギスがあると点にすいつく）'};
function recipeFx(R){const lo=prodMul(R.tier,'C'),b=prodMul(R.tier,'B'),hi=prodMul(R.tier,'SS');
 if(R.kind==='armor')return[['効果',`${ARMOR_FX[R.slot].d(b)}（B）`],['出来ばえで',`${ARMOR_FX[R.slot].d(lo)}（C）〜 ${ARMOR_FX[R.slot].d(hi)}（SS）`]];
 if(R.kind==='gen'){const A=ATK[R.impl],k=MAT_ATTR[genMain(R)],v=+(ATTR_BASE[k]*ATTR_RANK.B).toFixed(3);
  return[['攻撃',`${TIC(A.type,18)}${A.type}：${A.d[0]}`],['強くなると',A.d.slice(1).join('／')],['威力',`×${b}（B）　C ×${lo} 〜 SS ×${hi}`],['属性',`${attrTxt({k,v})}　主材料「${MATS[genMain(R)].n}」で決まる`],['使いかた','チーム装備の汎用の枠に付ける（2つまで）。パーティにいないキャラの技なら、その技が使えるようになる。パーティにいるキャラと同じ動きなら、そのキャラの攻撃を強化する（C+5%〜SS+20%）']]}
 const A=ATK[R.who];return[['攻撃',`${CHARS[R.who].name}の${TIC(A.type,18)}${A.n}`],['威力',`×${b}（B）　C ×${lo} 〜 SS ×${hi}`],['属性','できあがりでランダム（炎・雷・鋼・風）']]}
function openRecipe(id){const R=RECIPES[id],c=canMake(id),pr=procOf(R);
 const mats=Object.keys(R.mats).map(k=>{const lack=(G.mats[k]||0)<R.mats[k];return `<span class="${lack?'lack':''}">${MIC(k,20)}${MATS[k].n} ${G.mats[k]||0}/${R.mats[k]}</span>`}).join('');
 const tools=R.tools.map(t=>`<span class="${hasTool(t)?'':'lack'}">${MIC(useTool(t),20)}${TOOLS[useTool(t)].n}</span>`).join('');
 const cur=curProd(R);
 $('gpBody').innerHTML=`<div class="rdh">${RIC(id,52)}<div><b>${R.n}</b><small>${recTag(R)}・${KANJI_TIER[R.tier]}</small></div></div>
  <div class="rdt">${recipeFx(R).map(([a,b])=>`<div><span>${a}</span><p>${b}</p></div>`).join('')}<div><span>加工</span><p>${procsOf(R).map((p,i,A)=>`${A.length>1?['①','②'][i]:''}${MIC(PROC_TOOL[p],18)}${PROC_HOW[p]}`).join('<br>')}</p></div><div><span>工具の練度</span><p>Lv${recLv(R)}　${toolBonus(R)?`点数 +${toolBonus(R)}`:`許す幅 +${Math.round((assistMul({assist:recLv(R)})-1)*100)}%`}（使うほど上がる）</p></div><div><span>今</span><p>${cur}</p></div></div>
  <div class="rdn"><span>素材</span>${mats}</div><div class="rdn"><span>工具</span>${tools}</div>
  ${c.ok?'':`<div class="note" style="color:#ff8080;margin-top:6px">${c.noWho?CHARS[R.who].name+'がまだ仲間にいない':'足りないものがある（赤い字）'}</div>`}
  <div class="gpf"><button class="btn ghost" id="gpClose">やめる</button><button class="btn ghost" id="rdPr">練習</button><button class="btn gold" id="rdGo" ${c.ok?'':'disabled'}>つくる</button></div>`;
 $('gpClose').onclick=()=>$('genPick').classList.remove('on');
 $('rdPr').onclick=()=>{$('genPick').classList.remove('on');const ps=procsOf(R);runPractice(ps[0],R.tier,()=>{openShop('tab');openRecipe(id)})};
 $('rdGo').onclick=()=>{if(!canMake(id).ok)return;$('genPick').classList.remove('on');makeProduct(id)};
 $('genPick').classList.add('on')}

/* ===================== 図鑑：タブ（キャラ・図面・工具・素材）と並べかえ ===================== */
const ZK={tab:'char',sort:{char:'no',bp:'kind',tool:'price',mat:'floor'},own:false};
const ZK_TABS=[['char','キャラ'],['bp','図面'],['tool','工具'],['mat','素材']];
const ZK_SORTS={char:[['no','番号'],['star','★'],['lv','Lv'],['type','技']],bp:[['kind','種類'],['proc','加工'],['floor','階']],tool:[['price','値段'],['have','持っている']],mat:[['floor','階'],['num','数']]};
const CHAR_ALL=()=>[...new Set([...GACHA_POOL,...Object.keys(CHARS).filter(k=>ATK[k])])].filter(k=>(V2_OPEN||!VOL2.includes(k))&&(typeof V3_OPEN==='undefined'||V3_OPEN||!VOL3.includes(k))&&!SECRET_CH.includes(k));
function openZukan(){show('zukan');renderZukan()}
function renderZukan(){const t=ZK.tab,so=ZK.sort[t],S=ZK_SORTS[t],nx=S[(S.findIndex(x=>x[0]===so)+1)%S.length][0];
 const cnt={char:[CHAR_ALL().filter(owned).length,CHAR_ALL().length],bp:[G.bps.length,RECIPE_ORDER.length],tool:[G.tools.length,TOOL_ORDER.length],mat:[MAT_ORDER.filter(k=>G.mats[k]>0).length,MAT_ORDER.length]};
 let h=`<div class="zktab">${ZK_TABS.map(([k,n])=>`<button class="${k===t?'on':''}" data-zt="${k}">${n}<small>${cnt[k][0]}/${cnt[k][1]}</small></button>`).join('')}</div>
 <div class="wsbar"><button class="wssort zkown ${ZK.own?'on':''}" data-zo="1">${ZK.own?'持っているだけ':'すべて'}</button><span style="flex:1"></span><button class="wssort" data-zs="${nx}">並び：<b>${S.find(x=>x[0]===so)[1]}</b> ⇅</button></div><div class="zkg">`;
 if(t==='char'){let ids=CHAR_ALL();if(ZK.own)ids=ids.filter(owned);const no=id=>CHAR_ALL().indexOf(id);
  const key={no:id=>no(id),star:id=>-((owned(id)||{}).star||0),lv:id=>-((owned(id)||{}).lv||0),type:id=>ATK[id].type.charCodeAt(0)}[so];ids.sort((a,b)=>key(a)-key(b)||no(a)-no(b));
  h+=ids.map(id=>{const m=owned(id),c=CHARS[id];return `<button class="zkc ${m?'':'no'}" data-zc="${id}"><img src="${c.img}" alt=""><span class="hft">${TIC(ATK[id].type,18)}</span><span class="zkno">No.${String(no(id)+1).padStart(2,'0')}</span><span class="hfb"><b>${c.name}</b><small>${m?`Lv${m.lv}　<i>${'★'.repeat(m.star||1)}</i>`:'まだいない'}</small></span></button>`}).join('')}
 else if(t==='bp'){let ids=RECIPE_ORDER.filter(id=>(V2_OPEN||(!/^j/.test(RECIPES[id].area||'')&&(RECIPES[id].vol||1)<2))&&(typeof V3_OPEN==='undefined'||V3_OPEN||(RECIPES[id].vol||1)<3)&&(!RECIPES[id].secret||(G.bps||[]).includes(id)));if(ZK.own)ids=ids.filter(id=>G.bps.includes(id));const fl={alley:1,factory:2,under:3};
  const key={kind:id=>['weapon','gen','armor'].indexOf(RECIPES[id].kind),proc:id=>PROC_ORDER.indexOf(procOf(RECIPES[id])),floor:id=>fl[RECIPES[id].area]||RECIPES[id].tier}[so];ids.sort((a,b)=>key(a)-key(b)||RECIPES[a].tier-RECIPES[b].tier);
  h+=ids.map(id=>{const R=RECIPES[id],has=G.bps.includes(id);return `<div class="zki ${has?'':'no'}">${has?RIC(id,40):MIC('bp',40)}<b>${has?R.n:'？？？'}</b><small>${has?recTag(R)+'・'+PROC_LBL[procOf(R)]:R.limited?'図面ガチャ（限定）':LAYER_NAME[R.area]?'塔の'+LAYER_NAME[R.area]+'で見つかる':''}</small></div>`}).join('')}
 else if(t==='tool'){let ids=TOOL_ORDER.slice();if(ZK.own)ids=ids.filter(k=>G.tools.includes(k));const key={price:k=>TOOLS[k].price||0,have:k=>G.tools.includes(k)?0:1}[so];ids.sort((a,b)=>key(a)-key(b)||TOOL_ORDER.indexOf(a)-TOOL_ORDER.indexOf(b));
  h+=ids.map(k=>{const has=G.tools.includes(k);return `<div class="zki ${has?'':'no'}">${MIC(k,40)}<b>${TOOLS[k].n}</b><small>${has?'練度 Lv'+tlv(k):TOOLS[k].limited?'工具ガチャ（限定）':TOOLS[k].price?`${UIMG('coin',12)}${TOOLS[k].price}`:TOOLS[k].where||''}</small></div>`}).join('')}
 else{let ids=MAT_ORDER.slice();if(ZK.own)ids=ids.filter(k=>G.mats[k]>0);const f1=k=>{const f=Object.keys(FLOOR_MATS).find(f=>floorMats(+f).includes(k));return f?+f:99};
  const key={floor:k=>f1(k),num:k=>-(G.mats[k]||0)}[so];ids.sort((a,b)=>key(a)-key(b)||MAT_ORDER.indexOf(a)-MAT_ORDER.indexOf(b));
  h+=ids.map(k=>{const fl=Object.keys(FLOOR_MATS).filter(f=>floorMats(+f).includes(k));return `<div class="zki">${MIC(k,40)}<b>${MATS[k].n}</b><small>×${G.mats[k]||0}</small><small class="zkf">${fl.length?fl.join('・')+'F':''}</small></div>`}).join('')}
 h+='</div>';$('zkBody').innerHTML=h;
 $('zkBody').querySelectorAll('[data-zt]').forEach(b=>b.onclick=()=>{ZK.tab=b.dataset.zt;renderZukan()});
 $('zkBody').querySelector('[data-zs]').onclick=e=>{ZK.sort[t]=e.currentTarget.dataset.zs;renderZukan()};
 $('zkBody').querySelector('[data-zo]').onclick=()=>{ZK.own=!ZK.own;renderZukan()};
 $('zkBody').querySelectorAll('[data-zc]').forEach(b=>b.onclick=()=>zkChar(b.dataset.zc))}
function zkChar(id){const c=CHARS[id],m=owned(id),A=ATK[id],ab=ABIL[id]||[],ban=GACHA_BANNERS.find(b=>b.pool&&b.pool.includes(id));
 $('gpBody').innerHTML=`<div class="rdh"><img src="${c.img}" alt="" style="height:84px"><div><b>${c.name}</b><small>${m?`Lv${m.lv}　${'★'.repeat(m.star||1)}　かけら ${m.shard||0}`:'まだいない'}</small></div></div>
  <div class="rdt"><div><span>技</span><p>${TIC(A.type,18)}${A.n}（${A.type}）<br>${A.d[0]}</p></div>${ab.map((x,i)=>`<div><span>${ABIL_RANK[i][0]}・★${ABIL_RANK[i][1]}</span><p>${x.d}</p></div>`).join('')}<div><span>入手</span><p>${ban?`ガチャ vol.${ban.vol}`:id===G.lead||id==='wolf'?'はじめからいる':'—'}</p></div></div>
  <div class="gpf">${m?`<button class="btn ghost" id="zkGo">編成で見る</button>`:''}<button class="btn" id="gpClose">とじる</button></div>`;
 $('gpClose').onclick=()=>$('genPick').classList.remove('on');{const g=$('zkGo');if(g)g.onclick=()=>{$('genPick').classList.remove('on');partySel=id;openParty()}}
 $('genPick').classList.add('on')}

/* ===================== 換金所：しまってある装備はコインに、工具は基本素材に ===================== */
/* 売値＝階（壱・弐・参）の基本値 × 出来ばえの倍率。SS は高く売れる */
const SELL_BASE={1:12,2:30,3:70,4:150,5:300};
const SELL_RANK={D:.4,C:.6,B:1,A:1.5,S:2.5,SS:4};
const sellPrice=(rid,rank)=>Math.round((SELL_BASE[RECIPES[rid].tier]||SELL_BASE[4])*(SELL_RANK[rank]||1));
/* 工具は基本素材（鉄くず・ボルト・鉄板）にもどる。値段が高い工具ほど多い */
function toolScrap(t){if(TOOLS[t].limited)return{scrap:4,bolt:2,plate:1};const p=TOOLS[t].price||0,o={scrap:Math.max(1,Math.round(p/30))};if(p>=90)o.bolt=Math.round(p/90);if(p>=240)o.plate=Math.round(p/160);return o}
const scrapTxt=o=>Object.keys(o).map(k=>`${MIC(k,16)}${MATS[k].n}×${o[k]}`).join('　');
function recItems(){const L=[];
 invW().forEach((x,i)=>L.push({key:'w:'+i,rid:x.w.rid,rank:x.w.rank,kind:'専用武器',sub:CHARS[x.who].name,ic:WPIC(x.who,34,RECIPES[x.w.rid].tier)}));
 invArm().forEach((x,i)=>L.push({key:'a:'+i,rid:x.rid,rank:x.rank,kind:'防具',sub:SLOT_NAME[x.slot],ic:RIC(x.rid,34)}));
 Object.keys(G.gen||{}).filter(r=>RECIPES[r]&&!(G.genEq||[]).includes(r)).forEach(r=>L.push({key:'g:'+r,rid:r,rank:G.gen[r].rank,kind:'汎用武器',sub:ATK[RECIPES[r].impl].type,ic:RIC(r,34)}));
 return L}
function recycleHTML(){const L=recItems(),T=G.tools.filter(t=>t!=='file');
 let h=`<div class="wshint">しまってある装備はコインに、工具は基本素材に変えられる。装備中の物は売れない。出来ばえが良いほど高く売れる（SS は B の4倍）</div>
 <div class="wsg">装備 → コイン</div>`;
 h+=L.length?L.map(x=>`<button class="wsr ok" data-rc="${x.key}"><span class="wsi">${x.ic}</span><span class="wsm"><span class="wst"><b>${RECIPES[x.rid].n}</b>${RKIC(x.rank,18)}</span><small>${x.kind}・${x.sub}・${KANJI_TIER[RECIPES[x.rid].tier]}</small></span><span class="wss"><b class="go">${UIMG('coin',14)}${sellPrice(x.rid,x.rank)}</b></span></button>`).join('')
  :`<div class="note" style="margin:8px 0">しまってある装備はない。加工のあと「しまっておく」を選ぶか、編成で入れかえると、ここに並ぶ</div>`;
 h+=`<div class="wsg">工具 → 基本素材</div>`+(T.length?T.map(t=>`<button class="wsr" data-rc="t:${t}"><span class="wsi">${MIC(t,34)}</span><span class="wsm"><span class="wst"><b>${TOOLS[t].n}</b></span><small>${scrapTxt(toolScrap(t))}</small></span><span class="wss"><b class="go bp">${UIMG('u_scrap',14)}分解</b></span></button>`).join(''):`<div class="note">分解できる工具はない（やすりは分解できない）</div>`);
 return h}
function recycleAsk(key){const [k,v]=[key.slice(0,1),key.slice(2)];let body='',go=null;
 if(k==='t'){const o=toolScrap(v),need=RECIPE_ORDER.filter(r=>G.bps.includes(r)&&RECIPES[r].tools.includes(v)).length;
  body=`<div class="rdh">${MIC(v,52)}<div><b>${TOOLS[v].n}を分解</b><small>もどる素材：${scrapTxt(o)}</small></div></div>${need?`<div class="note" style="color:#ff8a8a">この工具を使う図面が ${need}枚ある。分解すると、また買うまで加工できない</div>`:''}`;
  go=()=>{G.tools=G.tools.filter(t=>t!==v);Object.keys(o).forEach(m=>G.mats[m]=(G.mats[m]||0)+o[m]);return `${MIC(v,28)} 分解した<br><span style="font-size:14px">${scrapTxt(o)}</span>`}}
 else{const x=recItems().find(i=>i.key===key);if(!x)return;const pr=sellPrice(x.rid,x.rank);
  body=`<div class="rdh">${x.ic}<div><b>${RECIPES[x.rid].n} ${RKIC(x.rank,20)}</b><small>${x.kind}・${x.sub}</small></div></div><div class="rdt"><div><span>売値</span><p>${UIMG('coin',18)}<b style="font-size:18px">${pr}</b> コイン</p></div></div>`;
  go=()=>{if(k==='w')invW().splice(+v,1);else if(k==='a')invArm().splice(+v,1);else delete G.gen[v];G.coin=(G.coin|0)+pr;return `${UIMG('coin',28)} ${pr}コインになった`}}
 $('gpBody').innerHTML=body+`<div class="gpf"><button class="btn ghost" id="gpClose">やめる</button><button class="btn gold" id="rcGo">${k==='t'?'分解する':'売る'}</button></div>`;
 $('gpClose').onclick=()=>$('genPick').classList.remove('on');
 $('rcGo').onclick=()=>{const m=go();save();$('genPick').classList.remove('on');tone(880,.15,'triangle',.1,1320);renderShop();say(m,1000)};
 $('genPick').classList.add('on')}

/* ===================== 工具の練度（使い込み）：使うほど上がり、その工具を使う加工が楽になる ===================== */
/* G.tlx：{工具: 経験}。Lv1〜5。被った工具（工具ガチャ）でも大きく上がる */
const TLV_XP=[0,30,80,160,300];
const tlv=t=>{const x=(G.tlx||{})[t]||0;let l=1;TLV_XP.forEach((v,i)=>{if(x>=v)l=i+1});return TOOLS[t]&&TOOLS[t].limited?Math.max(3,l):l};
/* そのレシピで使う工具のうち、いちばん練度の高いもの */
const recLv=R=>Math.max(1,...R.tools.filter(hasTool).map(t=>tlv(useTool(t))));
/* グラインダー・旋盤など、ずれの幅を変えにくい加工は点数ボーナスで助ける（Lv5で+8点）。ほかは各ミニゲームで幅が広がる */
let toolBonus=R=>{const pr=procOf(R);return (['grind','lathe'].includes(pr)||!MINI[pr]?(Math.min(5,recLv(R))-1)*2:0)+(pr==='lathe'&&hasLim('cnc')?5:0)};
let assistMul=o=>1+.08*(Math.min(5,(o&&o.assist)||1)-1);   /* Lv5で許す幅が+32% */
function toolXpGain(R,q){G.tlx=G.tlx||{};const g=5+Math.round(q/10),msg=[];
 R.tools.filter(hasTool).map(useTool).forEach(t=>{const b=tlv(t);G.tlx[t]=(G.tlx[t]||0)+g;const a=tlv(t);msg.push(`${MIC(t,18)}${TOOLS[t].n} 練度+${g}${a>b?` <b>Lv${a}に上がった！</b>`:''}`)});
 return msg.join('<br>')}
function tlvHTML(t){const x=(G.tlx||{})[t]||0,l=tlv(t),nx=TLV_XP[l],pv=TLV_XP[l-1];
 return `<div class="tlv">${UIMG('u_tlv',16)}<span>練度 <b>Lv${l}</b></span><i><u style="width:${l>=TLV_XP.length?100:Math.round((x-pv)/(nx-pv)*100)}%"></u></i><small>${l>=TLV_XP.length?'最大':`${x}/${nx}`}</small></div>`}

/* ===================== 限定工具（工具ガチャだけ）・限定装備（図面ガチャだけ） ===================== */
/* up：いつもの工具の代わりになる（持っていれば、その工具がなくても加工できる）。新品でも練度Lv3から */
Object.assign(TOOLS,{
 dcal:   {n:'デジタルノギス',d:'限定。けがきで点にすいつく範囲が2倍',limited:true,up:'caliper'},
 tig:    {n:'TIG溶接機',    d:'限定。つなぐの「ちょうどいい速さ」の幅が広い',limited:true,up:'welder'},
 ahammer:{n:'空気ハンマー', d:'限定。打つの輪が少しゆっくりちぢむ',limited:true,up:'anvil'},
 cnc:    {n:'CNC旋盤',      d:'限定。旋盤の点数+5',limited:true,up:'lathe'},
 micro:  {n:'マイクロメータ',d:'限定。どの加工でも、出来ばえがたまに1段上がる（10%）',limited:true},
 ratchet:{n:'ラチェットレンチ',d:'限定。どの加工でも、素材が1つもどってくることがある（20%）',limited:true}});
const LIM_TOOLS=['dcal','tig','ahammer','cnc','micro','ratchet'];
Object.assign(UI_IC,{dcal:'t_dcal',tig:'t_tig',ahammer:'t_ahammer',cnc:'t_cnc',micro:'t_micro',ratchet:'t_ratchet'});
const GEN_IC={g_seek:'wg_seek',g_shot:'wg_shot',g_area:'wg_area',g_heal:'wg_heal',g_orbit:'wg_orbit',g_trap:'wg_trap',g_chain:'wg_chain',g_wave:'wg_wave',g_fall:'wg_fall',g_beam:'wg_beam',cncblade:'w_cncblade'};
/* 限定装備：限定工具がないと作れない。boost＝ふつうより強い */
Object.assign(RECIPES,{
 dglass:  {n:'デジタル安全メガネ',kind:'armor',slot:'head',tier:1,mats:{plate:2,wire:1},tools:['dcal'],proc:'trace',shape:'ch',area:'gacha',limited:true,boost:1.25},
 tigarmor:{n:'TIG溶接の鎧',      kind:'armor',slot:'body',tier:2,mats:{plate:3,gear:2},tools:['tig'], proc:'weld', shape:'de',area:'gacha',limited:true,boost:1.25},
 cncblade:{n:'CNC加工の刃',      kind:'gen',impl:'robot',tier:3,mats:{brass:2,board:2,core:1},tools:['cnc'],proc:'lathe',area:'gacha',limited:true,boost:1.2}});
Object.assign(ARMOR_IC,{dglass:'ar_dglass',tigarmor:'ar_tigarmor'});
['dglass','tigarmor','cncblade'].forEach(k=>{if(!RECIPE_ORDER.includes(k))RECIPE_ORDER.push(k)});
const UPG={};Object.keys(TOOLS).forEach(k=>{if(TOOLS[k].up)UPG[TOOLS[k].up]=k});
/* その工具を持っている？（限定の上位版でもよい）。使う工具＝上位版があればそちら */
const hasTool=t=>G.tools.includes(t)||(!!UPG[t]&&G.tools.includes(UPG[t]));
const useTool=t=>UPG[t]&&G.tools.includes(UPG[t])?UPG[t]:t;
const hasLim=k=>G.tools.includes(k);
LIM_TOOLS.forEach(k=>{if(!TOOL_ORDER.includes(k))TOOL_ORDER.push(k)});

/* ===================== ガチャ：キャラ／工具／図面 ===================== */
let gaType='char';
const TOOL_G={cost:30,cost11:300,lim:.03,pity:30},BP_G={cost:40,cost11:400,lim:.03,pity:30};
const TOOL_POOL=()=>TOOL_ORDER.filter(t=>!TOOLS[t].limited&&t!=='file');
const BP_POOL=()=>RECIPE_ORDER.filter(id=>{const R=RECIPES[id];return !R.limited&&!R.secret&&R.area!=='gift'&&(V2_OPEN||!/^j/.test(R.area||''))&&(typeof V3_OPEN==='undefined'||V3_OPEN||(R.vol||1)<3)&&(R.kind!=='weapon'||ownChar(R.who))&&(R.tier<4||(G.floor|0)>=10)});
/* 3.1.8：図面ガチャのふつう枠は、選んでいる vol の図面だけ（vol.2 で vol.3 の図面が出ないように） */
const bpVol=R=>R.vol||(/^j/.test(R.area||'')?2:1);
const BP_POOL_V=v=>{const a=BP_POOL(),b=a.filter(id=>bpVol(RECIPES[id])===v);return b.length?b:a};
const BP_LIM=(v=1)=>RECIPE_ORDER.filter(id=>RECIPES[id].limited&&(RECIPES[id].vol||1)===v);
/* vol.2 以降は章ごとの限定（V2_OPEN の間だけ開く） */
const gaVolI={tool:1,bp:1};const gaVolOpen=v=>v===1||(v===2&&typeof V2_OPEN!=='undefined'&&V2_OPEN);
const gaLims=(type,v)=>type==='tool'?(v===2?(typeof LIM_TOOLS2!=='undefined'?LIM_TOOLS2:[]):LIM_TOOLS):BP_LIM(v);
const pityKey=(type,v)=>type+(v>1?v:'');
function gaHead(){return `<div class="gacoin">${coinIc(22)}<b>${G.coin}</b><small>コイン</small></div>
 <div class="gatype">${[['char','キャラ'],['tool','工具'],['bp','図面']].map(([k,n])=>`<button class="${gaType===k?'on':''}" data-gt="${k}">${UIMG('g_'+k,26)}${n}</button>`).join('')}</div>`}
function gaBind(){$('gaBody').querySelectorAll('[data-gt]').forEach(b=>b.onclick=()=>{gaType=b.dataset.gt;renderGacha()})}
function renderGacha(){if(gaType==='char'){renderCharGacha();return}
 const tool=gaType==='tool',C=tool?TOOL_G:BP_G,gv=gaVolOpen(gaVolI[gaType])?gaVolI[gaType]:1,pity=((G.pity||{})[pityKey(gaType,gv)])||0,lims=gaLims(gaType,gv);
 const icons=lims.map(k=>tool?MIC(k,44):RIC(k,44)).join('');
 $('gaBody').innerHTML=gaHead()+`<div class="gavol">${[1,2,3].map(v=>`<button class="${v===gv?'on':''} ${gaVolOpen(v)?'':'soon'}" data-giv="${v}">vol.${v}</button>`).join('')}</div>
 <div class="gaban gaimg"><img src="img/${tool?'gacha-tool':'gacha-bp'}.webp" alt=""><div class="gcb"><small>${tool?'TOOL':'BLUEPRINT'} GACHA</small><b>${tool?'工具ガチャ':'図面ガチャ'}${gv>1?' vol.'+gv:''}</b><em class="${tool?'':'bp'}">${UIMG('u_limited',16)}限定${tool?'工具':'装備の図面'} ${Math.round(C.lim*100)}%</em></div><div class="gci">${icons}</div></div>
 <div class="gapity">${UIMG('u_pity',20)} 限定まで あと <b>${C.pity-pity}</b> 回（${C.pity}回で必ず出る）</div>
 <div class="galink"><button data-ga="rate">提供割合</button><button data-ga="list">${tool?'工具':'図面'}の一覧（図鑑）</button></div>
 <div class="gabtns"><button class="gab" data-gp="1" ${G.coin<C.cost?'disabled':''}><b>1回</b><small>${coinIc(16)} ${C.cost}</small></button><button class="gab ten" data-gp="11" ${G.coin<C.cost11?'disabled':''}><b>11回</b><small>${coinIc(16)} ${C.cost11}</small></button></div>`;
 gaBind();$('gaBody').querySelectorAll('[data-giv]').forEach(b=>b.onclick=()=>{const v=+b.dataset.giv;if(!gaVolOpen(v))return;gaVolI[gaType]=v;renderGacha()});
 $('gaBody').querySelectorAll('[data-gp]').forEach(b=>b.onclick=()=>pullItems(gaType,+b.dataset.gp));
 $('gaBody').querySelector('[data-ga=list]').onclick=()=>{ZK.tab=tool?'tool':'bp';goTab('zukan')};
 $('gaBody').querySelector('[data-ga=rate]').onclick=()=>{$('gpBody').innerHTML=`<div class="gph">提供割合　${tool?'工具':'図面'}ガチャ vol.${gv}</div><div class="rdt">
  <div><span>限定</span><p>${Math.round(C.lim*100)}%：${lims.map(k=>tool?TOOLS[k].n:RECIPES[k].n).join('・')}</p></div>
  <div><span>ふつう</span><p>${100-Math.round(C.lim*100)}%：${tool?'工房で売っている工具（やすり以外）':`vol.${gv}の塔で見つかる図面（仲間の専用武器は、持っているキャラのぶんだけ）`}</p></div>
  <div><span>天井</span><p>${C.pity}回引くと限定が必ず出る（限定が出たら数えなおし）</p></div>
  <div><span>被ったら</span><p>${tool?'工具の練度が大きく上がる（+40）。練度Lv5のあとは基本素材になる':'改良図面：その装備の威力+3%（最大+3回）。そのあとは基本素材になる'}</p></div>
  <div><span>11回</span><p>10回分の値段で11回</p></div></div><div class="gpf"><button class="btn" id="gpClose">とじる</button></div>`;$('gpClose').onclick=()=>$('genPick').classList.remove('on');$('genPick').classList.add('on')}}
function pullItems(type,n){const tool=type==='tool',C=tool?TOOL_G:BP_G,cost=n>1?C.cost11:C.cost,gv=gaVolOpen(gaVolI[type])?gaVolI[type]:1,pk=pityKey(type,gv),LIMS=gaLims(type,gv);if(G.coin<cost){say('コインが足りない',1000);return}
 G.coin-=cost;G.pity=G.pity||{};G.bpPlus=G.bpPlus||{};const res=[];
 for(let i=0;i<n;i++){G.pity[pk]=(G.pity[pk]||0)+1;let lim=Math.random()<C.lim||G.pity[pk]>=C.pity;const pool=lim?LIMS:(tool?TOOL_POOL():BP_POOL_V(gv));if(lim)G.pity[pk]=0;
  const k=pick(pool);res.push(tool?getTool(k,lim):getBp(k,lim))}
 save();showItemResult(res);renderGacha()}
function getTool(t,lim){if(!G.tools.includes(t)){G.tools.push(t);return{ic:MIC(t,56),n:TOOLS[t].n,lim,tag:'NEW',cls:'new'}}
 G.tlx=G.tlx||{};if(tlv(t)>=5){const o=toolScrap(t);Object.keys(o).forEach(m=>G.mats[m]=(G.mats[m]||0)+o[m]);return{ic:MIC(t,56),n:TOOLS[t].n,lim,tag:'素材に',cls:'dup'}}
 const b=tlv(t);G.tlx[t]=(G.tlx[t]||0)+40;return{ic:MIC(t,56),n:TOOLS[t].n,lim,tag:`練度+40${tlv(t)>b?' ↑Lv'+tlv(t):''}`,cls:'dup'}}
function getBp(id,lim){const R=RECIPES[id];if(!G.bps.includes(id)&&!(G.bpRaw||[]).includes(id)){(G.bpRaw=G.bpRaw||[]).push(id);return{ic:RIC(id,56),n:R.n,lim,tag:'NEW（要解読）',cls:'new'}}
 const p=G.bpPlus[id]||0;if(p>=3){G.mats.scrap=(G.mats.scrap||0)+2;G.mats.bolt=(G.mats.bolt||0)+1;return{ic:RIC(id,56),n:R.n,lim,tag:'素材に',cls:'dup'}}
 G.bpPlus[id]=p+1;return{ic:RIC(id,56),n:R.n,lim,tag:`${UIMG('u_bpplus',14)}改良 +${p+1}`,cls:'dup'}}
function showItemResult(res){const any=res.some(r=>r.lim);
 $('grCards').innerHTML=res.map((r,i)=>`<div class="grc it ${r.lim?'s3':'s1'}" style="animation-delay:${i*.12}s"><span class="gri">${r.ic}</span><b>${r.n}</b><small>${r.lim?UIMG('u_limited',16)+'限定':'　'}</small><i class="${r.cls==='new'?'new':'dup'}">${r.cls==='new'?UIMG('u_new',14):''}${r.tag}</i></div>`).join('');
 $('grCards').classList.toggle('one',res.length===1);$('gres').classList.toggle('gold',any);$('gres').classList.add('on');tone(any?880:660,.3,'triangle',.1,any?1760:990)}

/* ===================== 工具・加工・装備の関係（1つの加工＝1つの主工具。形で加工を決める） ===================== */
/* 主工具：その加工に必ず要る工具。配線はペンチ（線を切る・むく）とはんだごて（つける）の2つ */
const PROC_MAIN={grind:['grinder'],lathe:['lathe'],hit:['anvil'],cut:['snips'],weld:['welder'],wire:['pliers','solder'],trace:['caliper'],file:['file'],drill:['drill'],tap:['tap']};
/* 装備ごとの加工。上層（参）の武器は2段階 */
const REMAP={bite1:['file'],bite2:['lathe'],spanner1:['grind'],shield1:['hit'],bow1:['cut'],fuda1:['cut'],rod1:['grind'],
 hammer1:['hit'],laser1:['wire'],guitar1:['weld'],shield2:['hit'],fuda2:['grind'],
 spanner2:['lathe','drill'],hammer2:['hit','weld'],pen1:['lathe','wire'],rod2:['grind','wire'],laser2:['lathe','wire'],bow2:['cut','weld'],guitar2:['weld','wire'],
 helm:['hit'],apron:['cut'],boots:['trace'],mask:['hit'],vest:['weld'],gboots:['drill'],chelm:['hit'],coat:['cut'],jboots:['tap']};
Object.entries(REMAP).forEach(([k,ps])=>{const R=RECIPES[k];if(!R)return;R.proc=ps[0];if(ps.length>1)R.procs=ps;else delete R.procs;delete R.lathe;R.tools=[...new Set(ps.flatMap(p=>PROC_MAIN[p]))]});
const procsOf=R=>R.procs||[procOf(R)];
Object.assign(PROC_LBL,{file:'やすり',drill:'穴あけ',tap:'ねじ切り'});Object.assign(PROC_TOOL,{file:'file',drill:'drill',tap:'tap'});
PROC_ORDER.splice(0,PROC_ORDER.length,'file','grind','lathe','hit','cut','weld','wire','trace','drill','tap');
Object.assign(PROC_HOW,{file:'やすり：左右に大きく、まっすぐ・同じ速さでこすってバリを取る',drill:'ボール盤：長押しで刃を下ろす。押す力を緑の帯に保つ（押しすぎると刃が折れる）',tap:'タップ：ハンドルを右に半回転すすめて、左に1/4もどす。くり返してねじを切る',trace:'けがき：ノギスで測りながら、定規とコンパスで図面の線を鉄板に写す'});
/* 万力は補助工具：持っていると、どの加工も少し楽になる（材料をしっかり固定できるから） */
{const _am=assistMul;assistMul=o=>_am(o)+(typeof G!=='undefined'&&G&&G.tools&&G.tools.includes('vise')?.08:0)}
{const _tb=toolBonus;toolBonus=R=>_tb(R)+(G.tools.includes('vise')&&['grind','lathe'].includes(procOf(R))?2:0)}
/* 加工を1つ行う */
async function runProc(R,pr,st){let r;const tl=KANJI_TIER[R.tier];
 if(MINI[pr]){const M=MINI[pr];r=await M.f({tier:R.tier,shape:R.shape,title:`${st}${M.t}　${R.n}`,assist:recLv(R),lim:limOf(R)});
  await say(`${M.n} <span class="big">${r.score}</span> 点${r.reach<1?`<br><span style="font-size:14px">最後までできなかった（${Math.round(r.reach*100)}%。SS はなし）</span>`:''}`,r.reach<1?1600:1100)}
 else if(pr==='lathe'){show('craft');$('craftT').textContent=`${st}旋盤　${R.n}`;$('craftSub').textContent='ハンドルを回して刃物を動かす。左＝左右、右＝深さ';
  r=await runLathe({tier:R.tier,label:'旋盤・'+tl});r.reach=1;await say(`旋盤 <span class="big">${r.score}</span> 点`,1100)}
 else{r=await runGrind({who:R.who||R.impl,tier:R.tier,title:`${st}グラインダー　${R.n}`});r.reach=1;
  await say(`形の一致 <span class="big">${r.score}</span> %`,1200)}
 return r}

/* ===================== 加工ミニゲーム道場（練習）：ゲームを進めなくても、全部の加工を試せる。?practice で開く ===================== */
const PRACTICE_LIST=['file','grind','lathe','hit','cut','weld','wire','trace','drill','tap'];
const PRACTICE_SHAPE={cut:'ch',trace:'ch',weld:'de'};
let prTier=1;
const prBest=()=>{try{return JSON.parse(localStorage.getItem('mt2_practice')||'{}')}catch(_){return{}}};
const prSave=b=>{try{localStorage.setItem('mt2_practice',JSON.stringify(b))}catch(_){}};
function openPractice(){show('practice');const B=prBest();
 $('prBody').innerHTML=`<div class="prsign">${UIMG('u_dojo',64)}<b>加工ミニゲーム道場</b></div><div class="note" style="margin:4px 0 8px">塔で使う加工ミニゲームを、ここで自由に練習できる。練習の結果はゲームの進みには関係しない。</div>
 <div class="wsch prt">${[1,2,3].map(t=>`<button class="${prTier===t?'on':''}" data-pt="${t}">${KANJI_TIER[t]}（${['やさしい','ふつう','むずかしい'][t-1]}）</button>`).join('')}</div>
 <div class="prg">${PRACTICE_LIST.map(k=>{const b=B[k+prTier];return `<button class="prc" data-pk="${k}">${MIC(PROC_TOOL[k],40)}<span class="prn"><b>${PROC_LBL[k]}</b><i>${b!=null?`ベスト ${b}点 ${RKIC(craftRank(b,1),18)}`:'まだ'}</i></span></button>`}).join('')}</div>
 <div class="gpf" style="margin-top:10px"><button class="btn ghost" id="prBack">${(typeof G!=='undefined'&&G)?'工房へ':'タイトルへ'}</button></div>`;
 $('prBody').querySelectorAll('[data-pt]').forEach(b=>b.onclick=()=>{prTier=+b.dataset.pt;openPractice()});
 $('prBody').querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>runPractice(b.dataset.pk));
 $('prBack').onclick=()=>(typeof G!=='undefined'&&G)?openShop('tab'):show('title')}
async function runPractice(k,tt,back){const t=tt||prTier,st='練習・';let r;
 try{if(MINI[k]){const M=MINI[k];r=await M.f({tier:t,shape:PRACTICE_SHAPE[k]||'ch',title:`${st}${M.t}`,assist:1,lim:{}})}
  else if(k==='lathe'){show('craft');$('craftT').textContent=`${st}旋盤`;$('craftSub').textContent='ハンドルを回して刃物を動かす。左＝左右、右＝深さ';r=await runLathe({tier:t,label:'旋盤・'+KANJI_TIER[t]});r.reach=1}
  else{r=await runGrind({who:'wolf',tier:t,title:`${st}グラインダー`});r.reach=1}}catch(e){console.error(e);r={score:0,reach:0}}
 const rank=craftRank(r.score,r.reach==null?1:r.reach),B=prBest(),key=k+t,best=B[key]==null||r.score>B[key];if(best){B[key]=r.score;prSave(B)}
 await say(`${PROC_LBL[k]}（${KANJI_TIER[t]}）<br><span class="big">${r.score}</span> 点　${RKIC(rank,40)}${best?'<br><span style="font-size:14px;color:#ffd060">ベスト更新！</span>':''}`,1600);(back||openPractice)()}
if(/practice/.test(location.search+location.hash))addEventListener('load',()=>setTimeout(openPractice,80));
/* 汎用武器は種類ごとに1本。今より低いランクができたときは、換金所の値段ぶんのコインに替える（2.0.4） */
{const _s=showCraftResult;showCraftResult=function(pc){_s(pc);const R=pc&&RECIPES[pc.rid];if(!R||R.kind!=='gen')return;const old=G.gen&&G.gen[pc.rid];
 if(!old||RANK_ORDER.indexOf(pc.rank)>RANK_ORDER.indexOf(old.rank))return;const pr=sellPrice(pc.rid,pc.rank);
 /* 同じランク：今と新しいのを並べて、どちらかを選ぶ。残さないほうはコインに替える（2.0.10） */
 if(pc.rank===old.rank){const row=(t,w)=>`<div class="note" style="margin:4px 0"><b>${t}</b>：${RKIC(w.rank,16)} 威力×${(+w.mul||1).toFixed(2)}　${w.attr?attrTxt(w.attr):'属性なし'}</div>`;
  $('resP').insertAdjacentHTML('beforeend',`<div style="margin-top:8px;text-align:left">${row('今の武器',old)}${row('新しい武器',pc)}</div><div class="note" style="text-align:center;color:var(--gold)">汎用武器は種類ごとに1本。残さないほうは ${UIMG('coin',16)} <b>${pr}</b> コインに替える</div>`);
  const fin=keepNew=>{if(!G.pendCraft)return;delete G.pendCraft;if(keepNew)genGet(pc);G.coin=(G.coin|0)+pr;save();tone(880,.15,'triangle',.1,1320);openShop()};
  $('resBtns').innerHTML='';addBtn('新しいほうにする',()=>fin(true),'gold');addBtn(`今のままにする（${pr}コイン）`,()=>fin(false));return}
 $('resP').insertAdjacentHTML('beforeend',`<div class="note" style="text-align:center;margin-top:6px;color:var(--gold)">すでに ${RKIC(old.rank,18)} を持っているので、${UIMG('coin',18)} <b>${pr}</b> コインに替える（換金所の値段）</div>`);
 $('resBtns').innerHTML='';addBtn(`${pr}コインを受け取る`,()=>{if(!G.pendCraft)return;delete G.pendCraft;G.coin=(G.coin|0)+pr;save();tone(880,.15,'triangle',.1,1320);openShop()},'gold')}}
