/* =====================================================================
   v0.2 サバイバー版（試作）
   町の外＝サバイバー形式。素材と図面を集め、工房で「素材＋工具＋図面」をそろえて武器・防具をつくる。
   調整しやすい数値は、このすぐ下のデータにまとめてある。
   ===================================================================== */

/* ---------- 素材・工具・図面 ---------- */
const MATS={
 scrap:{n:'鉄くず',d:'ほとんどの製品に使う基本の素材'},
 oil:  {n:'油',    d:'仕上げ・焼き入れに使う'},
 wire: {n:'銅線',  d:'電気の道具や防具の補強に使う'},
 gear: {n:'歯車',  d:'機械の部品。廃工場に多い'},
 core: {n:'錆の核',d:'ボスの階で出る。強敵やボスも落とす。上の段階の製品に必要'},
 bolt: {n:'ボルト',d:'部品どうしを締める。下層に多い'},
 rubber:{n:'ゴム', d:'衝撃をやわらげる。防具に使う'},
 plate:{n:'鋼板',  d:'硬い板。中層から出る'},
 spring:{n:'ばね', d:'はね返す力。速い武器や靴に使う'},
 brass:{n:'真鍮',  d:'さびにくい金色の金属。上層に多い'},
 board:{n:'基板',  d:'電子の部品。光る武器・電気の装備に使う'}};
const MAT_ORDER=['scrap','oil','bolt','rubber','plate','gear','wire','spring','brass','board','core'];
/* 階ごとに出る素材（2種類。ボスの階は錆の核も出る） */
const FLOOR_MATS={1:['scrap','oil'],2:['scrap','bolt'],3:['bolt','rubber'],4:['plate','oil'],5:['gear','wire'],6:['gear','spring'],7:['wire','brass'],8:['spring','board'],9:['brass','board'],10:['plate','board']};
const matIcons=(f,s=16)=>floorMats(f).map(k=>MIC(k,s)).join('');
const floorMats=f=>[...(FLOOR_MATS[f]||['scrap']),...(FLOORS[f]&&FLOORS[f].boss?['core']:[])];
/* 工具：price＝工房で買うときのコイン（0＝最初から持っている）。where＝塔の中で見つかる場所（見つければ無料） */
const TOOLS={
 file:  {n:'やすり',     d:'金属の角やバリを取る。基本の工具',price:0},
 snips: {n:'金切りばさみ',d:'薄い鉄板や銅線を切る',price:90},
 anvil: {n:'金床',       d:'熱した鉄を打つ台',price:150},
 pliers:{n:'電工ペンチ', d:'銅線を切る・曲げる・はさむ',price:480,where:'塔の上層（7〜10階）の資材の箱'},
 welder:{n:'溶接機',     d:'鉄と鉄をつなぐ',price:800,where:'塔の中層（4〜6階）の資材の箱'},
 caliper:{n:'ノギス',    d:'長さを正確に測る',price:60},
 vise:  {n:'万力',       d:'材料をしっかり固定する',price:90},
 grinder:{n:'グラインダー',d:'回る砥石で削って形を整える',price:120},
 tap:   {n:'タップハンドル',d:'穴にねじを切る',price:320,where:'塔の上層（7〜10階）の資材の箱'},
 solder:{n:'はんだごて', d:'電子部品をつなぐ',price:360,where:'塔の上層（7〜10階）の資材の箱'},
 drill: {n:'ボール盤',   d:'材料に穴をあける',price:480,where:'塔の中層（4〜6階）の資材の箱'},
 lathe: {n:'旋盤',       d:'材料を回して丸く削る',price:900,where:'塔の中層（4〜6階）の資材の箱'}};
const TOOL_ORDER=['file','caliper','snips','vise','grinder','anvil','tap','solder','pliers','drill','welder','lathe'];
/* 製品（レシピ）。kind:'weapon'（who のキャラの攻撃が強くなる）／'armor'（slot：head・body・feet。全員に効く）
   tier：1〜3（段階が上がるほど強い。なぞりと加工もむずかしくなる） shape：なぞる形 lathe：旋盤の加工もある
   area：図面が見つかるエリア（start:true は最初から持っている） */
const RECIPES={
 bite1:   {n:'鋼の牙刃',     kind:'weapon',who:'wolf',tier:1,mats:{scrap:4,oil:1},        tools:['file'],          shape:'ma',lathe:true,start:true},
 spanner1:{n:'歯車の輪刃',     kind:'weapon',who:'fox', tier:1,mats:{scrap:3,bolt:2}, tools:['file'],          shape:'me',area:'alley'},
 helm:    {n:'安全ヘルメット', kind:'armor',slot:'head',tier:1,mats:{scrap:4,rubber:1},        tools:['snips'],         shape:'ch',area:'alley'},
 apron:   {n:'耐火エプロン',   kind:'armor',slot:'body',tier:1,mats:{scrap:3,rubber:2},       tools:['snips'],         shape:'de',area:'alley'},
 bite2:   {n:'超硬の牙刃',     kind:'weapon',who:'wolf',tier:2,mats:{plate:3,oil:1,core:1},tools:['file','grinder'],  shape:'ma',lathe:true,area:'factory'},
 hammer1: {n:'鉄の籠手',   kind:'weapon',who:'dodo',tier:2,mats:{plate:4,gear:1},        tools:['anvil','vise'],         shape:'ch',area:'factory'},
 boots:   {n:'安全靴',         kind:'armor',slot:'feet',tier:1,mats:{scrap:3,bolt:1,rubber:1},       tools:['snips'],         shape:'ch',area:'alley'},
 spanner2:{n:'双歯車の輪刃',     kind:'weapon',who:'fox', tier:3,mats:{brass:3,spring:2,core:1},tools:['drill','welder'],shape:'me',area:'under'},
 hammer2: {n:'錆割りの籠手', kind:'weapon',who:'dodo',tier:3,mats:{plate:4,brass:2,core:2},       tools:['anvil','welder'],shape:'ch',area:'under'},
 pen1:    {n:'銅線の杖', kind:'weapon',who:'owl', tier:3,mats:{wire:4,brass:2,core:1},tools:['pliers','solder'],        shape:'hikari',area:'under'},
 /* ガチャで仲間になるキャラの武器（そのキャラが仲間にいるときだけ図面が見つかる） */
 shield1: {n:'歯車の盾',       kind:'weapon',who:'mouse',  tier:1,mats:{scrap:4,bolt:2},        tools:['file','caliper'],          area:'alley'},
 bow1:    {n:'星の弓',         kind:'weapon',who:'tsukiyo',tier:1,mats:{scrap:3,oil:1,bolt:1},        tools:['snips'],         area:'alley'},
 fuda1:   {n:'式神の札',       kind:'weapon',who:'onmyo',  tier:1,mats:{scrap:2,oil:2},  tools:['file'],          area:'alley'},
 rod1:    {n:'避雷針の槍',     kind:'weapon',who:'gorilla',tier:1,mats:{scrap:4,bolt:2},        tools:['snips'],         area:'factory'},
 laser1:  {n:'腕のレーザー砲', kind:'weapon',who:'robot',  tier:2,mats:{plate:2,wire:3},  tools:['solder'],area:'factory'},
 guitar1: {n:'鉄のギター',     kind:'weapon',who:'rocker', tier:2,mats:{plate:3,wire:2},        tools:['snips','anvil'], area:'factory'},
 shield2: {n:'救護の大盾',     kind:'weapon',who:'mouse',  tier:2,mats:{plate:3,gear:2},  tools:['anvil','vise'],         area:'factory'},
 fuda2:   {n:'鋼の式神札',     kind:'weapon',who:'onmyo',  tier:2,mats:{plate:2,spring:2,core:1},  tools:['grinder'],         area:'factory'},
 rod2:    {n:'落雷の槍',       kind:'weapon',who:'gorilla',tier:3,mats:{wire:4,board:2,core:1}, tools:['solder','welder'],area:'under'},
 laser2:  {n:'収束レーザー砲', kind:'weapon',who:'robot',  tier:3,mats:{board:3,brass:2,core:2},  tools:['solder','lathe'],        area:'under'},
 bow2:    {n:'流星の弓',       kind:'weapon',who:'tsukiyo',tier:3,mats:{spring:3,brass:2,core:1},  tools:['lathe','caliper'],area:'under'},
 /* 強い防具（中層は2段目、上層は3段目） */
 mask:    {n:'溶接の面',       kind:'armor',slot:'head',tier:2,mats:{plate:3,gear:1,oil:1},  tools:['anvil'],         shape:'de',area:'factory'},
 vest:    {n:'鉄板ベスト',     kind:'armor',slot:'body',tier:2,mats:{plate:4,wire:1}, tools:['snips','vise'], shape:'ch',area:'factory'},
 gboots:  {n:'歯車ブーツ',     kind:'armor',slot:'feet',tier:2,mats:{gear:3,spring:2},  tools:['tap'],         shape:'de',area:'factory'},
 chelm:   {n:'錆核のヘルメット',kind:'armor',slot:'head',tier:3,mats:{brass:3,board:1,core:2}, tools:['welder','drill'],        shape:'ch',area:'under'},
 coat:    {n:'銅線の耐火コート',kind:'armor',slot:'body',tier:3,mats:{wire:5,board:1,core:1}, tools:['pliers','tap'],shape:'de',area:'under'},
 jboots:  {n:'噴射安全靴',     kind:'armor',slot:'feet',tier:3,mats:{spring:3,board:2,core:2},   tools:['welder','tap'],        shape:'ch',area:'under'},
 guitar2: {n:'轟音のギター',   kind:'weapon',who:'rocker', tier:3,mats:{plate:3,board:2,core:2}, tools:['welder','drill'],        area:'under'}};
const RECIPE_ORDER=Object.keys(RECIPES);
const SLOT_NAME={head:'頭',body:'体',feet:'足'};
/* 製品の強さ：段階の倍率 × ランクの倍率 */
const TIER_MUL={1:1.35,2:1.75,3:2.2};
const RANK_MUL={D:.85,C:.92,B:1,A:1.08,S:1.16,SS:1.28};
const prodMul=(tier,rank)=>+(TIER_MUL[tier]*RANK_MUL[rank]).toFixed(2);
/* 防具の効き目（a＝製品の倍率） */
const ARMOR_FX={
 head:{d:a=>`最大体力 +${Math.round(30*a)}`},
 body:{d:a=>`受けるダメージ −${Math.round(Math.min(45,14*a))}%`},
 feet:{d:a=>`移動の速さ +${Math.round(8*a)}%`}};

/* ---------- キャラごとの攻撃（町の外で、仲間の攻撃だけが飛んでくる） ---------- */
const ATK={
 wolf:{n:'牙刃連射',  type:'連射',ic:'bite',   d:['近い敵へ牙刃を投げる','投げる数が増える','つらぬく','連射が速くなる','投げる数が増える']},
 fox: {n:'まわる輪刃',  type:'周回',ic:'spanner',d:['輪刃がまわりを回る','輪刃が増える','威力アップ','輪刃が増える','回る輪が広がる']},
 dodo:{n:'籠手の衝撃波',type:'範囲',ic:'hammer', d:['地面をなぐって、まわりをまとめて吹き飛ばす','範囲が広がる','間隔が短くなる','威力アップ','範囲が広がる']},
 owl: {n:'魔法陣の設置',type:'設置',ic:'pen',    d:['杖で敵の群れに魔法陣を描く','魔法陣が広がる','2つ置ける','威力アップ','3つ置ける']}};
const ATK_MAX=5;
/* 技のLvの上限：★1つごとに+1（★5でLv9、★10でLv14）。Lv6からは手数が増える（3.0.1） */
const atkMax=k=>{const m=typeof owned==='function'&&G&&owned(k);return ATK_MAX+Math.max(0,((m&&m.star)||1)-1)};
/* 強化カードのうち、キャラの攻撃以外のもの */
const PASSIVE={
 spd:{n:'作業靴のひも',d:'移動の速さ +10%',max:3},
 mag:{n:'磁石',       d:'素材や経験値を遠くから吸い寄せる',max:3},
 hp: {n:'安全帯',     d:'最大体力 +20、体力を回復',max:3},
 cd: {n:'冷却水',     d:'すべての攻撃の間隔 −8%',max:3}};

/* ---------- 町の外の敵とエリア ---------- */
const FFOE={
 slime:{hp:10, spd:.75,dmg:5, xp:1, r:18},
 dog:  {hp:16, spd:1.5,dmg:8, xp:2, r:18},
 crow: {hp:12, spd:1.35,dmg:6,xp:2, r:16,fly:1},
 golem:{hp:240,spd:.55,dmg:16,xp:18,r:34,big:1},
 bolt: {hp:22, spd:1.55,dmg:10,xp:2,r:16},
 lamp: {hp:20, spd:1.35,dmg:9,xp:2, r:16,fly:1},
 gear: {hp:40, spd:.85,dmg:12,xp:3, r:20},
 arm:  {hp:460,spd:.6, dmg:22,xp:24,r:36,big:1},
 pipe: {hp:36, spd:1.65,dmg:14,xp:3,r:18},
 ghost:{hp:32, spd:1.25,dmg:12,xp:3,r:18,fly:1},
 armor:{hp:90, spd:.7, dmg:18,xp:5, r:24},
 golem2:{hp:800,spd:.55,dmg:28,xp:30,r:38,big:1},
 boss: {hp:950,spd:.8,dmg:20,xp:60,r:50,big:1,boss:1},
 crane:{hp:2000,spd:.75,dmg:28,xp:90,r:56,big:1,boss:1},
 rostol:{hp:3600,spd:.85,dmg:34,xp:120,r:58,big:1,boss:1}};
/* mix：[秒, 出る敵, 1秒あたりの数]  drop：倒したとき素材を落とす確率  bps：見つかる図面  chestTool：資材の箱から出る工具 */
const FAREA={
 alley:  {mix:[[0,['slime'],1.1],[25,['slime','dog'],1.8],[70,['slime','dog','crow'],2.6],[130,['dog','crow','slime'],3.3],[200,['dog','crow','dog'],4.2]],
          elite:'golem',boss:'boss',drop:{scrap:.025,oil:.012,wire:.006,gear:.005},chestTool:null,ground:['#262a3a','150,70,30']},
 factory:{mix:[[0,['bolt'],1.3],[25,['bolt','lamp'],2],[70,['bolt','lamp','gear'],2.8],[130,['gear','bolt','lamp'],3.5],[200,['bolt','lamp','gear'],4.4]],
          elite:'arm',boss:'crane',drop:{scrap:.025,gear:.014,wire:.01,oil:.01},chestTool:'pliers',ground:['#2a2620','170,110,50']},
 under:  {mix:[[0,['pipe'],1.3],[25,['pipe','ghost'],2],[70,['pipe','ghost','armor'],2.8],[130,['armor','pipe','ghost'],3.5],[200,['ghost','pipe','armor'],4.4]],
          elite:'golem2',boss:'rostol',drop:{scrap:.025,gear:.014,wire:.014,core:.004},chestTool:'welder',ground:['#1c2428','90,140,150']}};
/* 時間（秒）：RUN＝ボスが出ないときに帰る時間、BOSS＝ボスが来る、JOIN＝仲間の気配、ELITE＝強敵、CHEST＝資材の箱、LIMIT＝ボス戦の終わり */
/* SEARCH：1つの階で階段をさがせる時間（秒）。ボスとの戦いの間は止まる */
/* 制限時間はなし。同じ階に RUST 秒より長くいると「錆が濃くなり」、敵がどんどん増える */
const FT={RUST:60,BOSS:30,JOIN:8,HINT:5,ELITE:[12,45],CHEST:[18,40]};
/* 階ごとに敵が強くなる（体力・攻撃）。ボスは階ごとの倍率 */
/* 11F〜（後編）は、上がり方を少しゆるくする（装備の4段目で追いつける強さ） */
const FSCALE=f=>{const n=(f||1)<=10?(f||1)-1:9+((f||1)-10)*.3;return{hp:1+.3*n+.06*n*n,dmg:1+.15*n+.02*n*n}};
const BOSS_HP={3:1.3,6:2.6,10:3.5};
/* 図面が出る確率：ボスは必ず1枚、強敵は BP_ELITE、資材の箱は BP_CHEST */
const BP_ELITE=.12,BP_CHEST=.08;
/* 工具が店に並ぶ階（その階に着いたら買える） */
/* 推奨戦力（チームの攻撃）。自動プレイで確かめた目安 */
const REC_POW={1:100,2:120,3:150,4:300,5:350,6:450,7:650,8:750,9:850,10:1100};
/* 中級工具：その層の資材の箱で必ず1回出る（CHEST_TOOLS）。店には、その層のボスを倒すと高い値段で並ぶ（TOOL_GATE＝突破した階） */
const TOOL_GATE={welder:6,lathe:6,drill:6,pliers:10,solder:10,tap:10};
const CHEST_TOOLS={factory:['welder','lathe','drill'],under:['pliers','solder','tap']};
const rustMul=()=>FD.st>FT.RUST?1+(FD.st-FT.RUST)/45:1;
/* 長居の錆：錆が出てから25秒ごとに錆Lvが上がり、新しく出る敵のHPと攻撃が強くなる（低い階での放置稼ぎを止める） */
const rustK=()=>Math.max(0,(FD.st-FT.RUST)/25),rustLv=()=>FD.st>=FT.RUST?Math.floor(rustK())+1:0;
/* 1つの階にいられるのは5分まで。錆が出てから経験値はだんだん減り、5分で0。5分をこえると「錆の大波」でHPがけずれ続ける */
const FLOOR_MAX=300,xpT=()=>!FD||FD.boss||FD.st<FT.RUST?1:Math.max(0,1-(FD.st-FT.RUST)/(FLOOR_MAX-FT.RUST));
const rustHp=k=>1+.6*k+.25*k*k,rustDm=k=>1+.5*k+.2*k*k;
const FCFG={HP:100,SPD:1.9,PICK:70,MAX_FOES:170};
const AREA_JOIN={alley:'fox',factory:'dodo',under:'owl'};
/* 塔の階（第1章＝1〜10階）。area：敵・地面・素材の種類（下層 alley／中層 factory／上層 under）
   step：その層の中で何段目か（敵が少しずつ強くなる）。boss・join・ev は、その階で起きること。stair：階段までの距離 */
const FLOORS=[null,
 {n:'錆びた路地の入口',area:'alley',step:0,stair:1100},
 {n:'消えた街灯の通り',area:'alley',step:1,stair:1200},
 {n:'廃材置き場',area:'alley',step:2,boss:true},
 {n:'搬入口',area:'factory',step:0,stair:1300},
 {n:'制御室',area:'factory',step:1,stair:1400},
 {n:'クレーン置き場',area:'factory',step:2,boss:true},
 {n:'図面の回廊',area:'under',step:0,stair:1500},
 {n:'錆の巣',area:'under',step:1,stair:1700},
 {n:'鏡の作業台',area:'under',step:2,stair:900,ev:'mirror'},
 {n:'錆の炉',area:'under',step:3,boss:true}];
const TOP_FLOOR=20;
const nextFloor=()=>Math.min(TOP_FLOOR,(G.floor|0)+1);
const LAYER_NAME={alley:'下層',factory:'中層',under:'上層'};
const bpArea=k=>RECIPE_ORDER.filter(id=>RECIPES[id].area===k);

/* ---------- アイコン（素材・工具・防具）。あとでイラストに差しかえる。ある物は img/icon を使う ---------- */
const SVG_IC={
 wire:'<circle cx="16" cy="16" r="11" fill="none" stroke="#e08a4a" stroke-width="3"/><circle cx="16" cy="16" r="6" fill="none" stroke="#f0a060" stroke-width="3"/><path d="M27 16h4" stroke="#f0a060" stroke-width="3"/>',
 gear:'<g fill="#b8a07a"><circle cx="16" cy="16" r="9"/>'+[0,1,2,3,4,5,6,7].map(i=>`<rect x="14" y="2" width="4" height="6" transform="rotate(${i*45} 16 16)"/>`).join('')+'</g><circle cx="16" cy="16" r="3.5" fill="#2a2a3a"/>',
 core:'<polygon points="16,3 27,12 23,28 9,28 5,12" fill="#b4462a" stroke="#ffb07a" stroke-width="1.5"/><circle cx="16" cy="16" r="4" fill="#ffd27f"/>',
 bp:'<rect x="5" y="4" width="22" height="24" rx="2" fill="#2f63b8" stroke="#bcd4ff"/><path d="M9 10h14M9 15h10M9 20h12" stroke="#bcd4ff" stroke-width="1.6"/><circle cx="22" cy="22" r="3" fill="none" stroke="#fff"/>',
 file:'<rect x="14" y="3" width="5" height="18" rx="1" fill="#a9b0c0"/><path d="M15 6h3M15 9h3M15 12h3M15 15h3M15 18h3" stroke="#555"/><rect x="13" y="21" width="7" height="9" rx="2" fill="#b4462a"/>',
 snips:'<path d="M10 4l9 14M22 4l-9 14" stroke="#c9d0dc" stroke-width="3" stroke-linecap="round"/><circle cx="11" cy="24" r="4" fill="none" stroke="#e05a4a" stroke-width="3"/><circle cx="21" cy="24" r="4" fill="none" stroke="#e05a4a" stroke-width="3"/>',
 anvil:'<path d="M4 9h18c4 0 6 2 6 4H22l-3 4h-6v5h4v4H7v-4h4v-5H8z" fill="#7a8494" stroke="#c9d0dc"/>',
 pliers:'<path d="M12 3l3 12M20 3l-3 12" stroke="#c9d0dc" stroke-width="4" stroke-linecap="round"/><path d="M15 15l-5 14M17 15l5 14" stroke="#e8c35a" stroke-width="4" stroke-linecap="round"/>',
 welder:'<rect x="4" y="12" width="16" height="14" rx="2" fill="#4a6ab0"/><circle cx="10" cy="19" r="3" fill="#ffd27f"/><path d="M20 16c6 0 6-8 9-10" stroke="#222" stroke-width="2.5" fill="none"/><path d="M27 4l3 3" stroke="#ffe" stroke-width="2"/>',
 head:'<path d="M5 20a11 11 0 0 1 22 0z" fill="#e8c35a" stroke="#fff3c0"/><rect x="3" y="20" width="26" height="4" rx="2" fill="#c89a2a"/>',
 body:'<path d="M10 4h12l2 6-3 2v16H11V12L8 10z" fill="#7a4a2a" stroke="#d09a6a"/><path d="M13 16h6" stroke="#d09a6a"/>',
 feet:'<path d="M6 8h9v10l11 3v6H6z" fill="#3a3a48" stroke="#9aa0b8"/><path d="M6 23h20" stroke="#e8c35a" stroke-width="2"/>'};
const UI_IC={scrap:'m_scrap',oil:'m_oil',wire:'m_wire',gear:'m_gear',core:'m_core',bp:'m_bp',
 file:'t_file',snips:'t_snips',anvil:'t_anvil',pliers:'t_pliers',welder:'t_welder',grinder:'t_grinder',
 caliper:'t_caliper',vise:'t_vise',tap:'t_tap',solder:'t_solder',drill:'t_drill',lathe:'t_lathe',
 bolt:'m_bolt',rubber:'m_rubber',plate:'m_plate',spring:'m_spring',brass:'m_brass',board:'m_board',
 hp:'p_hp',spd:'p_spd',mag:'p_mag',cd:'p_cd',head:'ar_helm',body:'ar_apron',feet:'ar_boots',coin:'coin',none:'ar_empty'};
const ARMOR_IC={helm:'ar_helm',apron:'ar_apron',boots:'ar_boots',mask:'ar_mask',vest:'ar_vest',gboots:'ar_gboots',chelm:'ar_chelm',coat:'ar_coat',jboots:'ar_jboots'};
const RKIC=(r,s=22)=>UIMG('r_'+r,s);
const UIMG=(n,s=22)=>`<img class="ic" src="img/ui/${n}.webp" alt="" style="width:${s}px;height:${s}px;vertical-align:middle">`;
/* 攻撃の種類のアイコン */
const TYPE_IC={'連射':'a_shot','周回':'a_orbit','範囲':'a_area','設置':'a_trap','連鎖':'a_chain','回復':'a_heal','貫通':'a_beam','降下':'a_fall','追尾':'a_seek','波動':'a_wave'};
const TIC=(t,s=22)=>TYPE_IC[t]?UIMG(TYPE_IC[t],s):'';
function MIC(k,s=22){if(UI_IC[k])return UIMG(UI_IC[k],s);if(SVG_IC[k])return `<svg class="ic" viewBox="0 0 32 32" style="width:${s}px;height:${s}px;vertical-align:middle">${SVG_IC[k]}</svg>`;return ''}
/* 武器：工具ではなく、工房で工具を使って作る製品。キャラごとに1つの絵。段階は縁の光で見分ける */
const WNAME={wolf:'牙刃',fox:'輪刃',dodo:'籠手',owl:'銅線の杖',gorilla:'避雷針の槍',mouse:'歯車の盾',robot:'腕のレーザー砲',tsukiyo:'星の弓',onmyo:'式神の札',rocker:'鉄のギター'};
const WPIC=(who,s=22,tier=0)=>`<img class="ic wt${tier}" src="img/ui/w_${who}.webp" alt="" style="width:${s}px;height:${s}px;vertical-align:middle">`;
const baseWeapon=who=>BASEW[who]||'見習いの'+(WNAME[who]||'武器');
const RIC=(id,s=22)=>{const R=RECIPES[id];return R.kind==='gen'?(GEN_IC[id]?UIMG(GEN_IC[id],s):TIC(ATK[R.impl].type,s)):R.kind==='armor'?UIMG(ARMOR_IC[id]||UI_IC[R.slot],s):WPIC(R.who,s,R.tier)};
const matText=o=>Object.keys(o).filter(k=>o[k]).map(k=>`${MIC(k,18)}${MATS[k]?MATS[k].n:k}×${o[k]}`).join('　');

/* ---------- セーブの補い（v2 の項目） ---------- */
function fixV2(g){if(!g.tw||typeof g.tw!=='object')g.tw={judge:{floor:0}};if(g.towerAt&&g.towerAt!=='meister'){g.tw[g.towerAt]=g.tw[g.towerAt]||{};g.tw[g.towerAt].floor=g.floor|0;g.floor=(g.tw.meister&&g.tw.meister.floor)|0;g.towerAt='meister'}if(!Array.isArray(g.bpRaw))g.bpRaw=[];if(!g.gen||typeof g.gen!=='object')g.gen={};if(!Array.isArray(g.genEq))g.genEq=[null,null];const m=g.mats&&typeof g.mats==='object'?g.mats:{};g.mats={};MAT_ORDER.forEach(k=>g.mats[k]=Math.max(0,Math.floor(+m[k]||0)));
 g.tools=Array.isArray(g.tools)?g.tools.filter(t=>TOOLS[t]):[];if(!g.tools.includes('file'))g.tools.unshift('file');
 g.bps=Array.isArray(g.bps)?g.bps.filter(b=>RECIPES[b]):[];RECIPE_ORDER.filter(b=>RECIPES[b].start).forEach(b=>{if(!g.bps.includes(b))g.bps.push(b)});
 const a=g.arm&&typeof g.arm==='object'?g.arm:{};g.arm={};['head','body','feet'].forEach(s=>{const p=a[s];g.arm[s]=p&&RECIPES[p.rid]&&Number.isFinite(+p.mul)?p:null});
 g.coin=Math.max(0,Math.floor(Number.isFinite(+g.coin)?+g.coin:100));
 g.bench=Array.isArray(g.bench)?g.bench.filter(m=>m&&CHARS[m.id]&&!g.party.some(p=>p.id===m.id)):[];g.bench.forEach(m=>{if(!JOBS[m.job])m.job=CHARS[m.id].job;m.lv=Math.max(1,Math.floor(+m.lv)||1)});
 /* パーティはリーダーを入れて PARTY_MAX 人まで。多いぶんは後ろから控えへ（リーダーは残す） */
 for(let i=g.party.length-1;i>=0&&g.party.length>PARTY_MAX;i--)if(g.party[i].id!==g.lead)g.bench.push(g.party.splice(i,1)[0]);
 [...g.party,...g.bench].forEach(m=>{m.star=Math.min(STAR_MAX,Math.max(1,Math.floor(+m.star)||1));m.shard=Math.max(0,Math.floor(+m.shard)||0)+Math.max(0,Math.floor(+m.dup)||0)*2;delete m.dup});
 if(!g.lead||!g.party.some(m=>m.id===g.lead))g.lead=g.party[0].id;
 {const i=g.party.findIndex(m=>m.id===g.lead);if(i>0)g.party.unshift(g.party.splice(i,1)[0])}
 if(g.where&&g.where.s==='field')g.where={s:'town'};
 if(!Number.isInteger(g.floor)){const c=g.cleared||[];g.floor=c.includes('u_boss')?10:c.includes('f_boss')?6:c.includes('boss')?3:0}g.floor=clamp(g.floor,0,TOP_FLOOR)}
/* 受けるダメージの見はり（vol2 の衣・トゲ・化石の体などが上書きする） */
let fHurt=(v,src)=>v;
const BASEW={};
const wMul=m=>m&&m.weapon&&Number.isFinite(+m.weapon.mul)?+m.weapon.mul:1;
const armMul=s=>G.arm&&G.arm[s]?+G.arm[s].mul:0;

/* ===================== 町の外（サバイバー） ===================== */
let FD=null,fRaf=0,fLast=0,fW=0,fH=0,fDPR=1,fZ=1;
const fcv=()=>$('fcv');
function resizeField(){const c=fcv();fDPR=Math.min(2,devicePixelRatio||1);fW=innerWidth;fH=innerHeight;c.width=Math.round(fW*fDPR);c.height=Math.round(fH*fDPR);fZ=clamp(Math.min(fW,fH)/400,.8,1.25);fZ=Math.max(fZ,Math.hypot(fW,fH)/2/700)/* 大きな画面（PC・ブラウザの縮小表示）でも、見える範囲を広げすぎない：広すぎると敵が遠くに湧いてすぐ消える */}
addEventListener('resize',()=>{if(FD&&onScr('field'))resizeField()});
/* 画像は小さく描き直して軽くする */
const FSPR={};
function fspr(src,size){const key=src+'@'+size;if(FSPR[key])return FSPR[key];const i=img(src);if(!i.complete||!i.naturalWidth)return null;
 const c=document.createElement('canvas'),k=size/Math.max(i.naturalWidth,i.naturalHeight);c.width=Math.max(1,Math.round(i.naturalWidth*k*2));c.height=Math.max(1,Math.round(i.naturalHeight*k*2));c.getContext('2d').drawImage(i,0,0,c.width,c.height);return FSPR[key]=c}
let fGround={};
/* 塔の床（下層・中層・上層）。画像が読めるまでは仮の床を描く */
const FLOOR_IMG={alley:'img/floor/alley.webp',factory:'img/floor/factory.webp',under:'img/floor/under.webp'};
function groundFor(k){if(fGround[k])return fGround[k];
 const fi=FLOOR_IMG[k]&&img(FLOOR_IMG[k]);if(fi&&fi.complete&&fi.naturalWidth){const c=document.createElement('canvas');c.width=c.height=360;const g=c.getContext('2d');g.drawImage(fi,0,0,360,360);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,360,360);return fGround[k]=fcv().getContext('2d').createPattern(c,'repeat')}
 if(fi)return groundTmp(k);return groundTmp(k,true)}
function groundTmp(k,keep){const A=FAREA[k],c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=A.ground[0];g.fillRect(0,0,256,256);
 for(let i=0;i<900;i++){g.fillStyle=`rgba(${Math.random()*40+20|0},${Math.random()*40+25|0},${Math.random()*40+40|0},.5)`;g.fillRect(Math.random()*256,Math.random()*256,2,2)}
 for(let i=0;i<6;i++){g.fillStyle=`rgba(${A.ground[1]},${.03+Math.random()*.05})`;g.beginPath();g.ellipse(Math.random()*256,Math.random()*256,10+Math.random()*22,6+Math.random()*12,Math.random()*3,0,TAU);g.fill()}
 g.strokeStyle='#1417244d';g.lineWidth=1.2;for(let i=0;i<3;i++){let x=Math.random()*256,y=Math.random()*256;g.beginPath();g.moveTo(x,y);for(let q=0;q<5;q++){x+=Math.random()*50-25;y+=Math.random()*50-25;g.lineTo(x,y)}g.stroke()}
 const p=fcv().getContext('2d').createPattern(c,'repeat');if(keep)fGround[k]=p;return p}

/* ---------- 入力：どこでもスティック ---------- */
const FIN={id:null,ox:0,oy:0,dx:0,dy:0,R:46};const FKEY={};
(function(){const c=$('fcv'),st=$('fstick'),kn=st.firstElementChild;
 c.addEventListener('pointerdown',e=>{if(!FD)return;if(FD.paused){/* 画面に何も出ていないのに止まったまま → 0.8秒あけて2回さわったら再開（動けなくなる不具合の保険） */const now=performance.now();if(FD.run&&!FD.climbing&&!FD.ending){if(FIN.stuck&&now-FIN.stuck>800&&now-FIN.stuck<6000){FIN.stuck=0;FD.paused=false;fLast=0;if(!fRaf)fRaf=requestAnimationFrame(fLoop);if(typeof BUGLOG!=='undefined'){BUGLOG.push('stuck-resume f'+FD.floor);if(BUGLOG.length>5)BUGLOG.shift()}}else{FIN.stuck=now;return}}else return}if(FIN.id!==null&&FIN.id!==e.pointerId){FIN.id=null}/* 前の指が離れた知らせが来ていなくても、新しい指で動かせる */if(FIN.id!==null)return;e.preventDefault();FIN.id=e.pointerId;FIN.ox=e.clientX;FIN.oy=e.clientY;FIN.dx=FIN.dy=0;
  st.style.left=e.clientX+'px';st.style.top=e.clientY+'px';kn.style.transform='';st.classList.add('on');try{c.setPointerCapture(e.pointerId)}catch(_){}});
 c.addEventListener('pointermove',e=>{if(e.pointerId!==FIN.id)return;let dx=e.clientX-FIN.ox,dy=e.clientY-FIN.oy;const d=Math.hypot(dx,dy);if(d>FIN.R){dx*=FIN.R/d;dy*=FIN.R/d}
  kn.style.transform=`translate(${dx}px,${dy}px)`;FIN.dx=d<8?0:dx/FIN.R;FIN.dy=d<8?0:dy/FIN.R});
 const end=e=>{if(e.pointerId!==FIN.id)return;FIN.id=null;FIN.dx=FIN.dy=0;st.classList.remove('on')};
 c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);c.addEventListener('lostpointercapture',end)})();
function fReleaseStick(){FIN.id=null;FIN.dx=FIN.dy=0;$('fstick').classList.remove('on')}
addEventListener('keydown',e=>{if(FD&&onScr('field'))FKEY[e.key]=1});addEventListener('keyup',e=>{FKEY[e.key]=0});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&FD&&FD.run&&!FD.paused&&onScr('field'))fPause()});

/* ---------- 出撃 ---------- */
function startFloor(fl){audio();const FLR=FLOORS[fl],k=FLR.area,A=FAREA[k];
 /* 技は最初はリーダーのものだけ。ほかのキャラの技は、レベルアップの候補に出てきて覚えていく（持っている全員が対象）。編成はパッシブのため */
 const atk={},ab=teamAb();atk[G.lead]=2;G.party.forEach(m=>{if(!(m.id in atk))atk[m.id]=0});genImpls().forEach(k=>{if(!(k in atk))atk[k]=0});if(ab.startLv)atk.wolf=Math.min(ATK_MAX,(atk.wolf||0)+ab.startLv);
 const hpMax=teamHp();
 const comp=FLR.join,needJoin=comp&&comp!==G.hero&&!ownChar(comp);
 const sa=Math.random()*TAU,sd=FLR.stair||0;
 FD={ab,revived:false,st:0,tt:0,startFl:fl,clearedTo:fl-1,coin:0,area:k,floor:fl,step:FLR.step,run:true,stairs:FLR.boss?null:{x:Math.cos(sa)*sd,y:Math.sin(sa)*sd,open:false},paused:false,t:0,lv:1,xp:0,need:4,hp:hpMax,maxhp:hpMax,x:0,y:0,face:'down',walk:0,inv:0,shake:0,warn:0,warnTxt:'',
  atk,ps:{spd:0,mag:0,hp:0,cd:0},foes:[],shots:[],gems:[],items:[],pops:[],fx:[],zones:[],chests:[],uid:0,acc:0,elite:0,chestN:0,pendingLv:0,
  cd:{wolf:0,fox:0,dodo:0,owl:0},stars:[],seeks:[],waves:[],orbA:0,kills:0,loot:{},lootTools:[],lootBps:[],join:needJoin?{id:comp,shown:false,x:0,y:0,cool:0}:null,
  boss:null,bossDone:false,ending:false};
 G.where={s:'field'};save();show('field');resizeField();fReleaseStick();renderFHud();$('fLevel').classList.remove('on');$('fPause').classList.remove('on');
 cancelAnimationFrame(fRaf);fLast=0;fRaf=requestAnimationFrame(fLoop);
 fBanner(`${fl}階　${FLR.n}　${FLR.boss?'ボスが待ちかまえている':'強敵から鍵をうばえ'}`,180,FLR.boss?'n_boss':'n_floor');
 if(FLR.ev==='mirror'&&!G.flags.selfRust)fMirror()}
const startField=k=>startFloor({alley:1,factory:4,under:7}[k]||1);
async function fMirror(){FD.paused=true;fReleaseStick();try{await talk(storyFit(SELF_RUST[G.hero]||[],SELF_RUST_FB),EV_IMG.includes('rust_'+G.hero)?'ev_rust_'+G.hero:null);G.flags.selfRust=true;save();
 await say(`${IC('shine',30)} 心の錆が消えた！<br><span style="font-size:14px">この先、ウルフの攻撃が少し強くなる</span>`,1600)}finally{if(FD){FD.paused=false;fLast=0;show('field');resizeField();if(!fRaf)fRaf=requestAnimationFrame(fLoop)}}}
function fBanner(t,frames,ic){if(!FD)return;FD.warnTxt=t;FD.warnIc=ic||'';FD.warn=frames||120}
const fSpd=()=>FCFG.SPD*(1+.1*FD.ps.spd)*(1+.08*armMul('feet'))*(1+Math.min(FD.ab.lvSpd||0,.01*(FD.lv-1)))*(1+(FD.ab.wspd||0));
const fCd=()=>1-.08*FD.ps.cd;
const fPick=()=>FCFG.PICK*(1+.6*FD.ps.mag)*(1+(FD.ab.pick||0));
const fCut=()=>(1-Math.min(.45,.14*armMul('body')))*(1-(FD.ab.cut||0))*ruleCut();
const fPow0=id=>fPow0b(id)*ruleAtk();
const fPow0b=id=>{const g=id!==G.lead&&!G.party.some(m=>m.id===id)&&genFor(id);if(g){const L=findOwn(G.lead);return (g.attr&&g.attr.k==='fire'?1+g.attr.v:1)*g.mul*lvMul(L)*(1+(FD.ab.teamAtk||0))*(FD.ab.rage&&FD.hp<FD.maxhp/2?1+FD.ab.rage:1)}const m=findOwn(id)||(FD.helperMs&&FD.helperMs[id])||null;const at=m&&m.weapon&&m.weapon.attr;return (at&&at.k==='fire'?1+at.v:1)*(G.flags.selfRust&&id===G.hero?1.1:1)*starMul(m)*wMul(m)*lvMul(m)*(m?genSup(m.id):1)*(1+(FD.ab.teamAtk||0))*(FD.ab.rage&&FD.hp<FD.maxhp/2?1+FD.ab.rage:1)};
const fPow=id=>fPow0(id)*fPowX(id);
/* 敵の波：1分の探索に合わせて、時間を2.5倍速で進める */
const fSearchT=()=>FD.st;   /* この階を探索した時間（ボス戦の間は進まない） */
function waveNow(){const mix=FAREA[FD.area].mix,t=fSearchT()*2.5;let w=mix[0];for(const v of mix)if(t>=v[0])w=v;return w}
function fSpawn(kind,ang,dist){if(FD.foes.length>=FCFG.MAX_FOES&&!FFOE[kind].big)return null;const F=FFOE[kind],a=ang==null?Math.random()*TAU:ang,r=dist||Math.hypot(fW,fH)/2/fZ+60,fs=FSCALE(fEff(FD.floor)),rk=F.boss?0:rustK(),hm=F.boss?BOSS_HP[FD.floor]||1:(1+fSearchT()/60)*(1+.22*(FD.step||0))*fs.hp*rustHp(rk);
 const e={id:++FD.uid,k:kind,x:FD.x+Math.cos(a)*r,y:FD.y+Math.sin(a)*r,hp:F.hp*hm,max:F.hp*hm,r:F.r,spd:F.spd*(F.boss?1:.9+Math.random()*.2),hit:0,kb:[0,0],wob:Math.random()*TAU,oh:0,big:!!F.big,boss:!!F.boss,dm:F.boss?1+.08*((fEff(FD.floor)||1)-1):fs.dmg*rustDm(rk)};
 FD.foes.push(e);return e}
function nearestFoes(n,x=FD.x,y=FD.y,maxD=1e9){return FD.foes.map(f=>[f,(f.x-x)**2+(f.y-y)**2]).filter(a=>a[1]<maxD*maxD).sort((a,b)=>a[1]-b[1]).slice(0,n).map(a=>a[0])}
function fDamage(e,d,kx,ky){if(e.hp<=0)return;e.hp-=d;e.hit=6;if(!e.boss)e.kb=[kx||0,ky||0];if(FD.pops.length<90)FD.pops.push({x:e.x,y:e.y-e.r,v:Math.round(d),t:0});
 const now=performance.now();if(now-(FD.lastSnd||0)>60){tone(420,.03,'square',.02);FD.lastSnd=now}}

/* ---------- 仲間の攻撃 ---------- */
function fAttacks(f){const A=FD.atk,c=FD.cd,cm=fCd();
 if(A.wolf){c.wolf-=f;if(c.wolf<=0){const L=A.wolf,n=1+(L>=2)+(L>=5),pierce=L>=3?2:1,dmg=11*(1+.15*(L-1))*fPow('wolf');
  nearestFoes(n,FD.x,FD.y,420).forEach(e=>{const a=Math.atan2(e.y-FD.y,e.x-FD.x);FD.shots.push({x:FD.x,y:FD.y-14,vx:Math.cos(a)*7,vy:Math.sin(a)*7,life:65,dmg:Math.random()<(FD.ab.crit||0)?dmg*2:dmg,pierce,hit:[],rot:0})});
  c.wolf=(L>=4?22:32)*cm}}
 if(A.fox){const L=A.fox,n=1+(L>=2)+(L>=4)+(L>=5)+(FD.ab.orb||0),R=62+(L>=5?24:0)+FD.ps.mag*0,dmg=8*(1+.2*(L>=3)+.12*(L-1))*fPow('fox');FD.orbA+=.065*f;FD.orb=[];
  for(let i=0;i<n;i++){const a=FD.orbA+i/n*TAU,x=FD.x+Math.cos(a)*R,y=FD.y+Math.sin(a)*R;FD.orb.push([x,y]);
   for(const e of FD.foes){if(e.oh>0)continue;if((e.x-x)**2+(e.y-y)**2<(e.r+12)**2){fDamage(e,dmg,(e.x-FD.x)/R*3,(e.y-FD.y)/R*3);e.oh=18}}}}else FD.orb=null;
 if(A.dodo){c.dodo-=f;if(c.dodo<=0){const L=A.dodo,R=78+12*(L>=2)+16*(L>=5),dmg=16*(1+.12*(L-1)+.25*(L>=4))*fPow('dodo');
  FD.fx.push({k:'ham',x:FD.x,y:FD.y,r:R,t:0});tone(140,.09,'square',.06,70);
  for(const e of FD.foes){const d=Math.hypot(e.x-FD.x,e.y-FD.y);if(d<R+e.r){const kb=FD.ab.kb?13:7;fDamage(e,dmg,(e.x-FD.x)/(d||1)*kb,(e.y-FD.y)/(d||1)*kb)}}
  c.dodo=(L>=3?62:88)*cm*(1-(FD.ab.hamCd||0))}}
 if(A.owl){c.owl-=f;if(c.owl<=0){const L=A.owl,k=1+(L>=3)+(L>=5)+(FD.ab.zone||0),R=55+14*(L>=2),dmg=3.2*(1+.12*(L-1)+.3*(L>=4))*fPow('owl');
  const ts=nearestFoes(8,FD.x,FD.y,360).sort(()=>Math.random()-.5).slice(0,k);
  ts.forEach(e=>FD.zones.push({x:e.x,y:e.y,r:R,t:0,life:130,dmg}));if(ts.length)tone(880,.08,'sine',.04,1320);c.owl=150*cm}}
 if(A.gorilla){c.gorilla=(c.gorilla||0)-f;if(c.gorilla<=0){const L=A.gorilla,hops=2+(L>=2)+(L>=5),dmg=14*(1+.18*(L-1)+.25*(L>=3))*fPow('gorilla');let from={x:FD.x,y:FD.y-20},hit=new Set();
   for(let i=0;i<hops;i++){const t=FD.foes.filter(e=>!hit.has(e.id)&&(e.x-from.x)**2+(e.y-from.y)**2<(i?170:320)**2).sort((a,b)=>((a.x-from.x)**2+(a.y-from.y)**2)-((b.x-from.x)**2+(b.y-from.y)**2))[0];if(!t)break;
    FD.fx.push({k:'bolt',x:from.x,y:from.y,x2:t.x,y2:t.y,t:0});fDamage(t,dmg,0,0);hit.add(t.id);from=t}
   if(hit.size)tone(1600,.05,'sawtooth',.03,400);c.gorilla=(L>=4?42:64)*cm}}
 if(A.mouse){c.mouse=(c.mouse||0)-f;if(c.mouse<=0){const L=A.mouse,amt=3+2*(L>=2)+3*(L>=4);FD.hp=Math.min(FD.maxhp,FD.hp+amt);FD.fx.push({k:'heal',x:FD.x,y:FD.y,r:40,t:0});
   if(L>=5)for(const e of FD.foes){const d=Math.hypot(e.x-FD.x,e.y-FD.y);if(d<110)e.kb=[(e.x-FD.x)/(d||1)*10,(e.y-FD.y)/(d||1)*10]}
   FD.pops.push({x:FD.x,y:FD.y-40,v:'+'+amt,t:0,heal:1});renderFHud();c.mouse=(L>=3?200:300)*cm}}
 if(A.robot){c.robot=(c.robot||0)-f;if(c.robot<=0){const L=A.robot,t=nearestFoes(1,FD.x,FD.y,400)[0];if(t){const base=Math.atan2(t.y-FD.y,t.x-FD.x),wid=L>=3?26:16,dmg=16*(1+.2*(L-1))*fPow('robot');
   (L>=5?[base,base+Math.PI]:[base]).forEach(a=>{const ux=Math.cos(a),uy=Math.sin(a);FD.fx.push({k:'beam',x:FD.x,y:FD.y-14,a,w:wid,t:0});
    for(const e of FD.foes){const dx=e.x-FD.x,dy=e.y-FD.y,along=dx*ux+dy*uy,side=Math.abs(-dx*uy+dy*ux);if(along>0&&along<420&&side<wid+e.r*.6)fDamage(e,dmg,ux*4,uy*4)}});tone(300,.12,'sawtooth',.04,1200)}
   c.robot=(L>=4?60:88)*cm}}
 if(A.tsukiyo){c.tsukiyo=(c.tsukiyo||0)-f;if(c.tsukiyo<=0){const L=A.tsukiyo,k=1+(L>=2)+(L>=4),R=L>=5?70:50,dmg=20*(1+.25*(L>=3)+.1*(L-1))*fPow('tsukiyo');
   nearestFoes(10,FD.x,FD.y,380).sort(()=>Math.random()-.5).slice(0,k).forEach(e=>FD.stars.push({x:e.x,y:e.y,t:0,R,dmg}));c.tsukiyo=80*cm}}
 for(const st of FD.stars){st.t+=f;if(!st.done&&st.t>=28){st.done=1;FD.fx.push({k:'ham',x:st.x,y:st.y,r:st.R,t:0,col:'#9fd0ff'});for(const e of FD.foes)if((e.x-st.x)**2+(e.y-st.y)**2<(st.R+e.r)**2)fDamage(e,st.dmg,0,0)}}
 FD.stars=FD.stars.filter(st=>st.t<34);
 if(A.onmyo){c.onmyo=(c.onmyo||0)-f;if(c.onmyo<=0){const L=A.onmyo,k=1+(L>=2)+(L>=5),dmg=13*(1+.22*(L>=3)+.1*(L-1))*fPow('onmyo');
   for(let i=0;i<k;i++){const a=Math.random()*TAU;FD.seeks.push({x:FD.x,y:FD.y-14,vx:Math.cos(a)*3,vy:Math.sin(a)*3,life:150,dmg,pierce:L>=4?2:1,hit:[]})}c.onmyo=54*cm}}
 for(const s of FD.seeks){s.life-=f;const t=nearestFoes(1,s.x,s.y,500)[0];if(t){const dx=t.x-s.x,dy=t.y-s.y,d=Math.hypot(dx,dy)||1;s.vx+=(dx/d*6.5-s.vx)*.12*f;s.vy+=(dy/d*6.5-s.vy)*.12*f}
  s.x+=s.vx*f;s.y+=s.vy*f;for(const e of FD.foes){if(s.hit.includes(e.id))continue;if((e.x-s.x)**2+(e.y-s.y)**2<(e.r+8)**2){fDamage(e,s.dmg,s.vx*.5,s.vy*.5);s.hit.push(e.id);if(s.hit.length>=s.pierce){s.life=0;break}}}}
 FD.seeks=FD.seeks.filter(s=>s.life>0);
 if(A.rocker){c.rocker=(c.rocker||0)-f;if(c.rocker<=0){const L=A.rocker;FD.waves.push({x:FD.x,y:FD.y,r:20,max:L>=3?260:200,dmg:12*(1+.22*(L>=2)+.1*(L-1))*fPow('rocker'),kb:L>=5?16:9,hit:new Set()});tone(196,.2,'square',.05,392);c.rocker=(L>=4?84:115)*cm}}
 for(const w of FD.waves){w.r+=7*f;for(const e of FD.foes){if(w.hit.has(e.id))continue;const d=Math.hypot(e.x-w.x,e.y-w.y);if(Math.abs(d-w.r)<e.r+10){w.hit.add(e.id);fDamage(e,w.dmg,(e.x-w.x)/(d||1)*w.kb,(e.y-w.y)/(d||1)*w.kb)}}}
 FD.waves=FD.waves.filter(w=>w.r<w.max);
 for(const z of FD.zones){z.t+=f;if(Math.floor(z.t/10)!==Math.floor((z.t-f)/10)){for(const e of FD.foes){if((e.x-z.x)**2+(e.y-z.y)**2<(z.r+e.r*.5)**2)fDamage(e,z.dmg,0,0)}}}
 FD.zones=FD.zones.filter(z=>z.t<z.life)}

/* ---------- 倒した・拾った ---------- */
function fKill(e){FD.kills++;const F=FFOE[e.k];{const v=F.xp*xpT();if(v>0)FD.gems.push({x:e.x,y:e.y,v,big:F.xp>=10})}
 {const fm=FLOOR_MATS[FD.floor]||['scrap'];for(let i=0;i<fm.length;i++)if(Math.random()<(i?.016:.026)){FD.items.push({x:e.x+Math.random()*16-8,y:e.y+Math.random()*16-8,k:fm.at(i)});break}if(FLOORS[FD.floor].boss&&Math.random()<.005)FD.items.push({x:e.x,y:e.y,k:'core'})}
 if(e.big){for(let i=0;i<6;i++)FD.gems.push({x:e.x+Math.random()*60-30,y:e.y+Math.random()*60-30,v:3});
  const n=e.boss?4:2,fm=FLOOR_MATS[FD.floor]||['scrap'];for(let i=0;i<n;i++)FD.items.push({x:e.x+Math.random()*50-25,y:e.y+Math.random()*50-25,k:fm.at(i%fm.length)});
  FD.items.push({x:e.x,y:e.y+10,k:'core'});if(e.boss)FD.items.push({x:e.x+20,y:e.y,k:'core'});
  if(e.key&&FD.stairs&&!FD.stairs.open){FD.stairs.open=true;FD.stairShown=true;fBanner('階段の鍵を手に入れた！ 矢印の方へ',170,'f_key');tone(990,.2,'triangle',.1,1480)}
  if(e.boss||Math.random()<BP_ELITE){const bp=nextBp();if(bp)FD.items.push({x:e.x-16,y:e.y,k:'bp',id:bp})}
  /* 強敵・ボスはコインも落とす */
  const cn=e.boss?5:2;for(let i=0;i<cn;i++)FD.items.push({x:e.x+Math.random()*44-22,y:e.y-14+Math.random()*20,k:'coin',v:COIN_DROP})}
 if(e.boss){FD.bossDone=true;FD.boss=null;FD.foes.forEach(f=>{if(f!==e&&f.hp>0)f.hp=0});FD.ebul=[];FD.hp=Math.max(FD.hp,1);fBanner(`${FOES[e.k]?FOES[e.k].n:'ボス'}をたおした！`,200,'n_boss');sfx.win&&sfx.win();FD.stairs={x:e.x,y:e.y,open:true};FD.stairShown=true;
  /* ボスが倒れると、まわりの錆もくずれ落ちる */
  for(const o of FD.foes)if(o!==e&&o.hp>0){o.hp=0;FD.gems.push({x:o.x,y:o.y,v:1})}
  fBanner('錆がくずれ落ちた！ 上への階段が現れた',200,'n_floor')}}
/* まだ持っていない図面（このエリアで見つかるもの。今回の出撃で落ちたものは除く） */
/* 持っているキャラの図面だけ見つかる（ガチャのキャラは仲間になってから） */
const ownedAll=()=>[...G.party,...(G.bench||[])];
const findOwn=id=>G.party.find(m=>m.id===id)||(G.bench||[]).find(m=>m.id===id);
const ownChar=id=>G.party.some(m=>m.id===id)||(G.bench||[]).some(m=>m.id===id);
function nextBp(){const have=new Set([...G.bps,...(G.bpRaw||[]),...FD.lootBps,...FD.items.filter(i=>i.k==='bp').map(i=>i.id)]);return bpArea(FD.area).find(b=>!RECIPES[b].limited&&!have.has(b)&&(RECIPES[b].kind!=='weapon'||ownChar(RECIPES[b].who)||!GACHA_BANNERS.some(x=>x.pool&&x.pool.includes(RECIPES[b].who))))||null}
function fGot(it){if(it.k==='coin'){const v=it.v||COIN_DROP;G.coin=(G.coin|0)+v;FD.coin+=v;FD.pops.push({x:FD.x,y:FD.y-40,v:'+'+v,t:0,heal:1});tone(1500,.06,'triangle',.06,2000);renderFHud();return}
 if(it.k==='bp'){FD.lootBps.push(it.id);fBanner(`図面を拾った！「${RECIPES[it.id].n}」`,170,'m_bp');tone(990,.15,'triangle',.08,1480);return}
 if(it.k==='tool'){FD.lootTools.push(it.id);fBanner(`工具を手に入れた！「${TOOLS[it.id].n}」`,170,UI_IC[it.id]);tone(990,.15,'triangle',.08,1480);return}
 FD.loot[it.k]=(FD.loot[it.k]||0)+1;tone(1300,.05,'triangle',.04,1700);renderFHud()}
function fOpenChest(c){c.open=true;const A=FAREA[FD.area],got=[];
 const add=(k,n)=>{for(let i=0;i<n;i++)FD.items.push({x:c.x+Math.random()*40-20,y:c.y+Math.random()*40-20,k})};
 {const fm=FLOOR_MATS[FD.floor]||['scrap'];add(fm.at(0),2+Math.floor(Math.random()*3));add(fm.at(-1),1+Math.floor(Math.random()*2))}
 const tl=(CHEST_TOOLS[FD.area]||[]).find(t=>!hasTool(t)&&!FD.lootTools.includes(t)&&!FD.items.some(i=>i.k==='tool'&&i.id===t));if(tl)FD.items.push({x:c.x,y:c.y-24,k:'tool',id:tl});
 else if(Math.random()<BP_CHEST){const bp=nextBp();if(bp)FD.items.push({x:c.x,y:c.y-24,k:'bp',id:bp})}
 tone(880,.2,'triangle',.1,1320);fBanner('資材の箱をあけた！',90)}

/* ---------- レベルアップ（だれを強化するか選ぶ） ---------- */
function fGainXp(v){FD.xp+=v*(1+(FD.ab.xp||0));while(FD.xp>=FD.need){FD.xp-=FD.need;FD.lv++;FD.need=Math.round(3+FD.lv*2.6+FD.lv*FD.lv*.16);FD.pendingLv++}
 if(FD.pendingLv&&!$('fLevel').classList.contains('on'))fOpenLevel()}
function fOpenLevel(){FD.paused=true;fReleaseStick();FD.pendingLv--;tone(660,.12,'triangle',.08,1320);
 const opts=[];Object.keys(FD.atk).forEach(k=>{if((FD.atk[k]||0)<atkMax(k))opts.push('a:'+k)});Object.keys(PASSIVE).forEach(k=>{if(FD.ps[k]<PASSIVE[k].max)opts.push('p:'+k)});
 /* 仲間の攻撃が少なくとも1つは入るようにする */
 let pk=opts.sort(()=>Math.random()-.5).slice(0,3);const atkOpts=opts.filter(o=>o[0]==='a');if(atkOpts.length&&!pk.some(o=>o[0]==='a'))pk[0]=pick(atkOpts);
 {const ex=extraOpts();if(ex.length)pk=[ex[0],...pk.filter(x=>x!==ex[0])].slice(0,3)}
 if(!pk.length)pk=['heal'];
 $('fPicks').innerHTML=pk.map(o=>{if(o==='heal')return `<button class="fpick" data-k="heal">${MIC('oil',44)}<span><b>オイル補給</b><small>体力を50回復</small></span></button>`;
  const [t,k]=o.split(':');if(t==='e'||t==='w')return evoCardHTML(t,k);if(t==='a'){const c=CHARS[k],A=ATK[k],L=FD.atk[k]||0,gr=k!==G.lead&&genRid(k);return `<button class="fpick" data-k="${o}">${gr?RIC(gr,44):`<span class="fpi"><img src="${c.img}" alt="">${TIC(A.type,26)}</span>`}<span><b>${gr?RECIPES[gr].n+'　'+A.type:c.name+'　'+A.n}</b><small>${A.d[L]}</small></span><span class="lvt">${L?'Lv'+L+'→'+(L+1):'NEW'}</span></button>`}
  const P=PASSIVE[k];return `<button class="fpick" data-k="${o}">${MIC(k,44)}<span><b>${P.n}</b><small>${P.d}</small></span><span class="lvt">${FD.ps[k]?'Lv'+FD.ps[k]+'→'+(FD.ps[k]+1):'NEW'}</span></button>`}).join('');
 $('fPicks').querySelectorAll('.fpick').forEach(b=>b.onclick=()=>{const o=b.dataset.k;if(o==='heal')FD.hp=Math.min(FD.maxhp,FD.hp+50);else{const [t,k]=o.split(':');if(t==='e'||t==='w')evoPick(t,k);else if(t==='a')FD.atk[k]=(FD.atk[k]||0)+1;else{FD.ps[k]++;if(k==='hp'){FD.maxhp+=20;FD.hp=Math.min(FD.maxhp,FD.hp+20)}}}
  $('fLevel').classList.remove('on');renderFHud();if(FD.pendingLv)fOpenLevel();else{FD.paused=false;fLast=0}});
 $('fLevel').classList.add('on')}

/* ---------- 仲間の気配・ボス（会話のあいだは止める） ---------- */
async function fJoin(){const J=FD.join;FD.paused=true;fReleaseStick();const id=J.id;
 try{if(CADQ_MISSION[id]&&!(await cadMission(id))){J.cool=150;return}
  await talk([[id,CHARS[id].name,CADQ_MISSION[id]?CADQ_MISSION[id].done:CHARS[id].lines[0]]].concat((JOIN_TALK[id]||[]).slice(id==='dodo'?2:1).filter(l=>l[0])));
  const full=G.party.length>=PARTY_MAX;if(!Array.isArray(G.bench))G.bench=[];
  (full?G.bench:G.party).push(newMember(id,1));G.joined.push(id);save();FD.atk[id]=0;FD.join=null;if(FD.stairs){FD.stairs.open=true;FD.stairShown=true}
  await say(`${UIMG('n_join',40)} <span class="nw">${CHARS[id].name}が</span><span class="nw">仲間になった！</span><br><span style="font-size:14px">${TIC(ATK[id].type,20)}${ATK[id].n}が、レベルアップの候補に出るようになった${full?`<br>パーティが${PARTY_MAX}人なので控えに入った`:''}</span>`,full?2200:1700)}
 finally{show('field');resizeField();renderFHud();FD.paused=false;fLast=0;if(!fRaf)fRaf=requestAnimationFrame(fLoop)}}
/* ボス戦の前と後の挿絵（img/ev/）。ないエリアは今までどおり */
const BOSS_EV={top:['ev_boss20_before','ev_boss20_after']};
async function fBossCome(){const k=FD.area,tk='bt_'+AREAS[k].boss;FD.bossCalled=true;FD.paused=true;fReleaseStick();
 try{if(!G.flags[tk]){await talk(storyFit(BOSS_TALK[k]||[],null,['onmyo','sora','takumi']),BOSS_EV[k]&&BOSS_EV[k][0]);G.flags[tk]=1;save()}}finally{FD.paused=false;fLast=0}
 const b=fSpawn(FAREA[k].boss,null,320);b.ai={st:'walk',t:0};FD.boss=b;fBanner(`${FOES[b.k]?FOES[b.k].n:'ボス'}が現れた！`,180,'n_boss')}
/* ボスの動き：歩く → 予告（赤い線）→ 突進。手下を呼ぶ */
function fBossAI(b,f){const a=b.ai;a.t+=f;
 if(a.st==='walk'){if(a.t>200){a.st='aim';a.t=0;a.ang=Math.atan2(FD.y-b.y,FD.x-b.x)}return 'walk'}
 if(a.st==='aim'){if(a.t>45){a.st='dash';a.t=0}return 'stop'}
 if(a.st==='dash'){b.x+=Math.cos(a.ang)*6.5*f;b.y+=Math.sin(a.ang)*6.5*f;if(a.t>38){a.st='walk';a.t=0;const mix=waveNow()[1];for(let i=0;i<6;i++){const e=fSpawn(pick(mix),0,1);if(e){e.x=b.x+Math.cos(i/6*TAU)*90;e.y=b.y+Math.sin(i/6*TAU)*90}}}return 'stop'}
 return 'walk'}

/* ---------- 1フレーム ---------- */
function fUpdate(f){const D=FD;D.t+=f/60;
 let mx=FIN.dx,my=FIN.dy;if(FKEY.ArrowLeft)mx=-1;if(FKEY.ArrowRight)mx=1;if(FKEY.ArrowUp)my=-1;if(FKEY.ArrowDown)my=1;const ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml}
 if(ml>.05){D.x+=mx*fSpd()*f;D.y+=my*fSpd()*f;D.walk+=f;D.face=Math.abs(mx)>Math.abs(my)?(mx<0?'left':'right'):(my<0?'up':'down')}
 // 出現
 const w=waveNow(),rate=w[2]*(D.boss?.6:1)*(1+.12*(D.step||0))*rustMul();if(!D.bossDone)D.acc+=rate*f/60;while(D.acc>=1){D.acc--;fSpawn(pick(w[1]))}
 if(D.elite<FT.ELITE.length&&D.t>=FT.ELITE[D.elite]){const key=!!(D.stairs&&!D.stairs.open);D.elite++;const e=fSpawn(FAREA[D.area].elite);if(e&&key)e.key=true;fBanner(key?'強敵が来た！ 階段の鍵を持っている':'強敵が来た！',150,key?'f_key':'n_boss')}
 if(D.stairs&&!D.stairs.open&&D.elite>=FT.ELITE.length&&!D.foes.some(e=>e.key)&&D.t>(D.keyT||0)){D.keyT=D.t+20;const e=fSpawn(FAREA[D.area].elite);if(e){e.key=true;fBanner('鍵を持った強敵がまた来た！',150,'f_key')}}
 if(D.chestN<FT.CHEST.length&&D.t>=FT.CHEST[D.chestN]){D.chestN++;const a=Math.random()*TAU;D.chests.push({x:D.x+Math.cos(a)*260,y:D.y+Math.sin(a)*260,open:false});fBanner('近くに資材の箱がある！',120)}
 if(D.join&&!D.join.shown&&D.t>=FT.JOIN){const a=Math.random()*TAU;Object.assign(D.join,{shown:true,x:D.x+Math.cos(a)*230,y:D.y+Math.sin(a)*230});fBanner(`だれかの気配がする…（${CHARS[D.join.id].name}）`,180,'n_join')}
 if(FLOORS[D.floor].boss&&!D.boss&&!D.bossDone&&!D.bossCalled&&D.t>=FT.BOSS){fBossCome();return}
 if(D.stairs&&!D.stairShown&&D.t>=FT.HINT){D.stairShown=true;fBanner(D.stairs.open?'階段の気配がする！ 矢印の方へ':'階段に鍵がかかっている。強敵が鍵を持っているらしい',170,D.stairs.open?'n_floor':'n_join')}
 D.tt+=f/60;if(D.bossDone&&D.hp<1)D.hp=1;if(!D.boss&&!D.bossDone){D.st+=f/60;if(D.st>=FLOOR_MAX-60&&!D.waveWarn){D.waveWarn=1;fBanner('錆の大波が近づいている…… あと1分でこの階は錆にのまれる',200,'n_time')}if(D.st>=FLOOR_MAX-10&&D.waveWarn<2){D.waveWarn=2;fBanner('あと10秒！ 階段へ急げ',150,'n_time')}if(D.st>=FLOOR_MAX&&!D.bossDone){if(!D.wave){D.wave=1;fBanner('錆の大波！ この階はもう持たない',220,'n_time')}D.hp-=D.maxhp*(.05+.03*(D.st-FLOOR_MAX))*f/60*(1-Math.min(.8,D.ab.rustRes||0));D.shake=Math.max(D.shake||0,3);if((D.wt=(D.wt||0)+f)>=30){D.wt=0;renderFHud()}}if(D.st>=FT.RUST&&!D.rustMsg){D.rustMsg=1;fBanner('錆が濃くなってきた…… 長居すると敵がどんどん強くなる',170,'n_time')}{const rl=rustLv();if(rl>=2&&rl>(D.rustLvMsg||1)){D.rustLvMsg=rl;fBanner(rl>=5?`錆Lv${rl}！ 敵がとても強い。早く階段へ`:`錆Lv${rl}　敵が強くなった`,150,'n_time')}}}
 // 攻撃
 fAttacks(f);
 for(const s of D.shots){s.x+=s.vx*f;s.y+=s.vy*f;s.life-=f;s.rot+=.35*f;
  for(const e of D.foes){if(e.hp<=0||s.hit.includes(e.id))continue;if((e.x-s.x)**2+(e.y-s.y)**2<(e.r+8)**2){fDamage(e,s.dmg,s.vx*.8,s.vy*.8);s.hit.push(e.id);if(s.hit.length>=s.pierce){s.life=0;break}}}}
 D.shots=D.shots.filter(s=>s.life>0);
 // 敵
 D.inv=Math.max(0,D.inv-f);
 for(const e of D.foes){let mode='walk';if(e.boss&&e.ai)mode=fBossAI(e,f);
  const dx=D.x-e.x,dy=D.y-e.y,d=Math.hypot(dx,dy)||1,slow=D.zones.some(z=>(e.x-z.x)**2+(e.y-z.y)**2<z.r*z.r)?(FD.ab.slow?.35:.55):1;
  if(mode==='walk'){e.x+=(dx/d*e.spd*slow+e.kb[0])*f;e.y+=(dy/d*e.spd*slow+e.kb[1])*f}
  e.kb[0]*=.8;e.kb[1]*=.8;e.hit=Math.max(0,e.hit-f);e.oh=Math.max(0,e.oh-f);e.wob+=.1*f;
  if(d<e.r+14&&D.inv<=0){D.hp-=fHurt(FFOE[e.k].dmg*(e.dm||1)*fCut(),e);D.inv=30;tone(90,.12,'sawtooth',.06);D.shake=8;renderFHud()}}
 const fs=D.foes;for(let i=0;i<fs.length;i++){const a=fs[i];for(let j=i+1;j<Math.min(fs.length,i+12);j++){const b=fs[j],dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy,m=a.r+b.r-6;if(d2<m*m&&d2>.01){const dd=Math.sqrt(d2),p=(m-dd)/2/dd,wa=a.boss?0:b.boss?2:1,wb=b.boss?0:a.boss?2:1;a.x-=dx*p*wa;a.y-=dy*p*wa;b.x+=dx*p*wb;b.y+=dy*p*wb}}}
 for(const e of D.foes)if(e.hp<=0)fKill(e);
 D.foes=D.foes.filter(e=>e.hp>0&&(e.boss||Math.hypot(e.x-D.x,e.y-D.y)<1600));
 // 拾う
 const R=fPick();
 for(const g of D.gems){const dx=D.x-g.x,dy=D.y-g.y,d=Math.hypot(dx,dy);if(d<R||g.mag){g.mag=1;const v=Math.min(d,9*f);g.x+=dx/(d||1)*v;g.y+=dy/(d||1)*v}if(d<16){g.got=1;fGainXp(g.v)}}
 D.gems=D.gems.filter(g=>!g.got);if(D.gems.length>300)D.gems.splice(0,D.gems.length-300);
 for(const it of D.items){const dx=D.x-it.x,dy=D.y-it.y,d=Math.hypot(dx,dy);if(d<R*.8||it.mag){it.mag=1;const v=Math.min(d,8*f);it.x+=dx/(d||1)*v;it.y+=dy/(d||1)*v}if(d<18){it.got=1;fGot(it)}}
 D.items=D.items.filter(i=>!i.got);
 for(const c of D.chests)if(!c.open&&(c.x-D.x)**2+(c.y-D.y)**2<40*40)fOpenChest(c);
 if(D.stairs){const sd=(D.stairs.x-D.x)**2+(D.stairs.y-D.y)**2;if(sd<46*46){if(D.stairs.open){fStairs();return}else if(!D.lockMsg){D.lockMsg=150;fBanner('鍵がかかっている。強敵をたおして鍵を手に入れよう',150,'n_unlock')}}if(D.lockMsg)D.lockMsg=Math.max(0,D.lockMsg-f)}
 if(D.join&&D.join.shown){D.join.cool=Math.max(0,D.join.cool-f);if(!D.join.cool&&(D.join.x-D.x)**2+(D.join.y-D.y)**2<44*44){fJoin();return}}
 D.pops.forEach(p=>p.t+=f);D.pops=D.pops.filter(p=>p.t<30);D.fx.forEach(p=>p.t+=f);D.fx=D.fx.filter(p=>p.t<16);
 D.shake=Math.max(0,D.shake-f);D.warn=Math.max(0,D.warn-f);
 if(D.ab.regen){D.rg=(D.rg||0)+f;if(D.rg>=600){D.rg=0;D.hp=Math.min(D.maxhp,D.hp+D.ab.regen);renderFHud()}}
 if(D.hp<=0&&D.ab.revive&&!D.revived&&!D.bossDone){D.revived=true;const rv=Math.min(1,D.ab.revive);D.hp=D.maxhp*rv;D.inv=120;fBanner(`仲間の力で立ち上がった！ 体力${Math.round(rv*100)}%`,160)}
 if(D.hp<=0&&!D.bossDone)fEnd('dead')}

/* ---------- 描く ---------- */
function fDraw(){const D=FD,c=fcv(),g=c.getContext('2d'),z=fZ;g.setTransform(fDPR,0,0,fDPR,0,0);
 const sx=D.shake?Math.random()*6-3:0,sy=D.shake?Math.random()*6-3:0,cx0=D.x-fW/2/z,cy0=D.y-fH/2/z;
 g.save();g.scale(z,z);g.translate(-cx0+sx,-cy0+sy);
 g.fillStyle=groundFor(D.area);g.fillRect(cx0-20,cy0-20,fW/z+40,fH/z+40);fDrawRuleFloor(g,D,cx0,cy0,z);
 // 魔法陣・衝撃波
 for(const q of D.zones){const k=q.t/q.life;g.save();g.translate(q.x,q.y);g.rotate(q.t*.02);g.globalAlpha=Math.min(1,(1-k)*2)*.85;g.strokeStyle='#8fd0ff';g.lineWidth=2.5;g.beginPath();g.arc(0,0,q.r,0,TAU);g.stroke();
  g.beginPath();for(let i=0;i<=5;i++){const a=i*TAU*2/5-Math.PI/2;g.lineTo(Math.cos(a)*q.r*.9,Math.sin(a)*q.r*.9)}g.stroke();g.fillStyle='#8fd0ff22';g.beginPath();g.arc(0,0,q.r,0,TAU);g.fill();g.restore()}g.globalAlpha=1;
 for(const p of D.fx){const k=p.t/16;g.globalAlpha=1-k;
  if(p.k==='bolt'){g.strokeStyle='#fff6a0';g.lineWidth=3;g.beginPath();g.moveTo(p.x,p.y);const n=5;for(let i=1;i<n;i++){g.lineTo(p.x+(p.x2-p.x)*i/n+Math.random()*16-8,p.y+(p.y2-p.y)*i/n+Math.random()*16-8)}g.lineTo(p.x2,p.y2);g.stroke()}
  else if(p.k==='beam'){g.strokeStyle='#ff5a8a';g.lineWidth=p.w*(1-k)+2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+Math.cos(p.a)*420,p.y+Math.sin(p.a)*420);g.stroke();g.strokeStyle='#fff';g.lineWidth=2;g.stroke()}
  else if(p.k==='heal'){g.strokeStyle='#7fffa0';g.lineWidth=4;g.beginPath();g.arc(p.x,p.y,p.r*(.4+.8*k),0,TAU);g.stroke()}
  else{g.strokeStyle=p.col||'#ffb35a';g.lineWidth=8*(1-k)+2;g.beginPath();g.arc(p.x,p.y,p.r*(.5+.5*k),0,TAU);g.stroke()}}g.globalAlpha=1;
 for(const st of D.stars){const k=Math.min(1,st.t/28);g.strokeStyle='#9fd0ff';g.globalAlpha=.35;g.beginPath();g.arc(st.x,st.y,st.R,0,TAU);g.stroke();g.globalAlpha=1;g.fillStyle='#e8f4ff';g.beginPath();g.arc(st.x+(1-k)*-120,st.y-(1-k)*260,6,0,TAU);g.fill()}
 for(const w of D.waves){g.strokeStyle='#c78bff';g.globalAlpha=1-w.r/w.max;g.lineWidth=4;g.beginPath();g.arc(w.x,w.y,w.r,0,TAU);g.stroke()}g.globalAlpha=1;
 for(const s of D.seeks){g.save();g.translate(s.x,s.y);g.rotate(Math.atan2(s.vy,s.vx));g.fillStyle='#f2efe0';g.strokeStyle='#c03030';g.lineWidth=1.5;g.fillRect(-8,-5,16,10);g.strokeRect(-8,-5,16,10);g.restore()}
 // 箱・素材・経験値
 const box=fspr('img/ui/f_box.webp',48)||fspr('img/ex-treasure.webp',46),boxO=fspr('img/ui/f_boxo.webp',48)||fspr('img/ex-treasure-open.webp',46);
 for(const ch of D.chests){const s=ch.open?boxO:box;if(s){g.drawImage(s,ch.x-23,ch.y-30,46,46*s.height/s.width)}else{g.fillStyle='#a07030';g.fillRect(ch.x-18,ch.y-14,36,26)}
  if(!ch.open){g.strokeStyle='#ffe7a0';g.globalAlpha=.5+.5*Math.sin(D.t*6);g.lineWidth=2;g.beginPath();g.arc(ch.x,ch.y-6,30,0,TAU);g.stroke();g.globalAlpha=1}}
 for(const it of D.items)drawItem(g,it,D.t);
 const gsp=fspr('img/ui/f_gem.webp',24);for(const gm of D.gems){if(gsp){const r=gm.big?11:7;g.drawImage(gsp,gm.x-r,gm.y-r,r*2,r*2);continue}g.fillStyle=gm.big?'#ffd27f':'#7fd0ff';g.beginPath();const r=gm.big?7:4.5;g.moveTo(gm.x,gm.y-r);g.lineTo(gm.x+r*.8,gm.y);g.lineTo(gm.x,gm.y+r);g.lineTo(gm.x-r*.8,gm.y);g.closePath();g.fill()}
 if(D.stairs)drawStairs(g,D);
 // 仲間の気配
 if(D.join&&D.join.shown){const J=D.join,s=fspr(CHARS[J.id].img,90);g.strokeStyle='#e8c35a';g.lineWidth=3;g.globalAlpha=.6+.4*Math.sin(D.t*4);g.beginPath();g.arc(J.x,J.y,40,0,TAU);g.stroke();g.globalAlpha=1;
  if(s){g.globalAlpha=J.cool?.5:1;g.drawImage(s,J.x-34,J.y-60,68,68*s.height/s.width);g.globalAlpha=1}
  const ang=Math.atan2(J.y-D.y,J.x-D.x),dd=Math.hypot(J.x-D.x,J.y-D.y);if(dd>Math.min(fW,fH)/2/z-30){const ax=D.x+Math.cos(ang)*(Math.min(fW,fH)/2/z-40),ay=D.y+Math.sin(ang)*(Math.min(fW,fH)/2/z-40);g.fillStyle='#e8c35a';g.save();g.translate(ax,ay);g.rotate(ang);g.beginPath();g.moveTo(14,0);g.lineTo(-8,-9);g.lineTo(-8,9);g.closePath();g.fill();g.restore()}}
 // 敵と主人公（下にいるものを手前に）
 const L=D.foes.slice();L.push({hero:1,y:D.y});L.sort((a,b)=>a.y-b.y);
 for(const e of L){if(e.hero){drawLead(g);continue}
  const F=FFOE[e.k],s=fspr('img/foe/'+e.k+'.webp',Math.round(e.r*2.6)),sz=e.r*2.6,bob=F.fly?Math.sin(e.wob)*5:0;
  g.fillStyle='#0006';g.beginPath();g.ellipse(e.x,e.y+e.r*.8,e.r*.9,e.r*.3,0,0,TAU);g.fill();
  if(e.boss&&e.ai&&e.ai.st==='aim'){g.strokeStyle='#ff4a4a';g.globalAlpha=.4+.4*Math.sin(D.t*20);g.lineWidth=e.r;g.beginPath();g.moveTo(e.x,e.y);g.lineTo(e.x+Math.cos(e.ai.ang)*280,e.y+Math.sin(e.ai.ang)*280);g.stroke();g.globalAlpha=1}
  if(s){g.save();g.translate(e.x,e.y+bob);if(D.x<e.x&&!F.noflip)g.scale(-1,1);g.drawImage(s,-sz/2,-sz*.6,sz,sz*s.height/s.width);g.restore()}else{g.fillStyle=FOES[e.k]?FOES[e.k].col:'#c07030';g.beginPath();g.arc(e.x,e.y,e.r,0,TAU);g.fill()}
  if(e.hit>0){g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.arc(e.x,e.y,e.r,0,TAU);g.fill()}
  if(e.big&&!e.boss){g.fillStyle='#0008';g.fillRect(e.x-30,e.y-e.r*1.5,60,6);g.fillStyle='#ff6a4a';g.fillRect(e.x-30,e.y-e.r*1.5,60*Math.max(0,e.hp/e.max),6)}}
 // 歯車・弾
 if(D.orb){const ws=fspr('img/ui/w_fox.webp',40);for(const [x,y] of D.orb){if(ws){g.save();g.translate(x,y);g.rotate(D.orbA*3);g.drawImage(ws,-15,-15,30,30);g.restore()}else drawGear(g,x,y,12,D.orbA*3)}}
 const wsh=(G.party.find(m=>m.id==='wolf')||{}).weapon,wspr=wsh&&wsh.shape?shapeCanvas(wsh.shape,30,'#ffd27f'):null;
 for(const s of D.shots){if(wspr){g.save();g.translate(s.x,s.y);g.rotate(Math.atan2(s.vy,s.vx));g.drawImage(wspr,-15,-9,30,18);g.restore();continue}g.save();g.translate(s.x,s.y);g.rotate(s.rot);g.fillStyle='#e8c35a';g.strokeStyle='#fff3c0';g.lineWidth=1.5;g.beginPath();g.moveTo(10,0);g.lineTo(-6,-5);g.lineTo(-3,0);g.lineTo(-6,5);g.closePath();g.fill();g.stroke();g.restore()}
 g.font='800 13px sans-serif';g.textAlign='center';for(const p of D.pops){g.globalAlpha=1-p.t/30;g.fillStyle=p.heal?'#7fffa0':'#fff';g.fillText(p.v,p.x,p.y-p.t*.8)}g.globalAlpha=1;
 fDrawExtra(g,D);
 g.restore();
 // 上の帯
 const lf=Math.floor(D.st),rusty=!D.boss&&D.st>=FT.RUST;{const h=(D.boss?UIMG('n_boss',22):UIMG(rusty?'n_time':'n_floor',22))+`<span class="ffl">${D.floor}F</span><span class="ftm ${!D.boss&&D.st>=FLOOR_MAX-60?'warn':''}">${D.boss?'ボス戦':!D.boss&&D.st>=FLOOR_MAX-60?'残り'+Math.max(0,FLOOR_MAX-lf)+'秒':Math.floor(lf/60)+':'+String(lf%60).padStart(2,'0')}</span>${rusty?`<span class="frl">${typeof towerAt==='function'&&towerAt()==='judge'?'ざわめき':towerAt()==='inf'?'ノイズ':'錆'}Lv${rustLv()}</span>`:''}`+`<span class="fmats">${matIcons(D.floor,18)}</span>`;const te=$('fTime');if(te._h!==h){te.innerHTML=h;te._h=h}}$('fTime').classList.toggle('warn',rusty);
 $('fHpI').style.width=Math.max(0,100*D.hp/D.maxhp)+'%';$('fXpI').style.width=100*D.xp/D.need+'%';$('fLv').textContent='Lv'+D.lv;
 if(D.boss){$('fBoss').style.display='block';$('fBossI').style.width=Math.max(0,100*D.boss.hp/D.boss.max)+'%';$('fBossN').textContent=FOES[D.boss.k]?FOES[D.boss.k].n:'ボス'}else $('fBoss').style.display='none';
 const wn=$('fWarn');if(D.warn>0){{const h=(D.warnIc?UIMG(D.warnIc,30)+' ':'')+D.warnTxt;if(wn._h!==h){wn.innerHTML=h;wn._h=h}}wn.style.opacity=Math.min(1,D.warn/30)}else wn.style.opacity=0}
function drawStairs(g,D){const S=D.stairs,t=D.t;g.save();g.translate(S.x,S.y);
 const ss=fspr(S.open?'img/ui/f_stairs.webp':'img/ui/f_gate.webp',80);
 if(ss)g.drawImage(ss,-38,-40,76,76);else{g.fillStyle=S.open?'#1b2a44':'#2a2a33';g.strokeStyle=S.open?'#ff9a4a':'#777';g.lineWidth=3;g.beginPath();g.rect(-34,-30,68,60);g.fill();g.stroke();
 for(let i=0;i<4;i++){g.fillStyle=S.open?`rgba(255,${150+i*20},90,${.35+i*.15})`:'#55556a';g.fillRect(-26+i*4,14-i*12,52-i*8,8)}}
 if(S.open){g.globalAlpha=.4+.3*Math.sin(t*5);g.strokeStyle='#ffb07a';g.beginPath();g.arc(0,0,48,0,TAU);g.stroke();g.globalAlpha=1}
 g.fillStyle='#fff';g.font='800 14px sans-serif';g.textAlign='center';g.fillText(S.open?'上へ ↑':'？',0,-46);g.restore();
 if(D.stairShown){const ang=Math.atan2(S.y-D.y,S.x-D.x),dd=Math.hypot(S.x-D.x,S.y-D.y),rr=Math.min(fW,fH)/2/fZ-34;
  if(dd>rr+10){const ax=D.x+Math.cos(ang)*rr,ay=D.y+Math.sin(ang)*rr;g.save();g.translate(ax,ay);g.rotate(ang);g.fillStyle=S.open?'#ff7a2f':'#999';g.beginPath();g.moveTo(18,0);g.lineTo(-10,-12);g.lineTo(-4,0);g.lineTo(-10,12);g.closePath();g.fill();g.restore();
   g.fillStyle='#ffd0a8';g.font='700 11px sans-serif';g.textAlign='center';g.fillText(Math.round(dd/10)+'m',ax-Math.cos(ang)*26,ay-Math.sin(ang)*26+4)}}}
function drawLead(g){const D=FD,id=G.lead,s=fspr(`img/walk/${id}_${D.face}.webp`,64);
 g.fillStyle='#0006';g.beginPath();g.ellipse(D.x,D.y+20,16,6,0,0,TAU);g.fill();
 if(D.inv>0&&Math.floor(D.inv/4)%2)return;
 if(s){const h=58,w=h*s.width/s.height,bob=-Math.abs(Math.sin(D.walk*.25))*4;g.drawImage(s,D.x-w/2,D.y+22-h+bob,w,h)}else{g.fillStyle='#e8c35a';g.beginPath();g.arc(D.x,D.y,16,0,TAU);g.fill()}}
function drawGear(g,x,y,r,a){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#c9b07a';g.strokeStyle='#5a4a2a';g.lineWidth=1.5;g.beginPath();for(let i=0;i<16;i++){const rr=i%2?r:r*.72,aa=i/16*TAU;g.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr)}g.closePath();g.fill();g.stroke();g.fillStyle='#3a2a1a';g.beginPath();g.arc(0,0,r*.28,0,TAU);g.fill();g.restore()}
const ITEM_COL={scrap:'#9aa0b0',oil:'#e8c35a',wire:'#e08a4a',gear:'#c9b07a',core:'#e05a3a'};
function drawItem(g,it,t){const y=it.y+Math.sin(t*4+it.x)*2;
 if(it.k==='bp'||it.k==='tool'){const ii=fspr('img/ui/'+(it.k==='bp'?'m_bp':(UI_IC[it.id]||'m_bp'))+'.webp',36);
  if(ii){g.drawImage(ii,it.x-16,y-16,32,32);g.strokeStyle='#ff7a2f';g.lineWidth=2;g.globalAlpha=.5+.5*Math.sin(t*8);g.beginPath();g.arc(it.x,y,22,0,TAU);g.stroke();g.globalAlpha=1;return}
  g.fillStyle=it.k==='bp'?'#2f63b8':'#4a6ab0';g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.rect(it.x-11,y-13,22,26);g.fill();g.stroke();g.strokeStyle='#bcd4ff';g.beginPath();g.moveTo(it.x-6,y-5);g.lineTo(it.x+6,y-5);g.moveTo(it.x-6,y+1);g.lineTo(it.x+4,y+1);g.stroke();
  g.strokeStyle='#ffe7a0';g.globalAlpha=.5+.5*Math.sin(t*8);g.beginPath();g.arc(it.x,y,20,0,TAU);g.stroke();g.globalAlpha=1;return}
 if(it.k==='gear'){drawGear(g,it.x,y,8,t);return}
 const ic=UI_IC[it.k]?fspr('img/ui/'+UI_IC[it.k]+'.webp',28):null;
 if(ic){g.drawImage(ic,it.x-13,y-13,26,26);return}
 g.fillStyle=ITEM_COL[it.k]||'#fff';g.beginPath();if(it.k==='wire'){g.strokeStyle=ITEM_COL.wire;g.lineWidth=3;g.arc(it.x,y,7,0,TAU);g.stroke();return}
 g.moveTo(it.x,y-9);g.lineTo(it.x+8,y-2);g.lineTo(it.x+5,y+8);g.lineTo(it.x-5,y+8);g.lineTo(it.x-8,y-2);g.closePath();g.fill()}
function renderFHud(){if(!FD)return;const l=FD.loot;$('fLoot').innerHTML=(FD.coin?`<span>${UIMG('coin',18)}${FD.coin}</span>`:'')+MAT_ORDER.filter(k=>l[k]).map(k=>`<span>${MIC(k,18)}${l[k]}</span>`).join('')+(FD.lootBps.length?`<span>${MIC('bp',18)}${FD.lootBps.length}</span>`:'')+(FD.lootTools.length?`<span>${MIC(FD.lootTools[0],18)}${FD.lootTools.length}</span>`:'')}

const ROT_MQ=matchMedia('(min-aspect-ratio:1/1) and (max-height:499px)');
function fLoop(now){if(!FD||!FD.run||!onScr('field')){fRaf=0;return}
 const f=fLast?clamp((now-fLast)/16.667,0,3):1;fLast=now;
 if(!FD.paused&&!ROT_MQ.matches)fUpdate(f);
 if(FD&&FD.run&&onScr('field'))fDraw();
 fRaf=requestAnimationFrame(fLoop)}
function fPause(){if(!FD||FD.paused)return;FD.paused=true;fReleaseStick();$('fPause').classList.add('on')}
function fResume(){$('fPause').classList.remove('on');if(FD){FD.paused=false;fLast=0}}
function fRetreat(){$('fPause').classList.remove('on');if(FD)fEnd('retreat')}

/* ---------- 階段：そのまま上の階へ（連続で登る） ---------- */
/* 階をクリアした記録（コイン・到達階・ボス撃破）。はじめて倒したボスなら true */
function commitFloor(fl){const D=FD,FLR=FLOORS[fl],bossId=AREAS[FLR.area].boss;let first=false;
 const coin=fl>(G.floor|0)?(FLR.boss?COIN_FIRST_BOSS:COIN_FIRST):COIN_AGAIN;G.coin=(G.coin|0)+coin;D.coin+=coin;
 if(fl>(G.floor|0))G.floor=fl;if(FLR.boss&&!G.cleared.includes(bossId)){G.cleared.push(bossId);first=true}
 D.clearedTo=Math.max(D.clearedTo,fl);save();return first}
async function fStairs(){const D=FD;if(!D||D.climbing)return;D.climbing=true;D.paused=true;fReleaseStick();
 const fl=D.floor,FLR=FLOORS[fl],k=D.area;const first=commitFloor(fl);sfx.win&&sfx.win();
 try{
  if(FLR.boss){
   if(first&&BOSS_WIN[k])await talk(storyFit(BOSS_WIN[k],null,['onmyo','sora','takumi']),BOSS_EV[k]&&BOSS_EV[k][1]);
   if(fl===10&&!G.flags.ch1&&towerAt()==='meister'){fEnd('ending');return}
   if(fl>=TOP_FLOOR){if(towerAt()!=='meister'){const tw=towerAt(),firstTw=!G.flags['tw_'+tw];G.flags['tw_'+tw]=1;save();if(firstTw&&typeof TW_END!=='undefined'&&TW_END[tw])await TW_END[tw]();fEnd('home');return}fEnd('ending2');return}
   if(!await fChoice(fl)){fEnd('home');return}}
  if(fl>=TOP_FLOOR){fEnd('home');return}
  await fAdvance(fl+1)}
 finally{if(FD===D&&D.run){D.climbing=false}}}
/* ボスのあと：続けて登るか、ホームへ帰るか */
function fChoice(fl){return new Promise(res=>{let el=$('fNext');if(!el){el=document.createElement('div');el.className='fov';el.id='fNext';$('fPause').parentNode.appendChild(el)}
 const D=FD,nf=FLOORS[fl+1],nk=nf.area!==D.area;
 el.innerHTML=`<div class="fcard"><div class="fnx">${UIMG('n_boss',40)}<div><b>${fl}階 突破！</b><small>ボスをたおした</small></div></div>
  <div class="note fnn">次は <b>${fl+1}階「${nf.n}」</b>${nk?`<br>ここから <b>${LAYER_NAME[nf.area]}</b>。敵が強くなる`:''}<br>体力 ${Math.ceil(D.hp)}/${D.maxhp}　Lv${D.lv}</div>
  <button class="btn gold" id="fnGo">続けて登る（${fl+1}階へ）</button><button class="btn" id="fnHome">ホームへ帰る<small class="bsm">素材は全部持ち帰る</small></button></div>`;
 el.classList.add('on');
 $('fnGo').onclick=()=>{el.classList.remove('on');res(true)};$('fnHome').onclick=()=>{el.classList.remove('on');res(false)}})}
/* 次の階へ：レベル・技・体力・素材はそのまま。階のものだけ入れかえる */
async function fAdvance(nf){const D=FD,F=FLOORS[nf],k=F.area,newArea=k!==D.area;
 await say(`${UIMG('n_floor',40)} <b style="font-size:26px">${nf}F</b>　${F.n}<br><span style="font-size:13px">${LAYER_NAME[k]}${F.boss?'・'+UIMG('n_boss',16)+'ボスの階':''}</span><br><span style="font-size:13px">出る素材 ${matIcons(nf,22)}</span><br><span style="font-size:13px;color:${teamPow()>=REC_POW[nf]?'#9be39b':'#ff8a8a'}">推奨戦力 ${REC_POW[nf]}（いま ${teamPow()}）</span>`,1100);
 if(FD!==D)return;
 if(newArea&&!G.flags['ai_'+k]){await talk(AREA_INTRO[k]);G.flags['ai_'+k]=1;save()}
 const comp=F.join,needJoin=comp&&comp!==G.hero&&!ownChar(comp),sa=Math.random()*TAU,sd=F.stair||0;
 Object.assign(D,{floor:nf,area:k,step:F.step,stairs:F.boss?null:{x:Math.cos(sa)*sd,y:Math.sin(sa)*sd,open:false},
  t:0,st:0,x:0,y:0,foes:[],shots:[],gems:[],items:[],pops:[],fx:[],zones:[],chests:[],stars:[],seeks:[],waves:[],acc:0,elite:0,chestN:0,
  join:needJoin?{id:comp,shown:false,x:0,y:0,cool:0}:null,boss:null,bossDone:false,bossCalled:false,stairShown:false,lockMsg:0,rustMsg:0,rustLvMsg:0,wave:0,waveWarn:0,wt:0,inv:90,climbing:false});
 D.hp=Math.min(D.maxhp,D.hp+Math.round(D.maxhp*.2));
 G.area=k;G.where={s:'field'};save();
 show('field');resizeField();renderFHud();
 fBanner(`${nf}階　${F.n}　${F.boss?'ボスが待ちかまえている':'強敵から鍵をうばえ'}`,180,F.boss?'n_boss':'n_floor');
 if(F.ev==='mirror'&&!G.flags.selfRust){fMirror();return}
 D.paused=false;fLast=0;if(!fRaf)fRaf=requestAnimationFrame(fLoop)}

/* ---------- 終わり：持ち帰り ---------- */
/* why：home＝ボスのあとホームへ／retreat＝自分で帰った／dead＝力つきた／ending＝10階のボスを倒した */
const startPoints=()=>[1,4,7,11,14,17].filter(s=>s===1||(G.floor|0)>=s-1);
const bestStart=()=>{const p=startPoints();return p[p.length-1]};
function fEnd(why){const D=FD;if(!D||D.ending)return;D.ending=true;D.run=false;cancelAnimationFrame(fRaf);fRaf=0;fReleaseStick();
 ['fNext','fLevel','fPause'].forEach(id=>{const e=$(id);if(e)e.classList.remove('on')});
 const dead=why==='dead',got={};MAT_ORDER.forEach(k=>{const n=D.loot[k]||0;got[k]=dead?Math.floor(n/2):n;G.mats[k]+=got[k]});
 D.lootTools.forEach(t=>{if(!G.tools.includes(t))G.tools.push(t)});D.lootBps.forEach(b=>{if(!G.bps.includes(b)&&!G.bpRaw.includes(b))G.bpRaw.push(b)});
 G.where={s:'town'};G.town={x:TOWN_START[0],y:TOWN_START[1]};save();
 if(why==='ending2'){FD=null;(async()=>{await talk(storyFit(ENDING2,null,['owl','takumi']));G.flags.ch1b=1;save();showEnding()})();return}
 if(why==='ending'){FD=null;(async()=>{await talk(storyFit(ENDING,null,['gorilla']),'ev_ending1');G.flags.ch1=1;save();showEnding()})();return}
 const up=D.clearedTo>=D.startFl,fl=up&&why==='home'?D.clearedTo:D.floor,coin=D.coin,climbed=Math.max(0,D.clearedTo-D.startFl+1);
 const ttl={home:'突破！',retreat:'ホームへ帰った',dead:'力つきた'}[why];
 const sub=`${D.startFl}F から ${climbed?climbed+'階 登った':'出発'}`+(dead?'<br>素材は半分だけ持ち帰れた（図面と工具はそのまま）':'');
 const emb={home:'n_floor',retreat:'n_lamp',dead:'n_boss'}[why];
 const tl=Math.floor(D.tt),tt=`${Math.floor(tl/60)}:${String(tl%60).padStart(2,'0')}`;
 let delay=0;const tile=(ic,n,cls='',tag='')=>`<div class="rzt ${cls}" style="animation-delay:${(delay+=70)}ms">${ic}<b>${n}</b>${tag?`<i>${tag}</i>`:''}</div>`;
 const tiles=[...MAT_ORDER.filter(k=>got[k]).map(k=>tile(MIC(k,34),'×'+got[k])),
  ...(coin?[tile(coinIc(34),'+'+coin,'gold')]:[]),
  ...D.lootBps.map(b=>tile(RIC(b,34),RECIPES[b].n,'wide','図面・未解読')),
  ...D.lootTools.map(t=>tile(MIC(t,34),TOOLS[t].n,'wide','工具 NEW'))].join('');
 const ns=bestStart(),NF=FLOORS[ns];
 const nxt=(G.floor|0)>=TOP_FLOOR?'':`<div class="rznx">${UIMG('n_unlock',26)}<span>次は <b>${ns}階</b> から出撃できる（${LAYER_NAME[NF.area]}）</span>　<em>最高 ${G.floor|0}F</em></div>`;
 $('result').classList.add('fres');
 $('resP').innerHTML=`<div class="rz ${up&&!dead?'win':'lose'}">
  <div class="rzh"><div class="rzfl">${fl}<small>F</small></div><div class="rzti">${UIMG(emb,40)}<b>${ttl}</b></div><div class="rzsb">${sub}</div></div>
  <div class="rzart"><img src="${CHARS[G.lead].img}" alt=""></div>
  <div class="rzst"><div>${UIMG('n_time',22)}<span>時間</span><b>${tt}</b></div><div>${UIMG('r_kill',22)}<span>倒した数</span><b>${D.kills}</b></div><div>${UIMG('r_lv',22)}<span>レベル</span><b>${D.lv}</b></div></div>
  <div class="rzrw"><div class="rzrh">持ち帰ったもの</div><div class="rzg">${tiles||'<span class="note">なし</span>'}</div></div>
  ${nxt}</div>`;
 $('resBtns').innerHTML='';
 addBtn(`${ns}階から出撃`,()=>resGo(ns),'gold');addBtn('ホームへ',afterField);
 if(up&&!dead)sfx.win&&sfx.win();show('result');FD=null}
/* 結果画面から、そのまま出撃 */
function resGo(f){$('result').classList.remove('fres');goFloor(f)}
async function afterField(){$('result').classList.remove('fres');
 /* 前の版のセーブに残った印（いまは階段の場で会話が流れる） */
 delete G.flags.pendFloorUp;const k=G.flags.pendFieldWin;if(k){delete G.flags.pendFieldWin;save();await talk(storyFit(BOSS_WIN[k]||[],null,['onmyo','sora','takumi']),BOSS_EV[k]&&BOSS_EV[k][1])}
 openHome()}

/* ===================== 工房（素材＋工具＋図面 → 製品） ===================== */
/* 図面の解読：三面図の問題を1問。正解でつくれるようになる。まちがえても、何度でもやり直せる */
async function decodeBp(id){const R=RECIPES[id];if(!R||!(G.bpRaw||[]).includes(id))return;const lv=Math.min(2,Math.max(0,R.tier-1));
 const ok=await CADQ.step(lv,{who:G.lead,label:'図面の解読',say:`「${R.n}」の図面は三面図でかかれている。上・前・右から見た形を組み立てて、正しい立体を選ぼう！`});
 openShop(shopFrom);
 if(ok){G.bpRaw=G.bpRaw.filter(b=>b!==id);if(!G.bps.includes(id))G.bps.push(id);save();sfx.win&&sfx.win();renderShop();
  await say(`${RIC(id,40)} 解読できた！<br><span style="font-size:14px">「${R.n}」をつくれるようになった</span>`,1500)}
 else await say('まだ読み解けない……<br><span style="font-size:14px">何度でも挑戦できる</span>',1200)}
let shopTab='make',shopFrom='tab';
/* from：'town'＝町の扉から（タブなし・「町へ」で戻る）／'tab'＝下のタブから */
function openShop(from){if(from)shopFrom=from;show('shop');G.where={s:'town'};save();renderShop()}
function canMake(id){const R=RECIPES[id];const lackM=Object.keys(R.mats).filter(k=>(G.mats[k]||0)<R.mats[k]);const lackT=R.tools.filter(t=>!hasTool(t));
 const noWho=R.kind==='weapon'&&!ownChar(R.who);return{ok:!lackM.length&&!lackT.length&&!noWho,lackM,lackT,noWho}}
function prodFx(R,mul){return R.kind==='gen'?`${ATK[R.impl].type}の攻撃　威力 ×${mul}`:R.kind==='armor'?ARMOR_FX[R.slot].d(mul):`${CHARS[R.who].name}の${ATK[R.who].n}の威力 ×${mul}`}
function curProd(R){if(R.kind==='gen'){const g=G.gen&&G.gen[Object.keys(RECIPES).find(k=>RECIPES[k]===R)];return g?`${R.n}（${g.rank}）`:'まだない'}if(R.kind==='armor'){const p=G.arm[R.slot];return p?`${RECIPES[p.rid].n}（${p.rank}）`:'なし'}const m=findOwn(R.who);return m&&m.weapon&&m.weapon.rid?`${RECIPES[m.weapon.rid].n}（${m.weapon.rank}）`:baseWeapon(R.who)}
const TLG={buy:true,have:false,later:false};
function renderShop(){const nRaw=(G.bpRaw||[]).length,tabs=[['make','つくる'],['dec','解読'+(nRaw?`<i class="bpn">${nRaw}</i>`:'')],['tool','工具'],['mat','素材'],['rec','換金所']];
 let h=`<div class="stabs">${tabs.map(([k,n])=>`<button class="stab ${shopTab===k?'on':''}" data-t="${k}">${n}</button>`).join('')}</div>`;
 if(shopTab==='make'||shopTab==='dec')h+=wsListHTML(shopTab);
 if(shopTab==='tool'){h+=`<div class="note">工具は何度でも使える。使うほど<b>練度</b>が上がって、その工具を使う加工が楽になる（Lv1〜${TLV_XP.length}）。基本の工具は店で買える。溶接機・旋盤などの中級の工具は、塔の資材の箱で見つかる（ボスを倒すと店にも高い値段で並ぶ）。工具ガチャでも出る。</div><div style="font-weight:800;margin:6px 0">${coinIc(22)} コイン ${G.coin|0}</div>`;
  const tg=t=>G.tools.includes(t)?'have':TOOLS[t].limited||(G.floor|0)<(TOOL_GATE[t]||0)||!TOOLS[t].price?'later':'buy';
  const TG=[['buy','店で買える'],['have','持っている工具'],['later','限定・まだ店にない']];
  h+=TG.map(([gk,gn])=>{const ts=TOOL_ORDER.filter(t=>tg(t)===gk);if(!ts.length)return '';const op=TLG[gk];
   return `<button class="wsgh ${op?'op':''}" data-tlg="${gk}"><b>${gn}</b><small>${ts.length}</small>${gk==='buy'&&ts.some(t=>(G.coin|0)>=TOOLS[t].price)?'<i class="okn">買える</i>':''}<em>${op?'▾':'▸'}</em></button>`+(op?`<div class="wsgb">`+(gk==='have'?ts.map(t=>`<div class="tlr">${MIC(t,28)}<b>${TOOLS[t].n}</b>${TOOLS[t].limited?'<span class="lim">限定</span>':''}<span class="tll">${tlvHTML(t)}</span></div>`).join(''):ts.map(t=>{const T=TOOLS[t],has=false;return `<div class="rcp"><div class="rh">${MIC(t,34)}<div style="flex:1"><b>${T.n}</b>${T.limited?' <span class="lim">限定</span>':''}${has?'　<span class="tag tg-ok">持っている</span>':''}<div class="note">${T.d}</div>${has?tlvHTML(t):''}</div>
   ${has?'':T.limited?`<div class="note" style="text-align:right;max-width:130px">工具ガチャだけで出る限定工具</div>`:(G.floor|0)<(TOOL_GATE[t]||0)?`<div class="note" style="text-align:right;max-width:130px">🔒 塔の箱で見つかる。${TOOL_GATE[t]}階のボスを倒すと店にも並ぶ</div>`:T.price?`<div style="text-align:right"><button class="btn" data-buy="${t}" ${(G.coin|0)<T.price?'disabled':''} style="width:auto;margin:0;padding:10px 14px;font-size:15px">${coinIc(18)}${T.price}で買う</button>${T.where?`<div class="note" style="max-width:130px;margin-top:4px">${T.where}でも見つかる</div>`:''}</div>`:''}</div></div>`}).join(''))+'</div>':'')}).join('')}
 if(shopTab==='rec')h+=recycleHTML();
 if(shopTab==='mat'){h+=`<div class="note">素材は塔の中で、錆の魔物を倒したり資材の箱をあけたりして集める。</div>`+MAT_ORDER.map(k=>`<div class="itr">${MIC(k,40)}<div class="itn"><b>${MATS[k].n}</b><small>${MATS[k].d}</small></div><span class="itc ${G.mats[k]?'':'z'}">×${G.mats[k]}</span></div>`).join('')}
 $('shopBody').innerHTML=h;
 $('shopBody').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{shopTab=b.dataset.t;renderShop()});
 $('shopBody').querySelectorAll('[data-mk]').forEach(b=>b.onclick=()=>openRecipe(b.dataset.mk));
 $('shopBody').querySelectorAll('[data-rc]').forEach(b=>b.onclick=()=>recycleAsk(b.dataset.rc));
 $('shopBody').querySelectorAll('[data-wsk]').forEach(b=>b.onclick=()=>{WS.kind=b.dataset.wsk;renderShop()});
 $('shopBody').querySelectorAll('[data-wss]').forEach(b=>b.onclick=()=>{WS.sort=b.dataset.wss;renderShop()});
 $('shopBody').querySelectorAll('[data-wsg]').forEach(b=>b.onclick=()=>{WS.open=WS.open||new Set();const k=b.dataset.wsg;WS.open.has(k)?WS.open.delete(k):WS.open.add(k);renderShop()});
 $('shopBody').querySelectorAll('[data-tlg]').forEach(b=>b.onclick=()=>{TLG[b.dataset.tlg]=!TLG[b.dataset.tlg];renderShop()});
 $('shopBody').querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>decodeBp(b.dataset.dec));
 $('shopBody').querySelectorAll('.bpgo').forEach(b=>b.onclick=()=>{shopTab='dec';renderShop()});
 $('shopBody').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const t=b.dataset.buy,T=TOOLS[t];if(G.tools.includes(t)||(G.coin|0)<T.price||(G.floor|0)<(TOOL_GATE[t]||0))return;G.coin-=T.price;G.tools.push(t);save();tone(880,.15,'triangle',.1,1320);renderShop();say(`${MIC(t,30)} ${T.n}を買った！`,1000)})}
let crafting=false;
async function makeProduct(id){const R=RECIPES[id];if(crafting||!canMake(id).ok)return;crafting=true;try{
 const procs=procsOf(R),r={score:0,reach:1},sc=[];let shape=null;
 for(let i=0;i<procs.length;i++){const x=await runProc(R,procs[i],procs.length>1?['①','②','③'][i]+' ':'');sc.push(x.score);r.reach=Math.min(r.reach,x.reach==null?1:x.reach);if(x.shape)shape=x.shape}
 r.score=Math.round(sc.reduce((a,b)=>a+b,0)/sc.length);r.shape=shape;const ls=r.score;
 const tb=toolBonus(R),q=Math.min(100,Math.floor((r.score+ls)/2)+tb);let rank=craftRank(q,r.reach),extra=[];
 if(hasLim('micro')&&Math.random()<.1&&rank!=='SS'&&rank!=='S'){rank=RANK_ORDER[RANK_ORDER.indexOf(rank)+1];extra.push(`${MIC('micro',18)}マイクロメータ：出来ばえが1段上がった！`)}
 const mul=+(prodMul(R.tier,rank)*(R.boost||1)*(1+.03*((G.bpPlus||{})[id]||0))).toFixed(2);const txp=toolXpGain(R,q);
 /* 素材は結果が決まったここで引く。装備を選ぶ前に読み込み直しても、作った製品は G.pendCraft に残る */
 Object.keys(R.mats).forEach(k=>G.mats[k]-=R.mats[k]);if(hasLim('ratchet')&&Math.random()<.2){const k=pick(Object.keys(R.mats));G.mats[k]++;extra.push(`${MIC('ratchet',18)}ラチェットレンチ：${MATS[k].n}が1つもどった`)}G.pendCraft={rid:id,rank,mul,ds:r.score,ls:null,parts:sc,reach:r.reach,shape:r.shape||null,attr:R.kind==='weapon'?rollAttr(rank):R.kind==='gen'?genAttr(R,rank):null,grind:procs.length===1&&procs[0]==='grind',tb,txp:[...extra,txp].filter(Boolean).join('<br>')};save();showCraftResult(G.pendCraft)}finally{crafting=false}}
function showCraftResult(pc){const R=RECIPES[pc.rid];if(!R){delete G.pendCraft;save();openShop();return}
 const who=R.kind==='weapon'?findOwn(R.who):null;if(R.kind==='weapon'&&!who){delete G.pendCraft;save();openShop();return}
 $('result').classList.remove('fres');
 $('resP').innerHTML=`<div style="text-align:center">${RIC(pc.rid,72)}<div style="margin:2px 0">${RKIC(pc.rank,84)}</div><b>${R.n}</b>
  ${pc.shape?shapeImg(pc.shape,200):''}${pc.attr?`<div class="note" style="margin:4px 0">属性：${attrTxt(pc.attr)}</div>`:''}<div class="note">${pc.grind?'形の一致 '+pc.ds+'%':(pc.parts&&pc.parts.length>1?procsOf(R).map((p,i)=>PROC_LBL[p]+' '+pc.parts[i]).join('・')+'　平均 '+pc.ds:PROC_LBL[procOf(R)]+' '+pc.ds)}　→　${prodFx(R,pc.mul)}${pc.reach<1&&pc.rank!=='SS'?'<br>（SS は、加工を最後までやりきったときだけ）':''}</div>
  ${pc.tb?`<div class="note">工具の練度ボーナス +${pc.tb}点</div>`:''}${pc.txp?`<div class="txp">${pc.txp}</div>`:''}<div class="note">今の装備：${curProd(R)}</div></div>`;
 const done=eq=>{if(!G.pendCraft)return;if(!eq)invStore(pc,who);else{const p={rid:pc.rid,rank:pc.rank,mul:pc.mul};if(R.kind==='gen')genGet(pc);else if(R.kind==='armor'){invPut(G.arm[R.slot],R.slot);G.arm[R.slot]=p}else{const J=JOBS[who.job];invPutW(who);who.weapon={name:R.n+'（'+pc.rank+'）',k:J.uses,v:Math.round(pc.mul*5),bv:Math.round(pc.mul*5),plus:0,rank:pc.rank,tier:R.tier,rid:pc.rid,mul:pc.mul,shape:pc.shape||null,attr:pc.attr||null}}}
  delete G.pendCraft;save();openShop()};
 $('resBtns').innerHTML='';addBtn('装備する',()=>done(true),'gold');addBtn('しまっておく（あとで編成で装備できる）',()=>done(false),'ghost');show('result')}

/* ===================== パーティ（出撃キャラ・装備） ===================== */
function miniHTML(m){const c=CHARS[m.id];return `<div class="mini ${m.id===G.lead?'lead':''}"><img src="${c.img}" alt=""><div class="t">${c.name}${m.id===G.lead?'<span class="ld">出撃</span>':''}<div class="note" style="font-size:11px;line-height:1.3">${ATK[m.id]?TIC(ATK[m.id].type,14)+ATK[m.id].type:''}・×${wMul(m)}</div></div></div>`}
function _m1_renderParty(){const arm=['head','body','feet'].map(s=>{const p=G.arm[s];return `<div class="itr">${MIC(s,36)}<div class="itn"><b>${SLOT_NAME[s]}：${p?RECIPES[p.rid].n+'（'+p.rank+'）':'なし'}</b><small>${p?ARMOR_FX[s].d(p.mul):'工房で防具をつくると装備できる'}</small></div></div>`}).join('');
 $('partyList').innerHTML=`<div class="panel"><b>防具（全員に効く）</b>${arm}</div>`+G.party.map(m=>{const c=CHARS[m.id],A=ATK[m.id],w=m.weapon;
  return `<div class="panel"><div class="mem"><img src="${c.img}" alt=""><div style="flex:1"><b style="font-size:17px">${c.name}</b>${m.id===G.lead?'　<span class="tag tg-eq">出撃キャラ</span>':''}
   <div class="note">攻撃：${TIC(A.type,20)} <b>${A.n}</b>（${A.type}）<br>${A.d[0]}<br>武器：${w&&w.rid?RECIPES[w.rid].n+'（'+w.rank+'）　威力×'+w.mul:baseWeapon(m.id)+'　威力×1'}</div></div></div>
   ${m.id===G.lead?'<div class="note">町の外で走るキャラ。攻撃は最初からLv2。</div>':`<button class="btn ghost" data-lead="${m.id}" style="margin:6px 0 0">出撃キャラにする</button>`}</div>`}).join('')+
  `<div class="note">町の外では、出撃キャラだけが走る。ほかの仲間は一緒には走らず、攻撃だけが飛んでくる。レベルアップのたびに、だれの攻撃を強くするか選ぶ。</div>`;
 $('partyList').querySelectorAll('[data-lead]').forEach(b=>b.onclick=()=>{G.lead=b.dataset.lead;save();renderParty();say(`${CHARS[G.lead].name}が出撃キャラになった`,900)})}
function openItems(){const row=(ic,n,cnt,d)=>`<div class="itr">${ic}<div class="itn"><b>${n}</b><small>${d}</small></div><span class="itc ${cnt?'':'z'}">×${cnt}</span></div>`;
 $('sheetT').innerHTML=`${IC('bag',30)} 持ちもの`;
 $('sheetB').innerHTML=`<div class="note"><b>素材</b></div>`+MAT_ORDER.map(k=>row(MIC(k,40),MATS[k].n,G.mats[k],MATS[k].d)).join('')+
  `<div class="note" style="margin-top:8px"><b>工具</b>　${G.tools.map(t=>MIC(t,20)+TOOLS[t].n).join('・')}</div>`+
  `<div class="note" style="margin-top:6px"><b>図面</b>　${G.bps.map(b=>'「'+RECIPES[b].n+'」').join('')}</div>`+
  `<button class="btn" style="margin-top:10px" onclick="closeSheet()">とじる</button>`;
 $('sheetB').scrollTop=0;$('sheet').classList.add('on')}
function openHelp(){talk([[null,'説明','ホームの「出撃」で、マイスターの塔を登る。階段を見つけると、そのまま上の階へ。ボスを倒したら、続けて登るかホームへ帰るかを選べる。同じ階に長くいると錆が濃くなり、敵が増えていく。さらに25秒ごとに「錆Lv」が上がり、敵のHPと攻撃がどんどん強くなる。もらえる経験値もだんだん減る。1つの階にいられるのは5分まで。5分をこえると「錆の大波」でHPがけずれ続ける。工房で武器・防具づくり、編成でパーティ、ガチャで仲間集め。'],
 [null,'説明','塔の中では、出撃キャラを指で動かす。攻撃は自動。はじめは出撃キャラの技だけ。'],
 [null,'説明','各層で、お助け仲間（下層：ギアフォックス、中層：ドド先輩、上層：ホー博士、試作の層：チュータ、発電の層：ボルトゴリラ、空の層：セブンティーン→ツキヨ）に会える。その挑戦の間だけ一緒に戦ってくれる。パーティにいるときは技が強化される。'],
 [null,'説明','技が最大Lvで、その技の武器がSランク以上なら覚醒できる（威力1.5倍）。組み合わせの2人がどちらも覚醒して、2人の絆のチャットを読んでいれば絆覚醒（合体の動き）。組み合わせはチャットの「絆覚醒」で見られる。磁石を拾うと、まわりの経験値を全部集める。'],
 [null,'説明','階段には鍵がかかっている。その階の強敵が鍵を持っているので、たおしてから階段へ。上の階ほど敵が強い。ボスを倒すと「ボスの宝箱」から強化とコインが出る。途中で「ひと休み」を押すと、いまの技と能力を確かめられる。出撃画面の「推奨戦力」とチームの攻撃をくらべよう。'],
 [null,'説明','攻撃は装備した武器で決まる。はじめは出撃キャラの専用武器の技だけ。レベルアップすると、パーティの仲間の技と、装備した汎用武器（2つまで）の技が NEW で出てくる。パーティ（5人）の仲間は、能力（パッシブ）で助けてくれる。'],
 [null,'説明','倒した錆や資材の箱から、素材と図面が手に入る。途中で帰っても全部持ち帰れるが、力つきると素材は半分になる。'],
 [null,'説明','工房では「素材＋工具＋図面」がそろうと加工できる。工具は工房で買うか、塔の中で見つける。なぞりの出来ばえで強さが決まる。']])}
function signLines(){return [[null,'看板','↑ 古い工房（武器・防具づくり、工具）\n↓ 渦の門（マイスターの塔の入口。錆が出るので注意）'],[null,'看板',`塔の${G.floor|0}階まで突破。次は ${nextFloor()}階「${FLOORS[nextFloor()].n}」`]]}
function openDest(){show('dest');const best=G.floor|0,pts=startPoints();
 $('destList').innerHTML=`<div class="note" style="margin-bottom:6px">階段には鍵がかかっている。強敵をたおすと鍵が手に入り、そのまま上の階へ進める。ボスの階を倒したら、続けて登るかホームへ帰るかを選べる。同じ階に長くいると錆が濃くなり、敵が増えていく。さらに25秒ごとに「錆Lv」が上がり、敵のHPと攻撃がどんどん強くなる。もらえる経験値もだんだん減る。1つの階にいられるのは5分まで。5分をこえると「錆の大波」でHPがけずれ続ける。</div>`+
  [17,14,11,7,4,1].map(s=>{const F=FLOORS[s],open=pts.includes(s),bossF={1:3,4:6,7:10,11:13,14:16,17:20}[s],done=best>=bossF,reach=Math.min(best,bossF);
   const st=!open?`${s-1}階のボスを倒すと開く`:done?`${UIMG('n_boss',16)}ボス撃破`:reach>=s?`${reach}Fまで到達`:'まだ入っていない';
   return `<button class="flr ${open&&s===bestStart()?'next':''} ${open?'':'lock'}" data-f="${s}" ${open?'':'disabled'}><span class="fn">${s}F</span><span class="ft"><b>${LAYER_NAME[F.area]}　${s}F〜${bossF}F</b><small>${st}</small><span class="drec ${teamPow()>=REC_POW[bossF]?'ok':teamPow()>=REC_POW[s]?'mid':'ng'}">推奨戦力 ${REC_POW[s]}〜${REC_POW[bossF]}　いま ${teamPow()}</span><span class="dmats">${Array.from({length:bossF-s+1},(_,i)=>s+i).map(f=>`<i>${f}F ${matIcons(f,15)}</i>`).join('')}</span></span><span class="fs">${open?UIMG(done?'n_floor':'n_unlock',26)+'出撃':UIMG('n_unlock',26)+'未'}</span></button>`}).join('')+
  `<div class="note" style="text-align:center;margin-top:8px">最高到達：${best}F　／　${TOP_FLOOR}F</div>`;
 $('destList').querySelectorAll('[data-f]:not([disabled])').forEach(b=>b.onclick=()=>goFloor(+b.dataset.f))}
async function goFloor(f){audio();if(TW)TW.busy=true;const F=FLOORS[f],k=F.area;G.area=k;save();await say(`${IC('gate',28)} 塔の${f}階へ……`,700);
 if(!G.flags['ai_'+k]&&F.step===0){await talk(AREA_INTRO[k]);G.flags['ai_'+k]=1;save()}startFloor(f)}
const goArea=k=>goFloor({alley:1,factory:4,under:7}[k]||1);
