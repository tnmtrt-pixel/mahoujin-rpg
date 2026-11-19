/* ===================== vol.2 の絆覚醒とチャット（ver2.3.0） =====================
 * 絆覚醒（組み合わせ・合体の動き）：
 *   セラフ×ハクロウ「天衣の祝福」　風の衣がやぶれたとき、光の輪が広がって体力を回復
 *   ライオネクス×ガーディアン「雷鳴の盾」　雷が落ちたあとしばらく、盾のトゲに雷がやどり、近くの敵へ雷が走る
 *   オカジュン×ハヤテ「剛疾連拳」　ハヤテの連打のたびに、オカジュンのためが早くたまる
 *   ネロ×クロガネ「ニャボのおやつ便」　走り回るニャボが、通った場所に飴の罠を置いていく
 *   リブラ×スピノボーン「判決の牙」　黒のサイコロが当たった敵に印。化石の牙がその敵にもう一度かみつく（2倍）
 * チャット：絆のチャット5本（武器がSランク以上で出る）＋補足11本（審判の塔の後日談10本と「丁か、半か」）
 *   補足は tw/fl で出る：審判の塔の前半の仲間（ハヤテ・リブラ・クロガネ・ネロ）は10Fクリア、後半は20Fクリア */
EVO.push(['seraph','hakurou','天衣の祝福','風の衣がやぶれたとき、光の輪が広がって体力を回復'],
 ['lionex','guardian','雷鳴の盾','雷が落ちたあと、盾のトゲに雷がやどり、近くの敵へ雷が走る'],
 ['okajun','hayate','剛疾連拳','ハヤテの連打のたびに、オカジュンのためが早くたまる'],
 ['nero','kurogane','ニャボのおやつ便','走り回るニャボが、通った場所に飴の罠を置いていく'],
 ['libra','spino','判決の牙','黒のサイコロが当たった敵に印。化石の牙がその敵に2倍でかみつく']);
Object.assign(EVO_IC,{seraph:'u_evo',lionex:'u_evo',okajun:'u_evo',nero:'u_evo',libra:'u_evo'});
Object.assign(BOND_CHAT,{seraph:'c_b_seraph',lionex:'c_b_lionex',okajun:'c_b_okajun',nero:'c_b_nero',libra:'c_b_libra'});

/* ---------- 合体の動き ---------- */
{const _fa=fAttacks;fAttacks=function(f){const D=FD,c=D&&D.cd,hb=c&&c.hayate,V0=D&&D.v2,ch0=V0?V0.charge:0,rb0=V0&&V0.robe?V0.robe.hp:null;_fa(f);
 const E=D&&D.evo,V=D&&D.v2;if(!E||!V||FD!==D)return;
 /* 天衣の祝福：衣がやぶれた瞬間 */
 if(E.seraph&&rb0>0&&V.robe&&V.robe.hp<=0){v2Heal(D.maxhp*.15);D.waves.push({x:D.x,y:D.y,r:20,max:160,dmg:12*fPow('seraph'),kb:8,hit:new Set()});V2FX.push({k:'burst',x:D.x,y:D.y,r:120,t:0,life:16})}
 /* 雷鳴の盾：雷が落ちたあと約5秒、盾から雷が走る */
 if(E.lionex){if(ch0>0&&V.charge===0)V.zap=300;if(V.zap>0){V.zap-=f;V.zt=(V.zt||0)+f;
  if(V.zt>=30){V.zt=0;nearestFoes(2,D.x,D.y,140).forEach(e=>{fDamage(e,14*fPow('guardian'),0,0);V2FX.push({k:'jab',x:D.x,y:D.y-12,x2:e.x,y2:e.y,t:0,life:8})});tone(1400,.04,'sawtooth',.03,700)}}}
 /* 剛疾連拳：ハヤテが打ったら、オカジュンのためが進む */
 if(E.okajun&&c&&hb!=null&&c.hayate>hb&&c.okajun!=null)c.okajun-=6;
 /* ニャボのおやつ便：ニャボが飴の罠を置く */
 if(E.nero&&V.pets.length){V.drop=(V.drop||0)+f;if(V.drop>=90){V.drop=0;const dmg=2*fPow('nero');V.pets.forEach(p=>V.traps.push({x:p.x,y:p.y,r:26,t:0,life:180,dmg}));if(V.traps.length>16)V.traps.splice(0,V.traps.length-16)}}
 /* 判決の牙：黒のサイコロの印と、印の敵へのもう一かみ */
 if(E.libra){for(const s of V.dice)if(s.k==='b')s.hit.forEach(id=>{const e=D.foes.find(o=>o.id===id);if(e)e.mark=300});
  for(const e of D.foes)if(e.mark>0)e.mark-=f;
  for(const b of V.bites)if(b.done&&!b.mk){b.mk=1;for(const e of D.foes)if(e.mark>0&&(e.x-b.x)**2+(e.y-b.y)**2<(b.r+e.r)**2){fDamage(e,b.dmg*(e.big||e.boss?2:1),0,0);e.mark=0}}}}}
/* 判決の牙：印の敵の頭に黒い天秤の印 */
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);if(!D.evo||!D.evo.libra)return;g.save();for(const e of D.foes){if(!(e.mark>0))continue;g.globalAlpha=.6+.4*Math.sin(D.t*8);g.fillStyle='#1a1a22';g.strokeStyle='#fff';g.lineWidth=2;
 g.beginPath();g.arc(e.x,e.y-e.r-14,8,0,TAU);g.fill();g.stroke()}g.restore()}}

/* ---------- チャット ---------- */
{const NE='ネロ',OK='オカジュン',HY='ハヤテ',KG='クロガネ',LX='ライオネクス',SR_='セラフ',HK_='ハクロウ',GD='ガーディアン',LB_='リブラ',SP='スピノボーン',W='ウルフ',MO_='チュータ',TK_='匠',DD_='ドド先輩';
 const N=t=>[null,'',t];
 CHATS.push(
  /* 絆のチャット（武器がSランク以上で出る。題名は絆覚醒「技名」） */
  {id:'c_b_seraph',t:'天衣の祝福',st:0,who:['seraph','hakurou'],L:[['hakurou',HK_,'風の衣は、やぶれるためにある。受けとめた分だけ、風になる。'],['seraph:smile',SR_,'じゃあ、やぶれたら、わたしが光で包むね。'],['hakurou',HK_,'……案内役が二人、か。見届けるだけでは、なくなったな。']]},
  {id:'c_b_lionex',t:'雷鳴の盾',st:0,who:['lionex','guardian'],L:[['lionex:serious',LX,'我の雷は、狙いを外せば仲間も焼く。'],['guardian',GD,'ならば、我の盾で受けよう。……トゲは、もう人を遠ざけるためのものではない。'],['lionex:smile',LX,'……そなたの盾になら、雷を預けられる。']]},
  {id:'c_b_okajun',t:'剛疾連拳',st:0,who:['okajun','hayate'],L:[['hayate',HY,'僕が先に打って、敵の動きを確かめます。'],['okajun',OK,'……で、俺がためて、ぶん殴る、と。'],['hayate:smile',HY,'はい。速さは、確かめるために使うって決めたので。'],['okajun:smile',OK,'……悪くねぇ。殴り返すより、ずっといい。']]},
  {id:'c_b_nero',t:'ニャボのおやつ便',st:0,who:['nero','kurogane'],L:[['nero',NE,'ねえ、ニャボたちに、あたしの飴を運んでもらえないかな。'],['kurogane',KG,'オイラのニャボは、ちゃんと運ぶニャ。……なくさないように、しっかり持たせるニャ。'],['nero:smile',NE,'ふふ。今度は、本当のことだけを甘くして配るの。']]},
  {id:'c_b_libra',t:'判決の牙',st:0,who:['libra','spino'],L:[['libra:serious',LB_,'黒のサイコロが示した相手は、重い罪を抱えている。……あなたの牙で、量りきって。'],['spino',SP,'オレさまの牙は、昔の栄光のためじゃねぇ。今、目の前のやつのためだ。ガラガラ。'],['libra:worry',LB_,'……昔の決まりにしがみついていたのは、わたしも同じだったわ。']]},
  /* 補足：審判の塔の後日談（前半の仲間は10Fクリア） */
  {id:'c_j_hayate',t:'謝りに行った日',tw:'judge',fl:10,st:3,who:['hayate'],L:[['hayate',HY,'……行ってきました。けがをさせてしまった、あの人のところへ。'],['wolf',W,'どうだった？'],['hayate:worry',HY,'何も言われませんでした。ただ、包帯の取れた手で、僕の肩をそっとたたいてくれて……'],['hayate:smile',HY,'次は、確かめてから走ります。一歩ずつ、ですね。']]},
  {id:'c_j_kurogane',t:'なくした部品',tw:'judge',fl:10,st:3,who:['kurogane'],L:[['kurogane',KG,'ニャボ隊、総出で探すニャ！ あの日なくした部品ニャ！'],N('三日後、ニャボの一体が、棚のすき間から小さな歯車をくわえて出てきた。'),['kurogane:worry',KG,'……あったニャ。オイラが、自分で落としてたニャ。……ちゃんと、持ち主に返しに行くニャ。']]},
  {id:'c_j_nero',t:'本当のことだけ',tw:'judge',fl:10,st:3,who:['nero'],L:[['nero',NE,'だました人たちに、お菓子を持って謝りに行ってきたの。'],['mouse',MO_,'受け取ってもらえたチュー？'],['nero:worry',NE,'半分くらい。……残りの半分は、また甘い言葉だと思われちゃった。'],['nero:smile',NE,'でもいいの。本当のことだけを、何回でも甘くして届けるから。']]},
  {id:'c_j_libra',t:'掟の書の続き',tw:'judge',fl:10,st:3,who:['libra'],L:[['libra',LB_,'掟の書に、新しいページを足したの。'],['takumi',TK_,'何て書いたの？'],['libra:smile',LB_,'「過ちを認めた者は、直し続ける権利を持つ」。……天秤が量るのは、罪の重さだけじゃなくていいと思ったから。']]},
  /* 補足：後半の仲間は20Fクリア */
  {id:'c_j_okajun',t:'殴る代わりに',tw:'judge',fl:20,st:7,who:['okajun'],L:[N('路地裏で、昔のけんか仲間がオカジュンを取りかこんだ。'),[null,'けんか仲間','おい、オカジュン。やられっぱなしかよ。'],['okajun:serious',OK,'……ああ。で、お前ら、なんで俺に殴りかかりたいんだ。話してみろ。'],N('その夜、路地裏から聞こえたのは、殴り合いではなく、長い長い話し声だった。')]},
  {id:'c_j_spino',t:'今の足で',tw:'judge',fl:20,st:7,who:['spino'],L:[['spino:smile',SP,'見ろ、ウルフ。オレさまの最強の記録、工房の壁に飾ってやったぜ。ガラガラ。'],['wolf',W,'……寄りかからねぇんじゃなかったのか？'],['spino',SP,'飾るのと、寄りかかるのはちがうんだよ。これは証だ。……毎朝見て、今日の足で歩くためのな。']]},
  {id:'c_j_lionex',t:'卑怯者と呼んだ相手',tw:'judge',fl:20,st:7,who:['lionex'],L:[['lionex',LX,'会ってきた。我が「卑怯者」と呼んだ、あの若者に。'],['wolf',W,'……なんて言ったんだ？'],['lionex:serious',LX,'「あの日、我は負けた。そなたは卑怯ではなかった」と。……若者は、しばらく黙って、それから笑った。'],['lionex:smile',LX,'王であったころより、今のほうが、ずっと胸が軽い。']]},
  {id:'c_j_guardian',t:'盾の向き',tw:'judge',fl:20,st:7,who:['guardian','dodo'],L:[['guardian',GD,'……ドド先輩。前に立つとき、盾はどう構える。'],['dodo',DD_,'えへへ〜、ぼくは盾ないから、おなかで受けてるよ〜。'],['guardian:smile',GD,'……そうか。守るとは、まず前に立つことなのだな。'],N('ガーディアンの盾が、はじめて自分ではなく、仲間のほうへ向けて構えられた。')]},
  {id:'c_j_seraph',t:'祝福の練習',tw:'judge',fl:20,st:7,who:['seraph'],L:[['seraph',SR_,'おはよう、祝福を。……ちがうな。おはよう、今日もよい日を。……うーん。'],['wolf',W,'何してんだ？'],['seraph:worry',SR_,'だれにでも、ちゃんと届く祝福の言葉を探してるの。審判の塔の外では、まだ慣れなくて。'],['seraph:smile',SR_,'……ウルフ、今日もおつかれさま。これ、どうかな？']]},
  {id:'c_j_hakurou',t:'風の行き先',tw:'judge',fl:20,st:7,who:['hakurou'],L:[['hakurou',HK_,'風が、東の海の向こうへ吹いている。'],['mouse',MO_,'東って……創技の塔チュー？'],['hakurou:serious',HK_,'金色の港町から、何かがきしむ音がする。……新しい技が生まれる場所で、何かが止まりかけている。'],['hakurou',HK_,'行くがいい。風は、もう吹いている。']]},
  {id:'c_j_chohan',t:'丁か、半か',tw:'judge',fl:20,st:7,who:['okajun','nero','libra'],L:[N('工房のすみで、白と黒のサイコロが転がる音がしている。'),['okajun',OK,'……丁だ。'],['nero:smile',NE,'じゃあ、あたしは半。負けたら飴、三つね。'],N('カラン、コロン。'),['nero:smile',NE,'半！ はい、飴三つ。'],['okajun:serious',OK,'……もう一回だ。やられたら、やり返す。'],['nero',NE,'それ、やめたんじゃなかったっけ〜？'],['libra:serious',LB_,'……何をしているのかしら。'],[null,'オカジュン・ネロ','あっ。'],['libra:serious',LB_,'それは、罪の重さを量るためのサイコロよ。飴の重さを量るためのものじゃないわ。'],['nero:worry',NE,'で、でも、ちゃんと公平だったよ？ 天秤のサイコロだもん。'],['libra',LB_,'……公平なのは、いいことね。'],N('リブラは二人の前にすわり、サイコロを手に取った。'),['libra:smile',LB_,'では、わたしは丁。負けたら、二人とも工房の掃除よ。'],[null,'オカジュン・ネロ','えっ。']]});
 /* 審判の塔の階で出る（20Fは塔のクリアまで） */
 const _co=chatOpen;chatOpen=c=>{if(c.tw)return(c.fl>=20?!!(G.flags&&G.flags['tw_'+c.tw]):towerFloor(c.tw)>=c.fl)&&c.who.every(id=>id==='wolf'||!!owned(id));return _co(c)}}
