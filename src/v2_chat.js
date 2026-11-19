/* ===================== チャット（テイルズのスキットのような、仲間どうしの短い掛け合い） =====================
   st：どこまで登ったら出るか（0＝はじめから、1＝3Fクリア、2＝6Fクリア、3＝10Fクリア）
   who：出るのに必要な仲間（持っていること。ウルフはいつもいる）
   魔法陣のときの「町の会話」を、塔の話に合わせて直したもの */
const CHATS=(()=>{const W='ウルフ',FX='ギアフォックス',DD='ドド先輩',OW='ホー博士',GR='ボルトゴリラ',MO='チュータ',RB='メカロボ',TK='ツキヨ',OM='オンミョウ',RK='セブンティーン';
return [
 /* ---------- はじめから ---------- */
 {id:'c_wolf1',t:'休憩もトレーニング？',st:0,who:['wolf'],L:[['wolf',W,'休憩もトレーニングのうちだって、博士が言ってた。'],['wolf:worry',W,'……ほんとかよ。じっとしてると、腕がなまりそうなんだけど。'],['wolf:smile',W,'よし、工房で刃物でも研ぐか。いい刃物は、いい仕事をする！']]},
 {id:'c_fox1',t:'設計どおり！',st:0,who:['fox'],L:[['fox',FX,'塔の入口の手すり、ボルトが一本ゆるんでたから直しといた！ 設計どおり！'],['wolf',W,'いつの間に……。'],['fox',FX,'ねぇ、工房の旋盤、あとで分解していい？'],['wolf:worry',W,'だめだ。'],['fox',FX,'……冗談だよ、たぶん。']]},
 {id:'c_dodo1',t:'五分だけ〜',st:0,who:['dodo'],L:[['dodo',DD,'ふわぁ……。ちょっとだけ寝ていい？ 五分だけ〜。'],['wolf',W,'先輩、まだ1階も登ってないっす。'],['dodo',DD,'あせらなくていいよ〜。でも、オイルは持っていこうね。'],['dodo',DD,'前はぼくが立つから、きみは思いきり行っていいよ〜。']]},
 {id:'c_owl1',t:'錆の円',st:0,who:['owl'],L:[['owl',OW,'ホッホッ。錆の出た場所を地図に記してみたんじゃが……。'],['wolf',W,'……円になってる？'],['owl',OW,'うむ。ただの錆なら、こうはきれいに並ばん。'],['owl',OW,'やはり、何かの「陣」じゃのう。']]},
 {id:'c_gorilla0',t:'停電の原因',st:0,who:['gorilla'],L:[['gorilla',GR,'停電の原因？ 錆の連中が電線をかじってやがるんだ、ウホッ。'],['gorilla',GR,'フルパワーでぶっ飛ばしてぇところだが……あいつら、電気が効きにくい。'],['wolf',W,'電気が効かない？'],['gorilla',GR,'何か秘密があるはずだ。俺の勘がそう言ってる。']]},
 {id:'c_robo0',t:'動かないロボ',st:0,who:['mouse','robot'],L:[['mouse',MO,'チュー……メカロボが動かなくなっちゃった。'],['robot',RB,'ピ……ガ……システム……エラー……サビ……検出……'],['mouse',MO,'錆が関節に入りこんだみたい。修理しなきゃ……。'],['mouse',MO,'工房のスパナ、貸してもらえないかな。']]},
 {id:'c_tsukiyo0',t:'星が告げてる',st:0,who:['tsukiyo'],L:[['tsukiyo',TK,'今夜は星がよく見える。街の灯りが消えたせいだね。'],['wolf',W,'星なんて、見てる余裕ないって。'],['tsukiyo',TK,'ふふ。星が告げてる。きみたちの道は、塔の門の向こうから始まるって。']]},
 {id:'c_onmyo0',t:'陰の気',st:0,who:['onmyo'],L:[['onmyo',OM,'……その門の先から、陰の気が流れてくる。'],['wolf',W,'陰の気？ 錆のことか？'],['onmyo',OM,'……陰と陽、どちらに転ぶか。見届けさせてもらおう。']]},
 {id:'c_rocker0',t:'静かな街',st:0,who:['rocker'],L:[['rocker',RK,'よう。街が静かすぎて、ギターの音がよく響くぜ。'],['rocker',RK,'錆の連中、いいリズムで攻めてきやがる。'],['wolf',W,'のんきだな……。'],['rocker',RK,'俺の出番は、もう少し先だ。']]},
 /* ---------- 下層クリア（3F） ---------- */
 {id:'c_gorilla1',t:'下がり続ける電圧',st:1,who:['gorilla'],L:[['gorilla',GR,'路地の番人を倒したって？ やるじゃねぇか、ウホッ！'],['gorilla',GR,'けど変だな。錆を倒したのに、電圧が下がり続けてる。'],['wolf',W,'まだ、どこかで電気を食ってるやつがいる……？'],['gorilla',GR,'そういうこった。']]},
 {id:'c_robo1',t:'スパナで',st:1,who:['mouse','robot'],L:[['mouse',MO,'スパナで関節は少し動いたチュー！'],['robot',RB,'ピピ……関節……可動率……12％……'],['robot',RB,'チュータ……アリガトウ……ゴザイ……マス……'],['mouse',MO,'でも、中の命令が止まってるみたいで……。']]},
 {id:'c_tsukiyo1',t:'空から見た円',st:1,who:['tsukiyo'],L:[['tsukiyo',TK,'錆の広がる形、空から見ると円になってる。'],['tsukiyo',TK,'まるで、大きな魔法陣みたいに。'],['wolf',W,'博士も同じこと言ってた……。'],['tsukiyo',TK,'次の星は、工場の上で光ってるよ。']]},
 {id:'c_onmyo1',t:'さらに奥へ',st:1,who:['onmyo'],L:[['onmyo',OM,'……番人を退けたか。'],['onmyo',OM,'だが陰の気は、さらに奥……工場から濃く流れている。']]},
 {id:'c_rocker1',t:'イントロ',st:1,who:['rocker'],L:[['rocker',RK,'番人を倒したって？ 悪くねぇイントロだ。'],['rocker',RK,'ただ、本番はまだ先だろ。'],['rocker',RK,'アンコールはいらねぇ……と言いたいとこだがな。']]},
 {id:'c_fox2',t:'直す役',st:1,who:['fox','dodo'],L:[['fox',FX,'先輩、また最前列でつっこんでたでしょ！ 傷だらけじゃん。'],['dodo',DD,'えへへ〜。前はぼくの場所だから〜。'],['fox',FX,'……もう。じゃあ直すのはボクの役ね。ケガしたら言ってよ。'],['wolf:smile',W,'直す役と、守る役か。いいコンビだな。']]},
 /* ---------- 中層クリア（6F） ---------- */
 {id:'c_gorilla2',t:'親方の口ぐせ',st:2,who:['gorilla'],L:[['gorilla',GR,'工場のクレーンか……昔、あそこの配線は俺がやったんだ。'],['gorilla',GR,'きれいな複線図だったぜ。'],['wolf',W,'ゴリラさんが？'],['gorilla',GR,'力まかせじゃ、電気は流れねぇ。……親方の口ぐせさ。'],['gorilla',GR,'今さら、身にしみるぜ。']]},
 {id:'c_robo2',t:'頭の中の文字',st:2,who:['mouse','robot'],L:[['mouse',MO,'ロボの頭の中、文字がいっぱい並んでるチュー。'],['mouse',MO,'……これ、プログラムっていうのかな？'],['robot',RB,'ワタシ……古イ型……モウ……役ニ……タタナイ……？'],['mouse',MO,'そんなことない！ ボク、ロボがいないと何もできないもん。'],['mouse',MO,'なんとか、読めるようになりたいチュー。']]},
 {id:'c_tsukiyo2',t:'星の見えない場所',st:2,who:['tsukiyo'],L:[['tsukiyo',TK,'星が告げてる。きみたちの道は、上へ……もっと上へ続いているって。'],['tsukiyo',TK,'……でも、上の階は星が見えない。わたしには、先が読めない場所。'],['tsukiyo',TK,'気をつけて。']]},
 {id:'c_onmyo2',t:'描きかけの図',st:2,who:['onmyo'],L:[['onmyo',OM,'……塔の上には、描きかけの図が眠っている。'],['onmyo',OM,'途中で止めた図は、陰に転びやすい。'],['wolf',W,'なんでそんなこと知ってるんだ？'],['onmyo',OM,'……我も昔、図を描きかけで捨てたことがある。'],['onmyo',OM,'……今は、関係のない話だ。']]},
 {id:'c_rocker2',t:'油のにおい',st:2,who:['rocker'],L:[['rocker',RK,'塔の上のほう、最近やけに油くせぇ。研究所でもあるのか？'],['rocker',RK,'錆の連中、何かためこんでやがるな。'],['rocker',RK,'火がついたら、ギターソロじゃすまねぇぜ。']]},
 {id:'c_owl2',t:'組み合わせ',st:2,who:['owl','tsukiyo'],L:[['owl',OW,'ツキヨ殿の星の位置と、わしの錆の地図。重ねてみると……。'],['tsukiyo',TK,'ぴったり、同じ円。'],['owl',OW,'ホッホッ。星と計算、組み合わせれば、陣の中心が読めるかもしれんのう。'],['wolf',W,'二人とも、なんか楽しそうだな……。']]},
 /* ---------- 上層クリア（10F） ---------- */
 {id:'c_gorilla3',t:'静かすぎる',st:3,who:['gorilla'],L:[['gorilla',GR,'炉の親玉まで倒したって！？ 100万ボルトの勝利だな！'],['gorilla',GR,'……ただな、塔の上の発電所のほうが、どうも静かすぎる。'],['gorilla',GR,'いやな予感がするぜ、ウホッ。']]},
 {id:'c_robo3',t:'再起動に必要なもの',st:3,who:['mouse','robot'],L:[['mouse',MO,'やったチュー！ 街の錆が少し減ったよ！'],['mouse',MO,'でも、ロボが寝言みたいに「パイソン」って言うんだ。ヘビの夢でも見てるのかな……？'],['robot',RB,'ピ……再起動ニ……必要ナモノ……'],['robot',RB,'……プログラム……ト……トモダチ……'],[null,'','メカロボの目が、一瞬だけ青く光った気がした。']]},
 {id:'c_tsukiyo3',t:'星座にない光',st:3,who:['tsukiyo'],L:[['tsukiyo',TK,'星読みどおり。……ううん、星読み以上かな。'],['tsukiyo',TK,'夜明けに、空をまっすぐ飛ぶ光を見た。'],['tsukiyo',TK,'あれは星じゃない。星座の図面にも、のってない。']]},
 {id:'c_onmyo3',t:'半分の図面',st:3,who:['onmyo'],L:[['onmyo',OM,'……面白い。'],['onmyo',OM,'その半分の図面。残りは、星見の回廊か、あるいは空か。'],['onmyo',OM,'……いずれ、また会うだろう。']]},
 {id:'c_rocker3',t:'今夜の主役',st:3,who:['rocker'],L:[['rocker',RK,'……やるじゃねぇか。今夜の主役は、お前らだ。'],['rocker',RK,'けどな、ステージはまだ続く。'],['rocker',RK,'上で嵐が来たら……そのときは、俺も弾く。']]},
 {id:'c_live3',t:'アンプに火を',st:3,who:['gorilla','rocker'],L:[['rocker',RK,'おい、ゴリラ。停電でアンプが鳴らねぇんだが。'],['gorilla',GR,'ウホッ？ だったら俺の電気を流してやろうか。'],['rocker',RK,'……壊すなよ。'],['gorilla',GR,'力まかせじゃ電気は流れねぇ。……ちゃんと分かってるさ。'],[null,'','アンプから、塔じゅうに響くような音が鳴った。'],['wolf:smile',W,'（これ、戦いに使えたらすげぇな……）']]},
 {id:'c_end3',t:'鉄灯の名前',st:3,who:['owl','fox','dodo'],L:[['owl',OW,'「鉄灯」という街の名はな、あの塔の灯りから来ておる。初代マイスターが錆を道具にもどす陣を塔に刻み、その光が夜の工場街を照らしたのじゃ。'],['fox',FX,'じゃあ、灯りが消えてたのって、陣が止まってたってこと？'],['owl',OW,'うむ。そして十年前に灯りを消したのが……わしの古い知り合い、匠じゃ。'],['dodo',DD,'えっ、博士、匠さんと知り合いだったの〜？'],['owl',OW,'若いころ、同じ図面台で線を引いた仲じゃ。あやつは、だれよりも正確な線を引いた。……正確すぎるほどにのう。'],['wolf:serious',W,'だったら、上で会ったら聞いてやる。なんで灯りを消したのかってな。']]}
]})();
const chatStage=()=>{const f=G.floor|0;return f>=20?7:f>=19?6:f>=16?5:f>=13?4:f>=10?3:f>=6?2:f>=3?1:0};
/* 絆のチャットは、2人とも「覚醒できる状態」（武器がSランク以上）になると出る（2.2.1） */
const chatOpen=c=>{const p=typeof bondOf==='function'&&bondOf(c.id);if(p)return bondOwned(p)&&p.slice(0,2).every(canAwakenOut);return c.st<=chatStage()&&c.who.every(id=>id==='wolf'||!!owned(id))};
const chatTitle=c=>{const p=typeof bondOf==='function'&&bondOf(c.id);return p?`絆覚醒「${p[2]}」`:c.t};
const chatNew=()=>CHATS.filter(c=>chatOpen(c)&&!(G.chatRead||[]).includes(c.id));
async function playChat(id){const c=CHATS.find(x=>x.id===id);if(!c)return;await talk(c.L);{const p=bondOf(id);if(p)await talk([N_(`絆覚醒「${p[2]}」が使えるようになった！\n${cnm(p[0])}と${cnm(p[1])}を同じパーティに入れて、出撃中に2人の技を覚醒させてみよう。`)])}G.chatRead=G.chatRead||[];if(!G.chatRead.includes(id)){G.chatRead.push(id);save()}}
function openChats(){const all=CHATS.filter(chatOpen),rd=G.chatRead||[],lock=CHATS.length-all.length;
 const face=id=>`<img src="${FACE(id)}" alt="">`;
 $('gpBody').innerHTML=ctTabs('chat')+`<div class="gph">チャット <small style="font-weight:600;color:var(--sm)">${all.length - all.filter(c=>!rd.includes(c.id)).length}/${CHATS.length}</small></div>
  <div class="chl">${all.slice().sort((a,b)=>(rd.includes(a.id)?1:0)-(rd.includes(b.id)?1:0)||b.st-a.st).map(c=>`<button class="chr ${rd.includes(c.id)?'':'nw'}" data-ch="${c.id}"><b>${chatTitle(c)}${Object.values(BOND_CHAT).includes(c.id)?'<i class="chb">絆</i>':''}</b>${rd.includes(c.id)?'':'<i>NEW</i>'}<span class="chf chfr">${[...new Set(c.L.map(l=>(l[0]||'').split(':')[0]).filter(Boolean))].slice(0,3).map(face).join('')}</span></button>`).join('')||'<div class="note">まだチャットはない</div>'}</div>
  ${lock?`<div class="note" style="margin-top:6px">まだ見られないチャット：${lock}（塔を登る・仲間を増やすと出てくる）</div>`:''}
  <div class="gpf"><button class="btn" id="gpClose">とじる</button></div>`;
 ctBind();
 $('gpClose').onclick=()=>{$('genPick').classList.remove('on');openHome()};
 $('gpBody').querySelectorAll('[data-ch]').forEach(b=>b.onclick=async()=>{$('genPick').classList.remove('on');await playChat(b.dataset.ch);openChats()});
 $('genPick').classList.add('on')}

/* ===================== 絆覚醒の一覧（2.2.0）：組み合わせと、条件のそろいぐあい ===================== */
function openBonds(){const face=id=>`<img src="${FACE(id)}" alt="">`,ok=b=>b?'<b class="bdk">✓</b>':'<b class="bdn">・</b>';
 const rows=EVO.map(p=>{const own=bondOwned(p),aw=own&&p.slice(0,2).every(canAwakenOut),rd=bondRead(p),open=own&&rd;
  return `<div class="bdr ${open?'on':''}"><span class="chf">${face(p[0])}${face(p[1])}</span><div class="bdt"><b>絆覚醒「${p[2]}」</b><small>${p[3]}</small>
   <div class="bdc">${ok(own)}${cnm(p[0])}と${cnm(p[1])}を持っている</div><div class="bdc">${ok(aw||rd)}2人の武器をSランク以上にする（絆のチャットが出る）</div><div class="bdc">${ok(rd)}絆のチャットを読む</div></div></div>`}).join('');
 $('gpBody').innerHTML=ctTabs('bond')+`<div class="gph">絆覚醒</div><div class="note" style="margin-bottom:6px">2人の武器をSランク以上にすると、<b>絆のチャット</b>が出る。読んだあと、2人を同じパーティに入れて、出撃中に2人の技を<b>どちらも覚醒</b>させると発動する（覚醒は、技が最大Lvで、武器がSランク以上のとき）。</div>
  <div class="bdl">${rows}</div><div class="gpf"><button class="btn" id="gpClose">とじる</button></div>`;
 ctBind();$('gpClose').onclick=()=>{$('genPick').classList.remove('on');openHome()};$('genPick').classList.add('on')}

/* チャット・絆覚醒・ストーリーの上のタブ（2.2.2）。いつも上に出る */
const CT_TABS=[['chat','チャット'],['bond','絆覚醒'],['story','ストーリー']];
function ctTabs(a){const nw=chatNew().length;return `<div class="ctt">${CT_TABS.map(([k,n])=>`<button class="${k===a?'on':''}" data-ct="${k}">${n}${k==='chat'&&nw?`<i>${nw}</i>`:''}</button>`).join('')}</div>`}
function ctBind(){const gp=$('genPick');gp.classList.add('full');if(!gp._fullObs){gp._fullObs=new MutationObserver(()=>{if(!gp.classList.contains('on')&&gp.classList.contains('full'))gp.classList.remove('full')});gp._fullObs.observe(gp,{attributes:true,attributeFilter:['class']})}$('gpBody').querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>({chat:openChats,bond:openBonds,story:openStory})[b.dataset.ct]())}
