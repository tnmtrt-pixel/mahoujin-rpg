/* =====================================================================
   ガチャ vol.2 の仲間10人（第2章「審判の塔」とともに登場）
   ・大切にすること：工具を武器にしない。拳・爪・鎖・盾・光・風・サイコロなど、キャラ自身の力と武具で戦う
   ・V2_OPEN が false の間は、ガチャ・図鑑に出さない（いまは ?judge のテスト版だけ）
   ===================================================================== */
const VOL2=['nero','okajun','hayate','kurogane','lionex','seraph','hakurou','guardian','libra','spino'];
const V2_OPEN=J_LIVE;  /* 公開日になったら vol.2 も開く */
Object.assign(CHARS,{
 nero:    {name:'ネロ',        img:'img/nero.webp',    job:'sekkei',pass:{n:'甘い誓い',d:'',k:''},sp:{n:'',d:'',shape:'yami'},lines:['……甘いもの、持ってる？ ないなら、一緒に行く。']},
 okajun:  {name:'オカジュン',  img:'img/okajun.webp',  job:'kaji',  pass:{n:'工業魂',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['っしゃあ！ 拳で語るのが工業のやり方だろ！']},
 hayate:  {name:'ハヤテ',      img:'img/hayate.webp',  job:'senban',pass:{n:'一番風',d:'',k:''},sp:{n:'',d:'',shape:'ma'},lines:['僕が先に行きます。遅れないでくださいね。']},
 kurogane:{name:'クロガネ',    img:'img/kurogane.webp',job:'hozen', pass:{n:'九つの命',d:'',k:''},sp:{n:'',d:'',shape:'me'},lines:['ニャハッ！ ニャボ隊、出動ニャ！']},
 lionex:  {name:'ライオネクス',img:'img/lionex.webp',  job:'denki', pass:{n:'獅子王',d:'',k:''},sp:{n:'',d:'',shape:'de'},lines:['……我が雷、しかと見届けよ。']},
 seraph:  {name:'セラフ',      img:'img/seraph.webp',  job:'hozen', pass:{n:'祝福',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['光は、まだ消えていないよ。']},
 hakurou: {name:'ハクロウ',    img:'img/hakurou.webp', job:'sekkei',pass:{n:'天衣',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['風の向くまま、守り抜こう。']},
 guardian:{name:'ガーディアン',img:'img/guardian.webp',job:'kaji',  pass:{n:'七色の誓い',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['この盾がある限り、誰も通さん！']},
 libra:   {name:'リブラ',      img:'img/libra.webp',   job:'sekkei',pass:{n:'天秤',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['白か、黒か。……それを決めるのは、サイコロじゃない。']},
 spino:   {name:'スピノボーン',img:'img/spino.webp',   job:'kaji',  pass:{n:'化石の体',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['ガラガラ……一億年前の牙、まだ折れちゃいないぜ。']}});
VOL2.forEach(id=>{FACES[id]=['smile','worry','serious']});
Object.assign(TYPE_IC,{'罠':'a_candy','パワー':'a_power','スピード':'a_speed','使い魔':'a_pet','大技':'a_roar','結界':'a_halo','防御':'a_veil','反射':'a_thorn','交互':'a_dice','一発':'a_fossil'});
Object.assign(ATK,{
 nero:    {n:'キャンディの罠',type:'罠',     ic:'pen',d:['足元に飴を置く。ふれた敵の足を止めて、少しずつ削る','一度に2つ置く','威力アップ','置く間隔が短くなる','飴が大きくなる']},
 okajun:  {n:'剛拳',         type:'パワー', ic:'pen',d:['ためた重い一撃で、前方を大きく吹き飛ばす。ダメージを受けると次の一撃が強くなる','届く距離がのびる','威力アップ','間隔が短くなる','衝撃波がまわりにも広がる']},
 hayate:  {n:'疾風拳',       type:'スピード',ic:'pen',d:['近くの敵へ、軽い拳をすばやく連打する','2体を同時に打つ','威力アップ','連打が速くなる','届く距離がのびる']},
 kurogane:{n:'ニャボ隊',     type:'使い魔', ic:'pen',d:['鈴の音で、ねこ型の小さなメカを呼ぶ。走り回って敵に体当たり','ニャボが増える','威力アップ','ニャボが増える','速く走る・威力アップ']},
 lionex:  {n:'雷鳴の咆哮',   type:'大技',   ic:'pen',d:['6秒ためて、敵がいちばん多い場所へ巨大な雷を落とす','雷が大きくなる','威力アップ','ため時間が短くなる','2か所に落とす']},
 seraph:  {n:'祝福の光輪',   type:'結界',   ic:'pen',d:['まわりの光の輪で敵を削る。輪の中で倒すと少し回復','輪が大きくなる','威力アップ','回復量アップ','輪がさらに大きくなる']},
 hakurou: {n:'天衣の風',     type:'防御',   ic:'pen',d:['ダメージを吸う風の衣をまとう。やぶれると突風で押し返す','衣が厚くなる','突風の威力アップ','衣が早く戻る','衣が厚くなり、突風が広がる']},
 guardian:{n:'七色のトゲ盾', type:'反射',   ic:'pen',d:['まわりにトゲ。ふれた敵を刺し、敵の弾を盾で跳ね返す','トゲの威力アップ','跳ね返す確率アップ','トゲが広がる','跳ね返した弾の威力2倍']},
 libra:   {n:'白黒の天秤',   type:'交互',   ic:'pen',d:['白（当たると広がる）と黒（並んだ敵を貫く）のサイコロを交互に投げる','威力アップ','白の広がりが大きくなる','投げる間隔が短くなる','白と黒を同時に投げる']},
 spino:   {n:'化石の牙',     type:'一発',   ic:'pen',d:['間隔は長いが、巨大なあごで重くかみつく。強敵・ボスに2倍','威力アップ','かみつく範囲が広がる','間隔が短くなる','2回続けてかみつく']}});
Object.assign(ABD,{eslow:v=>`敵の足−${Math.round(v*100)}%`,wspd:v=>`移動の速さ+${Math.round(v*100)}%`,charge:v=>`大技のため時間−${Math.round(v*100)}%`,healUp:v=>`回復量+${Math.round(v*100)}%`,
 robeFast:v=>`衣が戻るまでの時間−${Math.round(v*100)}%`,thorn:v=>`トゲのダメージ+${Math.round(v*100)}%`,flat:v=>`1回のダメージを${v}へらす（小さなダメージは無効）`});
Object.assign(ABIL,{
 nero:    ab4(['eslow',.05],['pick',.1],['eslow',.08],['teamAtk',.08]),
 okajun:  ab4(['hp',10],['teamAtk',.05],['cut',.05],['teamAtk',.1]),
 hayate:  ab4(['wspd',.05],['teamAtk',.05],['xp',.05],['teamAtk',.1]),
 kurogane:ab4(['regen',1],['hp',10],['cut',.05],['revive',.3]),
 lionex:  ab4(['teamAtk',.05],['teamAtk',.05],['charge',.1],['teamAtk',.12]),
 seraph:  ab4(['regen',1],['hp',10],['healUp',.2],['revive',.5]),
 hakurou: ab4(['cut',.05],['hp',15],['cut',.08],['robeFast',.2]),
 guardian:ab4(['cut',.05],['hp',15],['thorn',.3],['cut',.1]),
 libra:   ab4(['xp',.05],['teamAtk',.05],['xp',.1],['teamAtk',.1]),
 spino:   ab4(['hp',10],['cut',.05],['teamAtk',.08],['flat',4])});
/* 回復量アップは、10秒ごとの回復にも効く */
{const _ab=teamAb;teamAb=function(){const a=_ab();if(a.healUp&&a.regen)a.regen*=1+a.healUp;return a}}

/* ---------- 専用武器（見習い → 段階2〜4）。図面は審判の塔で見つかる ---------- */
Object.assign(WNAME,{nero:'飴鎖',okajun:'拳帯',hayate:'拳甲',kurogane:'鈴',lionex:'雷の爪',seraph:'光の手袋',hakurou:'羽衣',guardian:'盾',libra:'サイコロ',spino:'爪'});
Object.assign(BASEW,{hayate:'若葉の拳甲',kurogane:'銀の鈴',lionex:'雷の爪',seraph:'光の手袋',hakurou:'白い羽衣',guardian:'うろこの盾',libra:'白黒のサイコロ',spino:'化石の爪'});
{const M2={titan:3,scrap:2},M3={cell:2,titan:2,core:1},M4={carbon:3,cell:2,core:2};
 const W=[ // [id, 名前2,3,4, 加工2,3,4, 図面のエリア2,3,4, 形]
  ['nero',   '砂糖鋼の鎖鎌','黒蜜の鎖鎌','誓約の鎖鎌',        ['weld'],['weld','cut'],['weld','hit'],   'jk','jm','js','yami'],
  ['okajun', '熱血の拳帯','工業魂の拳帯','不屈の拳「ガンテツ」',['cut'],['cut','weld'],['hit','weld'],   'jk','jm','js','ch'],
  ['hayate', '疾風の拳甲','迅雷の拳甲','一番風の拳甲',      ['hit'],['hit','drill'],['hit','lathe'],  'jk','jm','js','ma'],
  ['kurogane','黒鉄の鈴','九つの鈴','九命の大鈴',           ['lathe'],['lathe','drill'],['lathe','wire'],'jk','jm','js','me'],
  ['lionex', '雷鳴の爪','天雷の爪','獅子王の雷爪',          ['hit'],['hit','wire'],['hit','weld'],    'jk','jb','jr','de'],
  ['seraph', '祝福のリング','聖光の光輪','熾天の光輪',      ['lathe'],['lathe','wire'],['lathe','trace'],'jt','jb','jr','hikari'],
  ['hakurou','天衣','風神の天衣','神獣の天衣',              ['cut'],['cut','trace'],['cut','wire'],   'jt','jb','jr','hikari'],
  ['guardian','騎士の盾','七色のトゲ盾','竜騎士の大盾',     ['hit'],['hit','drill'],['hit','weld'],   'jt','jb','jr','ch'],
  ['libra',  '天秤のサイコロ','判決のサイコロ','運命の天秤',['drill'],['drill','tap'],['lathe','drill'],'jt','jm','js','ke'],
  ['spino',  '化石の双爪','古代竜の双爪','一億年の帆骨',    ['hit'],['hit','drill'],['hit','weld'],   'jt','jm','js','ch']];
 W.forEach(([id,n2,n3,n4,p2,p3,p4,a2,a3,a4,sh])=>{[[2,n2,p2,a2,M2],[3,n3,p3,a3,M3],[4,n4,p4,a4,M4]].forEach(([t,n,ps,area,mats])=>{const k='v2_'+id+t;
  RECIPES[k]={n,kind:'weapon',who:id,tier:t,mats:{...mats},area,shape:sh,proc:ps[0],procs:ps.length>1?ps:undefined,tools:[...new Set(ps.flatMap(p=>PROC_MAIN[p]))]};if(!RECIPES[k].procs)delete RECIPES[k].procs;RECIPE_ORDER.push(k)})});
 /* 汎用武器（だれでも使える。技の動きは vol2 の仲間と同じ） */
 const GW2=[['g_candy','甘い罠の飴玉','nero',3,'jk',['cut']],['g_power','鋼の拳帯','okajun',3,'jk',['hit']],['g_speed','疾風の手甲','hayate',3,'jt',['hit']],
  ['g_pet','呼び鈴のお守り','kurogane',3,'jt',['lathe']],['g_roar','雷獅子の牙','lionex',4,'jb',['hit','wire']],['g_halo','光輪のお守り','seraph',4,'jm',['lathe','wire']],
  ['g_veil','風の羽衣','hakurou',4,'jb',['cut','trace']],['g_thorn','トゲのバックラー','guardian',4,'js',['hit','drill']],['g_dice','白黒のサイコロ','libra',4,'js',['drill','tap']],['g_fossil','化石の牙のお守り','spino',4,'jr',['hit','weld']]];
 GW2.forEach(([k,n,impl,t,area,ps])=>{RECIPES[k]={n,kind:'gen',impl,tier:t,mats:t===3?{cell:2,titan:2,core:1}:{carbon:2,cell:2,core:1},area,shape:'ch',proc:ps[0],tools:[...new Set(ps.flatMap(p=>PROC_MAIN[p]))]};if(ps.length>1)RECIPES[k].procs=ps;GEN_IC[k]='wg_'+k.slice(2);RECIPE_ORDER.push(k)})}

/* ---------- ガチャ vol.2 ---------- */
const GACHA_POOL2=[...VOL2];
GACHA_BANNERS[1]=V2_OPEN?{id:'v2',vol:2,n:'審判のなかまガチャ',img:'img/gacha-v2.webp',pool:GACHA_POOL2}:{id:'v2',vol:2,n:'近日登場',soon:true};

/* ===================== 技の動き ===================== */
const V2FX=[];
function v2Dir(range){const t=nearestFoes(1,FD.x,FD.y,range)[0];if(t)return Math.atan2(t.y-FD.y,t.x-FD.x);return FD.mva!=null?FD.mva:Math.PI/2}
function v2Heal(v){const a=v*(1+(FD.ab.healUp||0));const b=FD.hp;FD.hp=Math.min(FD.maxhp,FD.hp+a);if(FD.hp>b+.5&&FD.pops.length<90)FD.pops.push({x:FD.x,y:FD.y-40,v:'+'+Math.round(FD.hp-b),t:0,heal:1})}
function v2Attacks(f){const D=FD,A=D.atk,c=D.cd,cm=fCd();D.v2=D.v2||{traps:[],pets:[],dice:[],robe:null,rage:0,charge:0,bites:[]};const V=D.v2;
 /* ネロ：キャンディの罠 */
 if(A.nero){c.nero=(c.nero||0)-f;if(c.nero<=0){const L=A.nero,n=L>=2?2:1,R=L>=5?50:34,dmg=3*(L>=3?1.4:1)*fPow('nero');
   for(let i=0;i<n;i++){const a=Math.random()*TAU,o=30+Math.random()*40;V.traps.push({x:D.x+Math.cos(a)*o,y:D.y+12+Math.sin(a)*o,r:R,t:0,life:300,dmg})}
   if(V.traps.length>12)V.traps.splice(0,V.traps.length-12);tone(990,.05,'sine',.03,1320);c.nero=(L>=4?55:80)*cm}}
 for(const p of V.traps){p.t+=f;const tick=Math.floor(p.t/20)!==Math.floor((p.t-f)/20);for(const e of D.foes){if((e.x-p.x)**2+(e.y-p.y)**2<(p.r+e.r*.6)**2){e.trap=6;if(tick)fDamage(e,p.dmg,0,0)}}}
 V.traps=V.traps.filter(p=>p.t<p.life);
 /* オカジュン：剛拳 */
 if(A.okajun){c.okajun=(c.okajun||0)-f;if(c.okajun<=0){const L=A.okajun,Rg=L>=2?150:120,boost=1+V.rage,dmg=30*(L>=3?1.35:1)*boost*fPow('okajun'),a=v2Dir(Rg+40);V.rage=0;
   V2FX.push({k:'punch',x:D.x,y:D.y-10,a,r:Rg,t:0,life:16,big:boost>1.3});tone(110,.12,'square',.07,60);D.shake=Math.max(D.shake,5);
   for(const e of D.foes){const dx=e.x-D.x,dy=e.y-D.y,d=Math.hypot(dx,dy);if(d>Rg+e.r)continue;let da=Math.atan2(dy,dx)-a;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<.72||d<e.r+20)fDamage(e,dmg,dx/(d||1)*16,dy/(d||1)*16)}
   if(L>=5)D.waves.push({x:D.x,y:D.y,r:20,max:140,dmg:dmg*.4,kb:12,hit:new Set()});
   c.okajun=(L>=4?80:110)*cm}}
 /* ハヤテ：疾風拳 */
 if(A.hayate){c.hayate=(c.hayate||0)-f;if(c.hayate<=0){const L=A.hayate,Rg=L>=5?150:110,dmg=5.5*(L>=3?1.4:1)*fPow('hayate');
   nearestFoes(L>=2?2:1,D.x,D.y,Rg).forEach(e=>{const a=Math.atan2(e.y-D.y,e.x-D.x);fDamage(e,dmg,Math.cos(a)*2,Math.sin(a)*2);V2FX.push({k:'jab',x:D.x,y:D.y-12,x2:e.x,y2:e.y,t:0,life:7})});
   c.hayate=(L>=4?7:10)*cm}}
 /* クロガネ：ニャボ隊 */
 if(A.kurogane){const L=A.kurogane,n=1+(L>=2)+(L>=4),sp=L>=5?5.5:4,dmg=7*(L>=3?1.4:1)*(L>=5?1.2:1)*fPow('kurogane');
   while(V.pets.length<n){const a=Math.random()*TAU;V.pets.push({x:D.x+Math.cos(a)*30,y:D.y+Math.sin(a)*30,a,hit:{},face:1})}
   V.pets.forEach((p,i)=>{for(const k in p.hit){p.hit[k]-=f;if(p.hit[k]<=0)delete p.hit[k]}
    const t=(D.x-p.x)**2+(D.y-p.y)**2<360*360?nearestFoes(1,p.x,p.y,260)[0]:null;let tx,ty;
    if(t){tx=t.x;ty=t.y}else{const a=D.t*2+i/n*TAU;tx=D.x+Math.cos(a)*46;ty=D.y+Math.sin(a)*46}
    const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1,v=Math.min(d,(t?sp:sp*1.2)*f);p.x+=dx/d*v;p.y+=dy/d*v;if(Math.abs(dx)>1)p.face=dx<0?-1:1;
    for(const e of D.foes){if(p.hit[e.id])continue;if((e.x-p.x)**2+(e.y-p.y)**2<(e.r+10)**2){fDamage(e,dmg,dx/d*4,dy/d*4);p.hit[e.id]=20}}})}
 else V.pets.length=0;
 /* ライオネクス：雷鳴の咆哮（ため） */
 if(A.lionex){const L=A.lionex,need=360*(L>=4?.8:1)*(1-Math.min(.5,D.ab.charge||0))*cm;V.charge+=f;V.need=need;
   if(V.charge>=need){const R=L>=2?140:110,dmg=110*(L>=3?1.35:1)*fPow('lionex'),pool=nearestFoes(40,D.x,D.y,420);
    if(pool.length){const score=e=>pool.reduce((s,o)=>s+((o.x-e.x)**2+(o.y-e.y)**2<R*R?1:0),0);const sorted=pool.map(e=>[e,score(e)]).sort((a,b)=>b[1]-a[1]);const ts=[sorted[0][0]];
     if(L>=5){const far=sorted.find(([e])=>(e.x-ts[0].x)**2+(e.y-ts[0].y)**2>(R*1.5)**2);if(far)ts.push(far[0])}
     ts.forEach(t=>{V2FX.push({k:'roar',x:t.x,y:t.y,r:R,t:0,life:24});for(const e of D.foes)if((e.x-t.x)**2+(e.y-t.y)**2<(R+e.r)**2)fDamage(e,dmg,0,0)});
     tone(70,.35,'sawtooth',.09,40);D.shake=Math.max(D.shake,10);V.charge=0}else V.charge=need}}
 else V.charge=0;
 /* セラフ：祝福の光輪（いつも出ている） */
 if(A.seraph){const L=A.seraph,R=L>=5?96:L>=2?80:64,dmg=4*(L>=3?1.4:1)*fPow('seraph');V.halo=R;V.haloT=(V.haloT||0)+f;
   if(V.haloT>=20){V.haloT=0;for(const e of D.foes)if((e.x-D.x)**2+(e.y-D.y)**2<(R+e.r*.5)**2){e.halo=1;fDamage(e,dmg,0,0)}}}
 else V.halo=0;
 /* ハクロウ：天衣の風（衣） */
 if(A.hakurou){const L=A.hakurou,cap=D.maxhp*.22*(L>=5?1.8:L>=2?1.4:1);if(!V.robe)V.robe={hp:cap,cool:0};V.robe.cap=cap;
   if(V.robe.hp<=0){V.robe.cool-=f;if(V.robe.cool<=0){V.robe.hp=cap;tone(660,.1,'sine',.04,990)}}}
 else V.robe=null;
 /* ガーディアン：七色のトゲ盾 */
 if(A.guardian){const L=A.guardian,R=L>=4?70:54,dmg=9*(L>=2?1.4:1)*(1+(D.ab.thorn||0))*fPow('guardian');c.guardian=(c.guardian||0)-f;
   if(c.guardian<=0){let any=0;for(const e of D.foes)if((e.x-D.x)**2+(e.y-D.y)**2<(R+e.r)**2){const d=Math.hypot(e.x-D.x,e.y-D.y)||1;fDamage(e,dmg,(e.x-D.x)/d*6,(e.y-D.y)/d*6);any=1}
    if(any)V2FX.push({k:'thorn',x:D.x,y:D.y,r:R,t:0,life:12});c.guardian=45*cm}
   if(D.ebul){const p=L>=3?.7:.4,rd=20*(L>=5?2:1)*(1+(D.ab.thorn||0))*fPow('guardian');for(const b of D.ebul){if(b.rf||b.life<=0)continue;if((b.x-D.x)**2+(b.y-D.y)**2<48*48){b.rf=1;if(Math.random()<p){b.life=0;
     V.dice.push({k:'rf',x:b.x,y:b.y,vx:-b.vx*2.2,vy:-b.vy*2.2,life:70,dmg:rd,pierce:2,hit:[]});V2FX.push({k:'shield',x:D.x,y:D.y,a:Math.atan2(b.y-D.y,b.x-D.x),t:0,life:10})}}}}}
 /* リブラ：白黒の天秤 */
 if(A.libra){c.libra=(c.libra||0)-f;if(c.libra<=0){const L=A.libra,dm=L>=2?1.3:1,t=nearestFoes(1,D.x,D.y,400)[0];
   if(t){const a=Math.atan2(t.y-D.y,t.x-D.x);V.side=!V.side;const kinds=L>=5?['w','b']:[V.side?'w':'b'];
    kinds.forEach((k,i)=>{const aa=a+(kinds.length>1?(i?.12:-.12):0),s=k==='w'?6:9;V.dice.push({k,x:D.x,y:D.y-14,vx:Math.cos(aa)*s,vy:Math.sin(aa)*s,life:70,rot:0,
     dmg:(k==='w'?9:18)*dm*fPow('libra'),R:L>=3?76:56,pierce:k==='w'?1:4,hit:[]})});tone(V.side?880:440,.06,'triangle',.04)}
   c.libra=(L>=4?30:40)*cm}}
 /* スピノボーン：化石の牙 */
 if(A.spino){c.spino=(c.spino||0)-f;if(c.spino<=0){const L=A.spino,cand=nearestFoes(30,D.x,D.y,300),t=cand.find(e=>e.boss)||cand.find(e=>e.big)||cand[0];
   if(t){const b={x:t.x,y:t.y,r:L>=3?84:64,dmg:36*(L>=2?1.35:1)*fPow('spino'),t:0};V.bites.push(b);if(L>=5)V.bites.push({...b,t:-20})}
   c.spino=(L>=4?110:150)*cm}}
 for(const b of V.bites){b.t+=f;if(!b.done&&b.t>=10){b.done=1;V2FX.push({k:'bite',x:b.x,y:b.y,r:b.r,t:0,life:18});tone(90,.15,'square',.07,50);
   for(const e of D.foes)if((e.x-b.x)**2+(e.y-b.y)**2<(b.r+e.r)**2)fDamage(e,b.dmg*(e.big||e.boss?2:1),(e.x-b.x)*.05,(e.y-b.y)*.05)}}
 V.bites=V.bites.filter(b=>!b.done||b.t<12);
 /* 飛ぶもの（サイコロ・跳ね返した弾） */
 for(const s of V.dice){s.x+=s.vx*f;s.y+=s.vy*f;s.life-=f;s.rot=(s.rot||0)+.3*f;
  for(const e of D.foes){if(e.hp<=0||s.hit.includes(e.id))continue;if((e.x-s.x)**2+(e.y-s.y)**2<(e.r+9)**2){
   if(s.k==='w'){V2FX.push({k:'burst',x:s.x,y:s.y,r:s.R,t:0,life:14});for(const o of D.foes)if((o.x-s.x)**2+(o.y-s.y)**2<(s.R+o.r)**2)fDamage(o,s.dmg,0,0);s.life=0;break}
   fDamage(e,s.dmg,s.vx*.6,s.vy*.6);s.hit.push(e.id);if(s.hit.length>=s.pierce){s.life=0;break}}}}
 V.dice=V.dice.filter(s=>s.life>0)}

/* 敵の足：罠の中はほとんど止まる。ネロの能力で全体が少し遅くなる */
function v2Slow(){const D=FD,sl=1-Math.min(.4,D.ab.eslow||0);for(const e of D.foes){if(e.spd0==null)e.spd0=e.spd;let m=sl;if(e.trap>0){m*=e.boss?.6:.2;e.trap--}e.spd=e.spd0*m}}

{const _fa=fAttacks;fAttacks=function(f){_fa(f);v2Attacks(f)}}
{const _u=fUpdate;fUpdate=function(f){const D=FD;if(D&&D.run&&!D.paused&&!D.climbing){const x0=D.x,y0=D.y;v2Slow();_u(f);if(FD===D&&(D.x!==x0||D.y!==y0))D.mva=Math.atan2(D.y-y0,D.x-x0);
  for(const p of V2FX)p.t+=f;for(let i=V2FX.length-1;i>=0;i--)if(V2FX[i].t>=V2FX[i].life)V2FX.splice(i,1)}else _u(f)}}
/* 階が変わったら、罠などを片づける */
{const _s=startFloor;startFloor=function(fl){V2FX.length=0;return _s(fl)}}
/* 光輪の中で倒すと回復 */
{const _k=fKill;fKill=function(e){_k(e);const V=FD&&FD.v2;if(V&&V.halo&&(e.x-FD.x)**2+(e.y-FD.y)**2<(V.halo+e.r)**2){const t=FD.t;if(t-(V.lastHeal||0)>.1){V.lastHeal=t;v2Heal(FD.atk.seraph>=4?2:1)}}}}

/* ---------- 受けるダメージ：トゲ → 化石の体 → 天衣 → 剛拳のため ---------- */
fHurt=function(v,src){const D=FD;if(!D)return v;const A=D.atk,V=D.v2||{};
 if(src&&A.guardian&&src.hp>0){const L=A.guardian;fDamage(src,18*(L>=2?1.4:1)*(1+(D.ab.thorn||0))*fPow('guardian'),(src.x-D.x)*.1,(src.y-D.y)*.1)}
 if(D.ab.flat)v=Math.max(0,v-D.ab.flat);
 if(V.robe&&V.robe.hp>0&&v>0){const a=Math.min(V.robe.hp,v);V.robe.hp-=a;v-=a;
  if(V.robe.hp<=0){const L=A.hakurou||1,R=L>=5?200:150,dmg=30*(L>=3?1.5:1)*fPow('hakurou');V.robe.cool=480*(L>=4?.7:1)*(1-Math.min(.5,D.ab.robeFast||0));
   V2FX.push({k:'gust',x:D.x,y:D.y,r:R,t:0,life:20});tone(300,.25,'sine',.06,900);
   for(const e of D.foes){const d=Math.hypot(e.x-D.x,e.y-D.y);if(d<R+e.r)fDamage(e,dmg,(e.x-D.x)/(d||1)*22,(e.y-D.y)/(d||1)*22)}}}
 if(v>0&&A.okajun)V.rage=Math.min(1.2,(V.rage||0)+.4);
 if(v<=0&&FD.pops.length<90)FD.pops.push({x:D.x,y:D.y-40,v:'0',t:0,heal:1});
 return v};

/* ===================== 描く ===================== */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.v2;if(!V)return;const t=D.t;g.save();
 /* 罠の飴 */
 for(const p of V.traps){const k=1-Math.max(0,(p.t-p.life+40)/40);g.globalAlpha=.13*k;g.fillStyle='#ff7ab8';g.beginPath();g.arc(p.x,p.y,p.r,0,TAU);g.fill();g.globalAlpha=k;
  g.fillStyle='#ff4f9a';g.beginPath();g.arc(p.x,p.y,9,0,TAU);g.fill();g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.arc(p.x,p.y,5,t*4,t*4+4);g.stroke();g.strokeStyle='#e8e0ff';g.lineWidth=2;g.beginPath();g.moveTo(p.x+7,p.y+5);g.lineTo(p.x+15,p.y+14);g.stroke()}
 g.globalAlpha=1;
 /* 光輪 */
 if(V.halo){g.strokeStyle='#ffe58a';g.lineWidth=3;g.globalAlpha=.55+.15*Math.sin(t*5);g.beginPath();g.arc(D.x,D.y-4,V.halo,0,TAU);g.stroke();g.globalAlpha=.12;g.fillStyle='#fff6c8';g.fill();g.globalAlpha=.9;g.fillStyle='#fff3b0';
  for(let i=0;i<6;i++){const a=t*1.6+i/6*TAU;g.beginPath();g.arc(D.x+Math.cos(a)*V.halo,D.y-4+Math.sin(a)*V.halo,3.5,0,TAU);g.fill()}g.globalAlpha=1}
 /* 天衣 */
 if(V.robe&&V.robe.hp>0){const k=V.robe.hp/V.robe.cap;g.strokeStyle='#e9f6ff';g.lineWidth=2+2*k;for(let i=0;i<3;i++){g.globalAlpha=(.25+.35*k)*(1-i*.25);const a=t*3+i*2.1;g.beginPath();g.arc(D.x,D.y-12,30+i*5,a,a+2.2);g.stroke()}g.globalAlpha=1}
 /* ため（ライオネクス） */
 if(V.need&&D.atk.lionex){const k=Math.min(1,V.charge/V.need);g.strokeStyle=k>.85?'#fff27a':'#7fc4ff';g.lineWidth=3;g.globalAlpha=.7;g.beginPath();g.arc(D.x,D.y+20,22,-Math.PI/2,-Math.PI/2+k*TAU);g.stroke();g.globalAlpha=1}
 /* ニャボ */
 const ps=fspr('img/walk/kurogane_down.webp',30);for(const p of V.pets){g.fillStyle='#0005';g.beginPath();g.ellipse(p.x,p.y+11,9,3,0,0,TAU);g.fill();
  if(ps){const h=26,w=h*ps.width/ps.height;g.save();g.translate(p.x,p.y);g.scale(p.face,1);g.drawImage(ps,-w/2,-h/2-2+Math.sin(t*14+p.a)*1.5,w,h);g.restore()}else{g.fillStyle='#2a2a33';g.beginPath();g.arc(p.x,p.y,9,0,TAU);g.fill()}}
 /* 飛ぶもの */
 for(const s of V.dice){g.save();g.translate(s.x,s.y);g.rotate(s.rot||0);if(s.k==='rf'){g.fillStyle='#9fe0ff';g.beginPath();g.arc(0,0,6,0,TAU);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke()}
  else{g.fillStyle=s.k==='w'?'#f4f1e8':'#1d1b24';g.strokeStyle=s.k==='w'?'#2a2633':'#d9c27a';g.lineWidth=2;g.fillRect(-8,-8,16,16);g.strokeRect(-8,-8,16,16);g.fillStyle=s.k==='w'?'#2a2633':'#e8d48a';
   [[-4,-4],[4,4],[0,0]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,1.8,0,TAU);g.fill()})}g.restore()}
 /* 一瞬の効果 */
 for(const p of V2FX){const k=p.t/p.life;
  if(p.k==='punch'){g.globalAlpha=.6*(1-k);g.fillStyle=p.big?'#ff6a2a':'#ffb24a';g.beginPath();g.moveTo(p.x,p.y);g.arc(p.x,p.y,p.r*(.6+.4*k),p.a-.72,p.a+.72);g.closePath();g.fill();
   g.globalAlpha=1-k;g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,p.r*(.6+.4*k),p.a-.6,p.a+.6);g.stroke()}
  else if(p.k==='jab'){g.globalAlpha=1-k;g.strokeStyle='#d8f4ff';g.lineWidth=3;const mx=p.x+(p.x2-p.x)*.85,my=p.y+(p.y2-p.y)*.85;g.beginPath();g.moveTo(p.x+(p.x2-p.x)*.35,p.y+(p.y2-p.y)*.35);g.lineTo(mx,my);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(mx,my,5*(1-k)+2,0,TAU);g.fill()}
  else if(p.k==='roar'){g.globalAlpha=(1-k)*.5;g.fillStyle='#fff27a';g.beginPath();g.arc(p.x,p.y,p.r,0,TAU);g.fill();g.globalAlpha=1-k;g.strokeStyle='#ffffff';g.lineWidth=6*(1-k)+2;g.beginPath();
   let x=p.x+(Math.random()*20-10),y=p.y-420;g.moveTo(x,y);for(let i=1;i<=8;i++){x=p.x+(i<8?Math.random()*50-25:0);y=p.y-420+i*52.5;g.lineTo(x,y)}g.stroke();g.strokeStyle='#7fc4ff';g.lineWidth=2;g.stroke()}
  else if(p.k==='thorn'){g.globalAlpha=1-k;g.fillStyle='#ff9ad5';for(let i=0;i<12;i++){const a=i/12*TAU+(i%2)*.1,r1=p.r*.55,r2=p.r*(.85+.25*k);g.beginPath();g.moveTo(p.x+Math.cos(a-.12)*r1,p.y+Math.sin(a-.12)*r1);g.lineTo(p.x+Math.cos(a)*r2,p.y+Math.sin(a)*r2);g.lineTo(p.x+Math.cos(a+.12)*r1,p.y+Math.sin(a+.12)*r1);g.fill()}}
  else if(p.k==='shield'){g.globalAlpha=1-k;g.strokeStyle='#7fe0ff';g.lineWidth=5;g.beginPath();g.arc(p.x,p.y-10,40,p.a-.6,p.a+.6);g.stroke()}
  else if(p.k==='burst'){g.globalAlpha=(1-k)*.6;g.fillStyle='#fffaf0';g.beginPath();g.arc(p.x,p.y,p.r*(.5+.5*k),0,TAU);g.fill();g.globalAlpha=1-k;g.strokeStyle='#2a2633';g.lineWidth=2;g.stroke()}
  else if(p.k==='gust'){g.globalAlpha=(1-k)*.7;g.strokeStyle='#e9f6ff';g.lineWidth=4;for(let i=0;i<3;i++){g.beginPath();g.arc(p.x,p.y-10,p.r*(.3+.7*k)-i*14,i,i+4.5);g.stroke()}}
  else if(p.k==='bite'){const o=p.r*(1-Math.min(1,k*2.2));g.globalAlpha=1-Math.max(0,k-.5)*2;g.fillStyle='#efe0c0';g.strokeStyle='#4a3a2a';g.lineWidth=2.5;
   [-1,1].forEach(sg=>{g.beginPath();g.ellipse(p.x,p.y+sg*(o*.6+6),p.r,p.r*.28,0,sg<0?Math.PI:0,sg<0?TAU:Math.PI);g.fill();g.stroke();g.fillStyle='#fffaf0';
    for(let i=-3;i<=3;i++){const x=p.x+i*p.r*.26,y=p.y+sg*(o*.6+6);g.beginPath();g.moveTo(x-5,y);g.lineTo(x,y-sg*13);g.lineTo(x+5,y);g.fill()}g.fillStyle='#efe0c0'})}}
 g.restore()}}
