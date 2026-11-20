/* =====================================================================
   vol.3 の図面の解読：「回転体を見極める」（決定 11/20：A＝断面 → 立体を選ぶ）
   ・図面には中心線（一点鎖線）と、その片側だけの形（断面の半分）。中心線のまわりに1回転させてできる立体を4つから選ぶ
   ・やさしい：段1〜2つ／円すい　ふつう：段＋テーパー・みぞ　むずかしい：中に穴（通し穴・止まり穴）
   ・立体の中の穴は、かくれ線（点線）で見せる
   ===================================================================== */
const REVQ=(()=>{const rnd=n=>Math.floor(Math.random()*n),pk=a=>a[rnd(a.length)],RS=[1.6,2.4,3.2,4];
 const key=Q=>JSON.stringify([Q.segs.map(s=>[s.l,s.r0,s.r1]),Q.bore]);
 const total=10;
 function part(n){/* 長さ10を n 個に分ける（それぞれ2以上） */for(;;){const c=[];let left=total;for(let i=0;i<n-1;i++){const v=2+rnd(Math.max(1,left-2*(n-i)+1));c.push(v);left-=v}c.push(left);if(c.every(v=>v>=2))return c}}
 function makeSolid(lv){const n=lv===0?2+rnd(2):3+rnd(2),L=part(n),segs=[];let prev=null;
  for(let i=0;i<n;i++){let r;do{r=pk(RS)}while(prev!=null&&r===prev);segs.push({l:L[i],r0:r,r1:r});prev=r}
  /* テーパー（円すい） */
  if(lv>=1||Math.random()<.4){const i=rnd(n),s=segs[i];let r;do{r=pk(RS)}while(r===s.r0);s.r1=r}
  /* みぞ */
  if(lv>=1&&Math.random()<.5){const i=rnd(n),s=segs[i];if(s.l>=4&&s.r0===s.r1&&s.r0>=2.4){const a=1+rnd(s.l-3);segs.splice(i,1,{l:a,r0:s.r0,r1:s.r0},{l:1,r0:s.r0-.8,r1:s.r0-.8},{l:s.l-a-1,r0:s.r0,r1:s.r0})}}
  const minR=Math.min(...segs.map(s=>Math.min(s.r0,s.r1)));
  const bore=lv>=2&&minR>=2?{r:minR>=3?1.2:.8,d:Math.random()<.5?total:4+rnd(3)}:null;
  return{segs,bore}}
 const clone=Q=>({segs:Q.segs.map(s=>({...s})),bore:Q.bore?{...Q.bore}:null});
 const MUT=[
  Q=>{const o=clone(Q);o.segs=o.segs.reverse().map(s=>({l:s.l,r0:s.r1,r1:s.r0}));return o},                         /* 左右が反対 */
  Q=>{const o=clone(Q),i=rnd(o.segs.length),s=o.segs[i];if(s.r0!==s.r1){s.r1=s.r0}else{let r;do{r=pk(RS)}while(r===s.r0);s.r1=r}return o}, /* テーパー⇔まっすぐ */
  Q=>{const o=clone(Q),i=rnd(o.segs.length),s=o.segs[i];let r;do{r=pk(RS)}while(r===s.r0);const d=r-s.r0;s.r0=r;s.r1=Math.max(1.2,s.r1+d);return o}, /* 太さちがい */
  Q=>{const o=clone(Q);if(o.segs.length<2)return o;const i=rnd(o.segs.length-1),a=o.segs[i],b=o.segs[i+1],m=pk([-1,1]);if(a.l+m>=1&&b.l-m>=1){a.l+=m;b.l-=m}return o}, /* 段の位置ちがい */
  Q=>{const o=clone(Q);if(!Q.bore)return o;o.bore=pk([null,{r:Q.bore.r,d:Q.bore.d===total?4+rnd(3):total},{r:Q.bore.r,d:Q.bore.d===total?total:Math.max(2,Q.bore.d+pk([-2,2]))}]);return o}]; /* 穴ちがい */
 function makeQ(lv){for(let t=0;t<60;t++){const A=makeSolid(lv),K=key(A),opts=[A],ks=new Set([K]);let g=0;
   const pref=lv>=2&&A.bore?[4,4,0,1,3,2]:lv===0?[0,1,2,2,1]:[0,1,3,2,1,3];
   while(opts.length<4&&g++<80){const m=MUT[g<=pref.length?pref[g-1]:lv===0?pk([0,1,2]):rnd(MUT.length)];const B=m(A),k=key(B);if(!ks.has(k)&&B.segs.every(s=>s.l>=1&&s.r0>=1&&s.r1>=1)){ks.add(k);opts.push(B)}}
   if(opts.length===4){const order=[0,1,2,3].sort(()=>Math.random()-.5);return{A,opts:order.map(i=>opts[i]),ans:order.indexOf(0)}}}
  return null}
 const prep=(cv,ar)=>{const D=Math.min(2,devicePixelRatio||1),w=Math.max(120,cv.clientWidth||cv.parentNode.clientWidth||300),h=Math.round(w*ar);cv.width=w*D;cv.height=h*D;cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(D,0,0,D,0,0);x.clearRect(0,0,w,h);return{x,w,h}};
 const boreAt=(Q,z)=>Q.bore&&z>=total-Q.bore.d-1e-6?Q.bore.r:0;
 /* 図面：中心線と、断面の半分（ハッチング） */
 function drawProf(cv,Q){const{x,w,h}=prep(cv,.56),s=Math.min(w*.84/total,h*.78/4.4),z0=(w-total*s)/2,y0=h*.86,P=(z,r)=>[z0+z*s,y0-r*s];
  x.fillStyle='#f4f1e6';x.fillRect(0,0,w,h);x.strokeStyle='#c8c0a8';x.lineWidth=1;for(let i=0;i<w;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}for(let j=0;j<h;j+=16){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke()}
  /* 形 */
  const path=()=>{x.beginPath();let z=0;const pts=[];Q.segs.forEach(sg=>{const ri0=boreAt(Q,z+.001),ri1=boreAt(Q,z+sg.l-.001);pts.push([z,sg.r0,ri0],[z+sg.l,sg.r1,ri1]);z+=sg.l});
   x.moveTo(...P(0,pts[0][2]));pts.forEach(([zz,r])=>x.lineTo(...P(zz,r)));for(let i=pts.length-1;i>=0;i--){x.lineTo(...P(pts[i][0],pts[i][2]))}x.closePath()};
  path();x.fillStyle='#dbe6ff';x.fill();x.save();path();x.clip();x.strokeStyle='#4a6ab8';x.lineWidth=1;for(let i=-h;i<w;i+=9){x.beginPath();x.moveTo(i,h);x.lineTo(i+h,0);x.stroke()}x.restore();
  path();x.strokeStyle='#14306e';x.lineWidth=2.4;x.stroke();
  /* 中心線（一点鎖線） */
  x.strokeStyle='#c0392b';x.lineWidth=1.6;x.setLineDash([16,4,3,4]);x.beginPath();x.moveTo(z0-18,y0);x.lineTo(z0+total*s+18,y0);x.stroke();x.setLineDash([]);
  x.fillStyle='#c0392b';x.font='800 12px sans-serif';x.textAlign='left';x.fillText('中心線',z0-14,y0+16);
  /* 回す矢印 */
  const ax=z0+total*s+10;x.strokeStyle='#c0392b';x.lineWidth=2;x.beginPath();x.ellipse(ax,y0,7,16,0,-Math.PI*.9,Math.PI*.6);x.stroke();x.beginPath();x.moveTo(ax-4,y0+15);x.lineTo(ax+2,y0+18);x.lineTo(ax+4,y0+11);x.stroke()}
 /* 立体：中心線を横にして、少し右前から見た形 */
 function drawSolid(cv,Q,col){const{x,w,h}=prep(cv,.62),s=Math.min(w*.8/(total+1.5),h*.8/8.4),k=.34,z0=(w-total*s)/2-s*.4,yc=h/2,X=z=>z0+z*s;
  const cA=col||'#8fa2c8';let z=0;const grad=(r)=>{const g=x.createLinearGradient(0,yc-r*s,0,yc+r*s);g.addColorStop(0,'#e6ecf8');g.addColorStop(.35,cA);g.addColorStop(1,'#3a4660');return g};
  /* 左の端（見えない側）は影 */
  x.fillStyle='#3a4660';x.beginPath();x.ellipse(X(0),yc,Q.segs[0].r0*s*k,Q.segs[0].r0*s,0,0,TAU);x.fill();
  Q.segs.forEach(sg=>{const a=X(z),b=X(z+sg.l);x.fillStyle=grad(Math.max(sg.r0,sg.r1));x.beginPath();x.moveTo(a,yc-sg.r0*s);x.lineTo(b,yc-sg.r1*s);x.ellipse(b,yc,sg.r1*s*k,sg.r1*s,0,-Math.PI/2,Math.PI/2);x.lineTo(a,yc+sg.r0*s);x.ellipse(a,yc,sg.r0*s*k,sg.r0*s,0,Math.PI/2,-Math.PI/2,true);x.closePath();x.fill();
   x.strokeStyle='#1a2340';x.lineWidth=1.6;x.beginPath();x.moveTo(a,yc-sg.r0*s);x.lineTo(b,yc-sg.r1*s);x.moveTo(a,yc+sg.r0*s);x.lineTo(b,yc+sg.r1*s);x.stroke();
   /* 右の面 */
   x.fillStyle='#c8d2e8';x.beginPath();x.ellipse(b,yc,sg.r1*s*k,sg.r1*s,0,0,TAU);x.fill();x.stroke();z+=sg.l});
  /* 穴 */
  if(Q.bore){const br=Q.bore.r*s,e=X(total);x.fillStyle='#141a2c';x.beginPath();x.ellipse(e,yc,br*k,br,0,0,TAU);x.fill();
   if(Q.bore.d>=total){x.fillStyle='#d8e4ff';x.beginPath();x.ellipse(e-br*k*.3,yc,br*k*.45,br*.55,0,0,TAU);x.fill()}
   x.strokeStyle='#1a2340';x.lineWidth=1.3;x.setLineDash([5,4]);const d0=X(total-Q.bore.d);x.beginPath();x.moveTo(e,yc-br);x.lineTo(d0,yc-br);x.moveTo(e,yc+br);x.lineTo(d0,yc+br);if(Q.bore.d<total){x.moveTo(d0,yc-br);x.lineTo(d0,yc+br)}x.stroke();x.setLineDash([])}}
 function step(lv,pr){return new Promise(res=>{let Q=null,locked=false;const who=(pr&&pr.who)||'kuromio',prac=pr&&pr.practice;
  $('cqT').textContent=prac?'回転体の練習':'回転体の図面';$('cqStep').textContent=(pr&&pr.label)||'';$('cqBack').textContent=prac?'◀ やめる':'◀ あとで';
  $('cqMsg').innerHTML=`<img src="${CHARS[who]?CHARS[who].img:''}" alt=""><span>${(pr&&pr.say)||'図面の形を、中心線のまわりに1回転させると、どんな立体になる？'}</span>`;
  $('cqBack').onclick=()=>{if(locked&&Q&&Q.done)return;res(false)};
  const ask=()=>{Q=makeQ(lv);locked=false;show('cadq');drawProf($('cqViews'),Q.A);
   $('cqCands').innerHTML=Q.opts.map((_,k)=>`<div class="cand"><b>${'アイウエ'[k]}</b><canvas></canvas><div class="cqrow"><button class="cqpick">${'アイウエ'[k]}にする</button></div></div>`).join('');
   requestAnimationFrame(()=>{$('cqCands').querySelectorAll('.cand').forEach((b,k)=>{drawSolid(b.querySelector('canvas'),Q.opts[k]);b.querySelector('.cqpick').onclick=()=>answer(k)})});
   $('cqFb').innerHTML='<span class="note">ハッチング（斜線）が、切った面の半分。点線は、中にかくれた穴の線</span>'};
  const answer=k=>{if(locked)return;locked=true;const ok=k===Q.ans,bs=$('cqCands').querySelectorAll('.cand');$('cqCands').querySelectorAll('.cqpick').forEach(b=>b.disabled=true);bs[Q.ans].classList.add('ok');
   if(ok){Q.done=true;tone(880,.12,'triangle',.1,1320);$('cqFb').innerHTML='<div class="okc">○ 正解！</div><button class="btn gold" id="cqNext">次へ</button>';$('cqNext').onclick=()=>res(true);return}
   bs[k].classList.add('ng');buzz();const B=Q.opts[k],A=Q.A,rev=JSON.stringify(B.segs.map(s=>[s.l,s.r1,s.r0]).reverse())===JSON.stringify(A.segs.map(s=>[s.l,s.r0,s.r1]));
   const why=rev?'左右が反対になっている':JSON.stringify(B.bore)!==JSON.stringify(A.bore)?'中の穴がちがう':'段や太さがちがう';
   $('cqFb').innerHTML=`<div class="ngc">✗ 正解は「${'アイウエ'[Q.ans]}」</div><span class="note">「${'アイウエ'[k]}」は${why}。もう一度、別の部品で挑戦！</span><button class="btn" id="cqRetry">もう一度</button>`;$('cqRetry').onclick=ask};
  ask()})}
 return{step,makeQ,drawProf,drawSolid}})();

/* vol.3 の仲間の図面は回転体（特許の図面はのぞく） */
{const _d=decodeBp;decodeBp=async function(id){const R=RECIPES[id];if(!R||R.vol!==3||R.patent)return _d(id);if(!(G.bpRaw||[]).includes(id))return;
 const lv=Math.min(2,Math.max(0,R.tier-2));
 const ok=await REVQ.step(lv,{who:R.who&&CHARS[R.who]?R.who:G.lead,label:'図面の解読',say:`「${R.n}」の図面は、回転体でかかれている。中心線のまわりに1回転させてできる立体を選ぼう！`});
 openShop(shopFrom);
 if(ok){G.bpRaw=G.bpRaw.filter(b=>b!==id);if(!G.bps.includes(id))G.bps.push(id);save();sfx.win&&sfx.win();renderShop();
  await say(`${RIC(id,40)} 解読できた！<br><span style="font-size:14px">「${R.n}」をつくれるようになった</span>`,1500)}
 else await say('まだ読み解けない……<br><span style="font-size:14px">何度でも挑戦できる</span>',1200)}}
/* 道場：回転体の練習（vol.3 が開いてから） */
{const _o=openPractice;openPractice=function(){_o();if(!V3_OPEN)return;const qs=$('prBody').querySelectorAll('.prg'),pg=qs[qs.length-1];if(!pg)return;
 pg.insertAdjacentHTML('beforeend',`<button class="prc" data-rq="1">${MIC('bp',40)}<span class="prn"><b>回転体の解読</b><i>何問でも</i></span></button>`);
 const lv=Math.min(2,Math.max(0,prTier-1));
 $('prBody').querySelector('[data-rq]').onclick=async()=>{let ok=0,n=0;const M=['回転体の練習。断面の半分を、中心線のまわりに回してみて。','……いい。','……あわてずに。段の順番と、穴を見る。'];
  for(;;){const r=await REVQ.step(lv,{practice:true,who:'kuromio',label:`${CADQ_LV[lv]}　正解 ${ok}`,say:n?(ok===n?M[1]:M[2]):M[0]});if(!r)break;ok++;n++}
  openPractice();if(n)await say(`おつかれさま！ ${ok}問正解！`,1300)}}}
