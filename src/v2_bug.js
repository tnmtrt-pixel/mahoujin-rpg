/* =====================================================================
   バグ報告（メニュー →「バグを報告」）
   ・送り先はサイコロ版と同じ Cloudflare サーバー（/api/mt2/bug）。運営画面（サイコロ版の admin.html）で見る
   ・バージョン・端末・塔と階・直前のエラーを自動で付ける。セーブデータや本名は送らない
   ===================================================================== */
const BUGLOG=[];
window.addEventListener('error',e=>{BUGLOG.push(`${(e.message||'').slice(0,160)} @${String(e.filename||'').split('/').pop()}:${e.lineno||0}`);if(BUGLOG.length>5)BUGLOG.shift()});
window.addEventListener('unhandledrejection',e=>{BUGLOG.push('promise: '+String(e.reason&&e.reason.message||e.reason).slice(0,160));if(BUGLOG.length>5)BUGLOG.shift()});
const BUG_KIND=[['stop','動かない・進めない'],['wrong','おかしな動き・数字'],['view','表示がおかしい'],['idea','その他・要望']];
function bugInfo(){const s=[...document.querySelectorAll('.scr.on')].map(x=>x.id).join(',');
 return {v:VERSION,build:typeof BUILD!=='undefined'?BUILD:'',ua:navigator.userAgent.slice(0,200),scr:`${innerWidth}x${innerHeight}@${devicePixelRatio||1}`,
  at:s,tw:G?towerAt():'',fl:G?G.floor|0:0,fl2:G&&G.tw?Object.fromEntries(Object.entries(G.tw).map(([k,v])=>[k,v&&v.floor|0])):{},
  lead:G?G.lead||'':'',lv:G&&G.party?G.party.map(m=>m.id+':'+m.lv).join(' '):'',err:BUGLOG.slice()}}
let bugLast=0;
function openBug(){const P=G&&G.prof&&G.prof.reg?G.prof:null;
 $('sheetT').textContent='バグを報告';
 $('sheetB').innerHTML=`<div class="bug"><div class="note">おかしなところを見つけたら教えてください。運営（開発者）に届きます。返事はできませんが、次の更新で直します。</div>
  <div class="bugk">${BUG_KIND.map(([k,n],i)=>`<button type="button" data-bk="${k}" class="${i?'':'on'}">${n}</button>`).join('')}</div>
  <textarea id="bugT" maxlength="800" placeholder="例）審判の塔の5Fで、ボスを倒したのに次の階に進めなかった"></textarea>
  <div class="bugn"><span id="bugC">0</span>/800</div>
  <div class="note">いっしょに送るもの：バージョン（${VERSION}）・端末の種類・いまの塔と階・直前のエラー${P?`・プレイヤー名（${rName(P.w)} #${rTag(P.id)}）`:''}。セーブデータや本名は送りません。</div>
  <button class="btn gold" id="bugGo">送る</button></div>`;
 let kind='stop';
 $('sheetB').querySelectorAll('[data-bk]').forEach(b=>b.onclick=()=>{kind=b.dataset.bk;$('sheetB').querySelectorAll('[data-bk]').forEach(x=>x.classList.toggle('on',x===b))});
 const t=$('bugT');t.oninput=()=>{$('bugC').textContent=t.value.length};
 $('bugGo').onclick=async()=>{const text=t.value.trim();if(text.length<4){say('どんなことが起きたか、少しくわしく書いてください',1600);return}
  if(Date.now()-bugLast<60000){say('続けて送るときは、1分あけてください',1500);return}
  const b=$('bugGo');b.disabled=true;b.textContent='送っています…';
  try{const r=await fetch(MT_API+'/api/mt2/bug',{method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({id:P?P.id:'',name:P?`${rName(P.w)}#${rTag(P.id)}`:'',kind,text,info:bugInfo()})});
   const j=await r.json().catch(()=>({}));
   if(r.ok&&j.ok){bugLast=Date.now();tone(880,.15,'triangle',.08,1320);closeSheet();say('報告を送りました。ありがとう！',1800);return}
   say(j.err==='wait'?'続けて送るときは、1分あけてください':'送れませんでした。時間をおいてもう一度ためしてください',1800)}
  catch(e){say('通信できませんでした。電波のよいところで、もう一度ためしてください',1800)}
  b.disabled=false;b.textContent='送る'};
 $('sheet').classList.add('on')}
