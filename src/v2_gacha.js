/* =====================================================================
   ガチャ（原作マイスターの塔と同じく、キャラが出る）
   ・回すのは塔で手に入るコインだけ（本物のお金は使わない）
   ・★はガチャで決まる。同じキャラが出るとかけらになり、かけらで★を上げる（最大★5）。★で能力（パッシブ）が開く
   ・物語の3人（フォックス・ドド先輩・ホー博士）はガチャには入れない
   ===================================================================== */
Object.assign(CHARS,{
 gorilla:{name:'ボルトゴリラ',img:'img/gorilla.webp',job:'denki',pass:{n:'フルパワー',d:'',k:''},sp:{n:'',d:'',shape:'de'},lines:['ウホッ！ フルパワーでいくぜ！']},
 mouse:  {name:'チュータ',   img:'img/mouse.webp',  job:'hozen',pass:{n:'こまめな手入れ',d:'',k:''},sp:{n:'',d:'',shape:'me'},lines:['チュー！ 修理はまかせて！']},
 robot:  {name:'メカロボ',   img:'img/robot.webp',  job:'senban',pass:{n:'自動制御',d:'',k:''},sp:{n:'',d:'',shape:'ma'},lines:['ピピ……戦闘モード……起動……']},
 tsukiyo:{name:'ツキヨ',     img:'img/tsukiyo.webp',job:'sekkei',pass:{n:'星読み',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['星が告げてる。今夜は勝てるって。']},
 onmyo:  {name:'オンミョウ', img:'img/onmyo.webp',  job:'sekkei',pass:{n:'陰陽',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['……陰と陽、見届けよう。']},
 rocker: {name:'セブンティーン',img:'img/rocker.webp',job:'kaji',pass:{n:'ビート',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['よう。いいリズムで行こうぜ。']}});
Object.assign(ATK,{
 gorilla:{n:'100万ボルト',type:'連鎖',ic:'tester', d:['近い敵に雷。となりの敵へ飛び移る','飛び移る数が増える','威力アップ','間隔が短くなる','飛び移る数が増える']},
 mouse:  {n:'応急修理',   type:'回復',ic:'spanner',d:['ときどき体力を回復する','回復量アップ','間隔が短くなる','回復量アップ','回復のたびにまわりを押し返す']},
 robot:  {n:'メカレーザー',type:'貫通',ic:'bite',   d:['一直線のレーザー。並んだ敵をまとめて焼く','威力アップ','太くなる','間隔が短くなる','2方向に撃つ']},
 tsukiyo:{n:'流れ星',     type:'降下',ic:'pen',    d:['敵の上に星が落ちる','星が増える','威力アップ','星が増える','落ちる範囲が広がる']},
 onmyo:  {n:'式神',       type:'追尾',ic:'pen',    d:['敵を追いかける札を飛ばす','札が増える','威力アップ','つらぬく','札が増える']},
 rocker: {n:'ギター音波', type:'波動',ic:'hammer', d:['広がる音の輪で敵を押し返す','威力アップ','輪が大きくなる','間隔が短くなる','強く押し返す']}});
const ABD={teamAtk:v=>`チームの攻撃が+${Math.round(v*100)}%`,hp:v=>`チームの最大体力+${v}`,cut:v=>`受けるダメージ−${Math.round(v*100)}%`,regen:v=>`10秒ごとに体力を${v}回復`,pick:v=>`吸い寄せる範囲+${Math.round(v*100)}%`,revive:v=>`力つきても体力${Math.round(v*100)}%で立ち上がる（全員で1回。持つ仲間の分だけ足される）`,xp:v=>`経験値+${Math.round(v*100)}%`,lvSpd:v=>`レベルアップごとに移動速度が上昇（最大${Math.round(v*100)}%）`};
const ab4=(...a)=>a.map(([k,v])=>({k,v,d:ABD[k](v)}));
Object.assign(ABIL,{
 gorilla:ab4(['teamAtk',.05],['hp',10],['teamAtk',.08],['cut',.05]),
 mouse:  ab4(['regen',1],['pick',.1],['hp',10],['revive',.25]),
 robot:  ab4(['cut',.05],['hp',15],['teamAtk',.06],['cut',.08]),
 tsukiyo:ab4(['xp',.05],['pick',.1],['xp',.1],['lvSpd',.08]),
 onmyo:  ab4(['teamAtk',.05],['cut',.05],['xp',.05],['teamAtk',.1]),
 rocker: ab4(['lvSpd',.05],['teamAtk',.05],['xp',.08],['teamAtk',.1])});
/* ウルフは最初からいる。ほかの仲間はすべてガチャで手に入れる */
const GACHA_POOL=['wolf','fox','dodo','owl','gorilla','mouse','robot','tsukiyo','onmyo','rocker'];
const GACHA_COST=50,GACHA10_COST=450,STAR_MAX=10,PARTY_MAX=5;
const STAR_RATE=[[3,.05],[2,.25],[1,.70]];
/* コインの入り方（階の突破） */
const COIN_FIRST=40,COIN_FIRST_BOSS=80,COIN_AGAIN=20,COIN_DROP=10;  /* COIN_DROP：強敵が落とすコイン1枚ぶん（ボスは3枚） */
/* かけら：同じキャラが出ると、出た★に応じてもらえる。かけらで★を上げる */
const SHARD_GAIN={1:1,2:3,3:10},STAR_COST={1:5,2:10,3:20,4:40,5:60,6:80,7:100,8:130,9:160};
const starMul=m=>1;  /* ★は攻撃ではなく能力（パッシブ）に効く */
function starHTML(m){const s=m.star||1,c=STAR_COST[s],h=m.shard||0;return `<span class="pstar">${starTxt(s)}</span><span class="shd">かけら <b>${h}</b>${c?'/'+c:''}</span>${c?`<button class="hexb sbtn" id="pStar" ${h<c?'disabled':''}><span>★${s+1}にする</span></button>`:'<span class="shd">★最大</span>'}`}
function starUp(id){const m=owned(id);if(!m)return;const s=m.star||1,c=STAR_COST[s];if(!c||(m.shard||0)<c)return;m.shard-=c;m.star=s+1;save();tone(880,.2,'triangle',.1,1760);renderParty();
 const ab=ABIL[id]||[],i=m.star-1;say(m.star>5?`${CHARS[id].name} ★${m.star}！ 限界突破！<br><span style="font-size:14px">技のLvの上限が ${ATK_MAX+m.star-1} に。Lv6からは手数が増える</span>`:m.star===5?`${CHARS[id].name} ★5！<br><span style="font-size:14px">覚醒：全部の能力が1.5倍</span>`:`${CHARS[id].name} ★${m.star}！<br><span style="font-size:14px">${ABIL_RANK[i]?ABIL_RANK[i][0]+'能力が開いた：'+(ab[i]?ab[i].d:''):''}</span>`,1800)}
const starTxt=n=>n<=5?'★'.repeat(n)+'<span class="st0">'+'★'.repeat(Math.max(0,5-n))+'</span>':'<span style="color:#ff7ad9">'+'★'.repeat(n-5)+'</span>'+'★'.repeat(10-n);  /* ★6〜10は桃色の星が増える（限界突破） */
const owned=id=>G.party.find(m=>m.id===id)||(G.bench||[]).find(m=>m.id===id);

function rollStar(){let r=Math.random();for(const[s,p]of STAR_RATE){if(r<p)return s;r-=p}return 1}
function pullOnce(pool){const id=pick(pool||GACHA_POOL),star=rollStar(),m=owned(id);
 if(!m){const nm=newMember(id,1);nm.star=star;nm.shard=0;(G.party.length<PARTY_MAX?G.party:G.bench).push(nm);return{id,star,kind:'new',now:star}}
 const g=SHARD_GAIN[star]||1;m.shard=(m.shard||0)+g;return{id,star,kind:'dup',now:m.star||1,gain:g}}
/* 450コインで11回（10回分の値段で1回おまけ） */
function doGacha(n){if(GACHA_BANNERS[gaBan]&&GACHA_BANNERS[gaBan].soon)return;const cost=n>1?GACHA10_COST:GACHA_COST;if(G.coin<cost){say('コインが足りない<br><span style="font-size:14px">塔の階を突破するとコインがもらえる</span>',1300);return}
 G.coin-=cost;const res=[];const P=(GACHA_BANNERS[gaBan]&&GACHA_BANNERS[gaBan].pool)||GACHA_POOL;for(let i=0;i<n;i++)res.push(pullOnce(P));save();showGachaResult(res);renderGacha()}
function openGacha(){show('gacha');renderGacha()}
/* バナーは今後ふえる（vol.2、vol.3…）。soon:true はまだ引けない */
const GACHA_BANNERS=[{id:'v1',vol:1,n:'塔のなかまガチャ',img:'img/gacha-v1.webp',pool:GACHA_POOL},{id:'v2',vol:2,n:'近日登場',soon:true},{id:'v3',vol:3,n:'近日登場',soon:true}];
let gaBan=0;
function renderCharGacha(){const B=GACHA_BANNERS[gaBan];
 $('gaBody').innerHTML=gaHead()+`<div class="gavol">${GACHA_BANNERS.map((b,i)=>`<button class="${i===gaBan?'on':''} ${b.soon?'soon':''}" data-gb="${i}">vol.${b.vol}</button>`).join('')}</div>
 <div class="gaban ${B.soon?'soon':''}">${B.soon?`<div class="gasoon"><b>vol.${B.vol}</b><span>近日登場</span></div>`:`<img src="${B.img}" alt=""><span>${B.n}　vol.${B.vol}</span>`}</div>
 <div class="galink"><button data-ga="rate">提供割合</button><button data-ga="list">出るキャラ（図鑑）</button></div>
 <div class="gabtns"><button class="gab" onclick="doGacha(1)" ${B.soon||G.coin<GACHA_COST?'disabled':''}><b>1回</b><small>${coinIc(16)} ${GACHA_COST}</small></button><button class="gab ten" onclick="doGacha(11)" ${B.soon||G.coin<GACHA10_COST?'disabled':''}><b>11回</b><small>${coinIc(16)} ${GACHA10_COST}</small></button></div>`;
 $('gaBody').querySelectorAll('[data-gb]').forEach(b=>b.onclick=()=>{gaBan=+b.dataset.gb;renderGacha()});gaBind();
 $('gaBody').querySelector('[data-ga=list]').onclick=()=>{ZK.tab='char';goTab('zukan')};
 $('gaBody').querySelector('[data-ga=rate]').onclick=()=>{$('gpBody').innerHTML=`<div class="gph">提供割合　vol.${B.vol}</div><div class="rdt"><div><span>★3</span><p>${STAR_RATE[0][1]*100}%</p></div><div><span>★2</span><p>${STAR_RATE[1][1]*100}%</p></div><div><span>★1</span><p>${STAR_RATE[2][1]*100}%</p></div><div><span>出るキャラ</span><p>${(B.pool||[]).map(id=>CHARS[id].name).join('・')}（どれも同じ確率）</p></div><div><span>かけら</span><p>同じキャラが出ると、かけら（★1＝1、★2＝3、★3＝10）。かけらで★を上げると能力が開く（★5で覚醒）</p></div><div><span>11回</span><p>10回分の値段（${GACHA10_COST}コイン）で11回引ける</p></div></div><div class="gpf"><button class="btn" id="gpClose">とじる</button></div>`;$('gpClose').onclick=()=>$('genPick').classList.remove('on');$('genPick').classList.add('on')}}
function coinIc(s){return UIMG('coin',s)}
function _oldCoinIc(s){return `<svg class="ic" viewBox="0 0 32 32" style="width:${s}px;height:${s}px;vertical-align:middle"><circle cx="16" cy="16" r="13" fill="#ff9a3a" stroke="#ffd7a8" stroke-width="2"/><circle cx="16" cy="16" r="8" fill="none" stroke="#7a3a00" stroke-width="2"/><path d="M16 9v14M12 12h8" stroke="#7a3a00" stroke-width="2"/></svg>`}
function showGachaResult(res){const best=Math.max(...res.map(r=>r.star));
 $('grCards').innerHTML=res.map((r,i)=>`<div class="grc s${r.star}" style="animation-delay:${i*.12}s"><img src="${CHARS[r.id].img}" alt=""><b>${CHARS[r.id].name}</b><small>${starTxt(r.star)}</small><i class="${r.kind}">${r.kind==='new'?UIMG('u_new',14)+'NEW':'かけら+'+(r.gain||1)}</i></div>`).join('');
 $('grCards').classList.toggle('one',res.length===1);$('gres').classList.toggle('gold',best>=3);$('gres').classList.add('on');tone(best>=3?880:660,.3,'triangle',.1,best>=3?1760:990)}
function closeGacha(){$('gres').classList.remove('on')}

/* ---------- 編成：控えとの入れかえ ---------- */
function benchIn(id){const i=G.bench.findIndex(m=>m.id===id);if(i<0)return;if(G.party.length>=PARTY_MAX){say(`パーティは${PARTY_MAX}人まで<br><span style="font-size:14px">だれかを控えにもどしてから入れよう</span>`,1400);return}
 G.party.push(G.bench.splice(i,1)[0]);save();renderParty()}
function benchOut(id){if(id===G.lead){say('出撃キャラは控えにできない',1000);return}const i=G.party.findIndex(m=>m.id===id);if(i<0||G.party.length<=1)return;G.bench.push(G.party.splice(i,1)[0]);save();renderParty()}
