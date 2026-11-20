/* =====================================================================
   特許の図面の解読：スライドパズル（決定 11/20）。大きさは図面ごとに3×3〜6×6
   ・特許の図面（青図の線画）を6×6に切り分け、1マス空けてばらばらにする。空きマスと同じ列・行のマスをタップすると、そこまでまとめてすべる
   ・ハードロックナット3×3／ロータリーエンジン4×4／オシロスコープ・AEBS 5×5／アウル・スコープ6×6
   ・「番号を出す」で、マスに小さな番号を出せる（ヒント）
   ===================================================================== */
const PATQ_ART={},PATQ_SIZE={pt_nut:3,pt_engine:4,pt_osc:5,pt_aebs:5,pt_scope:6};
const PATQ=(()=>{let N=6;const SIZE=PATQ_SIZE,MOVES={3:20,4:36,5:60,6:90};
 /* 図面の線画（青図）。ctx の 0〜1 の正方形にかく */
 const ART=Object.assign(PATQ_ART,{
  pt_engine:(x,S)=>{const c=S/2;x.beginPath();x.ellipse(c,c,S*.36,S*.27,0,0,TAU);x.stroke();x.beginPath();x.ellipse(c,c,S*.3,S*.21,0,0,TAU);x.stroke();
   const R=S*.2;x.beginPath();for(let i=0;i<3;i++){const a=-Math.PI/2+i*TAU/3,b=a+TAU/3,p=[c+Math.cos(a)*R,c+Math.sin(a)*R],q=[c+Math.cos(b)*R,c+Math.sin(b)*R];i?0:x.moveTo(...p);x.quadraticCurveTo(c+Math.cos(a+TAU/6)*R*.75,c+Math.sin(a+TAU/6)*R*.75,...q)}x.closePath();x.stroke();
   x.beginPath();x.arc(c,c,S*.05,0,TAU);x.stroke();x.beginPath();x.arc(c,c,S*.025,0,TAU);x.stroke();
   [[.82,.3],[.82,.7]].forEach(([u,v])=>{x.strokeRect(S*u,S*v-S*.04,S*.1,S*.08)});return[[c,c-R,'1'],[c+S*.33,c,'2'],[c,c,'3'],[S*.87,S*.3,'4']]},
  pt_osc:(x,S)=>{x.strokeRect(S*.12,S*.18,S*.76,S*.6);x.strokeRect(S*.18,S*.24,S*.46,S*.36);for(let i=1;i<4;i++){x.beginPath();x.moveTo(S*.18,S*(.24+i*.09));x.lineTo(S*.64,S*(.24+i*.09));x.stroke()}
   x.beginPath();for(let i=0;i<=40;i++){const u=i/40,y=S*.42-(Math.abs(u-.5)<.06?S*.12*Math.sin((u-.44)/.12*Math.PI*2):S*.02*Math.sin(u*30));i?x.lineTo(S*(.18+u*.46),y):x.moveTo(S*.18,y)}x.stroke();
   [[.74,.32],[.74,.5]].forEach(([u,v])=>{x.beginPath();x.arc(S*u,S*v,S*.05,0,TAU);x.stroke()});x.strokeRect(S*.2,S*.66,S*.4,S*.06);x.beginPath();x.moveTo(S*.3,S*.78);x.lineTo(S*.25,S*.88);x.moveTo(S*.7,S*.78);x.lineTo(S*.75,S*.88);x.stroke();
   return[[S*.4,S*.3,'1'],[S*.74,S*.32,'2'],[S*.4,S*.69,'3'],[S*.5,S*.42,'4']]},
  pt_aebs:(x,S)=>{x.beginPath();x.moveTo(S*.1,S*.62);x.lineTo(S*.1,S*.5);x.lineTo(S*.22,S*.48);x.lineTo(S*.32,S*.36);x.lineTo(S*.56,S*.36);x.lineTo(S*.66,S*.48);x.lineTo(S*.74,S*.5);x.lineTo(S*.74,S*.62);x.closePath();x.stroke();
   [.24,.6].forEach(u=>{x.beginPath();x.arc(S*u,S*.63,S*.06,0,TAU);x.stroke()});x.strokeRect(S*.36,S*.4,S*.08,S*.08);x.strokeRect(S*.46,S*.4,S*.08,S*.08);
   for(let i=1;i<=3;i++){x.beginPath();x.arc(S*.74,S*.54,S*.06*i,-.6,.6);x.stroke()}x.beginPath();x.moveTo(S*.92,S*.36);x.lineTo(S*.92,S*.7);x.stroke();x.setLineDash([4,4]);x.beginPath();x.moveTo(S*.1,S*.76);x.lineTo(S*.92,S*.76);x.stroke();x.setLineDash([]);
   return[[S*.42,S*.36,'1'],[S*.24,S*.63,'2'],[S*.86,S*.54,'3'],[S*.92,S*.5,'4']]},
  pt_nut:(x,S)=>{const hex=(cx,cy,r)=>{x.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6+Math.PI/6;i?x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):x.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath();x.stroke();x.beginPath();x.arc(cx,cy,r*.45,0,TAU);x.stroke();x.beginPath();x.arc(cx,cy,r*.55,0,TAU);x.stroke()};
   hex(S*.32,S*.36,S*.18);hex(S*.68,S*.36,S*.18);x.strokeRect(S*.14,S*.62,S*.72,S*.1);x.beginPath();x.moveTo(S*.14,S*.72);x.lineTo(S*.5,S*.88);x.lineTo(S*.86,S*.72);x.stroke();
   x.beginPath();x.moveTo(S*.5,S*.62);x.lineTo(S*.44,S*.72);x.lineTo(S*.56,S*.72);x.closePath();x.stroke();return[[S*.32,S*.18,'1'],[S*.68,S*.18,'2'],[S*.5,S*.67,'3'],[S*.5,S*.85,'4']]},
  pt_scope:(x,S)=>{const c=S*.5;x.beginPath();x.arc(c,S*.42,S*.24,0,TAU);x.stroke();x.beginPath();x.arc(c,S*.42,S*.16,0,TAU);x.stroke();x.beginPath();x.arc(c,S*.42,S*.07,0,TAU);x.stroke();
   x.beginPath();x.moveTo(S*.3,S*.2);x.lineTo(S*.24,S*.08);x.lineTo(S*.38,S*.17);x.moveTo(S*.7,S*.2);x.lineTo(S*.76,S*.08);x.lineTo(S*.62,S*.17);x.stroke();
   x.strokeRect(S*.74,S*.36,S*.14,S*.12);for(let i=0;i<8;i++){const a=i*TAU/8;x.beginPath();x.moveTo(S*.81+Math.cos(a)*S*.06,S*.42+Math.sin(a)*S*.06);x.lineTo(S*.81+Math.cos(a)*S*.08,S*.42+Math.sin(a)*S*.08);x.stroke()}
   x.beginPath();x.moveTo(S*.42,S*.66);x.lineTo(S*.36,S*.86);x.lineTo(S*.64,S*.86);x.lineTo(S*.58,S*.66);x.stroke();x.strokeRect(S*.28,S*.86,S*.44,S*.05);
   return[[c,S*.18,'1'],[c,S*.42,'2'],[S*.81,S*.36,'3'],[c,S*.86,'4']]}});
 /* 図面の絵をキャンバスにかく（青図・方眼・番号） */
 function render(id,S){const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');
  x.fillStyle='#1d4a8f';x.fillRect(0,0,S,S);x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;for(let i=0;i<=S;i+=S/24){x.beginPath();x.moveTo(i,0);x.lineTo(i,S);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(S,i);x.stroke()}
  x.strokeStyle='#eaf2ff';x.lineWidth=Math.max(1.6,S/170);const tags=(ART[id]||ART.pt_scope)(x,S);
  x.lineWidth=1;x.font=`800 ${Math.round(S/22)}px sans-serif`;x.textAlign='center';x.textBaseline='middle';
  tags.forEach(([px,py,t],i)=>{const tx=i%2?S*.94:S*.06,ty=py<S*.5?S*.1+i*S*.05:S*.9-i*S*.03;x.beginPath();x.moveTo(px,py);x.lineTo(tx,ty);x.stroke();x.fillStyle='#1d4a8f';x.beginPath();x.arc(tx,ty,S/30,0,TAU);x.fill();x.stroke();x.fillStyle='#eaf2ff';x.fillText(t,tx,ty+1)});
  x.strokeStyle='#eaf2ff';x.lineWidth=2;x.strokeRect(S*.02,S*.02,S*.96,S*.96);x.font=`700 ${Math.round(S/26)}px sans-serif`;x.textAlign='right';x.fillStyle='#eaf2ff';x.fillText('図1',S*.95,S*.96);return c}
 /* ばらばらにする：そろった形から、空きマスをランダムに動かす（すぐ戻る手はしない） */
 function shuffle(moves){const b=[...Array(N*N).keys()];let e=N*N-1,prev=-1;
  for(let i=0;i<moves;i++){const ex=e%N,ey=e/N|0,nb=[];if(ex>0)nb.push(e-1);if(ex<N-1)nb.push(e+1);if(ey>0)nb.push(e-N);if(ey<N-1)nb.push(e+N);
   const c=nb.filter(n=>n!==prev);const n=c[Math.floor(Math.random()*c.length)];[b[e],b[n]]=[b[n],b[e]];prev=e;e=n}
  if(b.every((v,i)=>v===i))return shuffle(moves);return b}
 function step(id,pr){return new Promise(res=>{N=SIZE[id]||5;const moves=MOVES[N];let B=shuffle(moves),cnt=0,hint=false,done=false,img=null,S=0;
  $('cqT').textContent=RECIPES[id]&&RECIPES[id].legend?'マイスターの図面':'特許の図面';$('cqStep').textContent=(pr&&pr.label)||'';$('cqBack').textContent='◀ あとで';
  $('cqMsg').innerHTML=`<img src="${CHARS[(pr&&pr.who)||'nox'].img}" alt=""><span>${(pr&&pr.say)||'ばらばらになった特許の図面を、元の形にもどそう。空いたマスのとなりのマスをタップすると、すべって動く。'}</span>`;
  show('cadq');
  const old=$('cqViews');old.style.display='none';let cv=$('pqCv');if(!cv){cv=document.createElement('canvas');cv.id='pqCv';old.after(cv)}cv.style.display='block';
  const D=Math.min(2,devicePixelRatio||1);const W=Math.round(Math.max(240,Math.min(innerWidth-20,innerHeight*.58,480)));S=W;cv.width=W*D;cv.height=W*D;
  cv.style.cssText=`display:block;width:${W}px;height:${W}px;margin:0 auto;padding:0;border:0;border-radius:10px;touch-action:none;max-height:none`;
  const close=()=>{cv.style.display='none';old.style.display=''};const x=cv.getContext('2d');x.setTransform(D,0,0,D,0,0);
  img=render(id,Math.round(W*D));const T=W/N,TS=img.width/N;
  function draw(){x.clearRect(0,0,W,W);x.fillStyle='#0b1430';x.fillRect(0,0,W,W);
   B.forEach((v,i)=>{const px=(i%N)*T,py=(i/N|0)*T;if(v===N*N-1&&!done)return;x.drawImage(img,(v%N)*TS,(v/N|0)*TS,TS,TS,px+1,py+1,T-2,T-2);
    if(hint&&!done){x.fillStyle='rgba(255,210,90,.9)';x.font=`800 ${N<=4?14:11}px sans-serif`;x.textAlign='left';x.textBaseline='top';x.fillText(v+1,px+4,py+3)}
    if(!done&&v===i){x.strokeStyle='rgba(120,255,160,.35)';x.lineWidth=2;x.strokeRect(px+2,py+2,T-4,T-4)}})}
  const ok=()=>B.every((v,i)=>v===i);
  function tap(i){if(done)return;const e=B.indexOf(N*N-1),ex=e%N,ey=e/N|0,tx=i%N,ty=i/N|0;if(i===e)return;
   if(tx===ex){const d=ty>ey?N:-N;for(let k=e;k!==i;k+=d){[B[k],B[k+d]]=[B[k+d],B[k]]}}
   else if(ty===ey){const d=tx>ex?1:-1;for(let k=e;k!==i;k+=d){[B[k],B[k+d]]=[B[k+d],B[k]]}}else return;
   cnt++;tone(520,.04,'triangle',.04);draw();upd();if(ok()){done=true;draw();tone(880,.12,'triangle',.1,1320);
    $('cqFb').innerHTML=`<div class="okc">○ 図面がもどった！（${cnt}手）</div><button class="btn gold" id="cqNext">次へ</button>`;$('cqNext').onclick=()=>{close();res(true)}}}
  cv.onpointerdown=e=>{e.preventDefault();const r=cv.getBoundingClientRect(),cx=Math.floor((e.clientX-r.left)/r.width*N),cy=Math.floor((e.clientY-r.top)/r.height*N);if(cx<0||cy<0||cx>=N||cy>=N)return;tap(cy*N+cx)};
  $('cqBack').onclick=()=>{if(done)return;close();res(false)};
  const upd=()=>{if(done)return;$('cqFb').innerHTML=`<div class="note">${cnt}手　そろったマス ${B.filter((v,i)=>v===i&&v!==N*N-1).length} / ${N*N-1}</div>`};
  $('cqCands').innerHTML=`<div class="cand" style="grid-column:1/-1;display:flex;gap:8px;align-items:center;padding:8px"><canvas id="pqPrev" style="width:96px;height:96px;flex:none"></canvas><div style="flex:1"><div class="note" style="margin-bottom:6px">完成した図面（見本）</div><div class="cqrow"><button id="pqHint">番号を出す</button><button id="pqReset">はじめから</button></div></div></div>`;
  {const pc=$('pqPrev');pc.width=pc.height=192;pc.getContext('2d').drawImage(img,0,0,192,192)}
  $('pqHint').onclick=e=>{hint=!hint;e.target.textContent=hint?'番号を消す':'番号を出す';draw()};$('pqReset').onclick=()=>{if(done)return;B=shuffle(moves);cnt=0;draw();upd()};
  draw();upd()})}
 return{step,render}})();
/* 特許の図面はスライドパズルで解読する */
{const _d=decodeBp;decodeBp=async function(id){const R=RECIPES[id];if(!R||!R.patent)return _d(id);if(!(G.bpRaw||[]).includes(id))return;
 const ok=await PATQ.step(id,{who:'nox',label:'図面の解読',say:`「${R.n}」の${R.legend?'マイスターの':'特許の'}図面が、ばらばらになっている。空いたマスのとなりをタップしてすべらせ、元の図面にもどそう。`});
 openShop(shopFrom);
 if(ok){G.bpRaw=G.bpRaw.filter(b=>b!==id);if(!G.bps.includes(id))G.bps.push(id);save();sfx.win&&sfx.win();renderShop();
  await say(`${RIC(id,40)} 解読できた！<br><span style="font-size:14px">「${R.n}」をつくれるようになった（要る練度に注意）</span>`,1600)}
 else await say('まだ途中……<br><span style="font-size:14px">何度でも挑戦できる</span>',1200)}}
