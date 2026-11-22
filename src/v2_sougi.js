/* ===================== 第3章「創技の塔」（1〜20F）：黄金の港町 =====================
 * 特許の図面がしまわれた「技の保管庫」の塔。敵は無限の塔からしみ出したゆがみ。
 * 層：1〜3 発動機／4〜6 計器／7〜9 古図／10 保管庫の扉（ノクス）／11〜13 炉と砥石／14〜16 光と雷／17〜19 大ドック／20 黄金の登録所（アウルム）
 * ver3.0.0 で公開（S_LIVE=true）。?sougi は無限の塔50Fクリアの前でも入れるテスト用の入口として残す。
 * 仲間（vol.3）の技・ガチャは ②、工房（新しい加工・特許の図面・アウル・スコープ）は ③ で足す */
const S_TEST=/[?&]sougi\b/.test(location.search);
const S_LIVE=true;  /* ver3.0.0（2026-11-20）で公開 */
/* vol.3 の10人（②で技とガチャを足す。いまは会話に出るだけ） */
var VOL3=['raika','tsubasa','shiranagi','safegear','gennou','raiga','kuromio','shion','pukari','sakamata'];
Object.assign(CHARS,{
 raika:    {name:'ライカ',      img:'img/raika.webp',    job:'kaji',  pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['昨日まで走ってたのよ。']},
 tsubasa:  {name:'つばさ',      img:'img/tsubasa.webp',  job:'hozen', pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'me'},lines:['直しても直しても、三日で同じとこが壊れるの！']},
 shiranagi:{name:'シラナギ',    img:'img/shiranagi.webp',job:'denki', pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'de'},lines:['異常の音がしない。なのに、この子は弱っている。']},
 safegear: {name:'セーフ・ギア',img:'img/safegear.webp', job:'hozen', pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'me'},lines:['指差シ確認、ヨシ。']},
 gennou:   {name:'ゲンノウ',    img:'img/gennou.webp',   job:'sekkei',pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['頭は忘れても、手は覚えとるらしい。']},
 raiga:    {name:'雷牙',        img:'img/raiga.webp',    job:'kaji',  pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['オレの焼き入れは、鉄を鋼にする。']},
 kuromio:  {name:'クロミオ',    img:'img/kuromio.webp',  job:'senban',pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'ma'},lines:['……影まで映る面に、仕上げる。']},
 shion:    {name:'シオン',      img:'img/shion.webp',    job:'denki', pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'yami'},lines:['こんこん。わたしの狐火はね、鉄だって切っちゃうの。']},
 pukari:   {name:'ぷかり',      img:'img/pukari.webp',   job:'denki', pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'de'},lines:['ぴりぴり……さわらないで、けずるの。']},
 sakamata: {name:'サカマタ',    img:'img/sakamata.webp', job:'kaji',  pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'ch'},lines:['オレが最強だっつってんだろ！']},
 aurum:    {name:'アウルム',    img:'img/aurum.webp',    job:'sekkei',pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},lines:['図面を置いていけ。名前は、わしが書く。']},
 nox:      {name:'ノクス',      img:'img/nox.webp',      job:'sekkei',pass:{n:'',d:'',k:''},sp:{n:'',d:'',shape:'yami'},lines:['……帰れ。ここで渡せる図面はない。']}});
[...VOL3,'aurum','nox'].filter(id=>!['shion','tsubasa'].includes(id)).forEach(id=>{FACES[id]=['smile','worry','serious']});  /* 3.2.2：シオンとツバサは表情の絵がまだないので、顔アイコンを使う */

const SFLOORS=[null,
 {n:'止まった発動機',area:'s1',step:0,stair:1500},
 {n:'整備場',        area:'s1',step:1,stair:1600},
 {n:'ピストンの間',  area:'s1',step:2,boss:true},
 {n:'計器の廊下',    area:'s2',step:0,stair:1550},
 {n:'警報の部屋',    area:'s2',step:1,stair:1650},
 {n:'針の間',        area:'s2',step:2,boss:true},
 {n:'古図の棚',      area:'s3',step:0,stair:1600},
 {n:'書きかわる回廊',area:'s3',step:1,stair:1700},
 {n:'ただよう図面の間',area:'s3',step:2,boss:true},
 {n:'保管庫の扉',    area:'s4',step:3,boss:true},
 {n:'炉の間',        area:'s5',step:0,stair:1650},
 {n:'砥石の間',      area:'s5',step:1,stair:1750},
 {n:'るつぼの底',    area:'s5',step:2,boss:true},
 {n:'紫光の回廊',    area:'s6',step:0,stair:1700},
 {n:'火花の間',      area:'s6',step:1,stair:1800},
 {n:'雷の水槽',      area:'s6',step:2,boss:true},
 {n:'大ドック',      area:'s7',step:0,stair:1750},
 {n:'組み立て台',    area:'s7',step:1,stair:1850},
 {n:'ガントリーの下',area:'s7',step:2,boss:true},
 {n:'黄金の登録所',  area:'s8',step:3,boss:true}];
Object.assign(LAYER_NAME,{s1:'発動機の層',s2:'計器の層',s3:'古図の層',s4:'保管庫',s5:'炉と砥石の層',s6:'光と雷の層',s7:'大ドックの層',s8:'登録所'});
Object.assign(AREAS,{
 s1:{n:'発動機の層',  need:null,lv:'',bossLv:0,tier:4,boss:'pistron',   bg:'#1a1712'},
 s2:{n:'計器の層',    need:null,lv:'',bossLv:0,tier:4,boss:'alarmga',   bg:'#1a1414'},
 s3:{n:'古図の層',    need:null,lv:'',bossLv:0,tier:4,boss:'zumendra',  bg:'#16161e'},
 s4:{n:'保管庫',      need:null,lv:'',bossLv:0,tier:4,boss:'s_nox',     bg:'#0e1020'},
 s5:{n:'炉と砥石の層',need:null,lv:'',bossLv:0,tier:4,boss:'rutsuborn', bg:'#1e130c'},
 s6:{n:'光と雷の層',  need:null,lv:'',bossLv:0,tier:4,boss:'sparkurage',bg:'#150f22'},
 s7:{n:'大ドックの層',need:null,lv:'',bossLv:0,tier:4,boss:'gantrion',  bg:'#14161a'},
 s8:{n:'登録所',      need:null,lv:'',bossLv:0,tier:4,boss:'s_aurum',   bg:'#1c160a'}});
/* 敵：ゆがみの魔物。強さは第2章の頂上の少し上から始まる */
Object.assign(FFOE,{
 boltworm:   {hp:40, spd:1.1,dmg:14,xp:4,r:17,dash:230},
 gearrat:    {hp:32, spd:2.0,dmg:13,xp:4,r:15},
 metereye:   {hp:44, spd:.9, dmg:14,xp:5,r:18,fly:1,shoot:220},
 alarmbat:   {hp:36, spd:1.8,dmg:14,xp:4,r:16,fly:1,dash:200},
 paperbird:  {hp:30, spd:1.6,dmg:12,xp:3,r:16,fly:1,split:1},
 inkslime:   {hp:60, spd:.8, dmg:15,xp:5,r:20,split:1},
 sparkimp:   {hp:42, spd:1.4,dmg:15,xp:5,r:17,dash:210},
 moltenslime:{hp:100,spd:.6, dmg:18,xp:7,r:23},
 laserfly:   {hp:38, spd:1.5,dmg:14,xp:5,r:16,fly:1,shoot:190},
 jellydrone: {hp:48, spd:1.0,dmg:14,xp:5,r:19,fly:1,shoot:240},
 rivetcrab:  {hp:110,spd:.7, dmg:18,xp:7,r:23,dash:300},
 beamgull:   {hp:46, spd:1.7,dmg:15,xp:5,r:18,fly:1,dash:220},
 s_bigrat:   {hp:950, spd:.7, dmg:28,xp:36,r:36,big:1,src:'img/foe/gearrat.webp'},
 s_bigcrab:  {hp:1100,spd:.6, dmg:30,xp:38,r:38,big:1,src:'img/foe/rivetcrab.webp'},
 pistron:   {hp:4600,spd:.8, dmg:38,xp:160,r:58,big:1,boss:1,ring:145},
 alarmga:   {hp:4900,spd:.85,dmg:40,xp:170,r:58,big:1,boss:1,ring:135,call:460},
 zumendra:  {hp:5300,spd:1.0,dmg:42,xp:185,r:58,big:1,boss:1,fly:1,ring:125},
 s_nox:     {hp:5800,spd:.95,dmg:44,xp:200,r:56,big:1,boss:1,ring:120,call:520,src:'img/nox.webp'},
 rutsuborn: {hp:6100,spd:.8, dmg:46,xp:210,r:60,big:1,boss:1,ring:115},
 sparkurage:{hp:6500,spd:.9, dmg:47,xp:220,r:60,big:1,boss:1,fly:1,ring:105},
 gantrion:  {hp:7000,spd:.75,dmg:49,xp:240,r:62,big:1,boss:1,ring:100,call:440},
 s_aurum:   {hp:7800,spd:.95,dmg:51,xp:280,r:64,big:1,boss:1,ring:92,call:400,src:'img/aurum.webp'}});
Object.assign(FOES,{
 boltworm:{n:'ボルトワーム',col:'#c8c0b0'},gearrat:{n:'歯車ネズミ',col:'#d0b060'},metereye:{n:'メーターアイ',col:'#e8d8b0'},alarmbat:{n:'警報コウモリ',col:'#e04040'},
 paperbird:{n:'図面バード',col:'#5a7ad0'},inkslime:{n:'インクスライム',col:'#4a3a8a'},sparkimp:{n:'火花小鬼',col:'#ff9a30'},moltenslime:{n:'溶鉄スライム',col:'#ff7a20'},
 laserfly:{n:'レーザーホタル',col:'#b070ff'},jellydrone:{n:'電気クラゲ',col:'#9a7aff'},rivetcrab:{n:'リベットガニ',col:'#b0b4b8'},beamgull:{n:'鉄骨カモメ',col:'#d8d8d0'},
 s_bigrat:{n:'大歯車ネズミ',col:'#d0b060'},s_bigcrab:{n:'リベットガニの親分',col:'#b0b4b8'},
 pistron:{n:'ピストロン',col:'#ffa040'},alarmga:{n:'アラームガ',col:'#ff4040'},zumendra:{n:'ズメンドラ',col:'#6a8ae0'},s_nox:{n:'ノクス',col:'#7a6a9a'},
 rutsuborn:{n:'ルツボーン',col:'#ff8a30'},sparkurage:{n:'スパークラゲ',col:'#c08aff'},gantrion:{n:'ガントリオン',col:'#e07040'},s_aurum:{n:'アウルム',col:'#ffd040'}});
FOE_IMG_OK.push('boltworm','gearrat','metereye','alarmbat','paperbird','inkslime','sparkimp','moltenslime','laserfly','jellydrone','rivetcrab','beamgull','pistron','alarmga','zumendra','rutsuborn','sparkurage','gantrion');
['s_nox','s_aurum'].forEach(k=>FFOE[k].noflip=1);
const SD={scrap:.02,titan:.009,cell:.009,carbon:.009,core:.007};
Object.assign(FAREA,{
 s1:{mix:[[0,['boltworm','gearrat'],1.5],[25,['boltworm','gearrat'],2.2],[70,['gearrat','boltworm','alarmbat'],3],[130,['boltworm','gearrat','alarmbat'],3.7],[200,['gearrat','boltworm','metereye'],4.6]],elite:'s_bigrat',boss:'pistron',drop:SD,chestTool:null,ground:['#1a1712','230,170,90']},
 s2:{mix:[[0,['metereye','alarmbat'],1.5],[25,['metereye','alarmbat','gearrat'],2.2],[70,['alarmbat','metereye','boltworm'],3],[130,['metereye','alarmbat','gearrat'],3.7],[200,['alarmbat','metereye','boltworm'],4.6]],elite:'s_bigrat',boss:'alarmga',drop:SD,chestTool:null,ground:['#1a1414','240,110,90']},
 s3:{mix:[[0,['paperbird','inkslime'],1.4],[25,['paperbird','inkslime'],2.1],[70,['inkslime','paperbird','metereye'],2.9],[130,['paperbird','inkslime','alarmbat'],3.6],[200,['inkslime','paperbird','metereye'],4.5]],elite:'s_bigrat',boss:'zumendra',drop:SD,chestTool:null,ground:['#16161e','120,150,230']},
 s4:{mix:[[0,['inkslime','paperbird','metereye'],1.7],[25,['paperbird','inkslime','alarmbat'],2.5],[70,['inkslime','metereye','boltworm'],3.3],[130,['paperbird','inkslime','gearrat'],4.1],[200,['inkslime','paperbird','alarmbat'],4.9]],elite:'s_bigcrab',boss:'s_nox',drop:SD,chestTool:null,ground:['#0e1020','130,120,200']},
 s5:{mix:[[0,['sparkimp','moltenslime'],1.5],[25,['sparkimp','moltenslime'],2.2],[70,['moltenslime','sparkimp','boltworm'],3],[130,['sparkimp','moltenslime','gearrat'],3.7],[200,['moltenslime','sparkimp','alarmbat'],4.6]],elite:'s_bigcrab',boss:'rutsuborn',drop:SD,chestTool:null,ground:['#1e130c','255,150,60']},
 s6:{mix:[[0,['laserfly','jellydrone'],1.5],[25,['laserfly','jellydrone'],2.2],[70,['jellydrone','laserfly','sparkimp'],3],[130,['laserfly','jellydrone','metereye'],3.8],[200,['jellydrone','laserfly','sparkimp'],4.7]],elite:'s_bigcrab',boss:'sparkurage',drop:SD,chestTool:null,ground:['#150f22','180,120,255']},
 s7:{mix:[[0,['rivetcrab','beamgull'],1.5],[25,['rivetcrab','beamgull'],2.2],[70,['beamgull','rivetcrab','sparkimp'],3],[130,['rivetcrab','beamgull','moltenslime'],3.8],[200,['beamgull','rivetcrab','jellydrone'],4.7]],elite:'s_bigcrab',boss:'gantrion',drop:SD,chestTool:null,ground:['#14161a','200,190,170']},
 s8:{mix:[[0,['gearrat','paperbird','laserfly'],1.7],[25,['metereye','sparkimp','beamgull'],2.5],[70,['rivetcrab','jellydrone','inkslime'],3.3],[130,['moltenslime','alarmbat','laserfly'],4.1],[200,['beamgull','rivetcrab','sparkimp'],4.9]],elite:'s_bigcrab',boss:'s_aurum',drop:SD,chestTool:null,ground:['#1c160a','255,210,90']}});
Object.assign(FLOOR_IMG,{machine:'img/floor/machine.webp',archive:'img/floor/archive.webp',forge:'img/floor/forge.webp'});
Object.assign(FLOOR_TINT,{s1:['machine','rgba(0,0,0,.05)'],s2:['machine','rgba(160,30,20,.14)'],s3:['archive','rgba(0,0,0,.05)'],s4:['archive','rgba(20,30,80,.32)'],
 s5:['forge','rgba(0,0,0,.05)'],s6:['forge','rgba(90,40,160,.24)'],s7:['forge','rgba(40,50,60,.22)'],s8:['archive','rgba(200,150,30,.20)']});
TW_TABLE.sougi={
 FLOORS:SFLOORS,
 FLOOR_MATS:{1:['titan','scrap'],2:['cell','scrap'],3:['carbon','titan'],4:['titan','cell'],5:['cell','carbon'],6:['carbon','titan'],7:['titan','cell'],8:['cell','carbon'],9:['carbon','titan'],10:['titan','core'],11:['cell','carbon'],12:['carbon','titan'],13:['titan','cell'],14:['cell','carbon'],15:['carbon','titan'],16:['titan','cell'],17:['cell','carbon'],18:['carbon','titan'],19:['titan','cell'],20:['core','carbon']},
 BOSS_HP:{3:3.6,6:3.8,9:4,10:4.4,13:4.6,16:4.8,19:5,20:5.6},
 /* 推奨の強さ：審判の塔の頂上（≒5350）の少し上から。20Fで≒8000 */
 REC_POW:Object.fromEntries(Array.from({length:20},(_,i)=>{const h=FSCALE(46+(i+1)*1.5).hp/FSCALE(20).hp;return[i+1,Math.round(2200*h/50)*50]})),
 HELPER_FL:{},FLOOR_LINES:{},
 START_LV:{1:24,4:26,7:28,11:30,14:32,17:34},
 feff:f=>46+(f||1)*1.5};
TOWERS.sougi={n:'創技の塔',ready:S_LIVE,soon:'近日公開',go:()=>{enterTower('sougi');openDest()}};
{const p=WMAP.places.find(q=>q.k==='sougi');if(p)Object.assign(p,{tw:'sougi',d:'登録された技の図面がしまわれた「技の保管庫」の塔。新しい技を生み出す「創成の陣」が刻まれている。第3章の舞台。',
 open:()=>S_TEST||(S_LIVE&&!!(G.flags&&G.flags.inf50))})}

/* 長居の上限：名前と演出だけ「ゆがみ」に */
const S_BANNER={'錆の大波が近づいている…… あと1分でこの階は錆にのまれる':'ゆがみが大きくなっている…… あと1分でこの階はゆがみにのまれる',
 '錆の大波！ この階はもう持たない':'ゆがみの大波！ 図面の線がくずれていく',
 '錆が濃くなってきた…… 長居すると敵がどんどん強くなる':'ゆがみが濃くなってきた…… 長居すると敵がどんどん強くなる'};
{const _b=fBanner;fBanner=function(t,...a){if(towerAt()==='sougi'){if(S_BANNER[t])t=S_BANNER[t];else t=String(t).replace(/錆Lv/g,'ゆがみLv')}return _b(t,...a)}}
{const _o=openDest;openDest=function(){const r=_o.apply(this,arguments);if(towerAt()==='sougi'){const n=document.querySelector('#destList .note');if(n)n.innerHTML=n.innerHTML.replace('錆が濃くなり','ゆがみが濃くなり').replace(/錆Lv/g,'ゆがみLv').replace(/「錆の大波」/g,'「ゆがみの大波」').replace(/錆の大波/g,'ゆがみの大波')}return r}}
/* 会話でボスが話すとき、敵の絵を出す */
['pistron','alarmga','zumendra','rutsuborn','sparkurage','gantrion'].forEach(k=>{TALK_FOE[FOES[k].n]=k});
/* アウル・スコープを持っているか（③の工房で作る。いまはまだ作れない） */
const hasScope=()=>!!(G&&((G.flags&&G.flags.owlscope)||(typeof genEqList==='function'&&genEqList().includes('pt_scope'))));
