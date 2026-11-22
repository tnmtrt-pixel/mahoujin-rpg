/* ================= 会話のふりかえり =================
 * ・会話中：「◀ もどる」でひとつ前のセリフへ、「ログ」でこの会話のここまでを一覧
 * ・ストーリーのふりかえり：見た場面を、セーブの印（flags・到達階）から組み立てて、もう一度再生できる
 *   （会話の中身はセーブに入れない。今のパーティで再生される）
 * チャットは前から、チャット画面で読み返せる */
/* 会話に出る名前だけのボス → 敵の絵 */
const TALK_FOE={};
talk=function(list,bg){if(!list||!list.length)return Promise.resolve();try{list.forEach(l=>{const[id,ex]=String(l&&l[0]||'').split(':');if(id&&CHARS[id])img(ex&&(FACES[id]||[]).includes(ex)?`img/face/${id}_${ex}.webp`:!PORTRAIT[id]&&(FACES[id]||[]).includes('serious')?`img/face/${id}_serious.webp`:(!PORTRAIT[id]&&FACE(id).includes('/face/f_')?FACE(id):CHARS[id].img))})}catch(_){}return new Promise(res=>{let i=0;const T=$('talk');
 T.classList.toggle('ev',!!bg);T.style.backgroundImage=bg?`url(img/ev/${bg}.webp)`:'';T.classList.add('on');document.body.classList.add('talking');
 let bar=$('tBar');if(!bar){bar=document.createElement('div');bar.id='tBar';bar.className='tbar';T.querySelector('.nx').before(bar)}
 bar.innerHTML=`<button id="tBack" aria-label="ひとつ前へ">◀</button><button id="tLog">ログ</button><button id="tSkip">スキップ</button><button id="tNext" class="tnx">次へ ▶</button>`;
 const sh=()=>{const[rid,who,txt]=list[i];const[id,ex]=(rid||'').split(':');const c=id&&CHARS[id];const fb=$('tImg').parentNode,im=$('tImg');
  let src=!hasFace(id)?'':c?(ex&&(FACES[id]||[]).includes(ex)?`img/face/${id}_${ex}.webp`:c.img):`img/${id}.webp`,mode=src.includes('/face/')?'ex':'pt';
  /* 2.0.7：顔の切り抜きがないキャラは、立ち絵の代わりに顔アイコンを使う（ずれ防止）。名前だけのボスは敵の絵を出す */
  if(c&&mode==='pt'&&!PORTRAIT[id]){if((FACES[id]||[]).includes('serious')){src=`img/face/${id}_serious.webp`;mode='ex'}else{const f=FACE(id);if(f.includes('/face/f_')){src=f;mode='ic'}}}  /* 表情の指定がなければ、会話用の表情（真剣）を使う */
  if(!id&&who&&TALK_FOE[who]){src=`img/foe/${TALK_FOE[who]}.webp`;mode='foe'}
  fb.style.display=src?'block':'none';
  if(src){const css=mode==='ex'?'width:118%;margin-left:-9%;margin-top:0':mode==='ic'?'width:100%;margin:0':mode==='foe'?'width:100%;height:100%;object-fit:contain;margin:0':null;
   const apply=()=>{if(css!=null)im.style.cssText=css;else portrait(im,id);im.style.visibility='visible'};
   im.onerror=()=>{fb.style.display='none'};
   if(im.getAttribute('src')===src&&im.complete){apply()}else{im.style.visibility='hidden';im.onload=()=>{if(im.getAttribute('src')===src)apply()};im.src=src;if(im.complete&&im.naturalWidth)apply()}}$('tWho').textContent=who||'';$('tTxt').textContent=txt;$('tTxt').scrollTop=0;
  $('tBack').disabled=i===0};
 const stop=e=>{e.stopPropagation();e.preventDefault()};
 $('tBack').onclick=e=>{stop(e);if(i>0){i--;sh()}};
 $('tLog').onclick=e=>{stop(e);logShow(list.slice(0,i+1),'この会話のログ')};
 $('tSkip').onclick=e=>{stop(e);i=list.length-1;T.onclick({target:T})};  /* 3.1.6：会話をまとめて飛ばす */
 sh();T.onclick=e=>{if(e.target.closest('#tBack,#tLog'))return;i++;  /* 2.4.0：ボタンの列のすき間や「タップで次へ」を押しても進む */
  if(i>=list.length){T.classList.remove('on','ev');T.style.backgroundImage='';T.onclick=null;bar.innerHTML='';document.body.classList.remove('talking');lockInput(350);res()}else sh()}})};
/* ログの一覧（会話の上に重ねる） */
function logShow(L,title){let o=$('logOv');if(!o){o=document.createElement('div');o.id='logOv';o.className='logov';document.body.append(o)}
 const nm=(rid,who)=>who||'';
 o.innerHTML=`<div class="login"><div class="logh"><b>${title}</b><button id="logX">とじる</button></div><div class="logl">${L.map(([rid,who,txt])=>{const id=(rid||'').split(':')[0];
  return `<div class="logr ${who?'':'nar'}">${id&&hasFace(id)&&CHARS[id]?`<img src="${FACE(id)}" alt="">`:'<span class="lsp"></span>'}<div>${who?`<b>${nm(rid,who)}</b>`:''}<p>${String(txt).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p></div></div>`}).join('')}</div></div>`;
 const x=e=>{e&&e.stopPropagation();o.classList.remove('on')};$('logX').onclick=x;o.onclick=e=>{if(e.target===o)x(e)};
 o.classList.add('on');const l=o.querySelector('.logl');l.scrollTop=l.scrollHeight}
/* ---- 見た場面の一覧（ふりかえり） ---- */
function storyScenes(){const S=[],fl=G.floor|0,f=G.flags||{},K=['onmyo','sora','takumi'];
 const add=(n,t,run)=>S.push({n,t,run});
 if(f.intro)add(0,'はじまり',()=>talk(INTRO[G.hero]||[]));
 const areas=[];for(let i=1;i<FLOORS.length;i++){const F=FLOORS[i];if(!F)continue;let a=areas.find(x=>x.k===F.area);if(!a)areas.push(a={k:F.area,f0:i,fb:0});if(F.boss)a.fb=i}
 const hpFl={};Object.entries(HELPER).forEach(([k,id])=>{const a=areas.find(x=>x.k===k);if(a&&hpFl[id]==null)hpFl[id]=a.f0+.2});
 if(typeof HELPER_FL!=='undefined')Object.entries(HELPER_FL).forEach(([n,id])=>{if(hpFl[id]==null||hpFl[id]>+n)hpFl[id]=+n+.2});
 Object.entries(hpFl).forEach(([id,n])=>{if(f['hp_'+id]&&JOIN_TALK[id])add(n,`${CHARS[id].name}と出会う`,()=>talk(JOIN_TALK[id]))});
 areas.forEach(a=>{const A=AREAS[a.k];
  if(f['ai_'+a.k]&&AREA_INTRO[a.k])add(a.f0+.1,`${A.n}に入る`,()=>talk(AREA_INTRO[a.k]));
  if(a.fb&&f['bt_'+A.boss]&&BOSS_TALK[a.k])add(a.fb+.3,'ボス戦の前',()=>talk(storyFit(BOSS_TALK[a.k]||[],null,K),BOSS_EV[a.k]&&BOSS_EV[a.k][0]));
  const won=a.fb===TOP_FLOOR?!!f.ch1b:fl>a.fb;
  if(a.fb&&won&&BOSS_WIN[a.k])add(a.fb+.5,'ボスをたおした',()=>talk(storyFit(BOSS_WIN[a.k],null,K),BOSS_EV[a.k]&&BOSS_EV[a.k][1]))});
 if(f.selfRust)add(9.4,'鏡の作業台',()=>talk(storyFit(SELF_RUST[G.hero]||[],SELF_RUST_FB),EV_IMG.includes('rust_'+G.hero)?'ev_rust_'+G.hero:null));
 if(f.ch1)add(10.8,'第1章 前編　エンディング',()=>talk(storyFit(ENDING,null,['gorilla']),'ev_ending1'));
 if(f.ch1b)add(20.8,'第1章　エンディング',()=>talk(storyFit(ENDING2,null,['owl','takumi'])));
 return S.sort((a,b)=>a.n-b.n)}
/* 塔ごとのタブ（2.2.2）：場面の番号で分ける（0〜：マイスターの塔、200〜：審判の塔、300〜：無限の塔） */
const STORY_TW=[['meister','マイスターの塔',n=>n<200],['judge','審判の塔',n=>n>=200&&n<300],['inf','無限の塔',n=>n>=300]];let storyTw=null;
function openStory(){const all=storyScenes(),tws=STORY_TW.filter(t=>all.some(s=>t[2](s.n)));
 if(!tws.some(t=>t[0]===storyTw))storyTw=tws.length?tws[tws.length-1][0]:'meister';
 const T=STORY_TW.find(t=>t[0]===storyTw),S=all.filter(s=>T[2](s.n));
 $('gpBody').innerHTML=ctTabs('story')+`<div class="gph">ストーリー <small style="font-weight:600;color:var(--sm)">${all.length}場面</small></div>
  ${tws.length>1?`<div class="stt">${tws.map(t=>`<button class="${t[0]===storyTw?'on':''}" data-tw="${t[0]}">${t[1]}</button>`).join('')}</div>`:''}
  <div class="chl">${S.map((s,i)=>`<button class="chr stl" data-st="${i}"><span class="stf">${(s.lb||(s.n<1?'序':Math.floor(s.n)+'F')).replace(/^[審無]/,'')||'序'}</span><b>${s.t}</b></button>`).join('')||'<div class="note">まだ見た場面はありません</div>'}</div>
  <div class="note" style="margin-top:6px">これまでに見た場面を、もう一度見られます。会話の中の「ログ」で、読み飛ばしたセリフも一覧できます。</div>
  <div class="gpf"><button class="btn" id="gpClose">とじる</button></div>`;
 ctBind();
 $('gpBody').querySelectorAll('[data-tw]').forEach(b=>b.onclick=()=>{storyTw=b.dataset.tw;openStory()});
 $('gpClose').onclick=()=>{$('genPick').classList.remove('on');openHome()};
 $('gpBody').querySelectorAll('[data-st]').forEach(b=>b.onclick=async()=>{$('genPick').classList.remove('on');await S[+b.dataset.st].run();openStory()});
 $('genPick').classList.add('on')}
