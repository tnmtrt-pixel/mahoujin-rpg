/* ===================== 第2章「審判の塔」（1〜20F）：別の塔 =====================
 * 塔を切りかえるとき、階ごとの表（FLOORS・素材・ボスの体力・推奨攻撃・お助け・ひとこと・出撃Lv）と
 * G.floor（到達階）をその塔のものに入れかえる。ホームにもどるとマイスターの塔にもどす。
 * セーブ中に審判の塔のままでも、読みこみ時（fixV2）にマイスターの塔へもどす。
 * 2026-11-17 0:00 に公開（J_OPEN_AT）。それまでは URL に ?judge をつけたときだけ出撃できる */
const J_TEST=/[?&]judge\b/.test(location.search);
/* 第2章の公開：2026-11-17（火）0:00（日本時間）。それまでは ?judge のテスト版だけ */
const J_OPEN_AT=Date.UTC(2026,10,16,15,0,0),J_LIVE=J_TEST||Date.now()>=J_OPEN_AT;
const JFLOORS=[null,
 {n:'開廷の間',area:'jk',step:0,stair:1500},
 {n:'白の証言台',area:'jk',step:1,stair:1600,rule:'wb'},
 {n:'黒の証言台',area:'jk',step:2,boss:true,rule:'wb'},
 {n:'天秤の間',area:'jt',step:0,stair:1550},
 {n:'鏡の法廷',area:'jt',step:1,stair:1650,rule:'mirror'},
 {n:'証拠保管庫',area:'jt',step:2,boss:true},
 {n:'黙秘の間',area:'jm',step:0,stair:1600},
 {n:'表裏の間',area:'jm',step:1,stair:1700,rule:'wb'},
 {n:'木槌の間',area:'jm',step:2,stair:1750},
 {n:'判決の止まり木',area:'jm',step:3,boss:true},
 {n:'陪審員席',area:'jb',step:0,stair:1650},
 {n:'弁論の間',area:'jb',step:1,stair:1750},
 {n:'鏡の回廊',area:'jb',step:2,boss:true,rule:'mirror'},
 {n:'六法の書庫',area:'js',step:0,stair:1700},
 {n:'封印の間',area:'js',step:1,stair:1800},
 {n:'判例の間',area:'js',step:2,boss:true},
 {n:'双子の証人',area:'jr',step:0,stair:1750},
 {n:'雷鳴の大法廷',area:'jr',step:1,stair:1850,rule:'thunder'},
 {n:'最終弁論',area:'jr',step:2,boss:true},
 {n:'日蝕の玉座',area:'jg',step:3,boss:true}];
Object.assign(LAYER_NAME,{jk:'開廷の層',jt:'天秤の層',jm:'黙秘の層',jb:'陪審の層',js:'書庫の層',jr:'雷鳴の層',jg:'玉座'});
Object.assign(AREAS,{
 jk:{n:'開廷の層',need:null,lv:'',bossLv:0,tier:4,boss:'j_tenbin',bg:'#1e1a2a'},
 jt:{n:'天秤の層',need:null,lv:'',bossLv:0,tier:4,boss:'j_vault',bg:'#1c1a26'},
 jm:{n:'黙秘の層',need:null,lv:'',bossLv:0,tier:4,boss:'j_verdict',bg:'#18142a'},
 jb:{n:'陪審の層',need:null,lv:'',bossLv:0,tier:4,boss:'j_masq',bg:'#201628'},
 js:{n:'書庫の層',need:null,lv:'',bossLv:0,tier:4,boss:'j_roppo',bg:'#1a1622'},
 jr:{n:'雷鳴の層',need:null,lv:'',bossLv:0,tier:4,boss:'j_gaveldon',bg:'#14122a'},
 jg:{n:'玉座',    need:null,lv:'',bossLv:0,tier:4,boss:'j_eclipse',bg:'#100c1c'}});
/* 敵：白黒の魔物（ゆがんだ正しさ）。強さは第1章の頂上より上から始まる */
Object.assign(FFOE,{
 j_wwing: {hp:34, spd:1.9,dmg:13,xp:4,r:16,fly:1,dash:210},
 j_bwing: {hp:34, spd:1.9,dmg:13,xp:4,r:16,fly:1,dash:190},
 j_paper: {hp:30, spd:1.0,dmg:12,xp:3,r:17,fly:1,split:1},
 j_gavel: {hp:60, spd:.9, dmg:16,xp:5,r:21,dash:240},
 j_book:  {hp:46, spd:.9, dmg:14,xp:5,r:19,fly:1,shoot:210},
 j_mirror:{hp:44, spd:1.4,dmg:14,xp:5,r:18,fly:1,shoot:250},
 j_chain: {hp:80, spd:.7, dmg:15,xp:6,r:22},
 j_cloud: {hp:40, spd:1.0,dmg:13,xp:5,r:20,fly:1,shoot:190},
 j_stamp: {hp:56, spd:1.0,dmg:16,xp:5,r:20,dash:220},
 j_mask:  {hp:48, spd:1.2,dmg:14,xp:5,r:18,shoot:230},
 j_weight:{hp:110,spd:.6, dmg:18,xp:7,r:24,dash:280},
 j_scale: {hp:900, spd:.58,dmg:27,xp:34,r:36,big:1},
 j_hour:  {hp:1000,spd:.64,dmg:28,xp:36,r:36,big:1},
 j_tenbin:  {hp:4200,spd:.85,dmg:36,xp:150,r:56,big:1,boss:1,ring:150},
 j_vault:   {hp:4500,spd:.8, dmg:38,xp:160,r:56,big:1,boss:1,ring:140,call:480},
 j_verdict: {hp:5000,spd:1.0,dmg:40,xp:180,r:54,big:1,boss:1,fly:1,ring:125},
 j_masq:    {hp:5400,spd:.9, dmg:42,xp:190,r:58,big:1,boss:1,fly:1,ring:120,call:440},
 j_roppo:   {hp:5800,spd:.85,dmg:44,xp:200,r:58,big:1,boss:1,fly:1,ring:110},
 j_gaveldon:{hp:6300,spd:.9, dmg:46,xp:220,r:60,big:1,boss:1,ring:100},
 j_eclipse: {hp:7200,spd:1.0,dmg:48,xp:260,r:62,big:1,boss:1,ring:95,call:400}});
Object.assign(FOES,{
 j_wwing:{n:'白羽',col:'#f0eef8'},j_bwing:{n:'黒羽',col:'#6a4a8a'},j_paper:{n:'証言の紙',col:'#e8dcc0'},j_gavel:{n:'木槌ハンマー',col:'#b070e0'},
 j_book:{n:'六法の書',col:'#a060d0'},j_mirror:{n:'鏡の影',col:'#9a50d0'},j_chain:{n:'封印の鎖',col:'#c0a0e0'},j_cloud:{n:'雷雲の陪審員',col:'#d0c0f0'},
 j_stamp:{n:'判子ゴースト',col:'#c070f0'},j_mask:{n:'仮面の傍聴人',col:'#e0d0f0'},j_weight:{n:'秤の分銅',col:'#8a6ab0'},
 j_scale:{n:'天秤ゴーレム',col:'#d8c070'},j_hour:{n:'砂時計の番兵',col:'#c890f0'},
 j_tenbin:{n:'テンビンガ',col:'#d8c070'},j_vault:{n:'クラガード',col:'#8a6ab0'},j_verdict:{n:'ヴェルディクト',col:'#6b4a9e'},
 j_masq:{n:'マスカード',col:'#c0a0e0'},j_roppo:{n:'ロッポーン',col:'#a060d0'},j_gaveldon:{n:'ガベルドン',col:'#b070e0'},j_eclipse:{n:'エクリプス',col:'#e0c060'}});
FOE_IMG_OK.push('j_wwing','j_bwing','j_paper','j_gavel','j_book','j_mirror','j_chain','j_cloud','j_stamp','j_mask','j_weight','j_scale','j_hour','j_tenbin','j_vault','j_verdict','j_masq','j_roppo','j_gaveldon','j_eclipse');
const JD={scrap:.02,titan:.008,cell:.008,carbon:.008,core:.006};
Object.assign(FAREA,{
 jk:{mix:[[0,['j_wwing','j_bwing'],1.5],[25,['j_wwing','j_bwing','j_paper'],2.2],[70,['j_paper','j_gavel','j_wwing'],3],[130,['j_gavel','j_bwing','j_paper'],3.7],[200,['j_wwing','j_bwing','j_gavel'],4.6]],elite:'j_scale',boss:'j_tenbin',drop:JD,chestTool:null,ground:['#1e1a2a','200,190,230']},
 jt:{mix:[[0,['j_weight','j_wwing'],1.4],[25,['j_weight','j_mirror'],2.1],[70,['j_mirror','j_weight','j_bwing'],2.9],[130,['j_weight','j_mirror','j_paper'],3.6],[200,['j_mirror','j_weight','j_gavel'],4.5]],elite:'j_scale',boss:'j_vault',drop:JD,chestTool:null,ground:['#1c1a26','190,170,230']},
 jm:{mix:[[0,['j_chain','j_paper'],1.4],[25,['j_chain','j_stamp'],2.1],[70,['j_stamp','j_chain','j_gavel'],2.9],[130,['j_gavel','j_stamp','j_chain'],3.6],[200,['j_stamp','j_chain','j_bwing'],4.5]],elite:'j_hour',boss:'j_verdict',drop:JD,chestTool:null,ground:['#18142a','150,110,220']},
 jb:{mix:[[0,['j_mask','j_wwing'],1.5],[25,['j_mask','j_mirror'],2.2],[70,['j_mirror','j_mask','j_weight'],3],[130,['j_weight','j_mask','j_mirror'],3.7],[200,['j_mask','j_mirror','j_stamp'],4.6]],elite:'j_hour',boss:'j_masq',drop:JD,chestTool:null,ground:['#201628','190,120,220']},
 js:{mix:[[0,['j_book','j_paper'],1.5],[25,['j_book','j_chain'],2.2],[70,['j_book','j_chain','j_paper'],3],[130,['j_chain','j_book','j_stamp'],3.7],[200,['j_book','j_chain','j_mask'],4.6]],elite:'j_scale',boss:'j_roppo',drop:JD,chestTool:null,ground:['#1a1622','200,170,120']},
 jr:{mix:[[0,['j_cloud','j_bwing'],1.5],[25,['j_cloud','j_gavel'],2.2],[70,['j_cloud','j_gavel','j_weight'],3],[130,['j_gavel','j_cloud','j_stamp'],3.8],[200,['j_cloud','j_gavel','j_mirror'],4.7]],elite:'j_hour',boss:'j_gaveldon',drop:JD,chestTool:null,ground:['#14122a','170,120,255']},
 jg:{mix:[[0,['j_wwing','j_bwing','j_mask'],1.7],[25,['j_mirror','j_cloud','j_book'],2.5],[70,['j_weight','j_gavel','j_mirror'],3.3],[130,['j_gavel','j_cloud','j_book'],4.1],[200,['j_wwing','j_bwing','j_weight'],4.9]],elite:'j_hour',boss:'j_eclipse',drop:JD,chestTool:null,ground:['#100c1c','230,200,120']}});
Object.assign(FLOOR_IMG,{court:'img/floor/court.webp',library:'img/floor/library.webp',storm:'img/floor/storm.webp'});
Object.assign(FLOOR_TINT,{jk:['court','rgba(0,0,0,.05)'],jt:['court','rgba(120,90,200,.12)'],jm:['library','rgba(0,0,0,.05)'],jb:['court','rgba(170,90,210,.18)'],js:['library','rgba(60,30,90,.12)'],jr:['storm','rgba(0,0,0,.05)'],jg:['storm','rgba(20,10,40,.30)']});
/* 塔ごとの表 */
const TW_TABLE={
 judge:{
  FLOORS:JFLOORS,
  FLOOR_MATS:{1:['titan','scrap'],2:['cell','scrap'],3:['carbon','titan'],4:['titan','cell'],5:['cell','carbon'],6:['carbon','titan'],7:['titan','cell'],8:['cell','carbon'],9:['carbon','titan'],10:['titan','core'],11:['cell','carbon'],12:['carbon','titan'],13:['titan','cell'],14:['cell','carbon'],15:['carbon','titan'],16:['titan','cell'],17:['cell','carbon'],18:['carbon','titan'],19:['titan','cell'],20:['core','carbon']},
  BOSS_HP:{3:3.4,6:3.6,10:4,13:4.2,16:4.4,19:4.6,20:5},
  /* 推奨の強さ：敵の体力の上がり方に合わせる（1F≒2150、10F≒3500、20F≒5350）。強いパーティ（全力7000級）にも手ごたえが残るように */
  REC_POW:Object.fromEntries(Array.from({length:20},(_,i)=>{const h=FSCALE(18+(i+1)*1.5).hp/FSCALE(20).hp;return[i+1,Math.round(2200*h/50)*50]})),
  HELPER_FL:{},FLOOR_LINES:{},
  START_LV:{1:14,4:16,7:18,11:20,14:22,17:24},
  feff:f=>18+(f||1)*1.5}};  /* 2.0.0：上がり方を .8→1.5 に（20Fで第1章頂上の体力2.4倍・攻撃2.2倍） */
const TW_SAVED={};
function twTables(){return{FLOORS,FLOOR_MATS,BOSS_HP,REC_POW,HELPER_FL,FLOOR_LINES,START_LV}}
const towerAt=()=>G&&G.towerAt||'meister';
/* 敵の強さの基準になる階（審判の塔は第1章の頂上より上から） */
const fEff=f=>{const T=TW_TABLE[towerAt()];return T?T.feff(f):f};
function enterTower(k){if(!G)return;const cur=towerAt();if(cur===k)return;
 G.tw=G.tw||{};G.tw[cur]=G.tw[cur]||{};G.tw[cur].floor=G.floor|0;
 const tb=twTables();
 if(cur==='meister'){for(const n in tb)TW_SAVED[n]=Array.isArray(tb[n])?tb[n].slice():{...tb[n]}}
 const src=k==='meister'?TW_SAVED:TW_TABLE[k];
 for(const n in tb){const t=tb[n],s=src[n]||(Array.isArray(t)?[]:{});if(Array.isArray(t))t.splice(0,t.length,...s);else{for(const x in t)delete t[x];Object.assign(t,s)}}
 G.tw[k]=G.tw[k]||{};G.floor=G.tw[k].floor|0;G.towerAt=k}
/* ホームにもどったら、いつもマイスターの塔 */
{const _oh=openHome;openHome=function(){enterTower('meister');return _oh.apply(this,arguments)}}
TOWERS.judge.ready=J_LIVE;TOWERS.judge.go=()=>{enterTower('judge');openDest()};
if(J_TEST){const p=WMAP.places.find(q=>q.k==='judge');const o=p.open;p.open=()=>true}
{const _od=openDest;openDest=function(){const r=_od.apply(this,arguments);const t=$('destTw');if(t)t.textContent=(TOWERS[towerAt()]||TOWERS.meister).n;return r}}

/* ===================== 階のルール（3種類だけ） =====================
 * wb　　：白黒の床。白の上は攻撃+25%、黒の上は受けるダメージ+20%
 * mirror：鏡。敵の弾が画面のはしで1回だけ跳ね返る
 * thunder：雷鳴。3.5秒ごとに予告の円が出て、少しあとに雷が落ちる（自分にも敵にも当たる） */
const RULES={wb:{n:'白黒の床',d:'白の床では攻撃+25%、黒の床では受けるダメージ+20%'},mirror:{n:'鏡',d:'敵の弾が画面のはしで1回跳ね返る'},thunder:{n:'雷鳴',d:'予告の円に雷が落ちる。円から出よう（敵にも当たる）'}};
const WB_TILE=260;
const ruleOf=()=>FD&&FD.run&&FLOORS[FD.floor]&&FLOORS[FD.floor].rule;
const wbWhite=(x,y)=>((Math.floor(x/WB_TILE)+Math.floor(y/WB_TILE))&1)===0;
function ruleAtk(){return ruleOf()==='wb'&&wbWhite(FD.x,FD.y)?1.25:1}
function ruleCut(){return ruleOf()==='wb'&&!wbWhite(FD.x,FD.y)?1+.2*jRuleRes():1}
/* 階のルールで受けるダメージの倍率（黒の法衣で −30%） */
let jRuleRes=()=>1;
function fDrawRuleFloor(g,D,cx0,cy0,z){if(ruleOf()!=='wb')return;const T=WB_TILE,x0=Math.floor((cx0-20)/T),y0=Math.floor((cy0-20)/T),nx=Math.ceil((fW/z+40)/T)+1,ny=Math.ceil((fH/z+40)/T)+1;
 g.save();for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const X=x0+i,Y=y0+j,w=((X+Y)&1)===0;g.fillStyle=w?'rgba(255,250,235,.38)':'rgba(8,0,18,.58)';g.fillRect(X*T,Y*T,T,T)}
 g.strokeStyle='rgba(240,200,110,.7)';g.lineWidth=4;for(let i=0;i<=nx;i++){g.beginPath();g.moveTo((x0+i)*T,y0*T);g.lineTo((x0+i)*T,(y0+ny)*T);g.stroke()}for(let j=0;j<=ny;j++){g.beginPath();g.moveTo(x0*T,(y0+j)*T);g.lineTo((x0+nx)*T,(y0+j)*T);g.stroke()}g.restore()}
{const _s=startFloor;startFloor=function(fl){_s(fl);const r=FLOORS[fl]&&FLOORS[fl].rule;if(r&&FD){FD.thunder=[];FD.thT=0;setTimeout(()=>{if(FD&&FD.floor===fl)fBanner(`この階のルール「${RULES[r].n}」：${RULES[r].d}`,260,'n_floor')},1600)}}}
{const _a=fAdvance;fAdvance=async function(fl){const r=await _a.apply(this,arguments);const R=FLOORS[fl]&&FLOORS[fl].rule;if(R&&FD){FD.thunder=[];FD.thT=0;fBanner(`この階のルール「${RULES[R].n}」：${RULES[R].d}`,260,'n_floor')}return r}}
{const _u=fUpdate;fUpdate=function(f){_u(f);const D=FD;if(!D||!D.run||D.paused||D.climbing)return;const r=ruleOf();
 if(r==='mirror'&&D.ebul){const hw=fW/2/fZ,hh=fH/2/fZ;for(const b of D.ebul){if(b.mr)continue;const ox=b.x-D.x,oy=b.y-D.y;
   if(Math.abs(ox)>hw-6&&ox*b.vx>0){b.vx=-b.vx;b.mr=1;b.life=Math.max(b.life,120)}else if(Math.abs(oy)>hh-6&&oy*b.vy>0){b.vy=-b.vy;b.mr=1;b.life=Math.max(b.life,120)}}}
 if(r==='thunder'){D.thunder=D.thunder||[];D.thT=(D.thT||0)+f;
  if(D.thT>=210){D.thT=0;const pts=[[D.x+(Math.random()-.5)*60,D.y+(Math.random()-.5)*60]];for(let i=0;i<2;i++){const a=Math.random()*TAU,d=120+Math.random()*160;pts.push([D.x+Math.cos(a)*d,D.y+Math.sin(a)*d])}
   pts.forEach(([x,y])=>D.thunder.push({x,y,t:0,warn:80,r:70}));tone(300,.06,'triangle',.03)}
  for(const q of D.thunder){q.t+=f;if(!q.hit&&q.t>=q.warn){q.hit=1;D.shake=Math.max(D.shake||0,6);tone(70,.25,'sawtooth',.08,40);
    if(D.inv<=0&&(D.x-q.x)**2+(D.y-q.y)**2<q.r*q.r){D.hp-=fHurt(D.maxhp*.12*fCut()*jRuleRes(),null);D.inv=Math.max(D.inv,20);renderFHud()}
    for(const e of D.foes)if(!e.boss&&(e.x-q.x)**2+(e.y-q.y)**2<q.r*q.r)e.hp-=(e.max||60)*.35}}
  D.thunder=D.thunder.filter(q=>q.t<q.warn+18)}}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(!D.thunder||!D.thunder.length)return;
 for(const q of D.thunder){g.save();if(q.t<q.warn){const k=q.t/q.warn;g.globalAlpha=.25+.35*k;g.fillStyle='rgba(255,230,120,.45)';g.beginPath();g.arc(q.x,q.y,q.r*k,0,TAU);g.fill();g.strokeStyle='#ffe680';g.lineWidth=4;g.setLineDash([10,8]);g.beginPath();g.arc(q.x,q.y,q.r,0,TAU);g.stroke()}
  else{g.globalAlpha=1-(q.t-q.warn)/18;g.strokeStyle='#fff';g.lineWidth=6;g.beginPath();g.moveTo(q.x+20,q.y-600);g.lineTo(q.x-10,q.y-300);g.lineTo(q.x+15,q.y-150);g.lineTo(q.x,q.y);g.stroke();g.fillStyle='rgba(220,190,255,.6)';g.beginPath();g.arc(q.x,q.y,q.r,0,TAU);g.fill()}g.restore()}}}

/* 審判の塔の「長居の上限」＝判決の時（2.0.0）。削れ方は第1章の錆の大波と同じ。名前と演出だけ変える */
const J_BANNER={'錆の大波が近づいている…… あと1分でこの階は錆にのまれる':'判決の時が近づいている…… あと1分で判決が下る',
 '錆の大波！ この階はもう持たない':'判決の時！ 木槌が鳴りひびく'};
J_BANNER['錆が濃くなってきた…… 長居すると敵がどんどん強くなる']='法廷がざわめいてきた…… 長居すると敵がどんどん強くなる';
{const _b=fBanner;fBanner=function(t,...a){if(towerAt()==='judge'){if(J_BANNER[t]){t=J_BANNER[t];if(/判決の時！/.test(t))jGavel()}else t=String(t).replace(/錆Lv/g,'ざわめきLv')}return _b(t,...a)}}

function jGavel(){tone(150,.08,'square',.12,70);setTimeout(()=>tone(150,.08,'square',.12,70),160)}
/* 画面が白と黒に点滅し、2秒ごとに木槌の音 */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(!D.wave||D.boss||towerAt()!=='judge')return;
 const ph=Math.floor(D.t*1.5)%2;g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=.16+.08*Math.sin(D.t*6);g.fillStyle=ph?'#f4f0ff':'#0a0614';g.fillRect(0,0,g.canvas.width,g.canvas.height);g.restore();
 if(!D.paused){D.gvT=(D.gvT||0)+1;if(D.gvT>=120){D.gvT=0;jGavel()}}}}
