/* =====================================================================
   新しいバージョンの知らせ
   ・GitHub Pages はページを最大10分ほど覚えておく（キャッシュ）ので、更新してもすぐに新しい版にならないことがある
   ・起動したときと、アプリにもどってきたときに、公開中の index.html の VERSION を「覚えていない状態」で読みに行く
   ・ちがっていたら、画面の上に「新しいバージョンがあります　更新する」を出す
   ===================================================================== */
let updShown=false,updAt=0;
async function updCheck(){if(updShown||location.protocol==='file:'||Date.now()-updAt<60000)return;updAt=Date.now();
 try{const r=await fetch(location.pathname+'?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const t=await r.text();
  const m=/const VERSION='([0-9.]+)'/.exec(t);if(!m||m[1]===VERSION)return;
  const nv=m[1].split('.').map(Number),cv=VERSION.split('.').map(Number);let newer=false;for(let i=0;i<3;i++){if((nv[i]|0)!==(cv[i]|0)){newer=(nv[i]|0)>(cv[i]|0);break}}
  if(!newer)return;updShown=true;
  const d=document.createElement('div');d.id='updBar';d.innerHTML=`<span>新しいバージョン（ver ${m[1]}）があります</span><button type="button">更新する</button>`;
  d.querySelector('button').onclick=()=>{try{if(G)save()}catch(e){}let q=location.search.replace(/^\?/,'').split('&').filter(x=>x&&!/^v=/.test(x));q.push('v='+m[1]);location.replace(location.pathname+'?'+q.join('&'))};
  document.body.appendChild(d)}catch(e){}}
setTimeout(updCheck,2500);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')updCheck()});
/* 画像の読みこみに失敗したまま（丸の仮の絵のまま）にならないように：失敗した画像は2秒あけて読み直す（最大5回）。
   出撃前に、リーダーの歩く絵を先に読みこんでおく（2.0.6） */
{const _img=img;img=function(src){let i=imgCache[src];
 if(i&&i.complete&&!i.naturalWidth&&(i._n||0)<5){const now=performance.now();if(!i._t||now-i._t>2000){const n=new Image();n._n=(i._n||0)+1;n._t=now;n.src=src+(src.includes('?')?'&':'?')+'r'+n._n+'='+Math.floor(Date.now()/1000);imgCache[src]=n;i=n}}
 return _img(src)}}
function preloadLead(){try{if(!G||!G.lead)return;['down','left','right','up'].forEach(d=>img(`img/walk/${G.lead}_${d}.webp`));img(FACE(G.lead))}catch(_){}}
{const _oh=openHome;openHome=function(){const r=_oh.apply(this,arguments);preloadLead();return r}}
{const _s=startFloor;startFloor=function(fl){preloadLead();return _s(fl)}}
/* 出撃の前に、その層の敵・強敵・ボスの絵を先に読みこむ（ボスが丸で出ないように）（2.0.9） */
function preloadFoes(fl){try{const F=FLOORS[fl],A=F&&FAREA[F.area];if(!A)return;const ks=new Set();(A.mix||[]).forEach(m=>(m[1]||[]).forEach(k=>ks.add(k)));if(A.elite)ks.add(A.elite);if(A.boss)ks.add(A.boss);const ab=AREAS[F.area]&&AREAS[F.area].boss;if(ab)ks.add(ab);
 ks.forEach(k=>{const D=FFOE[k];if(!D)return;img('img/foe/'+k+'.webp');if(D.base)img('img/foe/'+D.base+'.webp');if(D.src)img(D.src)})}catch(_){}}
{const _s=startFloor;startFloor=function(fl){preloadFoes(fl);const nb=FLOORS[(fl|0)+1];if(nb)preloadFoes((fl|0)+1);return _s(fl)}}
/* 画面が切りかわった直後のタップは少しだけ無視する（読みこみ中に押したタップが、次の画面のボタンに入らないように）（2.0.11）
   出撃のフィールドは止めない。連打が続くと、そのぶん少しのびる（lockInput のしくみ） */
{const _sh=show;show=function(id){const cur=document.querySelector('.scr.on');const r=_sh.apply(this,arguments);if(id!=='field'&&(!cur||cur.id!==id))lockInput(300);return r}}
{const sh=document.getElementById('sheet');if(sh&&window.MutationObserver)new MutationObserver(()=>{if(sh.classList.contains('on')&&!sh._on){sh._on=1;lockInput(250)}else if(!sh.classList.contains('on'))sh._on=0}).observe(sh,{attributes:true,attributeFilter:['class']})}
