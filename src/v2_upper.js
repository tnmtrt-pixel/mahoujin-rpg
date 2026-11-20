/* ===================== 後編：塔の11〜20F（試作の層・発電の層・空の層・頂上） =====================
   階の名前はサイコロ版「マイスターの塔」と同じ。新しい敵は、今の敵の絵に色をつけたもの（あとで専用の絵に差しかえる）
   ボスは監視ドローン「空」の一番機（青）・二番機（黄）・三番機（赤）と、20Fの匠空 */

/* ---------- 階 ---------- */
FLOORS.push(
 {n:'試作室',area:'proto',step:0,stair:1300},
 {n:'鍛造場',area:'proto',step:1,stair:1450},
 {n:'制御室',area:'proto',step:2,boss:true},
 {n:'研究所',area:'power',step:0,stair:1400},
 {n:'精密測定室',area:'power',step:1,stair:1550},
 {n:'発電所',area:'power',step:2,boss:true},
 {n:'設計局',area:'sky',step:0,stair:1500},
 {n:'嵐の展望台',area:'sky',step:1,stair:1650},
 {n:'星見の回廊',area:'sky',step:2,boss:true},
 {n:'天空の工房',area:'top',step:3,boss:true});
Object.assign(LAYER_NAME,{proto:'試作の層',power:'発電の層',sky:'空の層',top:'頂上'});
Object.assign(AREAS,{
 proto:{n:'試作の層',need:null,lv:'',bossLv:0,tier:3,boss:'drone1',bg:'#10222a'},
 power:{n:'発電の層',need:null,lv:'',bossLv:0,tier:3,boss:'drone2',bg:'#22200e'},
 sky:  {n:'空の層',  need:null,lv:'',bossLv:0,tier:3,boss:'drone3',bg:'#1a1430'},
 top:  {n:'頂上',    need:null,lv:'',bossLv:0,tier:3,boss:'sorab', bg:'#0e1430'}});
Object.assign(FLOOR_MATS,{11:['spring','brass'],12:['plate','brass'],13:['board','gear'],14:['oil','board'],15:['brass','spring'],16:['wire','board'],17:['board','brass'],18:['wire','spring'],19:['brass','board'],20:['board','core']});
Object.assign(BOSS_HP,{13:3.4,16:3.8,19:4.2,20:4.6});
Object.assign(REC_POW,{11:1650,12:1700,13:1750,14:1800,15:1850,16:1900,17:1950,18:2000,19:2050,20:2200});

/* ---------- 敵：base＝もとの絵、tint＝色。dash＝ときどき突進、shoot＝弾を撃つ、split＝倒すと2つに分かれる ---------- */
Object.assign(FFOE,{
 mold: {hp:30, spd:.85,dmg:12,xp:3,r:20,base:'slime',tint:'#2fd6c6',split:1},
 cog:  {hp:34, spd:1.7,dmg:13,xp:3,r:17,base:'pipe', tint:'#ffcf4a'},
 anvil:{hp:95, spd:.62,dmg:17,xp:6,r:26,base:'armor',tint:'#ff6a2a',dash:260},
 spark:{hp:28, spd:1.3,dmg:11,xp:3,r:16,fly:1,base:'lamp',tint:'#fff04a',shoot:230},
 coil: {hp:44, spd:1.0,dmg:13,xp:4,r:20,base:'gear', tint:'#6aff6a',dash:220},
 lens: {hp:48, spd:1.1,dmg:14,xp:5,r:18,fly:1,base:'ghost',tint:'#5aa8ff',shoot:200},
 wing: {hp:36, spd:1.8,dmg:13,xp:4,r:16,fly:1,base:'crow',tint:'#b07cff',dash:200},
 golem3:{hp:850,spd:.58,dmg:26,xp:32,r:38,big:1,base:'golem2',tint:'#3fd0ff'},
 arm2:  {hp:950,spd:.64,dmg:27,xp:34,r:36,big:1,base:'arm',   tint:'#ffe14a'},
 golem4:{hp:1050,spd:.62,dmg:28,xp:36,r:38,big:1,base:'golem2',tint:'#b07cff'},
 drone1:{hp:4200,spd:.9, dmg:36,xp:150,r:54,big:1,boss:1,fly:1,drone:'#4aa8ff',ring:150},
 drone2:{hp:4800,spd:.95,dmg:40,xp:170,r:56,big:1,boss:1,fly:1,drone:'#ffd23a',ring:130},
 drone3:{hp:5400,spd:1.0,dmg:44,xp:190,r:58,big:1,boss:1,fly:1,drone:'#ff4a4a',ring:115},
 sorab: {hp:6400,spd:1.0,dmg:46,xp:240,r:60,big:1,boss:1,src:'img/sora.webp',ring:100,call:420,callFoe:'wing',callMsg:'匠空がドローンを呼んだ！'}});
Object.assign(FOES,{
 mold:{n:'試作の錆',col:'#2fd6c6'},cog:{n:'歯車の錆',col:'#ffcf4a'},anvil:{n:'鍛造の錆',col:'#ff6a2a'},spark:{n:'火花の錆',col:'#fff04a'},
 coil:{n:'コイルの錆',col:'#6aff6a'},lens:{n:'レンズの錆',col:'#5aa8ff'},wing:{n:'嵐の錆',col:'#b07cff'},
 golem3:{n:'試作の巨錆',col:'#3fd0ff'},arm2:{n:'発電の巨腕',col:'#ffe14a'},golem4:{n:'嵐の巨錆',col:'#b07cff'},
 drone1:{n:'監視ドローン 空・一番機',col:'#4aa8ff'},drone2:{n:'監視ドローン 空・二番機',col:'#ffd23a'},drone3:{n:'監視ドローン 空・三番機',col:'#ff4a4a'},sorab:{n:'匠空',col:'#3a6ad8'}});
Object.assign(FAREA,{
 proto:{mix:[[0,['mold'],1.4],[25,['mold','cog'],2.1],[70,['mold','cog','anvil'],2.9],[130,['anvil','mold','cog'],3.6],[200,['mold','cog','anvil'],4.5]],
        elite:'golem3',boss:'drone1',drop:{scrap:.02,spring:.014,brass:.012,core:.004},chestTool:'drill',ground:['#16262a','60,170,170']},
 power:{mix:[[0,['spark'],1.3],[25,['spark','coil'],2],[70,['spark','coil','lens'],2.8],[130,['coil','lens','spark'],3.5],[200,['spark','coil','lens'],4.4]],
        elite:'arm2',boss:'drone2',drop:{scrap:.02,wire:.016,board:.012,core:.004},chestTool:'solder',ground:['#26240e','200,180,60']},
 sky:  {mix:[[0,['wing'],1.4],[25,['wing','lens'],2.1],[70,['wing','lens','anvil'],2.9],[130,['anvil','wing','spark'],3.6],[200,['wing','lens','anvil'],4.5]],
        elite:'golem4',boss:'drone3',drop:{scrap:.02,brass:.014,board:.014,core:.005},chestTool:'lathe',ground:['#1c1630','140,100,220']},
 top:  {mix:[[0,['wing','lens'],1.6],[25,['wing','lens','spark'],2.4],[70,['anvil','wing','lens'],3.2],[130,['anvil','wing','spark'],4],[200,['wing','lens','anvil'],4.8]],
        elite:'golem4',boss:'sorab',drop:{scrap:.02,board:.014,core:.006},chestTool:null,ground:['#101830','90,120,220']}});

/* ---------- 床：下の層の床の絵に色をかさねる ---------- */
const FLOOR_TINT={proto:['factory','rgba(40,170,180,.30)'],power:['under','rgba(230,200,40,.24)'],sky:['under','rgba(130,80,230,.32)'],top:['alley','rgba(30,50,160,.40)']};
{const _g=groundFor;groundFor=function(k){const T=FLOOR_TINT[k];if(!T)return _g(k);if(fGround[k])return fGround[k];
 const fi=img(FLOOR_IMG[T[0]]);if(fi&&fi.complete&&fi.naturalWidth){const c=document.createElement('canvas');c.width=c.height=360;const g=c.getContext('2d');g.drawImage(fi,0,0,360,360);g.fillStyle=T[1];g.fillRect(0,0,360,360);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,360,360);return fGround[k]=fcv().getContext('2d').createPattern(c,'repeat')}
 return groundTmp(k)}}

/* ---------- 敵の絵：色つき・ドローン・匠空 ---------- */
function droneSpr(col,size){const S=Math.round(size*2),c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),m=S/2,R=S*.36;
 g.strokeStyle='#3a4250';g.lineWidth=S*.05;g.lineCap='round';
 for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){g.beginPath();g.moveTo(m,m);g.lineTo(m+sx*R*.8,m+sy*R*.8);g.stroke()}
 for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=m+sx*R*.8,y=m+sy*R*.8;g.fillStyle='rgba(200,220,240,.25)';g.beginPath();g.ellipse(x,y,S*.16,S*.06,0,0,TAU);g.fill();g.fillStyle='#2a303a';g.beginPath();g.arc(x,y,S*.03,0,TAU);g.fill()}
 g.fillStyle='#d9dee6';g.strokeStyle='#5a6270';g.lineWidth=S*.02;g.beginPath();g.arc(m,m,S*.2,0,TAU);g.fill();g.stroke();
 const gr=g.createRadialGradient(m,m+S*.02,0,m,m+S*.02,S*.12);gr.addColorStop(0,'#fff');gr.addColorStop(.35,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(m,m+S*.02,S*.12,0,TAU);g.fill();
 g.fillStyle='#2a303a';g.font=`900 ${Math.round(S*.09)}px sans-serif`;g.textAlign='center';g.fillText('空',m,m-S*.1);return c}
/* 専用の絵がある敵（色ぬりの仮の絵は使わない） */
const FOE_IMG_OK=['mold','cog','anvil','spark','coil','lens','wing','golem3','arm2','golem4','drone1','drone2','drone3'];
['drone1','drone2','drone3'].forEach(k=>FFOE[k].noflip=1);
{const _f=fspr;fspr=function(src,size){const mm=/^img\/foe\/(\w+)\.webp$/.exec(src),F=mm&&FFOE[mm[1]];if(!F||!(F.base||F.drone||F.src)||FOE_IMG_OK.includes(mm[1]))return _f(src,size);
 if(F.src)return _f(F.src,size);const key=src+'@'+size;if(FSPR[key])return FSPR[key];
 if(F.drone)return FSPR[key]=droneSpr(F.drone,size);
 const b=_f('img/foe/'+F.base+'.webp',size);if(!b)return null;const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const g=c.getContext('2d');
 g.drawImage(b,0,0);g.globalCompositeOperation='source-atop';g.globalAlpha=.5;g.fillStyle=F.tint;g.fillRect(0,0,c.width,c.height);return FSPR[key]=c}}

/* ---------- 新しい動き：突進・弾・分裂・ボスの弾の輪と手下 ---------- */
const EB={SPD:3.1,MAX:70,DMG:.45};
{const _u=fUpdate;fUpdate=function(f){_u(f);const D=FD;if(!D||!D.run||D.paused||D.climbing)return;
 if(D._ebF!==D.floor){D._ebF=D.floor;D.ebul=[]}
 for(const e of D.foes){const F=FFOE[e.k];if(!F)continue;
  if(F.dash){if(e.dsh>0){e.x+=e.dv[0]*f;e.y+=e.dv[1]*f;e.dsh-=f}else{e.dt=(e.dt==null?Math.random()*F.dash:e.dt)+f;
   if(e.dt>F.dash&&Math.hypot(D.x-e.x,D.y-e.y)<380){e.dt=0;const a=Math.atan2(D.y-e.y,D.x-e.x);e.dv=[Math.cos(a)*4.6,Math.sin(a)*4.6];e.dsh=28;e.hit=Math.max(e.hit,4)}}}
  if(F.shoot){e.sht=(e.sht==null?Math.random()*F.shoot:e.sht)+f;if(e.sht>F.shoot){e.sht=0;const dx=D.x-e.x,dy=D.y-e.y,d=Math.hypot(dx,dy)||1;
   if(d<420&&D.ebul.length<EB.MAX)D.ebul.push({x:e.x,y:e.y-8,vx:dx/d*EB.SPD,vy:dy/d*EB.SPD,life:160,dmg:F.dmg*EB.DMG*(e.dm||1),c:F.tint})}}}
 for(const b of D.ebul){b.x+=b.vx*f;b.y+=b.vy*f;b.life-=f;if(D.inv<=0&&(b.x-D.x)**2+(b.y-D.y)**2<15*15){D.hp-=fHurt(b.dmg*fCut(),null);D.inv=30;b.life=0;tone(90,.1,'sawtooth',.05);D.shake=6;renderFHud()}}
 D.ebul=D.ebul.filter(b=>b.life>0)}}
{const _ai=fBossAI;fBossAI=function(b,f){const r=_ai(b,f),F=FFOE[b.k],D=FD;if(!F||!F.ring||!D)return r;
 b.rg=(b.rg||0)+f;if(b.rg>F.ring){b.rg=0;const n=b.k==='sorab'?14:10,o=Math.random()*TAU;D.ebul=D.ebul||[];
  for(let i=0;i<n;i++){const a=o+i/n*TAU;D.ebul.push({x:b.x,y:b.y,vx:Math.cos(a)*2.4,vy:Math.sin(a)*2.4,life:220,dmg:F.dmg*.5*(b.dm||1),c:F.drone||'#7fb0ff'})}tone(520,.08,'square',.03,260)}
 if(F.call){b.cl=(b.cl||0)+f;if(b.cl>F.call){b.cl=0;/* 呼ぶ敵と文字はボスごと（2.1.5：ほかの塔のボスにも「匠空がドローンを呼んだ」と出ていた）。callFoe がなければ、その層のいちばん強い組の敵 */
  const A=FAREA[D.area],mx=A&&A.mix&&A.mix[A.mix.length-1],pool=F.callFoe?[F.callFoe]:(mx&&mx[1]&&mx[1].length?mx[1]:['wing']);
  for(let i=0;i<3;i++){const e=fSpawn(pool[i%pool.length],0,1);if(e){e.x=b.x+Math.cos(i/3*TAU)*80;e.y=b.y+Math.sin(i/3*TAU)*80}}
  fBanner(F.callMsg||`${(FOES[b.k]||{}).n||'ボス'}が仲間を呼んだ！`,100,'n_boss')}}
 return r}}
{const _k=fKill;fKill=function(e){_k(e);const F=FFOE[e.k];if(!FD||!F||!F.split||e.small)return;
 for(let i=0;i<2;i++){const s=fSpawn(e.k,0,1);if(!s)continue;s.x=e.x+(i?14:-14);s.y=e.y;s.r=Math.round(F.r*.65);s.max=s.hp=e.max*.3;s.small=true}}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(!D.ebul||!D.ebul.length)return;
 for(const b of D.ebul){g.fillStyle=b.c||'#ff6a4a';g.globalAlpha=.35;g.beginPath();g.arc(b.x,b.y,9,0,TAU);g.fill();g.globalAlpha=1;g.fillStyle='#fff';g.beginPath();g.arc(b.x,b.y,4,0,TAU);g.fill()}}}

/* ---------- お助け仲間：階ごと（試作の層＝チュータ、発電の層＝ボルトゴリラ、17〜18F＝セブンティーン、19〜20F＝ツキヨ） ---------- */
const HELPER_FL={11:'mouse',12:'mouse',13:'mouse',14:'gorilla',15:'gorilla',16:'gorilla',17:'rocker',18:'rocker',19:'tsukiyo',20:'tsukiyo'};
Object.assign(JOIN_TALK,{
 mouse:[['mouse','チュータ','チュー……メカロボが動かなくなっちゃった。'],
  ['robot','メカロボ','ピ……ガ……システム……エラー……サビ……検出……'],
  ['mouse','チュータ','ボク、ロボの頭の中の文字を読めるようになりたいんだ。\nいっしょに行ってもいい？ ロボを直す方法をさがしたいチュー！']],
 gorilla:[['gorilla','ボルトゴリラ','ウホッ！ やっと来たか、職人たち！'],
  ['gorilla','ボルトゴリラ','俺はボルトゴリラ。街の配線なら、だいたい俺がやった。\n……だから許せねぇんだよ、電線を食う錆どもが。'],
  ['gorilla','ボルトゴリラ','この層の電気は、俺がつなぎなおす。\nフルパワーでいくぜ、ウホッ！']],
 rocker:[['rocker','セブンティーン','よう。今夜の主役のお出ましか。'],
  ['rocker','セブンティーン','嵐で、ギターの音がよく響きやがる。\n……錆の連中、いいリズムで攻めてくるじゃねぇか。'],
  ['rocker','セブンティーン','一曲だけ付き合ってやる。\nアンコールは、ないぜ。']],
 tsukiyo:[['tsukiyo','ツキヨ','……星が、きみたちが来るって告げてた。'],
  ['tsukiyo','ツキヨ','錆の円の中心は、塔のてっぺん。そのさらに上の夜空。\n星の位置で、道を読んであげる。'],
  ['tsukiyo','ツキヨ','夜明けに見た、星座にない光。\nあれの正体を、確かめに行こう。']]});
Object.assign(HELPER_AGAIN,{mouse:'チュー！ また会えたね。ロボへの命令は、ボクにまかせて！',gorilla:'ウホッ、また来たか！ 力まかせじゃなく、きっちりつなぐぜ。',rocker:'よう。もう一曲、付き合ってやるよ。',tsukiyo:'星読みどおり。また会えたね。'});

/* ---------- 層の紹介・階の一言 ---------- */
Object.assign(AREA_INTRO,{
 proto:[[null,'','11F。後編のはじまり、試作の層。\n作業台の上に、作りかけの機械がいくつも並んでいる。'],
  [null,'','どれも途中で手を止めたまま、錆に包まれていた。\n奥の制御室から、低いモーター音が聞こえる。']],
 power:[[null,'','14F。発電の層。天井を、何本もの太い電線が走っている。'],
  [null,'','その電線に、錆がびっしりと取りついていた。\n錆が脈打つたびに、街の明かりがひとつ消えていく。']],
 sky:[[null,'','17F。空の層。塔の外壁に沿って、通路が空へ続いている。'],
  [null,'','窓の外で、雷雲が渦を巻いていた。\n設計局の机には、描きかけの図面が山のように積まれている。']],
 top:[[null,'','20F。天井のない部屋。頭の上に、夜空が広がっている。'],
  [null,'','壁はすべて棚で、何千本もの図面が収められていた。\n塔の歴代の主たちが描きためた、図面庫だ。'],
  [null,'','床のまん中に、何も描かれていない円がある。']]});
Object.assign(FLOOR_LINES,{
 11:['作りかけの機械ばかりだ……','止まった機械にも、錆がついてる'],12:['鍛造場か。熱がこもってるな','ハンマーの音……だれもいないのに'],
 13:['制御室。画面が全部、砂嵐だ','上から、プロペラの音がする'],14:['研究所……薬品と油のにおいだ','火花には気をつけよう'],
 15:['精密測定室。ここは寸法がすべてだ','0.01ミリのずれも、ここではごまかせない'],16:['発電所。ここが街の電気のもとか','錆が電気を食ってる。止めないと'],
 17:['設計局……描きかけの図面ばかりだ','途中で止めた図は、陰に転びやすい……か'],18:['嵐の展望台。風が強い！','雷が近い。足もとに気をつけろ'],
 19:['星見の回廊。空が近い','あと一階で、てっぺんだ'],20:['天空の工房……ここが頂上か','行こう。灯りを、取りもどす']});
Object.assign(BOSS_LINES,{proto:'またあのドローンか。今度も止める',power:'電線を守る。気を抜くな',sky:'赤い一つ目……来るぞ',top:'もう一度、話をしよう'});

/* ---------- ボスの会話（仲間のセリフは、その仲間がいるときだけ。4つ目は、いないときの地の文） ---------- */
Object.assign(BOSS_TALK,{
 proto:[[null,'','制御室の天井から、丸い機械が降りてきた。\n四つのプロペラ。まん中に、青く光る一つ目。'],
  [null,'','胴体には、かすれた文字で「空」と書かれている。'],
  ['wolf','ウルフ','朝焼けの空を横切った光……こいつだったのか。'],
  [null,'監視ドローン 空・一番機','……錆ヲ、検出。……古イ機械ヲ、検出。型式、旧型。'],
  [null,'監視ドローン 空・一番機','……完璧デナイモノハ、不要。消去シマス。']],
 power:[[null,'','発電所の天井で、黄色い一つ目が光った。二機目の「空」だ。'],
  [null,'監視ドローン 空・二番機','……古イ電線ヲ、検出。劣化率、基準外。消去。'],
  [null,'','赤い光が、錆だけでなく、まだ使える電線まで焼き切っていく。'],
  ['gorilla','ボルトゴリラ','おい、やめろ！ その線はまだ使える！','だれかの声がひびいた気がした。「その線は、まだ使える！」'],
  [null,'監視ドローン 空・二番機','……完璧デナイモノハ、不要。……完璧デナイモノハ、不要。'],
  ['wolf:serious','ウルフ','（9階の鏡の前で、俺が自分に言いかけた言葉と……同じだ）']],
 sky:[[null,'','星見の回廊の窓の外を、赤い光が横切った。三機目の「空」だ。'],
  ['tsukiyo','ツキヨ','星が隠れた……。この光、星座にない。','星が、ひとつずつ隠れていく。'],
  [null,'監視ドローン 空・三番機','……錆ヲ、検出。……描キカケノ図面ヲ、検出。'],
  [null,'監視ドローン 空・三番機','……途中デ止メタモノハ、不要。焼却ニヨリ、消去。']],
 top:[[null,'','夜空から、何十もの光が降りてきた。すべて、監視ドローン「空」だった。'],
  [null,'','そのまん中に、ひとりの職人が浮かんでいた。白い作業着に帽子。手には、ドローンの送信機。\n作業着の半分は、オレンジ色の錆におおわれている。'],
  ['sora','匠空','空の上から見てたよ。きみの腕、試させて！'],
  [null,'','明るい声だった。けれど、その目は笑っていなかった。'],
  ['sora','匠空','ずれた線も、古い道具も、錆も。完璧でないものは、ぜんぶ消すんだ。\nそうしたら、錆は生まれないでしょ？'],
  ['wolf:serious','ウルフ','……それじゃ、何も残らねぇだろうが！']]});
Object.assign(BOSS_WIN,{
 proto:[[null,'','ドローンの一つ目が光を失い、ゆっくりと床に降りた。'],
  ['mouse','チュータ','中の文字、読めるチュー……！ ここ、書きかえられてる。','ドローンの小窓の中に、命令の文字が並んでいた。'],
  ['mouse','チュータ','もとは「錆があったら、直す」。それを消して、上から「消す」って。\n……同じ人の字だチュー。','もとは「錆があったら、直す」。それを消して、上から「消す」。同じ人の字だ。'],
  [null,'','そのとき、制御室の画面のひとつに、白と黒の影が映った。'],
  ['onmyo','オンミョウ','……書きかえた跡か。あの人らしい、まっすぐな字だ。'],
  [null,'','画面はすぐ砂嵐にもどった。\n試作の層 クリア！ 発電の層（14F〜）へ登れるようになった。']],
 power:[[null,'','ドローンの一つ目が、黄色から青に変わった。'],
  [null,'監視ドローン 空・二番機','……命令ヲ、確認。……「錆ヲ、消セ」。……発信元、匠……'],
  ['gorilla','ボルトゴリラ','力まかせじゃ、電気は流れねぇ。……親方の口ぐせさ。\nこいつも、命令に力まかせに従ってただけかもしれねぇな。','このドローンは、十年前の命令に、ずっと従っていただけなのかもしれない。'],
  [null,'','焼き切れた電線を、図面どおりにつなぎなおす。\n天井のランプが、ひとつずつ灯っていった。'],
  [null,'','発電の層 クリア！ 空の層（17F〜）へ登れるようになった。']],
 sky:[[null,'','三機目のドローンが落ちると、回廊に白と黒の影が立っていた。\n今度は、消えなかった。'],
  ['onmyo','オンミョウ','……陰と陽、どちらに転ぶか。見届けておった。'],
  [null,'','オンミョウは、懐から一枚の紙を取り出した。\nぎざぎざの切り口。匠の魔法陣の、左半分だった。'],
  ['onmyo','オンミョウ','我は、匠の弟子だった。\n十年前、師匠と二人で、この塔の再生の陣を描きなおしていた。'],
  ['onmyo','オンミョウ','師匠の線は、一本も狂わなかった。我の線は、いつも少しずつずれた。\n……それがこわくなって、我は筆を置いて去った。'],
  ['onmyo','オンミョウ','一人になった師匠は完成を急ぎ、錆を「直す」陣を「消す」陣に書きかえた。\n陣は暴走し、図面は左右に裂けた。'],
  ['wolf:serious','ウルフ','……右半分は、ロストールが持ってた。'],
  ['onmyo','オンミョウ','そなたの線は、ずれても磨き続ける線だ。我にはなかったものだ。\n……今度は、最後まで描く。連れていけ。'],
  [null,'','空の層 クリア！ 頂上・天空の工房（20F）へ登れるようになった。']],
 top:[[null,'','匠空の作業着から、錆がはじけ飛んだ。\nドローンの一つ目が、赤から青へ、ひとつずつ変わっていく。'],
  [null,'','床の円の上で、二枚の図面を合わせた。左右は、ぴたりと合った。\nけれどまん中に、一本だけ線が足りない。'],
  ['takumi:worry','匠','……描けないよ。この手じゃ、もう完璧な線は引けない。'],
  ['wolf','ウルフ','図面のここ、公差だろ。ここまでならずれていいっていう幅だ。\n初代マイスターの図面にも、ちゃんと書いてある。'],
  ['takumi:worry','匠','……ゼロにしたんだ。書きかえたとき、その数字を、ぜんぶゼロに。\nずれを許さない陣にしたら、錆も、道具も、人も……全部、はじかれた。'],
  ['wolf:smile','ウルフ','俺の線は、たぶんちょっとずれる。でも、公差の中には入れてみせる。\n……毎晩、磨いてきたからな。'],
  [null,'','ウルフとオンミョウが、左右から一本の線を引いた。\nまん中で、少しだけずれて出会う。'],
  [null,'','魔法陣が光った。その光は匠の錆を消さず、ゆっくりと元の色にもどしていった。\n本当の「再生の陣」が、十年ぶりに完成した。']]});

/* ---------- 20Fのエンディング（第1章 完） ---------- */
const ENDING2=[
 [null,'','塔のてっぺんに、灯りがともった。\n鉄灯の街の、すべての街灯が、いっせいについた。'],
 ['takumi:smile','匠','……まいった。きみたちこそ、本物のマイスターだよ。'],
 ['takumi:worry','匠','でも、ぼくは許されたわけじゃない。\n十年、街を暗くした。古い道具をたくさん消した。弟子を、一人にした。'],
 ['takumi:serious','匠','だから、審判を受けようと思う。'],
 [null,'','匠が魔法陣に手をおくと、一筋の光が、はるか西の空を指した。\nその先に、白と黒に塗り分けられた塔の影が見えた。'],
 ['owl','ホー博士','審判の塔じゃ。白黒の高原に、大昔から立つ塔。\n正しさを量る「天秤の陣」が刻まれておる。','白黒の高原に、大昔から立つ塔。正しさを量る「天秤の陣」が刻まれているという。'],
 ['wolf:smile','ウルフ','俺たちも行くよ。あんたがどう変わったか、一番近くで見てたのは俺たちだ。\n証人がいなきゃ、裁判にならねぇだろ。'],
 [null,'','塔の入口の石に刻まれた言葉が、街の灯りに照らされていた。\n「夜に磨く、未来を創る力」'],
 [null,'','第1章「夜の工房に灯る」　完\n第2章「審判の塔」へつづく']];
function showEnding(){sfx.win&&sfx.win();const full=!!G.flags.ch1b;
 $('resP').innerHTML=`<div style="text-align:center"><img class="endImg" src="img/ev/ev_ending1.webp" alt=""><h2 style="margin:4px 0;color:var(--gold)">${full?'第1章 クリア！':'第1章 前編クリア！'}</h2><div style="font-weight:800">「夜の工房に灯る」</div>
  <div style="display:flex;justify-content:center;gap:4px;margin:10px 0;flex-wrap:wrap">${G.party.map(m=>`<img src="${CHARS[m.id].img}" style="width:56px;height:56px;object-fit:contain" alt="">`).join('')}</div>
  <div class="note">${full?'塔の灯りが、十年ぶりにともった。<br>クリア後も、塔に登って素材集め・装備づくりができる。<br>第2章「審判の塔」へつづく':'塔の中ほどに、灯りがひとつともった。<br>11Fから後編へ。塔の頂上・20Fをめざそう。'}</div></div>`;
 $('resBtns').innerHTML='';addBtn('ホームへ',openHome,'gold');show('result')}

/* ---------- チャット（後編）：13F・16F・19F・20Fクリアで出る ---------- */
{const W='ウルフ',DD='ドド先輩',OW='ホー博士',GR='ボルトゴリラ',MO='チュータ',RB='メカロボ',TK='ツキヨ',OM='オンミョウ',RK='セブンティーン';
CHATS.push(
 {id:'c_robo4',t:'再起動',st:4,who:['mouse','robot'],L:[['mouse',MO,'ロボの頭の中の文字、ひと晩かけて読んだんだ。'],['mouse',MO,'もしこうなら、こうする。正しい順番で並んだ命令は、ちゃんと描いた図面と同じなんだね。'],['mouse',MO,'錆が、一字だけ食べちゃってた。そこを書きなおしたら……'],['robot',RB,'ピ……再起動……完了。……再起動ニ、必要ナモノ……ぷろぐらむ……ト……トモダチ……'],['mouse',MO,'……うん。やったチュー！']]},
 {id:'c_onmyo4',t:'まっすぐな字',st:4,who:['onmyo'],L:[['onmyo',OM,'……書きかえた跡を、見たか。'],['wolf',W,'やっぱり、画面に映ったのはお前だったのか。'],['onmyo',OM,'あの人の字は、昔から一本も震えなかった。'],['onmyo',OM,'震えない字は、美しい。……だが、ときに冷たい。']]},
 {id:'c_owl4',t:'十年前の命令',st:4,who:['owl'],L:[['owl',OW,'ドローンの命令が書きかえられたのは、十年前。灯りが消えたのと同じころじゃ。'],['owl',OW,'あやつは、完璧な線を引く男じゃった。……完璧すぎるほどにのう。'],['wolf',W,'博士……匠のこと、もっと知ってるんじゃねぇのか。'],['owl',OW,'……上へ行けば、わかる。']]},
 {id:'c_gorilla4',t:'まず図を描け',st:5,who:['gorilla'],L:[['gorilla',GR,'俺は昔、配線を力まかせにつないで、工場をひとつ停電させたことがある。'],['gorilla',GR,'そのとき親方に言われたんだ。まず図を描け、ってな。'],['wolf',W,'図を描いてから、つなぐ……。'],['gorilla',GR,'正しく描いた複線図は、光るんだぜ。魔法陣と同じさ、ウホッ。']]},
 {id:'c_rocker4',t:'火事の夜',st:5,who:['rocker'],L:[['rocker',RK,'研究所の油のにおい……思い出すぜ。'],['rocker',RK,'昔、港の倉庫街で火事があった。俺はそのとき、ギターしか持ってなかった。'],['rocker',RK,'油の火に水はだめだ。泡で、ふたをする。……あの夜のあとで、全部覚えた。'],['wolf',W,'……だから、そんなに詳しいのか。']]},
 {id:'c_robo5',t:'命令して、撃つ',st:5,who:['mouse','robot'],L:[['mouse',MO,'ロボ、ボクが命令を書くから、撃って！'],['robot',RB,'……了解。狙イト、たいみんぐハ、ちゅーたニ、オマカセシマス。'],['mouse',MO,'右に三つ、左に二つ、上に一つ。ドローンの動き、いつも同じ順番だったチュー！'],[null,'','チュータが書いた命令で、ロボのレーザーがまっすぐ伸びた。']]},
 {id:'c_onmyo5',t:'筆を置いた日',st:6,who:['onmyo'],L:[['onmyo',OM,'……我の線は、いつも少しずつずれた。'],['onmyo',OM,'ずれが陣を壊すのではないか。そう思ったら、筆が持てなくなった。'],['wolf',W,'俺もだよ。試験で手がふるえて、0.05ミリ削りすぎた。'],['onmyo',OM,'……それでも、そなたは旋盤の前にもどった。'],['wolf:smile',W,'もどるしかなかったんだよ。ほかに、やり方を知らねぇからな。']]},
 {id:'c_tsukiyo4',t:'星図の陣',st:6,who:['tsukiyo','owl'],L:[['owl',OW,'ツキヨ殿、星の位置と、わしの錆の地図。もう一度重ねてみてくれんか。'],['tsukiyo',TK,'……円の中心は、塔のてっぺん。その、さらに上。'],['owl',OW,'ホッホッ。星と計算、組み合わせれば、陣の中心が読める。'],['tsukiyo',TK,'星読みどおり。……ううん、星読み以上かな。']]},
 {id:'c_live4',t:'嵐のステージ',st:6,who:['rocker','gorilla'],L:[['rocker',RK,'嵐の中で弾くのは、悪くねぇな。'],['gorilla',GR,'俺の電気も、もう力まかせじゃねぇぞ。'],['rocker',RK,'……知ってる。さっきの音、ちゃんと鳴ってた。'],[null,'','雷鳴とギターの音が、嵐の展望台に響いた。']]},
 {id:'c_owl5',t:'ゼロにした数字',st:7,who:['owl'],L:[['owl',OW,'あやつが公差をゼロにした、と聞いて……ようやくわかったわい。'],['owl',OW,'若いころ、あやつはよく言っておった。「ずれは、ぼくの負けだ」と。'],['wolf',W,'ずれは負けじゃねぇよ。公差の中なら、それは合格だ。'],['owl',OW,'ホッホッ。……そうじゃな。それをあやつに教えたのは、おぬしじゃ。']]},
 {id:'c_onmyo6',t:'陰陽牙刃',st:7,who:['onmyo'],L:[['onmyo',OM,'……あの線を引いたとき、我の手はふるえていた。'],['wolf',W,'俺もだ。でも、まん中でちゃんと出会っただろ。'],['onmyo',OM,'右から来る線と、左から来る線。陰と陽が、少しずれて重なった。'],['onmyo',OM,'……札で縛り、牙で断つ。あれと同じだな。'],['wolf:smile',W,'だったら、技にも名前をつけようぜ。陰陽牙刃だ！'],['onmyo',OM,'……面白い。']]},
 {id:'c_wolf3',t:'合格ライン',st:7,who:['wolf'],L:[['wolf',W,'……試験、あさってなんだよな。'],['wolf',W,'不思議と、手がふるえる気がしねぇ。'],[null,'','ウルフは、20階で引いた一本の線を思い出していた。少しずれて、それでも公差の中で出会った線を。'],['wolf:smile',W,'よっしゃ。合格ライン、ぶっちぎってやる！']]})}

/* ---------- 後編の層から出撃するときは、最初からレベルが上がった状態（下の階を登ってきた分） ---------- */
const START_LV={11:7,14:11,17:14};
{const _s=startFloor;startFloor=function(fl){_s(fl);const L=START_LV[fl];if(!L||!FD)return;const D=FD;D.lv=1+L;D.need=Math.round(3+D.lv*2.6+D.lv*D.lv*.16);D.pendingLv+=L;
 fBanner(`${fl}階から出撃：はじめから Lv${D.lv}（技を${L}回えらべる）`,200,'n_floor');if(!D.paused&&!$('fLevel').classList.contains('on'))fOpenLevel()}}

/* ===================== 装備の4段目（肆）：後編の素材・図面 ===================== */
Object.assign(MATS,{
 titan: {n:'チタン',      d:'軽くて強い金属。試作の層に多い。4段目の装備に使う'},
 cell:  {n:'蓄電池',      d:'電気をためる部品。発電の層に多い。4段目の装備に使う'},
 carbon:{n:'カーボン繊維',d:'しなやかで丈夫な繊維。空の層に多い。4段目の装備に使う'}});
MAT_ORDER.splice(MAT_ORDER.indexOf('core'),0,'titan','cell','carbon');
Object.assign(MAT_ATTR,{titan:'steel',cell:'thunder',carbon:'wind'});
Object.assign(SVG_IC,{
 titan:'<polygon points="6,22 10,10 26,10 30,22" fill="#b9c4d0" stroke="#eef4fa" stroke-width="1.5"/><polygon points="6,22 30,22 26,27 2,27" fill="#7d8a98"/><path d="M12 14h12" stroke="#fff" stroke-width="1.5" opacity=".7"/>',
 cell:'<rect x="8" y="7" width="16" height="22" rx="3" fill="#2f3a48" stroke="#9fd0ff" stroke-width="1.5"/><rect x="13" y="3" width="6" height="4" rx="1" fill="#9fd0ff"/><polygon points="17,10 11,19 16,19 14,26 21,16 16,16" fill="#ffe14a"/>',
 carbon:'<rect x="5" y="5" width="22" height="22" rx="3" fill="#1d2026" stroke="#8a93a4" stroke-width="1.5"/>'+[0,1,2,3].map(i=>`<path d="M${7+i*5} 7v18" stroke="#3c434f" stroke-width="2.5"/><path d="M7 ${9+i*5}h18" stroke="#525b6a" stroke-width="1.6"/>`).join('')});
Object.assign(FLOOR_MATS,{11:['titan','spring'],12:['titan','brass'],13:['titan','board'],14:['cell','oil'],15:['cell','brass'],16:['cell','wire'],17:['carbon','board'],18:['carbon','spring'],19:['carbon','titan'],20:['titan','cell']});
TIER_MUL[4]=2.8;KANJI_TIER[4]='肆';
/* 図面：試作の層／発電の層／空の層で見つかる。どの武器も2段階の加工 */
Object.assign(RECIPES,{
 bite3:   {n:'チタンの牙刃',   kind:'weapon',who:'wolf',   tier:4,mats:{titan:3,carbon:1,core:2},area:'proto',shape:'ma'},
 spanner3:{n:'三連歯車の輪刃', kind:'weapon',who:'fox',    tier:4,mats:{titan:2,cell:1,spring:2,core:1},area:'proto',shape:'me'},
 shield3: {n:'チタンの大盾',   kind:'weapon',who:'mouse',  tier:4,mats:{titan:3,plate:2,core:1},area:'proto',shape:'ch'},
 laser3:  {n:'プラズマ砲',     kind:'weapon',who:'robot',  tier:4,mats:{cell:3,board:2,core:2},area:'proto',shape:'ch'},
 thelm:   {n:'チタンのヘルメット',kind:'armor',slot:'head',tier:4,mats:{titan:3,carbon:1,core:2},area:'proto',shape:'ch'},
 hammer3: {n:'鍛造の大籠手',   kind:'weapon',who:'dodo',   tier:4,mats:{titan:3,cell:1,core:2},area:'power',shape:'ch'},
 pen2:    {n:'星図の杖',       kind:'weapon',who:'owl',    tier:4,mats:{cell:2,brass:2,core:2},area:'power',shape:'hikari'},
 rod3:    {n:'雷神の槍',       kind:'weapon',who:'gorilla',tier:4,mats:{cell:3,wire:2,core:2},area:'power',shape:'de'},
 guitar3: {n:'雷鳴のギター',   kind:'weapon',who:'rocker', tier:4,mats:{cell:2,carbon:2,core:2},area:'power',shape:'me'},
 tboots:  {n:'空気ばね安全靴', kind:'armor',slot:'feet',tier:4,mats:{carbon:2,titan:2,cell:1,core:1},area:'power',shape:'de'},
 g_star:  {n:'星降りの陣盤',   kind:'gen',impl:'owl',      tier:4,mats:{cell:2,titan:2,core:1},area:'power',shape:'hikari'},
 bow3:    {n:'天体の弓',       kind:'weapon',who:'tsukiyo',tier:4,mats:{carbon:3,brass:2,core:2},area:'sky',shape:'ke'},
 fuda3:   {n:'陰陽の式神札',   kind:'weapon',who:'onmyo',  tier:4,mats:{carbon:2,titan:1,board:2,core:1},area:'sky',shape:'yami'},
 cvest:   {n:'カーボンの防護服',kind:'armor',slot:'body',tier:4,mats:{carbon:4,cell:1,core:1},area:'sky',shape:'de'},
 g_ring:  {n:'天空のリング',   kind:'gen',impl:'fox',      tier:4,mats:{titan:3,carbon:1,core:1},area:'sky',shape:'me'}});
const REMAP4={bite3:['lathe','file'],spanner3:['lathe','tap'],shield3:['hit','drill'],laser3:['wire','drill'],thelm:['hit','drill'],
 hammer3:['hit','weld'],pen2:['trace','wire'],rod3:['weld','wire'],guitar3:['weld','wire'],tboots:['tap','trace'],g_star:['trace','lathe'],
 bow3:['cut','lathe'],fuda3:['cut','grind'],cvest:['cut','weld'],g_ring:['lathe','drill']};
Object.entries(REMAP4).forEach(([k,ps])=>{const R=RECIPES[k];R.proc=ps[0];R.procs=ps;R.tools=[...new Set(ps.flatMap(p=>PROC_MAIN[p]))];if(!RECIPE_ORDER.includes(k))RECIPE_ORDER.push(k)});
/* ミニゲームの難しさは3段目と同じ（表が3段目までのため） */
{const _p=runProc;runProc=function(R,pr,st){return _p(R.tier>3?Object.assign({},R,{tier:3}):R,pr,st)}}
{const _r=runPractice;runPractice=function(k,t,back){return _r(k,t>3?3:t,back)}}

/* ===================== コイン：ふつうの敵もときどき落とす ===================== */
const COIN_NORMAL={rate:.05,v:2};
{const _k=fKill;fKill=function(e){_k(e);if(FD&&!e.big&&!e.small&&Math.random()<COIN_NORMAL.rate)FD.items.push({x:e.x+8,y:e.y-6,k:'coin',v:COIN_NORMAL.v})}}

/* ===================== ポーズ画面：今の強化（技・能力・進化／覚醒・お助け）をタップで確認 ===================== */
function atkCardIc(k,s){const c=CHARS[k],A=ATK[k],gr=k!==G.lead&&genRid(k);return gr?RIC(gr,s):`<span class="pzi"><img src="${c.img}" alt="">${TIC(A.type,Math.round(s*.5))}</span>`}
function pzStars(n,max,cls){let h='';for(let i=0;i<max;i++)h+=`<i class="${i<n?'on':''} ${cls||''}"></i>`;return `<span class="pzs">${h}</span>`}
function fPauseHTML(){const D=FD,ks=Object.keys(D.atk).filter(k=>D.atk[k]>0),ps=Object.keys(PASSIVE).filter(k=>D.ps[k]>0);
 const cell=(ic,lv,max,tag,key,cls)=>`<button class="pzc ${cls||''}" data-pz="${key}">${ic}${tag?`<em>${tag}</em>`:''}${pzStars(lv,max,cls)}</button>`;
 const atk=ks.map(k=>{const aw=D.awk&&D.awk[k],ev=evoOn(k);return cell(atkCardIc(k,48),D.atk[k],ATK_MAX,aw?'覚醒':ev?'進化':(D.helperMs&&D.helperMs[k]?'お助け':''),'a:'+k,aw?'awk':ev?'evo':'')}).join('');
 const pas=ps.map(k=>cell(MIC(k,44),D.ps[k],PASSIVE[k].max,'','p:'+k)).join('');
 const empty=n=>Array.from({length:Math.max(0,n)},()=>'<span class="pzc no"></span>').join('');
 return `<h3>ひと休み</h3><div class="pzt">${D.floor}F ${FLOORS[D.floor].n}　Lv${D.lv}　体力 ${Math.ceil(D.hp)}/${D.maxhp}　${UIMG('coin',16)}${D.coin}</div>
  <div class="pzh">技</div><div class="pzg">${atk}${empty(3-ks.length%3===3?0:3-ks.length%3)}</div>
  <div class="pzh">能力</div><div class="pzg">${pas||'<span class="pzn">まだない</span>'}${pas?empty(3-ps.length%3===3?0:3-ps.length%3):''}</div>
  <div class="pzd" id="pzD">アイコンをタップすると、くわしく見られる</div>
  <button class="btn gold" onclick="fResume()">つづける</button><button class="btn" onclick="fRetreat()">ホームへ帰る<small class="bsm">素材は全部持ち帰る</small></button>`}
function pzDesc(key){const D=FD,[t,k]=key.split(':');
 if(t==='p'){const P=PASSIVE[k];return `<b>${P.n}　Lv${D.ps[k]}/${P.max}</b>${P.d}`}
 const A=ATK[k],L=D.atk[k],gr=k!==G.lead&&genRid(k),nm=gr?RECIPES[gr].n:CHARS[k].name+'の'+A.n;
 const got=A.d.slice(0,L).map((d,i)=>`Lv${i+1}：${d}`).join('<br>'),nx=L<ATK_MAX?`<br><span class="pzx">次（Lv${L+1}）：${A.d[L]}</span>`:'';
 let ex='';if(D.awk&&D.awk[k])ex='<br><span class="pzx">覚醒：威力1.5倍</span>';if(evoOn(k)){const p=EVO.find(x=>x.includes(k)&&D.evo[x[0]]);ex+=`<br><span class="pzx">絆覚醒「${p[2]}」：${p[3]}</span>`}
 if(D.hboost&&D.hboost[k])ex+='<br><span class="pzx">お助け：威力1.2倍（この挑戦の間）</span>';
 return `<b>${nm}　${A.type}　Lv${L}/${ATK_MAX}</b>${got}${nx}${ex}`}
{const _p=fPause;fPause=function(){if(!FD||FD.paused)return;_p();const card=$('fPause').querySelector('.fcard');card.classList.add('pz');card.innerHTML=fPauseHTML();
 card.querySelectorAll('[data-pz]').forEach(b=>b.onclick=()=>{card.querySelectorAll('.pzc.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');$('pzD').innerHTML=pzDesc(b.dataset.pz)})}}

/* ===================== ボスの宝箱：強化3つ＋コイン ===================== */
const BOSS_CHEST={coin:f=>40+f*6,n:3};
{const _k=fKill;fKill=function(e){_k(e);if(FD&&e.boss)FD.chests.push({x:e.x+80,y:e.y+10,open:false,boss:true})}}
function chestRewards(){const D=FD,out=[];D.evo=D.evo||{};D.awk=D.awk||{};
 for(let i=0;i<BOSS_CHEST.n;i++){const ex=extraOpts(),o=[];Object.keys(D.atk).forEach(k=>{if(D.atk[k]>0&&D.atk[k]<ATK_MAX)o.push('a:'+k)});Object.keys(PASSIVE).forEach(k=>{if(D.ps[k]<PASSIVE[k].max)o.push('p:'+k)});
  const pk=ex.length?ex[0]:o.length?pick(o):'heal';const [t,k]=pk.split(':');
  if(pk==='heal'){D.hp=Math.min(D.maxhp,D.hp+80);out.push({ic:MIC('oil',52),n:'オイル補給',d:'体力を80回復'});continue}
  if(t==='e'||t==='w'){evoPick(t,k);out.push({ic:UIMG('u_awk',52),n:'覚醒！ '+ATK[k].n,d:'威力1.5倍'});continue}
  if(t==='a'){D.atk[k]++;const L=D.atk[k];out.push({ic:atkCardIc(k,52),n:(k!==G.lead&&genRid(k)?RECIPES[genRid(k)].n:CHARS[k].name+'　'+ATK[k].n),d:`Lv${L}：${ATK[k].d[L-1]}`});continue}
  D.ps[k]++;if(k==='hp'){D.maxhp+=20;D.hp=Math.min(D.maxhp,D.hp+20)}out.push({ic:MIC(k,52),n:PASSIVE[k].n,d:`Lv${D.ps[k]}：${PASSIVE[k].d}`})}
 return out}
{const _o=fOpenChest;fOpenChest=function(c){if(!c.boss)return _o(c);c.open=true;const D=FD;D.paused=true;fReleaseStick();
 const rw=chestRewards(),coin=BOSS_CHEST.coin(D.floor);G.coin=(G.coin|0)+coin;D.coin+=coin;save();renderFHud();tone(880,.25,'triangle',.1,1760);
 let el=$('fChest');if(!el){el=document.createElement('div');el.className='fov';el.id='fChest';$('fPause').parentNode.appendChild(el)}
 el.innerHTML=`<div class="fcard chb"><div class="chh">宝箱オープン</div>${rw.map((r,i)=>`<div class="chr" style="animation-delay:${i*120}ms">${r.ic}<span><b>${r.n}</b><small>${r.d}</small></span></div>`).join('')}
  <div class="chr coin" style="animation-delay:${rw.length*120+80}ms">${UIMG('coin',48)}<span><b>コイン</b><small>×${coin}</small></span></div><button class="btn gold" id="chOk">OK</button></div>`;
 el.classList.add('on');$('chOk').onclick=()=>{el.classList.remove('on');if(FD===D){D.paused=false;fLast=0}}}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);for(const c of D.chests){if(!c.boss||c.open)continue;g.save();g.strokeStyle='#ffd23a';g.lineWidth=4;g.globalAlpha=.5+.5*Math.sin(D.t*5);g.beginPath();g.arc(c.x,c.y-6,40,0,TAU);g.stroke();
 g.globalAlpha=1;g.fillStyle='#ffd23a';g.font='900 12px sans-serif';g.textAlign='center';g.fillText('ボスの宝箱',c.x,c.y-52);g.restore()}}}

/* ---------- 4段目のアイコン（素材・防具・汎用武器） ---------- */
Object.assign(UI_IC,{titan:'m_titan',cell:'m_cell',carbon:'m_carbon'});
Object.assign(ARMOR_IC,{thelm:'ar_thelm',cvest:'ar_cvest',tboots:'ar_tboots'});
Object.assign(GEN_IC,{g_star:'wg_star',g_ring:'wg_ring'});

/* ===================== 世界地図：行ったことのない場所は霧。章が進むと晴れる ===================== */
/* 塔ごとの出撃先。ready=遊べる。進みぐあいは G.tw[塔].floor（マイスターの塔は今までどおり G.floor） */
const TOWERS={meister:{n:'マイスターの塔',ready:true,go:()=>openDest()},judge:{n:'審判の塔',ready:false,soon:'11/17（火）0:00 公開'}};
const towerFloor=k=>k==='meister'?G.floor|0:(G.tw&&G.tw[k]&&G.tw[k].floor)|0;
const WMAP={img:'img/worldmap.webp',places:[
 {k:'tetto',tw:'meister', x:.43,y:.77,r:.25,n:'鉄灯の街',  t:'マイスターの塔',d:'夜の工業の街。塔の灯りが、街の名前のもとになった。塔には、錆を元の道具にもどす「再生の陣」が刻まれている。',open:()=>true},
 {k:'judge',tw:'judge', x:.18,y:.19,r:.2, n:'白黒の高原',t:'審判の塔',    d:'正しさを量る「天秤の陣」の塔。過ちを犯した者が登り、自分の罪と向き合う。第2章の舞台。',open:()=>!!G.flags.ch1b,hint:'霧の向こうに、白と黒の塔の影が見える……'},
 {k:'sougi', x:.86,y:.35,r:.19,n:'黄金の港町',t:'創技の塔',    d:'新しい技を生み出す「創成の陣」の塔。第3章の舞台。',open:()=>false,hint:'東の海の向こうから、金色の光がもれている……'},
 {k:'hw',    x:.82,y:.67,r:.14,n:'いたずらの島',t:'ハロウィンの塔',d:'遊びと文化を生む「祭りの陣」の塔。季節のイベントで開く。',open:()=>false,hint:'海の上から、にぎやかな笑い声が聞こえる……'},
 {k:'inf',   x:.54,y:.07,r:.12,n:'雲海',      t:'？？？',      d:'',open:()=>false,hint:'雲の上に、てっぺんの見えない塔の影がある……'}]};
function openSortie(){openWorldMap(true)}
function openWorldMap(sortie){let el=$('wmap');if(!el){el=document.createElement('div');el.id='wmap';document.body.appendChild(el)}
 el.innerHTML=`<div class="wmh"><b>${sortie?'どの塔へ出撃する？':'世界地図'}</b><button class="btn ghost" id="wmX">${sortie?'もどる':'とじる'}</button></div>
  <div class="wmbox" id="wmBox"><img src="${WMAP.img}" alt="世界地図" id="wmImg"><canvas id="wmFog"></canvas>
  ${WMAP.places.map(p=>{const o=p.open();return `<button class="wmp ${o?'on':'fog'}" data-wm="${p.k}" style="left:${p.x*100}%;top:${p.y*100}%">${o?`<b>${p.n}</b><small>${p.t}</small>`:'<b>？？？</b>'}</button>`}).join('')}</div>
  <div class="wmd" id="wmD">${sortie?'塔をタップして、出撃する塔を選ぶ':'場所をタップすると、くわしく見られる'}</div>`;
 el.classList.add('on');$('wmX').onclick=()=>el.classList.remove('on');
 const draw=()=>{const box=$('wmBox'),c=$('wmFog'),W=box.clientWidth,H=box.clientHeight;if(!W)return;const dpr=Math.min(2,devicePixelRatio||1);c.width=W*dpr;c.height=H*dpr;const g=c.getContext('2d');g.scale(dpr,dpr);
  g.fillStyle='rgba(226,224,218,.93)';g.fillRect(0,0,W,H);
  let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<140;i++){const x=rnd()*W,y=rnd()*H,r=20+rnd()*60;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
  g.globalCompositeOperation='destination-out';
  for(const p of WMAP.places){if(!p.open())continue;const x=p.x*W,y=p.y*H,r=p.r*W*1.25;const gr=g.createRadialGradient(x,y,r*.45,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
  g.globalCompositeOperation='source-over'};
 const im=$('wmImg');if(im.complete)draw();else im.onload=draw;
 el.querySelectorAll('[data-wm]').forEach(b=>b.onclick=()=>{const p=WMAP.places.find(q=>q.k===b.dataset.wm),o=p.open();
  el.querySelectorAll('.wmp.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');
  const T=p.tw&&TOWERS[p.tw];
  $('wmD').innerHTML=(o?`<b>${p.n}　${p.t}</b>${p.d}`:`<b>？？？</b>${p.hint||'霧に包まれていて、まだ見えない。'}${p.k==='judge'?'<br><small>第1章（マイスターの塔20F）をクリアすると、霧が晴れる</small>':''}`)
   +(sortie&&o&&T?(T.ready?`<div class="wmgo"><span>最高 ${towerFloor(p.tw)}F</span><button class="btn gold" id="wmGo">${T.n}へ出撃</button></div>`:`<div class="wmgo"><span>${T.soon}</span><button class="btn" disabled>準備中</button></div>`):'');
  const go=$('wmGo');if(go)go.onclick=()=>{el.classList.remove('on');T.go()}});
 if(sortie){const t=el.querySelector('[data-wm="tetto"]');if(t)t.click()}}

/* ---------- 工房：武器の鍛え直し（編成から移した） ---------- */
function openReforge(){const ms=ownedAll().filter(m=>m.weapon&&m.weapon.attr);
 $('gpBody').innerHTML=`<div class="gph">武器の鍛え直し</div><div class="note">鉄くず ${REFORGE_COST}個で、武器の属性をつけ直す（いま ${MIC('scrap',16)}${G.mats.scrap|0}）</div>
  ${ms.map(m=>{const w=m.weapon;return `<div class="rfr">${WPIC(m.id,40,w.rid&&RECIPES[w.rid]?RECIPES[w.rid].tier:0)}<span><b>${CHARS[m.id].name}　${w.rid&&RECIPES[w.rid]?RECIPES[w.rid].n:''}</b><small>${attrTxt(w.attr)}</small></span><button class="hexb rf" onclick="reforge('${m.id}')" ${(G.mats.scrap|0)<REFORGE_COST?'disabled':''}><span>鍛え直し</span></button></div>`}).join('')||'<div class="note">属性のついた武器がない</div>'}
  <div class="gpf"><button class="btn" id="rfX">とじる</button></div>`;
 $('genPick').classList.add('on');$('rfX').onclick=()=>$('genPick').classList.remove('on')}

/* ===================== お知らせ（ver1.0.0 第1章 公開） ===================== */
function openNews(){$('sheetT').textContent='お知らせ';
 $('sheetB').innerHTML=`<div class="news"><b>ver 2.4.8</b><ul><li>第3章の準備：無限の塔の「試練」とマイスターの図面を入れました。まだ遊べません</li></ul><b>ver 2.4.7</b><ul><li>第3章の準備：特許の図面の解読（スライドパズル）を入れました。まだ遊べません</li></ul><b>ver 2.4.6</b><ul><li>第3章の準備：新しい仲間の図面の解読「回転体を見極める」を入れました。まだ遊べません</li></ul><b>ver 2.4.5</b><ul><li>第3章の準備：工房の新しいしくみ（新しい加工・特許の図面）を入れました。まだ遊べません</li></ul><b>ver 2.4.4</b><ul><li>第3章の準備：新しい仲間たちの技・絆覚醒・チャットのしくみを入れました。まだ遊べません</li></ul><b>ver 2.4.3</b><ul><li>第3章「創技の塔」の準備を始めました（塔と物語のしくみ）。まだ遊べません。公開をお楽しみに</li></ul><b>ver 2.4.2</b><ul><li>匠の★を上げられるように：クリアした審判の塔の20階のボスを、もう一度倒すたびに「匠のかけら」が5個もらえる</li></ul></div><div class="news"><b>ver 2.4.1</b><ul><li>はじめて遊ぶ人向けに、編成と工房の画面を初めて開いたとき、使い方の説明が出るように</li></ul></div><div class="news"><b>ver 2.4.0</b><ul><li>はじめての人向けに「練習場」（チュートリアル）を追加。ホー博士の案内で、動き方・戦い方・レベルアップ・拾い方・出口を順に覚えられる。練習場を出ると、はじめてのガチャが1回無料</li><li>ガチャが毎日1回無料に（日本時間で日付が変わると、また引ける）</li><li>会話：「タップで次へ ▶」をボタンにして、押すと進むように。ボタンの列のすき間を押しても進む</li></ul></div><div class="news"><b>ver 2.3.3</b><ul><li>リブラの丁半：前に「丁か、半か」を読んでいた人ができなかったのを修正。もう一度チャットを読むと、一回だけ勝負できる</li></ul></div><div class="news"><b>ver 2.3.2</b><ul><li>チャット「丁か、半か」を初めて読み終えると、リブラと一回だけ丁半勝負ができるように（当たり500コイン、はずれでも100コイン。自分のコインは賭けない）</li></ul></div><div class="news"><b>ver 2.3.1</b><ul><li>ちがう章の仲間どうしのチャットを9本追加（追いかけっこ・昔のなかま・雷くらべ・ニャボの健康診断・段取り八分・天秤座・トゲとギター・腕相撲・年寄りの昼寝）。出てくる仲間を持っていて、審判の塔をクリアすると見られる</li></ul></div><div class="news"><b>ver 2.3.0</b><ul><li>第2章の仲間（vol.2）に絆覚醒が5組：天衣の祝福（セラフ×ハクロウ）・雷鳴の盾（ライオネクス×ガーディアン）・剛疾連拳（オカジュン×ハヤテ）・ニャボのおやつ便（ネロ×クロガネ）・判決の牙（リブラ×スピノボーン）</li><li>vol.2 の絆のチャット5本と、審判の塔の後日談のチャット11本を追加（審判の塔10F・20Fクリアで出る）</li><li>絆覚醒の一覧の条件の書き方を短く</li></ul></div><div class="news"><b>ver 2.2.4</b><ul><li>チャット・絆覚醒・ストーリーの画面を、画面いっぱいに広げて見やすく</li></ul></div><div class="news"><b>ver 2.2.3</b><ul><li>チャットの一覧：題名を左に、出てくる仲間の顔を右に横並びに。「絆」の印は題名の横に</li></ul></div><div class="news"><b>ver 2.2.2</b><ul><li>チャットの画面の上に「チャット・絆覚醒・ストーリー」のタブをいつも出すように</li><li>ストーリーは、塔ごとのタブ（マイスターの塔・審判の塔・無限の塔）で分けて見られるように</li></ul></div><div class="news"><b>ver 2.2.1</b><ul><li>絆覚醒が発動すると、2人が飛びこんでくるテロップが出るように</li><li>絆のチャットは、2人の武器をSランク以上にすると出るように。題名も「絆覚醒「○○」」にして分かりやすく。読み終わると、使い方の案内が出る</li><li>編成：絆覚醒できる2人は金色の枠になり、技の説明が出るように</li></ul></div><div class="news"><b>ver 2.2.0</b><ul><li>「進化」が「絆覚醒」に変わった：組み合わせの2人の技をどちらも覚醒させると発動し、合体の動きが加わる（威力は覚醒の1.5倍）</li><li>絆覚醒には、2人の「絆のチャット」を読んでおく必要がある。チャットの一覧で「絆」の印がついたもの</li><li>チャットの画面に「絆覚醒」ボタン：組み合わせと、条件のそろいぐあいが見られる</li><li>無限の塔：続きから始めても、覚醒と絆覚醒が残るように</li></ul></div><div class="news"><b>ver 2.1.5</b><ul><li>無限の塔・審判の塔のボスが仲間を呼んだとき、「匠空がドローンを呼んだ！」と出ていたのを修正。そのボスの名前で出て、その層の敵を呼ぶように</li></ul></div><div class="news"><b>ver 2.1.4</b><ul><li>「立ち上がる」能力（ギアフォックス・セラフ・クロガネ・チュータ）を見直し：1人25%ずつ、持っている仲間の分だけ足される（4人そろうと100%）。復活は今までどおり全員で1回だけ</li><li>立ち上がったときの文字を「仲間の力で立ち上がった！」に</li></ul></div><div class="news"><b>ver 2.1.3</b><ul><li>無限の塔：出撃の画面で、いまの編成と、この挑戦で覚えている技が見られるように。「編成を変える」ボタンも</li><li>無限の塔：続きから始めるとき、技は今の編成の仲間の分だけ残るように（外した仲間の技は消え、新しく入れた仲間の技は1から）。編成を入れかえるたびに技が増えていたのを修正</li><li>無限の塔：ギアフォックスなどの「1回だけ復活」が、帰って続きにするとまた使えたのを修正（1回の挑戦で1回だけ）</li></ul></div><div class="news"><b>ver 2.1.2</b><ul><li>ランキング：運営がランキングを見守れるように、名前と称号の文字もいっしょに送るように</li></ul></div><div class="news"><b>ver 2.1.1</b><ul><li>無限の塔：とちゅうでホームへ帰って「続きから」にすると、体力が全回復していたのを修正（帰ったときの体力とレベルのまま続く）</li></ul></div><div class="news"><b>ver 2.1.0</b><ul><li>「無限の塔」公開！ 審判の塔の20階をクリアすると、地図の雲海に出る</li><li>毎回1階・Lv1から、終わりのない塔を登る。とちゅうで帰っても、次は続きから。倒れたら挑戦はおしまい</li><li>10階ごとに、塔を建てた時代の何かを写しそこなったボスが待つ。登るほど、陣に残った記録が読めていく</li><li>ランキング開始：1回の挑戦で何階まで登れたかを全国で競う</li><li>新しい素材「ノイズの欠片」「記憶の結晶」（第3章で使えるようになる）</li></ul></div><div class="news"><b>ver 2.0.17</b><ul><li>（準備）無限の塔の絵（床・挿絵・素材のアイコン）を試験中。公開は ver2.1.0 から</li></ul></div><div class="news"><b>ver 2.0.16</b><ul><li>（準備）無限の塔とランキングを試験中。公開は ver2.1.0 から。審判の塔の20階をクリアすると、地図の雲海に塔の名前が出る</li></ul></div><div class="news"><b>ver 2.0.15</b><ul><li>特別な仲間の紹介のセリフを見直し</li></ul></div><div class="news"><b>ver 2.0.14</b><ul><li>SS がとりにくかった加工を見直し：打つ（輪がほぼ重なれば満点）・けがき（数点のずれは満点）・配線のはんだ付け（緑の帯の中なら満点）・穴あけ（押しはじめて緑に届くまでは減点しない）</li></ul></div><div class="news"><b>ver 2.0.13</b><ul><li>溶接（つなぐ）で SS がとれるように：線の近くは満点、当てた瞬間の速さの減点と、線に当てる前のはみ出しの減点をなくした</li></ul></div><div class="news"><b>ver 2.0.12</b><ul><li>セーブのコードとファイルを新しい形（MT2T.）に。書きかえたコードは読みこめないように</li><li>前の形のコード（MT2S.）は11月30日まで読めます。それまでに「セーブの守り」で新しいコードやファイルを取り直してください</li></ul></div><div class="news"><b>ver 2.0.11</b><ul><li>画面が切りかわる途中でタップすると、次の画面のボタンが勝手に押されることがあったのを修正（切りかわった直後の少しの間はタップを受けつけない）</li></ul></div><div class="news"><b>ver 2.0.10</b><ul><li>汎用武器で同じランクができたときは、今のと新しいのを並べて、どちらかを選べるように（残さないほうはコインに替える）</li></ul></div><div class="news"><b>ver 2.0.9</b><ul><li>ボスや敵の絵が読みこめず、丸で表示されることがあったのを修正（出撃の前に先に読みこむ）</li></ul></div><div class="news"><b>ver 2.0.8</b><ul><li>会話で表情の指定がないセリフも、審判の塔の仲間と匠は会話用の表情の絵を出すように</li></ul></div><div class="news"><b>ver 2.0.7</b><ul><li>会話の顔の絵がずれて見えるキャラが多かったのを修正（顔アイコンを使う）</li><li>会話で、前の人の顔が残って見えることがあったのを修正（絵が読みこめてから出す）</li><li>審判の塔のボスが話すとき、ボスの絵を出すように</li></ul></div><div class="news"><b>ver 2.0.6</b><ul><li>キャラの絵の読みこみに失敗すると、丸のまま表示され続けることがある不具合を修正（失敗したら読み直す）</li></ul></div><div class="news"><b>ver 2.0.5</b><ul><li>審判の塔の出撃先の説明を、審判の塔の言葉（ざわめきLv・判決の時）に</li></ul></div><div class="news"><b>ver 2.0.4</b><ul><li>汎用武器は種類ごとに1本。今より低いランクができたときは、換金所の値段ぶんのコインに替えるように（前は素材だけが減っていた）</li></ul></div><div class="news"><b>ver 2.0.3</b><ul><li>匠の顔アイコン・会話の表情・専用武器のアイコンを新しい絵に</li></ul></div><div class="news"><b>ver 2.0.2</b><ul><li>審判の塔では、長居で敵が強くなる段階を「ざわめきLv」に（知らせの文も審判の塔に合わせた）</li></ul></div><div class="news"><b>ver 2.0.1</b><ul><li>審判の塔では、1つの階に長くいると「判決の時」（第1章の錆の大波と同じ削れ方。画面が白黒に点滅し、木槌が鳴る）</li></ul></div><div class="news"><b>ver 2.0.0</b><ul><li>第2章「審判の塔」公開（11/17 0:00から。第1章をクリアすると地図に出る）</li><li>審判の仲間ガチャ（vol.2）・お助けの仲間・段階5の装備・限定工具</li><li>vol.2 の図面は展開図で解読。道場で展開図の練習も</li></ul></div><div class="news"><b>ver 1.11.1</b><ul><li>やすりがけをやさしく：バリの高さのばらつきを小さく、高い所から削れて平らになりやすく、線ぴったりの許す幅を少し広く</li></ul></div><div class="news"><b>ver 1.11.0</b><ul><li>加工ミニゲーム道場で「三面図の解読」を練習できるように</li><li>（準備）vol.2 の図面は、立方体の展開図の問題で解読するように</li></ul></div><div class="news"><b>ver 1.10.10</b><ul><li>PCの大きな画面やブラウザの縮小表示で、敵が出てこなくなる不具合を修正</li></ul></div><div class="news"><b>ver 1.10.9</b><ul><li>出撃中に、まれにスティックが出ず動けなくなることがある不具合への対策</li><li>動けなくなったときは、画面を2回さわると再開できるように</li></ul></div><div class="news"><b>ver 1.10.8</b><ul><li>プレゼントコードで受け取れる特別な仲間を、もう一人追加（ガチャには出ません）</li></ul></div><div class="news"><b>ver 1.10.7</b><ul><li>特別な仲間の顔アイコンと武器アイコンを新しい絵に変更</li></ul></div><div class="news"><b>ver 1.10.6</b><ul><li>プレゼントコードで受け取れる特別な仲間を、もう一人追加（ガチャには出ません）</li></ul></div><div class="news"><b>ver 1.10.5</b><ul><li>プレゼントコードで受け取れる特別な仲間を、もう一人追加（ガチャには出ません）</li></ul></div><div class="news"><b>ver 1.10.4</b><ul><li>一部の仲間の顔アイコンが大きく写っていたのを、ほかの仲間とそろえた</li></ul></div><div class="news"><b>ver 1.10.3</b><ul><li>プレゼントコードで受け取れる特別な仲間を、もう一人追加（ガチャには出ません）</li></ul></div><div class="news"><b>ver 1.10.2</b><ul><li>第2章の準備（素材・装備・ガチャ vol.2）を試験中。公開は ver2.0.0 から</li></ul></div><div class="news"><b>ver 1.10.1</b><ul><li>第2章の準備（会話）を試験中。公開は ver2.0.0 から</li></ul></div><div class="news"><b>ver 1.10.0</b><ul><li>中級の工具（溶接機・旋盤・ボール盤／電工ペンチ・はんだごて・タップハンドル）は、塔の中層・上層の資材の箱で必ず見つかるようにした。店では、その層のボスを倒すと高い値段で買える</li><li>工房の上のタブのアイコンをなくし、文字だけにそろえた</li></ul></div><div class="news"><b>ver 1.9.7</b><ul><li>図面ガチャから、まだ出ないはずの図面が出ることがあったのを直した</li></ul></div><div class="news"><b>ver 1.9.6</b><ul><li>メニューの「プレゼントコード」の絵文字をなくした</li></ul></div><div class="news"><b>ver 1.9.5</b><ul><li>メニューを整理：ホームにある「チャット」をメニューから外し、かわりに「お知らせ」を入れた</li></ul></div><div class="news"><b>ver 1.9.4</b><ul><li>プレゼントコードで図面も受け取れるようにした</li></ul></div><div class="news"><b>ver 1.9.3</b><ul><li>特別な仲間の武器のアイコンを新しい絵にした</li></ul></div><div class="news"><b>ver 1.9.2</b><ul><li>新しいバージョンが出ていたら、画面の上に「更新する」ボタンが出るようにした</li></ul></div><div class="news"><b>ver 1.9.1</b><ul><li>プレゼントコードで受け取れる特別な仲間を追加（ガチャには出ません）</li></ul></div><div class="news"><b>ver 1.9.0</b><ul><li>メニューに「プレゼントコード」を追加。運営からもらったコードで、コインや特別な仲間を受け取れる</li></ul></div><div class="news"><b>ver 1.8.3</b><ul><li>ランキングの名前と称号の一覧には、使えるものだけを出すようにした</li></ul></div><div class="news"><b>ver 1.8.2</b><ul><li>ウルフの会話の表情（笑う・真剣・困る）と顔アイコンを新しい絵にした</li></ul></div><div class="news"><b>ver 1.8.1</b><ul><li>噴射安全靴の絵が、第2章の防具の絵になっていたのを直した</li></ul></div><div class="news"><b>ver 1.8.0</b><ul><li>メニューに「バグを報告」を追加。おかしなところを運営に直接送れるようにした</li><li>ランキングのプロフィールに、称号とアイコン（持っているキャラから選べる）を追加。名前の単語はサイコロ版と同じになった</li><li>サイコロ版マイスターの塔から、ID・名前・称号・アイコンと、解放した単語・称号を引き継げるようにした</li></ul></div><div class="news"><b>ver 1.7.7</b><ul><li>ランキングの説明を「無限の塔の攻略階数（何階まで登ったか）」に直した</li></ul></div><div class="news"><b>ver 1.7.6</b><ul><li>ホームに「ランキング」を追加。名前（3つの単語の組み合わせ）を登録できるようにした。ランキングは無限の塔（ver2.0.0）から</li><li>ホームの一番下の到達階の表示をなくした</li></ul></div><div class="news"><b>ver 1.7.5</b><ul><li>第2章の準備：ガチャ vol.2 の仲間10人（技・能力・専用武器・お守り）を試験中。公開は ver2.0.0 から</li></ul></div><div class="news"><b>ver 1.7.4</b><ul><li>新しいお知らせがあるとき、ホームの帯に「NEWS」で出るようにした（読むといつもの NEXT にもどる）</li></ul>
  <b>ver 1.7.3</b><ul><li>工房「つくる」の専用武器を「専用武器 vol1」→ キャラ の2段にした（第2章の仲間は vol2 にまとまる）</li></ul>
  <b>ver 1.7.2</b><ul><li>換金所で段階4の装備の値段が「NaN」になっていた不具合を直した（B 150コイン）</li><li>ドド先輩の衝撃波とネズミの応急修理のアイコンを、工具の絵から拳とハートの絵に変えた（工具を武器にしない）</li></ul>
  <b>ver 1.7.1</b><ul><li>審判の塔の床を新しい絵に（法廷・書庫・雷雲）。第2章の仲間のアイコン・表情・装備の絵を準備</li></ul>
  <b>ver 1.7.0</b><ul><li>審判の塔に階のルールを3種類：白黒の床（2・3・8F）、鏡（5・13F）、雷鳴（18F）</li></ul>
  <b>ver 1.6.1</b><ul><li>審判の塔6Fのボス「クラガード」の絵を入れた</li></ul>
  <b>ver 1.6.0</b><ul><li>第2章「審判の塔」の試し遊び版を入れた（白黒の魔物13種・ボス7体）。まだ準備中で、ふつうには出撃できない</li></ul>
  <b>ver 1.5.0　出撃は世界地図から</b><ul><li>「出撃」を押すと世界地図が開き、出撃する塔を選べるようにした（第2章「審判の塔」は第1章クリアで地図に出る。公開は ver2.0.0）</li></ul>
  <b>ver 1.4.4</b><ul><li>ホームとメニューから「地図」をなくした（今は使う場面がないため）</li></ul>
  <b>ver 1.4.3</b><ul><li>ホーム：攻撃・体力の数字が途切れないように。「編成 ›」ボタンは下のタブと重なるのでなくした</li></ul>
  <b>ver 1.4.2</b><ul><li>編成画面：専用武器の表示が★やボタンに重なっていたので、キャラ絵の下の帯に移した</li></ul>
  <b>ver 1.4.1</b><ul><li>編成画面：キャラの名前の下に、いま付けている専用武器を表示。タップで入れかえ。「工房でつくる」は右の欄へ</li></ul>
  <b>ver 1.4.0　汎用武器の「支援」</b><ul><li>パーティにいるキャラと同じ動きの汎用武器は「支援」になり、そのキャラの攻撃が上がる（C+5%・B+8%・A+12%・S+16%・SS+20%）。リーダーと同じ動きでも付けられる</li><li>編成画面：専用武器は上の「武器 変える」から。下の列は「チーム装備（汎用・防具）」にまとめた</li></ul>
  <b>ver 1.3.1</b><ul><li>編成画面で仲間を選ぶと、下の「専用」の枠がその仲間の武器になり、リーダー以外の専用武器も入れかえられるようにした</li></ul>
  <b>ver 1.3.0　会話のふりかえり</b><ul><li>会話中に「◀ もどる」でひとつ前のセリフへ、「ログ」でここまでのセリフを一覧できる</li><li>メニューとチャット画面に「ストーリーをふりかえる」。見た場面をもう一度見られる（前のセーブで見た場面も出てくる）</li></ul>
  <b>ver 1.2.5</b><ul><li>20Fのボス戦の前と、たおしたあとの場面に挿絵を追加</li></ul>
  <b>ver 1.2.4</b><ul><li>ボスをたおしたあと、残った敵にやられてHPが0になってもゲームが終わらない不具合を直した（ボスをたおすと残りの敵も消え、その階の時間も止まる）</li></ul>
  <b>ver 1.2.3</b><ul><li>見直し：資材の箱にコインが入っていたときも受け取れるように。ホームで会話中は、保存・引き継ぎの案内を出さないように</li></ul>
  <b>ver 1.2.2</b><ul><li>錆の大波のあとに次の階へ上がっても、画面のオレンジの点滅が消えなかった不具合を直した</li></ul>
  <b>ver 1.2.1</b><ul><li>1つの階にいられるのは5分まで。のこり1分で知らせ、5分をこえると「錆の大波」でHPがけずれ続ける</li><li>錆が出てからは、もらえる経験値がだんだん減る（5分で0）</li></ul>
  <b>ver 1.2.0</b><ul><li>工房の「つくる」を、仲間ごと・汎用・防具のまとまりで開け閉めできるようにした（専用武器はキャラごと）</li><li>工房の「工具」を「店で買える／持っている／まだ店にない」に分けた</li><li>スクロールすると下のタブが動いてしまう不具合を直した</li></ul>
  <b>ver 1.1.1</b><ul><li>資材の箱をあけると一時停止して、出たもの（素材・図面・工具）を確認できる</li></ul>
  <b>ver 1.1.0　セーブの守り・引き継ぎ</b><ul>
  <li>セーブの守り：ファイルに保存・引っ越しコード・端末の中の控え（3日分）・ひとつ前にもどす</li>
  <li>マイスターの塔（サイコロ版）から、仲間とコイン（上限1,350）を1回だけ引き継げる</li>
  <li>同じ階に長くいると「錆Lv」が上がり、敵がどんどん強くなる</li>
  <li>ホームの上にコインの所持数を表示。帯のデザインを新しくした</li></ul>
  <b>ver 1.0.0　第1章「夜の工房に灯る」公開</b><ul>
  <li>マイスターの塔 1〜20F。後編（11F〜）の試作の層・発電の層・空の層・頂上を追加</li>
  <li>4段目（肆）の装備と、新しい素材（チタン・蓄電池・カーボン繊維）</li>
  <li>ボスの宝箱：強化3つ＋コイン。ふつうの敵もコインを落とす</li>
  <li>ポーズ画面で、いまの技と能力を確認できる</li>
  <li>世界地図。章が進むと霧が晴れる</li>
  <li>チャット（仲間どうしの掛け合い）39本</li></ul>
  <b>次の予定</b><ul><li>ver2.0.0　第2章「審判の塔」と「無限の塔」</li></ul></div><button class="btn ghost" id="nsX">閉じる</button>`;
 $('nsX').onclick=closeSheet;$('sheet').classList.add('on')}

/* ---------- ボスの宝箱を取らずに階段へ行ったら、先に宝箱をあける ---------- */
{const _s=fStairs;fStairs=async function(){const c=FD&&FD.chests.find(x=>x.boss&&!x.open);if(c&&!FD.climbing){fOpenChest(c);return}return _s()}}
/* ---------- ふつうの資材の箱：ばらまかずに一時停止して中身を見せ、そのまま受け取る ---------- */
{const _o=fOpenChest;fOpenChest=function(c){if(c.boss)return _o(c);const D=FD,n0=D.items.length;_o(c);
 const got=D.items.splice(n0),cnt={},rows=[];
 for(const it of got){if(it.k==='bp'){D.lootBps.push(it.id);rows.push({ic:UIMG('m_bp',44),n:'図面',d:`「${RECIPES[it.id].n}」`})}
  else if(it.k==='coin'){D.coin=(D.coin||0)+(it.v||1);cnt.coin=(cnt.coin||0)+(it.v||1)}else if(it.k==='tool'){D.lootTools.push(it.id);rows.push({ic:UIMG(UI_IC[it.id]||'m_bp',44),n:'工具',d:`「${TOOLS[it.id].n}」`})}
  else{D.loot[it.k]=(D.loot[it.k]||0)+1;cnt[it.k]=(cnt[it.k]||0)+1}}
 Object.keys(cnt).forEach(k=>rows.unshift(k==='coin'?{ic:UIMG('coin',44),n:'コイン',d:`+${cnt[k]}`}:{ic:MIC(k,44),n:MATS[k]?MATS[k].n:k,d:`×${cnt[k]}`}));
 if(!rows.length)return;D.paused=true;fReleaseStick();renderFHud();
 let el=$('fChest');if(!el){el=document.createElement('div');el.className='fov';el.id='fChest';$('fPause').parentNode.appendChild(el)}
 el.innerHTML=`<div class="fcard chb"><div class="chh">資材の箱オープン</div>${rows.map((r,i)=>`<div class="chr" style="animation-delay:${i*120}ms">${r.ic}<span><b>${r.n}</b><small>${r.d}</small></span></div>`).join('')}<button class="btn gold" id="chOk">OK</button></div>`;
 el.classList.add('on');$('chOk').onclick=()=>{el.classList.remove('on');if(FD===D){D.paused=false;fLast=0}}}}

/* 錆の大波：画面を錆色にそめる */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(!D.wave||D.boss||(typeof towerAt==='function'&&towerAt()==='judge'))return;g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=.18+.1*Math.sin(D.t*6);g.fillStyle='#b4461a';g.fillRect(0,0,g.canvas.width,g.canvas.height);g.restore()}}
/* ホームの帯：まだ読んでいない新しいお知らせがあれば「NEWS」、読んだらいつもの NEXT */
const NEWS_SRC=openNews.toString();
const newsHead=()=>{const m=NEWS_SRC.match(/<li>(.*?)<\/li>/);return m?m[1].replace(/<[^>]+>/g,''):''};
{const _on=openNews;openNews=function(){const r=_on.apply(this,arguments);if(OPT.newsSeen!==VERSION){OPT.newsSeen=VERSION;saveOpt()}const b=$('hBanner');if(b&&onScr('home'))renderNewsBand();return r}}
function renderNewsBand(){const b=$('hBanner');if(!b||!G)return;b.classList.remove('news');
 if(OPT.newsSeen===VERSION){if(typeof openHome==='function'&&b.dataset.nb){delete b.dataset.nb;const g=nextGoal();b.innerHTML=`<span class="nx">NEXT</span><span class="nm">${g.m}</span><span class="na">→</span>`;b.onclick=()=>g.go==='go'?openSortie():goTab(g.go)}return}
 b.dataset.nb=1;b.classList.add('news');b.innerHTML=`<span class="nx">NEWS</span><span class="nm">ver ${VERSION}　${newsHead()}</span><span class="na">→</span>`;b.onclick=()=>openNews()}
{const _oh3=openHome;openHome=function(){const r=_oh3.apply(this,arguments);renderNewsBand();return r}}
