/* 前の試作（アーティファクト「マイスターの塔2（第1章 試作）」）で作った展開図の問題を移植 */
/* ===== 展開図の解読（vol.2 の図面から） =====
   立方体の展開図を組み立てたとき、●の点と重なる点をすべて選ぶ。答えたあと、展開図を組み立てて確かめられる。
   図面が vol:2（または quiz:'net'）のとき、decodeBp がこちらを使う。lv：0＝1-4-1型　1＝2-3-1型　2＝階段型・3-3型 */
const NETQ_SETS=[
 [[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]],[[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]]],
 [[[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]]],
 [[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]]]];
const NETQ=(()=>{const rnd=n=>Math.floor(Math.random()*n),K=(a,b)=>a+','+b,KANA='あいうえおかきくけこさしすせそたちつ';
 const RX=(t,s)=>[1,0,0,0,Math.cos(t),-Math.sin(t),0,Math.sin(t),Math.cos(t)].map(v=>v*1),RY=t=>[Math.cos(t),0,Math.sin(t),0,1,0,-Math.sin(t),0,Math.cos(t)];
 /* 4x4 の代わりに [3x3回転, 平行移動] の組で持つ */
 const mul=(A,B)=>{const r=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)r.push(A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j]);return r};
 const app=(R,p)=>[R[0]*p[0]+R[1]*p[1]+R[2]*p[2],R[3]*p[0]+R[4]*p[1]+R[5]*p[2],R[6]*p[0]+R[7]*p[1]+R[8]*p[2]];
 const comp=(T1,T2)=>({R:mul(T1.R,T2.R),t:app(T1.R,T2.t).map((v,i)=>v+T1.t[i])}),tp=(T,p)=>app(T.R,p).map((v,i)=>v+T.t[i]);
 const I={R:[1,0,0,0,1,0,0,0,1],t:[0,0,0]};
 /* 回す・裏返すで見た目を変える */
 function transform(sq){let s=sq.map(a=>[...a]);const r=rnd(4);for(let i=0;i<r;i++)s=s.map(([c,r])=>[-r,c]);if(rnd(2))s=s.map(([c,r])=>[-c,r]);
  const mc=Math.min(...s.map(a=>a[0])),mr=Math.min(...s.map(a=>a[1]));return s.map(([c,r])=>[c-mc,r-mr])}
 function build(sq){const set=new Set(sq.map(a=>K(...a))),tree={},order=[];const st=sq[0];tree[K(...st)]={par:null};const q=[st];
  while(q.length){const[c,r]=q.shift();for(const[dc,dr]of[[0,-1],[0,1],[1,0],[-1,0]]){const k=K(c+dc,r+dr);if(!set.has(k)||tree[k])continue;
   let piv,ax,s;if(dr===-1){piv=[0,-r];ax='x';s=1}else if(dr===1){piv=[0,-r-1];ax='x';s=-1}else if(dc===1){piv=[c+1,0];ax='y';s=-1}else{piv=[c,0];ax='y';s=1}
   tree[k]={par:K(c,r),piv,ax,s};order.push(k);q.push([c+dc,r+dr])}}
  return{set,tree,order}}
 /* t（0〜1）のときの各面の位置 */
 function poses(N,t){const P={},th=t*Math.PI/2;P[K(...N.sq[0])]=I;N.F.order.forEach(k=>{const h=N.F.tree[k],R=h.ax==='x'?RX(h.s*th):RY(h.s*th);
  const T={R,t:[h.piv[0],h.piv[1],0].map((v,i)=>v-app(R,[h.piv[0],h.piv[1],0])[i])};P[k]=comp(P[h.par],T)});return P}
 const faceOf=(sq,x,y)=>sq.find(([c,r])=>x>=c&&x<=c+1&&y>=r&&y<=r+1);
 function outward(set,x,y){let dx=0,dy=0;[[x-1,y-1],[x,y-1],[x-1,y],[x,y]].forEach(([c,r])=>{if(!set.has(K(c,r))){dx+=c+.5-x;dy+=r+.5-y}});const l=Math.hypot(dx,dy)||1;return[dx/l,dy/l]}
 function makeQ(lv){const base=NETQ_SETS[Math.min(2,lv)];const sq=transform(base[rnd(base.length)]);const F=build(sq),N={sq,F};
  const cnt={};sq.forEach(([c,r])=>[[c,r],[c+1,r],[c,r+1],[c+1,r+1]].forEach(v=>{const k=K(...v);cnt[k]=(cnt[k]||0)+1}));
  /* 外周を時計回りにたどる（左上から） */
  const nxt={};sq.forEach(([c,r])=>{[[[c,r],[c+1,r],[c,r-1]],[[c+1,r],[c+1,r+1],[c+1,r]],[[c+1,r+1],[c,r+1],[c,r+1]],[[c,r+1],[c,r],[c-1,r]]].forEach(([a,b,nb])=>{if(!F.set.has(K(...nb)))nxt[K(...a)]=K(...b)})});
  const s0=sq.slice().sort((a,b)=>a[1]-b[1]||a[0]-b[0])[0],st=K(...s0);const ring=[st];for(let c=nxt[st];c!==st;c=nxt[c])ring.push(c);
  const pts=ring.filter(k=>cnt[k]<3);const P1=poses(N,1);
  const pos=k=>{const[x,y]=k.split(',').map(Number),f=faceOf(sq,x,y);return tp(P1[K(...f)],[x,-y,0]).map(v=>Math.round(v)).join(',')};
  const dot=pts[rnd(pts.length)],dp=pos(dot),labs=pts.filter(k=>k!==dot);
  N.dot=dot.split(',').map(Number);N.labels=labs.map((k,i)=>{const[x,y]=k.split(',').map(Number);return{n:KANA[i],x,y,o:outward(F.set,x,y)}});
  N.ans=N.labels.filter(l=>pos(K(l.x,l.y))===dp).map(l=>l.n);return N}
 /* 展開図（紙の図面）。ラベルの位置を返す */
 function drawNet(c,N,sel,show){const W=Math.min(560,c.parentNode.clientWidth),dpr=Math.min(2,devicePixelRatio||1),cw=Math.max(...N.sq.map(a=>a[0]))+1,ch=Math.max(...N.sq.map(a=>a[1]))+1;
  const u=Math.floor(Math.min((W-60)/cw,46)),ox=Math.round((W-u*cw)/2),oy=30,HH=u*ch+60;c.style.height=HH+'px';c.width=W*dpr;c.height=HH*dpr;
  const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.fillStyle='#f4efe0';x.fillRect(0,0,W,HH);const X=v=>ox+v*u,Y=v=>oy+v*u;
  x.fillStyle='#fff';N.sq.forEach(([a,b])=>x.fillRect(X(a),Y(b),u,u));
  N.sq.forEach(([a,b])=>[[a,b,a+1,b,a,b-1],[a+1,b,a+1,b+1,a+1,b],[a,b+1,a+1,b+1,a,b+1],[a,b,a,b+1,a-1,b]].forEach(([p,q,r,s,nc,nr])=>{const inn=N.F.set.has(K(nc,nr));if(inn&&(nr<b||nc<a))return;
   x.beginPath();x.setLineDash(inn?[4,4]:[]);x.lineWidth=inn?1.4:2.4;x.strokeStyle='#111';x.moveTo(X(p),Y(q));x.lineTo(X(r),Y(s));x.stroke()}));x.setLineDash([]);
  x.beginPath();x.arc(X(N.dot[0]),Y(N.dot[1]),6,0,7);x.fillStyle=show?'#d8402f':'#111';x.fill();
  const hit=[];N.labels.forEach(l=>{const cx=X(l.x)+l.o[0]*17,cy=Y(l.y)+l.o[1]*17,on=sel.has(l.n),an=show&&N.ans.includes(l.n);
   x.beginPath();x.arc(cx,cy,12,0,7);x.fillStyle=an?'#d8402f':on?'#1c2f6a':'#fff';x.fill();x.lineWidth=1.6;x.strokeStyle=an?'#d8402f':'#111';x.stroke();
   x.fillStyle=an||on?'#fff':'#111';x.font='800 15px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(l.n,cx,cy+1);hit.push({n:l.n,cx,cy})});return hit}
 /* 組み立て：t＝0（展開図）〜1（立方体）。yaw・pitch で回す */
 function draw3d(cv,N,t,yaw,pitch,show){const W=Math.min(560,cv.parentNode.clientWidth),Hh=230,dpr=Math.min(2,devicePixelRatio||1);if(cv.width!==W*dpr){cv.width=W*dpr;cv.height=Hh*dpr;cv.style.height=Hh+'px'}
  const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,Hh);const P=poses(N,t);
  const all=[];N.sq.forEach(([a,b])=>{const T=P[K(a,b)];[[a,b],[a+1,b],[a+1,b+1],[a,b+1]].forEach(([p,q])=>all.push(tp(T,[p,-q,0])))});
  const cen=[0,1,2].map(i=>all.reduce((s,p)=>s+p[i],0)/all.length);const V=mul(RX(pitch*Math.PI/180),[Math.cos(yaw*Math.PI/180),-Math.sin(yaw*Math.PI/180),0,Math.sin(yaw*Math.PI/180),Math.cos(yaw*Math.PI/180),0,0,0,1]);
  const span=Math.max(2.2,...all.map(p=>Math.hypot(p[0]-cen[0],p[1]-cen[1],p[2]-cen[2]))),s=Math.min(W,Hh)/(2.25*span);
  const pr=p=>{const q=app(V,p.map((v,i)=>v-cen[i]));return{sx:W/2+q[0]*s,sy:Hh/2-q[1]*s,dz:q[2]}};
  const faces=N.sq.map(([a,b])=>{const T=P[K(a,b)],ps=[[a,b],[a+1,b],[a+1,b+1],[a,b+1]].map(([p,q])=>pr(tp(T,[p,-q,0])));return{ps,dz:ps.reduce((s,p)=>s+p.dz,0)/4}}).sort((p,q)=>p.dz-q.dz);
  faces.forEach(f=>{x.beginPath();f.ps.forEach((p,i)=>i?x.lineTo(p.sx,p.sy):x.moveTo(p.sx,p.sy));x.closePath();x.fillStyle='rgba(232,238,252,.82)';x.fill();x.strokeStyle='#0b1024';x.lineWidth=1.5;x.stroke()});
  const mk=[];const df=faceOf(N.sq,...N.dot);mk.push({p:pr(tp(P[K(...df)],[N.dot[0],-N.dot[1],0])),dot:1});
  N.labels.forEach(l=>{const f=faceOf(N.sq,l.x,l.y);mk.push({p:pr(tp(P[K(...f)],[l.x+l.o[0]*.3,-(l.y+l.o[1]*.3),0])),n:l.n,an:show&&N.ans.includes(l.n)})});
  mk.sort((a,b)=>a.p.dz-b.p.dz).forEach(m=>{if(m.dot){x.beginPath();x.arc(m.p.sx,m.p.sy,6,0,7);x.fillStyle=show?'#d8402f':'#111';x.fill();x.strokeStyle='#fff';x.lineWidth=1.5;x.stroke();return}
   x.beginPath();x.arc(m.p.sx,m.p.sy,10,0,7);x.fillStyle=m.an?'#d8402f':'#fff';x.fill();x.strokeStyle=m.an?'#d8402f':'#111';x.lineWidth=1.4;x.stroke();x.fillStyle=m.an?'#fff':'#111';x.font='800 12px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(m.n,m.p.sx,m.p.sy+1)})}
 function viewer(box,N){box.innerHTML=`<div class="cand" style="grid-column:1/-1"><canvas class="nq3"></canvas><div class="cqrow"><button class="nqf">組み立てる</button><button class="nqo">開く</button><button class="nqr">赤くする</button></div></div>`;
  const cv=box.querySelector('canvas'),v={t:0,yaw:-25,pitch:-55,tg:null,show:false};let drag=null,raf=0;const draw=()=>draw3d(cv,N,v.t,v.yaw,v.pitch,v.show);
  const anim=()=>{cancelAnimationFrame(raf);const go=()=>{if(v.tg===null)return;const d=v.tg-v.t;if(Math.abs(d)<.03){v.t=v.tg;v.tg=null}else v.t+=Math.sign(d)*.03;draw();if(v.tg!==null)raf=requestAnimationFrame(go)};go()};
  box.querySelector('.nqf').onclick=()=>{v.tg=1;anim()};box.querySelector('.nqo').onclick=()=>{v.tg=0;anim()};
  box.querySelector('.nqr').onclick=e=>{v.show=!v.show;e.target.textContent=v.show?'色をもどす':'赤くする';draw()};
  cv.addEventListener('pointerdown',e=>{e.preventDefault();drag=[e.clientX,e.clientY,v.yaw,v.pitch];try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener('pointermove',e=>{if(!drag)return;v.yaw=drag[2]+(e.clientX-drag[0])*.6;v.pitch=Math.max(-90,Math.min(0,drag[3]+(e.clientY-drag[1])*.5));draw()});
  const up=()=>{drag=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);draw();setTimeout(()=>{v.tg=1;anim()},400)}
 /* 1問を出す。正解なら true、「あとで」なら false。pr は CADQ.step と同じ */
 function step(lv,pr){return new Promise(res0=>{const res=v=>{$('cqViews').onclick=null;res0(v)};let N=null,sel=new Set(),hit=[],locked=false;const who=(pr&&pr.who)||'owl',prac=pr&&pr.practice;
  $('cqT').textContent=prac?'展開図の練習':'展開図の図面';$('cqStep').textContent=(pr&&pr.label)||'';$('cqBack').textContent=prac?'◀ やめる':'◀ あとで';
  $('cqMsg').innerHTML=`<img src="${CHARS[who].img}" alt=""><span>${(pr&&pr.say)||'展開図を組み立てて立方体にしたとき、●と重なる点をすべて選ぼう！'}</span>`;
  $('cqBack').onclick=()=>{if(locked&&N&&N.done)return;res(false)};const cv=$('cqViews');
  const paint=()=>{hit=drawNet(cv,N,sel,locked)};
  cv.onclick=e=>{if(locked||!N)return;const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*(cv.width/(Math.min(2,devicePixelRatio||1))/r.width),py=(e.clientY-r.top)*(cv.height/(Math.min(2,devicePixelRatio||1))/r.height);let best=null,bd=22;hit.forEach(h=>{const d=Math.hypot(h.cx-px,h.cy-py);if(d<bd){bd=d;best=h}});
   if(!best)return;sel.has(best.n)?sel.delete(best.n):sel.add(best.n);tone(660,.05,'triangle',.05);paint();upd()};
  const upd=()=>{$('cqFb').innerHTML=`<div class="note">えらんだ点：<b style="color:var(--gold);font-size:16px">${sel.size?[...sel].join('・'):'なし'}</b>　（もう一度タップで外す）</div><button class="btn gold" id="nqGo">これで決定</button><div class="ngc" id="nqErr" style="font-size:13px"></div>`;
   $('nqGo').onclick=answer};
  const ask=()=>{N=makeQ(lv);sel=new Set();locked=false;show('cadq');$('cqCands').innerHTML='<div class="note" style="grid-column:1/-1">へこんだ角をはさむ2本の辺は、組み立てると重なる。●から順にたどろう。記号をタップして選ぶ</div>';paint();upd()};
  const answer=()=>{if(locked)return;if(!sel.size){$('nqErr').textContent='重なると思う点を1つ以上えらんでね';return}
   const ok=sel.size===N.ans.length&&N.ans.every(a=>sel.has(a));locked=true;paint();viewer($('cqCands'),N);
   if(ok){N.done=true;tone(880,.12,'triangle',.1,1320);$('cqFb').innerHTML='<div class="okc">○ 正解！ 組み立てて確かめよう</div><button class="btn gold" id="cqNext">次へ</button>';$('cqNext').onclick=()=>res(true);return}
   buzz();$('cqFb').innerHTML=`<div class="ngc">✗ 正解は「${N.ans.join('・')}」</div><span class="note">組み立てると、赤い点が●と重なる。もう一度、別の展開図で挑戦！</span><button class="btn" id="cqRetry">もう一度</button>`;$('cqRetry').onclick=ask};
  ask()})}
 return{step,makeQ,poses}})();
/* どの図面を展開図にするか：vol.2 の図面（審判の塔の図面・ガチャ vol.2 の限定図面）、または quiz:'net' */
const J_NET_LV={jk:0,jt:0,jm:1,jb:1,js:2,jr:2,jg:2};
function isNetBp(R){return !!R&&(R.quiz==='net'||R.vol===2||(R.area in J_NET_LV))}
function netLv(R){return R.area in J_NET_LV?J_NET_LV[R.area]:2}
{const _d=decodeBp;decodeBp=async function(id){const R=RECIPES[id];if(!isNetBp(R))return _d(id);if(!(G.bpRaw||[]).includes(id))return;
 const ok=await NETQ.step(netLv(R),{who:G.lead,label:'図面の解読',say:`「${R.n}」の図面は展開図でかかれている。組み立てたとき、●と重なる点をすべて選ぼう！`});
 openShop(shopFrom);
 if(ok){G.bpRaw=G.bpRaw.filter(b=>b!==id);if(!G.bps.includes(id))G.bps.push(id);save();sfx.win&&sfx.win();renderShop();
  await say(`${RIC(id,40)} 解読できた！<br><span style="font-size:14px">「${R.n}」をつくれるようになった</span>`,1500)}
 else await say('まだ読み解けない……<br><span style="font-size:14px">何度でも挑戦できる</span>',1200)}}
/* 道場に「図面の解読」の練習（三面図・展開図）を足す。展開図は審判の塔が開いてから */
const NETQ_PRAC=['展開図の練習だよ。●と重なる点を探そう。答えたあと、組み立てて確かめられるよ。','いい調子！','へこんだ角から、重なる辺をたどってみよう。'];
const CADQ_PRAC=['三面図の練習だよ。上・前・右から見た形を組み立てよう。','いい調子！','あわてずに、上・前・右を順番に見よう。'];
async function quizPractice(kind,lv){const Q=kind==='net'?NETQ:CADQ,M=kind==='net'?NETQ_PRAC:CADQ_PRAC;let ok=0,n=0;
 for(;;){const r=await Q.step(lv,{practice:true,who:'owl',label:`${CADQ_LV[lv]}　正解 ${ok}`,say:n?(ok===n?M[1]:M[2]):M[0]});if(!r)break;ok++;n++}
 openPractice();if(n)await say(`おつかれさま！ ${ok}問正解！`,1300)}
{const _o=openPractice;openPractice=function(){_o();const pg=$('prBody').querySelector('.prg');if(!pg)return;const lv=Math.min(2,Math.max(0,prTier-1));
 const kinds=[['cad','三面図の解読',MIC('bp',40)]].concat(V2_OPEN?[['net','展開図の解読',MIC('bp',40)]]:[]);
 pg.insertAdjacentHTML('afterend',`<div class="note" style="margin:12px 0 4px">図面の解読の練習（${CADQ_LV[lv]}）</div><div class="prg">${kinds.map(([k,n,ic])=>`<button class="prc" data-qz="${k}">${ic}<span class="prn"><b>${n}</b><i>何問でも</i></span></button>`).join('')}</div>`);
 $('prBody').querySelectorAll('[data-qz]').forEach(b=>b.onclick=()=>quizPractice(b.dataset.qz,lv))}}
