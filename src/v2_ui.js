/* =====================================================================
   v0.3 ホーム・編成・図鑑（メダサバ風の画面）
   ===================================================================== */

/* ---------- キャラ育成：レベルで能力の枠（R→SR→UR→LR）が開く ---------- */
const GROW_MAX=20;
/* lv→lv+1 に必要なもの。Lv5・10・15・20 に上がるときは錆の核もいる */
/* キャラのLv：コインで上げる（鉄くずは装備づくり専用）。Lv1つで基礎攻撃+5%、リーダーなら体力+5 */
const growCost=lv=>({coin:10+lv*10});
/* 能力（パッシブ）は★で開く：★1＝R、★2＝SR、★3＝UR、★4＝LR、★5＝全部の能力が1.5倍（覚醒） */
const ABIL_RANK=[['R',1],['SR',2],['UR',3],['LR',4]];
const abOpen=(m,i)=>((m&&m.star)||1)>=ABIL_RANK[i][1];
const abBoost=m=>((m&&m.star)||1)>=5?1.5:1;
const ABIL={
 wolf:[{k:'teamAtk',v:.10,d:'チームの攻撃が+10%'},{k:'crit',v:.15,d:'牙刃連射が15%で会心（2倍）'},{k:'rage',v:.3,d:'体力が半分以下のとき、攻撃+30%'},{k:'startLv',v:1,d:'出撃したとき、ウルフの攻撃Lvが+1'}],
 fox: [{k:'pick',v:.2,d:'素材・経験値を吸い寄せる範囲+20%'},{k:'regen',v:2,d:'10秒ごとに体力を2回復'},{k:'orb',v:1,d:'まわる輪刃が1つ増える'},{k:'revive',v:.5,d:'1回だけ、力つきても体力50%で立ち上がる'}],
 dodo:[{k:'hp',v:15,d:'チームの最大体力+15'},{k:'cut',v:.1,d:'受けるダメージ−10%'},{k:'kb',v:1,d:'衝撃波で大きくふっとばす'},{k:'hamCd',v:.25,d:'衝撃波の間隔−25%'}],
 owl: [{k:'xp',v:.1,d:'経験値が+10%'},{k:'slow',v:1,d:'魔法陣の足止めが強くなる'},{k:'zone',v:1,d:'魔法陣が1つ増える'},{k:'lvSpd',v:.12,d:'レベルアップごとに移動速度が上昇（最大12%）'}]};
const RANK_COL={R:'#3fae5a',SR:'#2f7fd0',UR:'#8a3fd0',LR:'#c9962a'};
/* チーム全員の開いている能力を合計する（メダサバのチーム効果と同じ考え方） */
function teamAb(){const a={};G.party.forEach(m=>{(ABIL[m.id]||[]).forEach((ab,i)=>{if(abOpen(m,i))a[ab.k]=(a[ab.k]||0)+ab.v*abBoost(m)});const at=m.weapon&&m.weapon.attr;if(at){const k={thunder:'xp',steel:'cut',wind:'wspd'}[at.k];if(k)a[k]=(a[k]||0)+at.v}});return a}
const lvMul=m=>1+.05*((m&&m.lv||1)-1);
const memPow=m=>Math.round(100*starMul(m)*wMul(m)*lvMul(m)*genSup(m.id));
function teamPow(){const a=teamAb();return Math.round(G.party.reduce((s,m)=>s+memPow(m),0)*(1+(a.teamAtk||0)))}
function teamHp(){const a=teamAb(),L=G.party.find(m=>m.id===G.lead);return Math.round(FCFG.HP+5*((L&&L.lv||1)-1)+30*armMul('head')+(a.hp||0))}

/* ---------- 下のタブ ---------- */
const TAB_SCR={party:'party',shop:'shop',zukan:'zukan',gacha:'gacha'};  /* ホームは魔法陣のまわりにボタンがあるのでタブを出さない */
function updTabs(id){const on=!!TAB_SCR[id]&&!(id==='shop'&&shopFrom==='town');const sb=$('shopBack');if(sb)sb.style.display=id==='shop'&&shopFrom==='town'?'':'none';document.body.classList.toggle('hasTabs',on);$('tabs').style.display=on?'flex':'none';
 document.querySelectorAll('#tabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.s===id))}
{const _show=show;show=function(id){_show(id);updTabs(id)}}
function goTab(s){audio();if(TW)TW.busy=false;({home:openHome,party:openParty,shop:()=>openShop('tab'),town:openTown,zukan:openZukan,gacha:openGacha})[s]()}

/* ---------- ホーム ---------- */
function nextGoal(){const k=AREA_ORDER.find(a=>areaOpen(a)&&!areaDone(a));
 const mk=RECIPE_ORDER.find(id=>G.bps.includes(id)&&canMake(id).ok&&!isEquipped(id));
 if(mk)return{t:'工房',m:`「${RECIPES[mk].n}」を作れる！`,ic:RIC(mk,40),go:'shop'};
 const up=G.party.find(m=>m.lv<GROW_MAX&&canGrow(m));if(up)return{t:'編成',m:`${CHARS[up.id].name}をレベルアップできる`,ic:`<img src="${CHARS[up.id].img}" style="width:40px;height:40px;object-fit:contain">`,go:'party'};
 if((G.floor|0)<TOP_FLOOR){const f=nextFloor();return{t:'次の目標',m:`塔の${f}階「${FLOORS[f].n}」を突破する`,ic:IC('node_boss',40),go:'go'}}
 return{t:'第1章クリア',m:'第2章「審判の塔」は次のアップデートで公開。素材を集めて、最強の装備を作ろう',ic:IC('clear',40),go:'shop'}}
function isEquipped(id){const R=RECIPES[id];if(R.kind==='armor')return G.arm[R.slot]&&G.arm[R.slot].rid===id;const m=G.party.find(x=>x.id===R.who);return m&&m.weapon&&m.weapon.rid===id}
/* ホーム上部：コインの所持数（素材の数は出さない） */
function resHTML(){return `<span class="gcoin">${UIMG('coin',20)}<small>コイン</small><b>${(G.coin|0).toLocaleString()}</b></span>`}
function openHome(){if(TW)TW.busy=false;G.where={s:'town'};save();show('home');
 const L=G.party.find(m=>m.id===G.lead)||G.party[0],done=AREA_ORDER.filter(areaDone).length;
 $('hName').textContent='第1章　夜の工房に灯る';$('hRank').textContent=`${G.floor|0}F / ${TOP_FLOOR}F`;$('hRankI').style.width=100*(G.floor|0)/TOP_FLOOR+'%';
 $('hRes').innerHTML=resHTML();
 const others=G.party.filter(m=>m.id!==L.id);
 $('hArt').innerHTML=homeFormHTML(L,others);
 $('hArt').querySelectorAll('[data-hf]').forEach(b=>b.onclick=()=>{const v=b.dataset.hf;if(v.startsWith('slot:')){partySel=G.lead;openParty();pickSlot=+v.slice(5);renderParty()}else{partySel=v||null;openParty()}});
 $('hLead').innerHTML='';
 const g=nextGoal();$('hBanner').innerHTML=`<span class="nx">NEXT</span><span class="nm">${g.m}</span><span class="na">→</span>`;$('hBanner').onclick=()=>g.go==='go'?openSortie():goTab(g.go);
 const f=bestStart();$('hGoT').textContent=`塔の${f}階から　${LAYER_NAME[FLOORS[f].area]}`;
 const h=$('home');h.classList.remove('enter');void h.offsetWidth;h.classList.add('enter');requestAnimationFrame(fitHomeArt)}
/* キャラは「NEXT」とメニューのあいだに収める（重ならないように） */
function fitHomeArt(){if(!onScr('home'))return;const hm=$('home').getBoundingClientRect(),nx=$('hBanner').getBoundingClientRect(),mn=document.querySelector('.gmenu').getBoundingClientRect();
 const top=nx.bottom-hm.top+8,bot=mn.top-hm.top-10,f=$('hArt').querySelector('.hform');if(f)Object.assign(f.style,{top:top+'px',height:Math.max(150,bot-top)+'px'})}
function homeFormHTML(L,others){const card=(m,k,lead)=>{if(!m)return `<button class="hfc em" data-hf="slot:${k}"><span>＋</span><small>空き</small></button>`;const c=CHARS[m.id],A=ATK[m.id];
  return `<button class="hfc ${lead?'ld':'fc'}" data-hf="${m.id}"><img src="${lead?c.img:FACE(m.id)}" alt=""><span class="hft">${TIC(A.type,lead?24:18)}</span>${lead?'<span class="hfl">LEADER</span>':''}<span class="hfb"><b>${c.name}</b><small>Lv${m.lv}　<i>${'★'.repeat(m.star||1)}</i></small></span></button>`};
 const rest=Array.from({length:PARTY_MAX-1},(_,i)=>card(others[i],i+1,false)).join('');
 return `<div class="hform"><div class="hfh"><span class="hfk">PARTY</span><span class="hfs"><i>攻撃</i><b>${teamPow()}</b><i>体力</i><b>${teamHp()}</b></span>${(()=>{const n=chatNew().length;return `<button class="hfe hch ${n?'on':''}" onclick="openChats()">チャット${n?`<i>${n}</i>`:''}</button>`})()}</div>${card(L,0,true)}${rest}</div>`}
addEventListener('resize',()=>{if(onScr('home'))fitHomeArt()});

/* ---------- 編成 ---------- */
let partySel=null,pickSlot=null,pickSel=null;
/* リーダー（出撃キャラ）はいつも左はしの枠 */
function leadFirst(){const i=G.party.findIndex(x=>x.id===G.lead);if(i>0)G.party.unshift(G.party.splice(i,1)[0]);if(G.party[0])G.lead=G.party[0].id}
function canGrow(m){if(m.lv>=GROW_MAX)return false;return (G.coin|0)>=growCost(m.lv).coin}
function openParty(){show('party');pickSlot=null;pickSel=null;if(!partySel||!owned(partySel))partySel=G.lead;renderParty()}
let partyShow=null;
function renderParty(){leadFirst();const showId=pickSlot!=null&&pickSel?pickSel:partySel;partyShow=showId;const inP=G.party.some(x=>x.id===showId),m=owned(showId)||G.party[0],hasW=RECIPE_ORDER.some(r=>RECIPES[r].who===m.id),c=CHARS[m.id],A=ATK[m.id],ab=ABIL[m.id]||[],cost=growCost(m.lv),max=m.lv>=GROW_MAX;
 const w=m.weapon,rank=w&&w.rank?w.rank:'C';
 $('partyList').innerHTML=`
 <div class="pstat"><div class="pst pw"><span>攻撃</span><b>${teamPow()}</b></div><div class="pst ar"><span>体力</span><b>${teamHp()}</b></div></div>
 <div class="part"><img class="pimg" src="${c.img}" alt="">
  <div class="pbtns"><span class="plead">${m.id===G.lead?'リーダー（出撃）':inP?'パーティ':'控え'}</span>
   </div>
  <div class="pname"><b>${c.name}</b><span>${TIC(A.type,20)}${A.n}（${A.type}）</span><div class="stup">${starHTML(m)}</div></div></div>
 <button class="pwstrip" id="pW">${WPIC(m.id,30,w&&w.rid&&RECIPES[w.rid]?RECIPES[w.rid].tier:0)}<span class="pwl">専用武器</span><span class="pwn"><b>${w&&w.rid&&RECIPES[w.rid]?RECIPES[w.rid].n:baseWeapon(m.id)}${w&&w.rid?' '+RKIC(w.rank,16):''}</b><small>×${wMul(m)}${w&&w.attr?'　'+attrTxt(w.attr):''}</small></span><i>変える</i></button>
 <div class="pcards">
  <div class="abcard">
   
   ${ab.map((x,i)=>{const [r,need]=ABIL_RANK[i],open=abOpen(m,i);return `<div class="abrow ${open?'':'lock'}"><span class="abtag" style="background:${RANK_COL[r]}">${r}</span><span class="abd">${open?'':`<i>★${need}で開く</i>`}${x.d}${open&&abBoost(m)>1?' <b class="awk">×1.5</b>':''}</span></div>`}).join('')}</div>
  <div class="lvcard"><div class="lvh">Lv <b>${m.lv}</b><small>/${GROW_MAX}</small></div>
   <div class="lvs"><span>攻撃 ×${(starMul(m)*wMul(m)*lvMul(m)*genSup(m.id)).toFixed(2)}${genSup(m.id)>1?'<small class="supt">支援込み</small>':''}</span>${hasW?`<button class="lvw" onclick="goTab('shop')">${UIMG('u_weapon',16)}工房でつくる ›</button>`:''}</div>
   ${max?'<div class="note" style="text-align:center">レベル最大</div>':`<div class="lvc ${(G.coin|0)<cost.coin?'lack':''}">${coinIc(22)}<b>${G.coin|0}</b>/${cost.coin}</div>`}
   <button class="lvup" id="pUp" ${max||!canGrow(m)?'disabled':''}>レベルアップ</button></div></div>
 <div class="prow slots">${Array.from({length:PARTY_MAX},(_,k)=>{const x=G.party[k];return `<button class="phex slot ${pickSlot===k?'pk':''} ${x&&x.id===m.id?'on':''} ${x?'':'empty'}" data-slot="${k}">${x?`<img class="pface" src="${FACE(x.id)}" alt=""><span class="plv">Lv${x.lv}</span>`:'<span class="pplus">＋</span>'}${k===0?'<span class="ptag">リーダー</span>':''}</button>`}).join('')}</div>
 ${pickSlot==null?equipRowHTML():pickerHTML()}
 `;
 $('partyList').querySelectorAll('.phex.slot').forEach(b=>b.onclick=()=>{const k=+b.dataset.slot,x=G.party[k];if(pickSlot===k){pickSlot=null;pickSel=null;renderParty();return}pickSlot=k;pickSel=x?x.id:null;if(x)partySel=x.id;renderParty();const pp=$('ppick');if(pp)pp.scrollIntoView({block:'nearest',behavior:'smooth'})});
 $('partyList').querySelectorAll('.ppt[data-id]').forEach(b=>b.onclick=()=>{const id=b.dataset.id,x=G.party[pickSlot];if(x&&x.id===id){partySel=id;renderParty();return}if(!x&&G.party.some(p=>p.id===id)){partySel=id;pickSel=id;renderParty();return}slotAssign(pickSlot,id)});
 const po=$('ppOut');if(po)po.onclick=()=>{const k=pickSlot,x=G.party[k];if(!x||k===0)return;G.bench.push(G.party.splice(k,1)[0]);pickSel=null;partySel=G.lead;save();tone(500,.08,'triangle',.06,300);renderParty()};
 const pi=$('ppIn');if(pi)pi.onclick=()=>slotAssign(pickSlot,pickSel);
 const pc=$('ppClose');if(pc)pc.onclick=()=>{pickSlot=null;pickSel=null;renderParty()};
 {const sb=$('pStar');if(sb)sb.onclick=()=>starUp(m.id)}
 $('partyList').querySelectorAll('[data-gs]').forEach(b=>b.onclick=()=>openGenPick(+b.dataset.gs));
 $('partyList').querySelectorAll('[data-es]').forEach(b=>b.onclick=()=>openEqPick('w'));
 $('partyList').querySelectorAll('[data-as]').forEach(b=>b.onclick=()=>openEqPick('a',b.dataset.as));
 $('pW').onclick=()=>openEqPick('w');
 $('pUp').onclick=()=>{if(!canGrow(m))return;const k=growCost(m.lv);G.coin-=k.coin;m.lv++;save();tone(880,.15,'triangle',.1,1320);
  renderParty();say(`${c.name} Lv${m.lv}！<br><span style="font-size:14px">基礎攻撃が上がった</span>`,800)}}

/* 入れかえ中は、イラストを小さくして能力を見やすく。スクロールしなくても一覧まで見える */
function previewTeam(k,id){const P=G.party.slice(),B=(G.bench||[]).slice();let r=null;
 try{const x=G.party[k];if(id&&!(x&&x.id===id)){const yi=G.party.findIndex(p=>p.id===id);
   if(yi>=0){if(x){[G.party[k],G.party[yi]]=[G.party[yi],G.party[k]]}}
   else{const bi=G.bench.findIndex(p=>p.id===id);if(bi>=0){const y=G.bench.splice(bi,1)[0];if(x){G.party[k]=y;G.bench.push(x)}else G.party.push(y)}}
   r={pow:teamPow(),hp:teamHp()}}}finally{G.party=P;G.bench=B}return r}
function renderPartyPick(m,inP){const c=CHARS[m.id],A=ATK[m.id],ab=ABIL[m.id]||[],w=m.weapon,rank=w&&w.rank?w.rank:'C';
 const pw=teamPow(),hp=teamHp(),pv=previewTeam(pickSlot,pickSel);
 const diff=(a,b)=>b==null||a===b?'':`<i class="${b>a?'up':'dn'}">→${b}</i>`;
 $('partyList').innerHTML=`
 <div class="pstat cmp"><div class="pst pw"><span>攻撃</span><b>${pw}${diff(pw,pv&&pv.pow)}</b></div><div class="pst ar"><span>体力</span><b>${hp}${diff(hp,pv&&pv.hp)}</b></div></div>
 <div class="pcmp"><div class="pci"><img src="${c.img}" alt=""></div><div class="pcb">
  <div class="pcn"><b>${c.name}</b><span class="pstar">${starTxt(m.star||1)}</span><span class="pcs">${m.id===G.lead?'リーダー':inP?'パーティ':'控え'}</span></div>
  <div class="pcl">Lv <b>${m.lv}</b>　攻撃 ×${(starMul(m)*wMul(m)*lvMul(m)).toFixed(2)}</div>
  <div class="pcl">${TIC(A.type,18)} ${A.n}（${A.type}）</div>
  <div class="pcl">${WPIC(m.id,18,w&&w.rid?RECIPES[w.rid].tier:0)} ${w&&w.rid?RECIPES[w.rid].n+' '+RKIC(rank,18):baseWeapon(m.id)}${w&&w.attr?'　'+attrTxt(w.attr):''}</div></div></div>
 <div class="pcab">${ab.map((x,i)=>{const [r,need]=ABIL_RANK[i],open=abOpen(m,i);return `<div class="abrow ${open?'':'lock'}"><span class="abtag" style="background:${RANK_COL[r]}">${r}</span><span class="abd">${open?'':`<i>★${need}で開く</i>`}${x.d}${open&&abBoost(m)>1?' <b class="awk">×1.5</b>':''}</span></div>`}).join('')}</div>
 <div class="prow slots sm">${Array.from({length:PARTY_MAX},(_,k)=>{const x=G.party[k];return `<button class="phex slot ${pickSlot===k?'pk':''} ${x?'':'empty'}" data-slot="${k}">${x?`<img class="pface" src="${FACE(x.id)}" alt=""><span class="plv">Lv${x.lv}</span>`:'<span class="pplus">＋</span>'}${k===0?'<span class="ptag">リーダー</span>':''}</button>`}).join('')}</div>
 ${pickerHTML()}`;
 bindPartyPick()}
function bindPartyPick(){
 $('partyList').querySelectorAll('.phex.slot').forEach(b=>b.onclick=()=>{const k=+b.dataset.slot,x=G.party[k];pickSlot=k;pickSel=x?x.id:null;if(x)partySel=x.id;renderParty()});
 $('partyList').querySelectorAll('.ppt[data-id]').forEach(b=>b.onclick=()=>{pickSel=b.dataset.id;renderParty()});
 const po=$('ppOut');if(po)po.onclick=()=>{const k=pickSlot,x=G.party[k];if(!x||k===0)return;G.bench.push(G.party.splice(k,1)[0]);pickSel=null;partySel=G.lead;save();tone(500,.08,'triangle',.06,300);renderParty()};
 const pi=$('ppIn');if(pi)pi.onclick=()=>slotAssign(pickSlot,pickSel);
 const pc=$('ppClose');if(pc)pc.onclick=()=>{pickSlot=null;pickSel=null;renderParty()}}

/* 枠をタップしたときの一覧（持っているキャラ全員） */
function pickerHTML(){const k=pickSlot,x=G.party[k],y=pickSel?owned(pickSel):null;
 const list=ownedAll().slice().sort((a,b)=>(b.star||1)-(a.star||1)||b.lv-a.lv);
 const label=k===0?'リーダーの枠':`${k+1}番目の枠`;
 let act='';if(false&&y&&(!x||x.id!==y.id)){const yIn=G.party.some(p=>p.id===y.id);act=yIn&&!x?`<span class="ppn">${CHARS[y.id].name}はもうパーティにいる</span>`:`<button class="lvup pin" id="ppIn">${CHARS[y.id].name}を${x?(yIn?'入れかえる':'この枠に入れる'):'この枠に入れる'}</button>`}
 else act=`<span class="ppn">${x?'入れかえるキャラをタップ':'入れるキャラをタップ'}</span>`;
 return `<div class="ppick" id="ppick"><div class="pph"><b>${label}</b>${act}<button class="ppx" id="ppClose">閉じる</button></div>
 <div class="ppg">${x&&k>0?'<button class="ppt off" id="ppOut">はずす</button>':''}${list.map(p=>{const inP=G.party.some(q=>q.id===p.id);return `<button class="ppt ${p.id===pickSel?'on':''}" data-id="${p.id}"><img class="pface" src="${FACE(p.id)}" alt="">${inP?'<span class="ppc">✓</span>':''}<span class="plv">Lv${p.lv}</span><span class="pps">${'★'.repeat(p.star||1)}</span></button>`}).join('')}</div></div>`}
function slotAssign(k,id){if(k==null||!id)return;const x=G.party[k];if(x&&x.id===id)return;const yi=G.party.findIndex(p=>p.id===id);
 if(yi>=0){if(!x)return;[G.party[k],G.party[yi]]=[G.party[yi],G.party[k]]}
 else{const bi=G.bench.findIndex(p=>p.id===id);if(bi<0)return;const y=G.bench.splice(bi,1)[0];if(x){G.party[k]=y;G.bench.push(x)}else G.party.push(y)}
 G.lead=G.party[0].id;partySel=id;pickSel=id;save();tone(880,.1,'triangle',.08,1320);renderParty();
 if(k===0)say(`${CHARS[id].name}がリーダー（出撃キャラ）になった`,900)}

/* ---------- 図鑑（図面・工具・素材） ---------- */
function _oldZukan(){show('zukan');
 $('zkBody').innerHTML=`<div class="zkh">図面 ${G.bps.length}/${RECIPE_ORDER.length}</div><div class="zkg">${RECIPE_ORDER.map(id=>{const R=RECIPES[id],has=G.bps.includes(id);
  return `<div class="zki ${has?'':'no'}">${has?RIC(id,40):MIC('bp',40)}<b>${has?R.n:'？？？'}</b><small>${has?recTag(R):LAYER_NAME[R.area]?'塔の'+LAYER_NAME[R.area]+'で見つかる':''}</small></div>`}).join('')}</div>
 <div class="zkh">工具 ${G.tools.length}/${TOOL_ORDER.length}</div><div class="zkg">${TOOL_ORDER.map(t=>{const has=G.tools.includes(t);return `<div class="zki ${has?'':'no'}">${MIC(t,40)}<b>${TOOLS[t].n}</b><small>${has?'持っている':TOOLS[t].price?'工房で買える':TOOLS[t].where}</small></div>`}).join('')}</div>
 <div class="zkh">素材</div><div class="zkg">${MAT_ORDER.map(k=>{const fl=Object.keys(FLOOR_MATS).filter(f=>floorMats(+f).includes(k));return `<div class="zki">${MIC(k,40)}<b>${MATS[k].n}</b><small>×${G.mats[k]}</small><small class="zkf">${fl.length?fl.join('・')+'F':''}</small></div>`}).join('')}</div>`}
function openMenu(){$('sheetT').textContent='メニュー';$('sheetB').innerHTML=`<button class="btn ghost" onclick="closeSheet();setTimeout(openNews,50)">お知らせ</button><button class="btn ghost" onclick="closeSheet();openHelp()">あそびかた</button><button class="btn ghost" onclick="closeSheet();openStory()">ストーリーをふりかえる</button><button class="btn ghost" onclick="closeSheet();openItems()">持ちもの</button><button class="btn ghost" onclick="closeSheet();openPractice()">加工の練習（道場）</button><button class="btn ghost" onclick="closeSheet();openSaveGuard()">セーブの守り</button><button class="btn ghost" onclick="closeSheet();setTimeout(openGift,50)">🎁 プレゼントコード</button><button class="btn ghost" onclick="closeSheet();setTimeout(openBug,50)">バグを報告</button><button class="btn ghost" onclick="closeSheet();show('title')">タイトルへ</button><div class="note" style="text-align:center;margin-top:6px">更新日時：${typeof BUILD!=='undefined'?BUILD:'-'}</div>`;$('sheet').classList.add('on')}

/* 鍛え直し：鉄くずを使って属性を付け直す */
function reforge(id){const m=owned(id),w=m&&m.weapon;if(!w||!w.attr)return;if(G.mats.scrap<REFORGE_COST){say('鉄くずが足りない',900);return}
 G.mats.scrap-=REFORGE_COST;const old=w.attr;w.attr=rollAttr(w.rank||'B');save();tone(700,.15,'square',.06,1400);if(onScr('party'))renderParty();else openReforge();say(`鍛え直した！<br><span style="font-size:14px">${ATTRS[old.k].n} → ${ATTRS[w.attr.k].n}（${ATTRS[w.attr.k].d(w.attr.v)}）</span>`,1500)}
/* 画面を切りかえたら、その画面のスクロールを上にもどす（画面の中でスクロールするため） */
{const _sh=show;show=function(id){const r=_sh.apply(this,arguments);const el=document.getElementById(id);if(el)el.scrollTop=0;return r}}
