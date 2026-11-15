/* ===================== 加工ミニゲーム：打つ（金床）・つなぐ（溶接機） ===================== */
const HIT_N={1:5,2:7,3:9};          /* 打つ回数 */
const HIT_PERIOD={1:1.5,2:1.25,3:1.05}; /* 輪がちぢむ時間（秒）。時間切れはない。のがしたら輪がまたひろがる */
const WELD_TOL={1:16,2:13,3:10};      /* 溶接線からどれだけずれてもよいか（画面の点） */
const WELD_V={1:[60,240],2:[70,210],3:[80,190]}; /* ちょうどよいトーチの速さ（点/秒） */

function forgeOpen(title,sub,ic){$('fgBar').style.display='none';$('fgBar').innerHTML='';$('fgTitle').innerHTML=UIMG(ic,26)+' '+title;$('fgSub').textContent=sub;$('fgInfo').textContent='';show('forge');
 const cv=$('fgcv'),W=Math.min(560,innerWidth*.92),H=Math.min(W*1.15,innerHeight-250),DPR=Math.min(2,devicePixelRatio||1);
 cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';const g=cv.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);return{cv,g,W,H}}

/* ---------- 打つ：真っ赤な鉄を金床の上でたたいて、金色の線までのばす ---------- */
function runHit(o){return new Promise(res=>{
 const tier=o.tier||1,N=HIT_N[tier],P=HIT_PERIOD[tier]*(o.lim&&o.lim.ahammer?1.25:1),AM=assistMul(o);
 const {cv,g,W,H}=forgeOpen(o.title||'金床で打つ','輪が金色の円に重なった瞬間にタップ。ぴったりなほど、鉄が金色の線どおりにのびる','t_anvil');
 const ax0=W*.1,ax1=W*.9,ay=H*.62;        /* 鉄の中心線 */
 const tgtT=H*.045,startT=H*.11;           /* 目標の厚み（半分）と、はじめの厚み */
 const pts=Array.from({length:N},(_,i)=>ax0+(ax1-ax0)*(i+.5)/N);
 const M=60,th=new Float32Array(M+1).fill(startT);   /* 鉄の厚み（場所ごと） */
 let k=0,t=0,last=0,raf=0,done=false,scores=[],hammer=0,sparks=[],shake=0,msg='',msgT=0;
 const R0=26,RMAX=96;
 const ringR=()=>RMAX-(RMAX-R0*.2)*((t%P)/P);
 function strike(){if(done||k>=N)return;const r=ringR(),q=Math.max(0,1-Math.abs(r-R0)/(R0*.8*AM));scores.push(q);
  /* その場所の鉄をのばす：ぴったりなら目標の厚みに、ずれるほど厚いまま */
  const x=pts[k],span=(ax1-ax0)/N*.75;for(let i=0;i<=M;i++){const xi=ax0+(ax1-ax0)*i/M,d=Math.abs(xi-x)/span;if(d<1){const w=Math.cos(d*Math.PI/2),goal=tgtT+(startT-tgtT)*(1-q)*.85;th[i]=th[i]+(Math.min(th[i],goal)-th[i])*w}}
  hammer=1;shake=6;for(let i=0;i<14+q*16;i++){const a=-Math.PI*Math.random();sparks.push({x,y:ay-th[Math.round((x-ax0)/(ax1-ax0)*M)],vx:Math.cos(a)*(2+Math.random()*4),vy:Math.sin(a)*(2+Math.random()*5),l:1})}
  tone(q>.8?520:q>.5?380:240,.09,'square',.08,q>.8?260:180);msg=q>.85?'ぴったり！':q>.6?'いい感じ':q>.3?'ちょっとずれた':'ずれた…';msgT=1;
  k++;t=0;$('fgInfo').textContent=`${k} / ${N}`;if(k>=N)setTimeout(finish,700)}
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=null;
  const s=scores.length?scores.reduce((a,b)=>a+b,0)/N:0;res({score:Math.round(Math.min(100,s*102)),reach:k>=N?1:k/N})}
 function draw(){g.clearRect(0,0,W,H);g.save();if(shake)g.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  /* 金床 */
  g.fillStyle='#2b3448';g.beginPath();g.moveTo(W*.04,ay+H*.06);g.lineTo(W*.96,ay+H*.06);g.lineTo(W*.84,ay+H*.16);g.lineTo(W*.62,ay+H*.18);g.lineTo(W*.66,H*.97);g.lineTo(W*.34,H*.97);g.lineTo(W*.38,ay+H*.18);g.lineTo(W*.16,ay+H*.16);g.closePath();g.fill();
  g.fillStyle='#3d4862';g.fillRect(W*.04,ay+H*.06-5,W*.92,6);
  /* 目標の線 */
  /* 鉄（たたくほど冷えて色が暗くなる） */
  const heat=1-k/N*.6;const gr=g.createLinearGradient(0,ay-startT,0,ay+startT);gr.addColorStop(0,`hsl(${30+10*heat},100%,${45+20*heat}%)`);gr.addColorStop(1,`hsl(${10+10*heat},100%,${25+15*heat}%)`);
  g.fillStyle=gr;g.beginPath();for(let i=0;i<=M;i++){const x=ax0+(ax1-ax0)*i/M;i?g.lineTo(x,ay-th[i]):g.moveTo(x,ay-th[i])}for(let i=M;i>=0;i--)g.lineTo(ax0+(ax1-ax0)*i/M,ay+Math.min(th[i],H*.06));g.closePath();g.fill();
  g.shadowColor='#ff6a20';g.shadowBlur=18*heat;g.fill();g.shadowBlur=0;
  g.setLineDash([6,6]);g.strokeStyle='#ffe9a0';g.lineWidth=2;g.beginPath();g.moveTo(ax0,ay-tgtT);g.lineTo(ax1,ay-tgtT);g.stroke();g.setLineDash([]);
  /* たたく場所と輪 */
  pts.forEach((x,i)=>{g.fillStyle=i<k?'#ffffff30':i===k?'#fff':'#ffffff55';g.beginPath();g.arc(x,ay+H*.06+12,3,0,TAU);g.fill()});
  if(k<N&&!done){const x=pts[k],y=ay-H*.2;g.strokeStyle='#e8c35a';g.lineWidth=4;g.beginPath();g.arc(x,y,R0,0,TAU);g.stroke();
   const r=ringR(),near=Math.abs(r-R0)<R0*.3;g.strokeStyle=near?'#ffe066':'#ffffffaa';g.lineWidth=near?5:3;g.beginPath();g.arc(x,y,r,0,TAU);g.stroke();
   g.strokeStyle='#ffffff40';g.lineWidth=1;g.beginPath();g.moveTo(x,y+R0);g.lineTo(x,ay-startT-4);g.stroke()}
  /* ハンマー */
  if(hammer>0){const x=pts[Math.max(0,k-1)],y=ay-H*.12-hammer*H*.12;g.save();g.translate(x,y);g.rotate(-.5*hammer);g.fillStyle='#8a5a32';g.fillRect(-4,-70,8,70);g.fillStyle='#9aa6bd';g.fillRect(-22,-8,44,22);g.restore()}
  sparks.forEach(s=>{g.fillStyle=`rgba(255,${180+60*s.l|0},80,${s.l})`;g.fillRect(s.x,s.y,3,3)});
  if(msgT>0){g.globalAlpha=Math.min(1,msgT*2);g.fillStyle='#ffe066';g.font='800 22px sans-serif';g.textAlign='center';g.fillText(msg,W/2,H*.16);g.globalAlpha=1}
  g.restore()}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;t+=dt;hammer=Math.max(0,hammer-dt*4);shake=Math.max(0,shake-dt*30);msgT=Math.max(0,msgT-dt);
  sparks.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.vy+=.25;s.l-=dt*1.6});sparks=sparks.filter(s=>s.l>0);draw();if(!done)raf=requestAnimationFrame(loop)}
 cv.onpointerdown=e=>{e.preventDefault();strike()};
 $('fgDone').style.display='none';$('fgInfo').textContent=`0 / ${N}`;raf=requestAnimationFrame(loop)})}

/* ---------- つなぐ：2枚の鉄板のつなぎ目を、トーチでなぞって溶接する ---------- */
function weldPath(shape,W,H){const y=H*.5,x0=W*.1,x1=W*.9,P=[];const n=80;
 for(let i=0;i<=n;i++){const u=i/n,x=x0+(x1-x0)*u;let yy=y;
  if(shape==='de')yy=y+Math.sin(u*Math.PI*3)*H*.12;          /* 波 */
  else if(shape==='me')yy=y+H*.16-Math.sin(u*Math.PI)*H*.32;  /* 弓なり */
  else if(shape==='ma')yy=y+Math.sin(u*Math.PI*2)*H*.18;
  P.push([x,yy])}return P}
function runWeld(o){return new Promise(res=>{
 const tier=o.tier||1,AM=assistMul(o),TOL=WELD_TOL[tier]*AM,TG=o.lim&&o.lim.tig?1.3:1,VMIN=WELD_V[tier][0]/AM/TG,VMAX=WELD_V[tier][1]*AM*TG;
 const {cv,g,W,H}=forgeOpen(o.title||'溶接機でつなぐ','指でトーチを動かして、つなぎ目をなぞる。速すぎると細く、遅すぎると焼けすぎる','t_welder');
 const P=weldPath(o.shape||'ch',W,H),n=P.length-1,q=new Float32Array(n).fill(-1),heat=new Float32Array(n);
 let pid=null,tx=W*.5,ty=H*.85,lx=0,ly=0,lt=0,v=0,last=0,raf=0,done=false,spat=0,sparks=[],on=false;
 const OFF=46;   /* トーチの先は指より少し上（指でかくれないように） */
 function nearest(x,y){let bi=-1,bd=1e9;for(let i=0;i<n;i++){const[a,b]=P[i],[c,d]=P[i+1],dx=c-a,dy=d-b,L=dx*dx+dy*dy,u=Math.max(0,Math.min(1,((x-a)*dx+(y-b)*dy)/L)),px=a+dx*u,py=b+dy*u,dd=Math.hypot(x-px,y-py);if(dd<bd){bd=dd;bi=i}}return[bi,bd]}
 const cover=()=>{let c=0;for(const v of q)if(v>=0)c++;return c/n};
 function score(){let s=0;for(const v of q)s+=Math.max(0,v);return Math.max(0,Math.round(s/n*100-spat*.5))}
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;$('fgDone').onclick=null;res({score:score(),reach:cover()})}
 function speedQ(v){if(v<VMIN)return Math.max(.35,v/VMIN);if(v>VMAX)return Math.max(.25,1-(v-VMAX)/VMAX);return 1}
 function weldAt(x,y,dt){const[i,d]=nearest(x,y);if(d>TOL){spat+=dt*10;return false}
  heat[i]+=dt;const over=heat[i]>.9?Math.max(.4,1-(heat[i]-.9)):1;const sq=speedQ(v)*over*(1-.35*d/TOL);
  q[i]=q[i]<0?sq:Math.min(q[i],sq)*.5+Math.max(q[i],sq)*.5;if(i>0&&q[i-1]<0&&d<TOL)q[i-1]=sq*.9;return true}
 function draw(){g.clearRect(0,0,W,H);
  /* 鉄板2枚 */
  g.fillStyle='#4a5670';g.beginPath();g.moveTo(0,H*.08);g.lineTo(W,H*.08);for(let i=n;i>=0;i--)g.lineTo(P[i][0]+(i===n?W*.1:0),P[i][1]-3);g.lineTo(0,P[0][1]-3);g.closePath();g.fill();
  g.fillStyle='#3e4960';g.beginPath();g.moveTo(0,H*.92);g.lineTo(W,H*.92);for(let i=n;i>=0;i--)g.lineTo(P[i][0]+(i===n?W*.1:0),P[i][1]+3);g.lineTo(0,P[0][1]+3);g.closePath();g.fill();
  /* つなぎ目（金色の点線） */
  g.setLineDash([5,6]);g.strokeStyle='#e8c35a';g.lineWidth=2;g.beginPath();P.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.setLineDash([]);
  /* ビード：質で太さと色が変わる */
  for(let i=0;i<n;i++)if(q[i]>=0){const[a,b]=P[i],[c,d]=P[i+1],hot=Math.min(1,heat[i]*1.5);g.strokeStyle=heat[i]>.9?'#5a3a2a':`hsl(${30-20*hot},${30+60*Math.min(1,heat[i]*4)}%,${55+10*q[i]}%)`;g.lineWidth=4+8*q[i];g.lineCap='round';g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()}
  /* トーチ */
  g.save();g.translate(tx,ty);g.fillStyle='#202634';g.fillRect(-7,6,14,46);g.fillStyle='#9aa6bd';g.beginPath();g.moveTo(-6,6);g.lineTo(6,6);g.lineTo(2,-4);g.lineTo(-2,-4);g.closePath();g.fill();
  if(on){g.fillStyle='#bfe6ff';g.shadowColor='#7fd0ff';g.shadowBlur=24;g.beginPath();g.arc(0,-6,6+Math.random()*3,0,TAU);g.fill();g.shadowBlur=0}g.restore();
  sparks.forEach(s=>{g.fillStyle=`rgba(255,${200+50*s.l|0},120,${s.l})`;g.fillRect(s.x,s.y,2,2)});
  /* 速さメーター */
  const mw=W*.5,mx=W*.25,my=H-14;g.fillStyle='#ffffff20';g.fillRect(mx,my,mw,6);const sc=x=>mx+Math.min(1,x/(VMAX*1.6))*mw;g.fillStyle='#e8c35a55';g.fillRect(sc(VMIN),my,sc(VMAX)-sc(VMIN),6);
  if(on){g.fillStyle='#fff';g.fillRect(sc(v)-2,my-4,4,14)}}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;for(let i=0;i<n;i++)heat[i]=Math.max(0,heat[i]-dt*.5);if(on&&performance.now()-lt>60)v*=.8;
  if(on&&pid!=null){if(weldAt(tx,ty,dt)){for(let i=0;i<3;i++){const a=Math.random()*TAU;sparks.push({x:tx,y:ty-6,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5-1,l:1})}}}
  sparks.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.vy+=.15;s.l-=dt*2.5});sparks=sparks.filter(s=>s.l>0);
  const c=cover();$('fgInfo').textContent=`溶接 ${Math.round(c*100)}%　${!on?'':v<VMIN?'遅い':v>VMAX?'速い':'ちょうどいい'}`;draw();
  if(c>=1&&pid==null){finish();return}
  if(!done)raf=requestAnimationFrame(loop)}
 const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 cv.onpointerdown=e=>{if(done)return;e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}const[x,y]=pos(e);tx=x;ty=y-OFF;lx=tx;ly=ty;lt=performance.now();on=true;v=0};
 cv.onpointermove=e=>{if(e.pointerId!==pid||done)return;const[x,y]=pos(e),now=performance.now();tx=x;ty=y-OFF;const dt=Math.max(.001,(now-lt)/1000);const iv=Math.hypot(tx-lx,ty-ly)/dt;v=v*.8+iv*.2;lx=tx;ly=ty;lt=now};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId===pid){pid=null;on=false}};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();raf=requestAnimationFrame(loop)})}

/* ---------- 共通：図形の道すじ（キャンバスの点） ---------- */
function shapePath(shape,W,H,closed){const cx=W/2,cy=H/2,P=[];
 if(shape==='ch'){const w=W*.32,h=H*.3,s=W*.12;[[cx-w,cy+h],[cx-w,cy-h],[cx-w+s,cy-h-s*.6],[cx+w-s,cy-h-s*.6],[cx+w,cy-h],[cx+w,cy+h]].forEach(p=>P.push(p))}
 else if(shape==='de'){const n=5,w=W*.36;for(let i=0;i<=n*2;i++){const u=i/(n*2);P.push([cx-w+2*w*u,cy+(i%2?-1:1)*H*.12+H*.05])}}
 else if(shape==='me'){for(let i=0;i<=24;i++){const a=Math.PI*(1+i/24),r=W*.34;P.push([cx+Math.cos(a)*r,cy+H*.15+Math.sin(a)*r*.9])}}
 else{for(let i=0;i<=40;i++){const a=i/40*TAU*.9+Math.PI*.55,r=W*(.1+.25*i/40);P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}}
 /* 細かい点に分ける */
 const Q=[P[0]];for(let i=1;i<P.length;i++){const[a,b]=P[i-1],[c,d]=P[i],L=Math.hypot(c-a,d-b),k=Math.max(1,Math.round(L/6));for(let j=1;j<=k;j++)Q.push([a+(c-a)*j/k,b+(d-b)*j/k])}return Q}
function nearIdx(P,x,y,from,to){let bi=-1,bd=1e9;for(let i=from;i<=to;i++){const d=Math.hypot(P[i][0]-x,P[i][1]-y);if(d<bd){bd=d;bi=i}}return[bi,bd]}

/* ---------- 切る：金切りばさみ。タップでひと切り進む。左右にドラッグで向きを変える ---------- */
const CUT_STEP={1:16,2:14,3:12},CUT_TOL={1:13,2:10,3:8};
function runCut(o){return new Promise(res=>{
 const tier=o.tier||1,STEP=CUT_STEP[tier],TOL=CUT_TOL[tier]*assistMul(o);
 const {cv,g,W,H}=forgeOpen(o.title||'金切りばさみで切る','タップでひと切り進む。左右にドラッグして、はさみの向きを変える。角では止まって向きを合わせよう','t_snips');
 const P=shapePath(o.shape||'ch',W,H),n=P.length-1;
 let x=P[0][0],y=P[0][1],ang=Math.atan2(P[3][1]-P[0][1],P[3][0]-P[0][0]),prog=0,cuts=[[x,y]],qs=[],done=false,raf=0,last=0,snap=0,pid=null,sx=0,moved=0,t0=0;
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;$('fgDone').onclick=null;
  const reach=Math.min(1,prog/n),q=qs.length?qs.reduce((a,b)=>a+b,0)/qs.length:0;res({score:Math.round(q*100*Math.min(1,reach+.02)),reach:reach>=.97?1:reach})}
 function snip(){if(done)return;const nx=x+Math.cos(ang)*STEP,ny=y+Math.sin(ang)*STEP;const[i,d]=nearIdx(P,nx,ny,Math.max(0,prog-4),Math.min(n,prog+14));
  x=nx;y=ny;cuts.push([x,y]);const q=Math.max(0,1-(Math.max(0,d-2)/TOL)**2);qs.push(q);if(d<TOL*1.6&&i>prog)prog=i;snap=1;
  tone(q>.7?900:500,.04,'square',.05,q>.7?600:300);$('fgInfo').textContent=`切った ${Math.round(Math.min(1,prog/n)*100)}%　${q>.8?'ぴったり':q>.4?'少しずれた':'ずれた！'}`;
  if(prog>=n-1)setTimeout(finish,400)}
 function draw(){g.clearRect(0,0,W,H);
  g.fillStyle='#55627e';g.fillRect(W*.06,H*.08,W*.88,H*.84);g.strokeStyle='#7d8aa6';g.strokeRect(W*.06,H*.08,W*.88,H*.84);
  g.setLineDash([6,6]);g.strokeStyle='#e8c35a';g.lineWidth=2;g.beginPath();P.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.stroke();g.setLineDash([]);
  g.strokeStyle='#0d1322';g.lineWidth=3;g.beginPath();cuts.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.stroke();
  /* 次に切る向き */
  g.strokeStyle='#ffffff90';g.setLineDash([3,4]);g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(ang)*STEP*2.2,y+Math.sin(ang)*STEP*2.2);g.stroke();g.setLineDash([]);
  /* はさみ */
  g.save();g.translate(x,y);g.rotate(ang);const op=.35*(1-snap);g.fillStyle='#c9d2e4';
  [op,-op].forEach(a=>{g.save();g.rotate(a);g.beginPath();g.moveTo(0,0);g.lineTo(-30,a>0?-4:4);g.lineTo(-30,0);g.closePath();g.fill();g.restore()});
  g.fillStyle='#e05a3a';g.beginPath();g.ellipse(-40,-7,8,5,0,0,TAU);g.ellipse(-40,7,8,5,0,0,TAU);g.fill();g.restore()}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;snap=Math.max(0,snap-dt*6);draw();if(!done)raf=requestAnimationFrame(loop)}
 const px=e=>e.clientX-cv.getBoundingClientRect().left;
 cv.onpointerdown=e=>{e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}sx=px(e);moved=0;t0=performance.now()};
 window.__cut={P,st:()=>({x,y,ang,prog,n}),aim:a=>{ang=a},snip};
 cv.onpointermove=e=>{if(e.pointerId!==pid)return;const nx=px(e),dx=nx-sx;moved+=Math.abs(dx);ang+=dx*.012;sx=nx};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId!==pid)return;pid=null;if(moved<8&&performance.now()-t0<400)snip()};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();$('fgInfo').textContent='切った 0%';raf=requestAnimationFrame(loop)})}

/* ---------- けがき：定規で直線、コンパスで円。図面の線を鉄板に写す ---------- */
function scribeFig(shape,W,H,tier){const cx=W/2,cy=H/2,F=[];const L=(a,b,c,d)=>F.push({t:'l',a:[a,b],b:[c,d]}),C=(x,y,r)=>F.push({t:'c',c:[x,y],r});
 const w=W*.3,h=H*.24;
 if(shape==='de'){L(cx-w,cy+h,cx+w,cy+h);L(cx+w,cy+h,cx,cy-h);L(cx,cy-h,cx-w,cy+h);C(cx,cy+h*.3,W*.08)}
 else if(shape==='me'){C(cx,cy,W*.3);L(cx-W*.3,cy,cx+W*.3,cy);C(cx,cy,W*.1)}
 else{L(cx-w,cy-h,cx+w,cy-h);L(cx+w,cy-h,cx+w,cy+h);L(cx+w,cy+h,cx-w,cy+h);L(cx-w,cy+h,cx-w,cy-h);C(cx,cy,W*.09)}
 if(tier>=2)C(cx-w*.6,cy-h*.55,W*.05);if(tier>=3)L(cx-w*.6,cy+h*.6,cx+w*.6,cy+h*.6);return F}
function runScribe(o){return new Promise(res=>{
 const tier=o.tier||1,snapOn=!!(typeof G!=='undefined'&&G&&G.tools&&(G.tools.includes('caliper')||G.tools.includes('dcal'))),SN=o.lim&&o.lim.dcal?2:1;
 const {cv,g,W,H}=forgeOpen(o.title||'けがき','図面の線を鉄板に写す。定規：始めから終わりまでドラッグ。コンパス：円の中心を押して、外へドラッグ','t_caliper');
 const F=scribeFig(o.shape||'ch',W,H,tier),drawn=[],pts=[];F.forEach(f=>{if(f.t==='l'){pts.push(f.a,f.b)}else pts.push(f.c)});
 let tool='l',cur=null,pid=null,done=false;
 const bar=$('fgBar');bar.innerHTML=`<button data-tl="l" class="on">📏 定規</button><button data-tl="c">⭕ コンパス</button><button data-tl="u">↶ 1つ消す</button>`;bar.style.display='flex';
 bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{const t=b.dataset.tl;if(t==='u'){drawn.pop();draw();return}tool=t;bar.querySelectorAll('[data-tl]').forEach(x=>x.classList.toggle('on',x.dataset.tl===t))});
 const AM=assistMul(o),snapP=p=>{if(!snapOn)return p;let best=p,bd=12*AM*SN;pts.forEach(q=>{const d=Math.hypot(q[0]-p[0],q[1]-p[1]);if(d<bd){bd=d;best=q}});return best};
 function match(f){let best=0;drawn.forEach(d=>{if(d.t!==f.t)return;let q;
  if(f.t==='l'){const e1=Math.hypot(d.a[0]-f.a[0],d.a[1]-f.a[1])+Math.hypot(d.b[0]-f.b[0],d.b[1]-f.b[1]),e2=Math.hypot(d.a[0]-f.b[0],d.a[1]-f.b[1])+Math.hypot(d.b[0]-f.a[0],d.b[1]-f.a[1]);q=1-Math.min(e1,e2)/(40*AM)}
  else q=1-(Math.hypot(d.c[0]-f.c[0],d.c[1]-f.c[1])+Math.abs(d.r-f.r)*1.2)/(26*AM);best=Math.max(best,q)});return Math.max(0,best)}
 function result(){const qs=F.map(match),hit=qs.filter(q=>q>.3).length,extra=Math.max(0,drawn.length-F.length);return{score:Math.max(0,Math.round(qs.reduce((a,b)=>a+b,0)/F.length*100-extra*3)),reach:hit/F.length}}
 function finish(){if(done)return;done=true;cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;$('fgDone').onclick=null;bar.style.display='none';bar.innerHTML='';res(result())}
 function draw(){g.clearRect(0,0,W,H);g.fillStyle='#4a5670';g.fillRect(W*.05,H*.05,W*.9,H*.9);
  g.setLineDash([5,6]);g.strokeStyle='#e8c35a99';g.lineWidth=2;F.forEach(f=>{g.beginPath();f.t==='l'?(g.moveTo(...f.a),g.lineTo(...f.b)):g.arc(f.c[0],f.c[1],f.r,0,TAU);g.stroke()});g.setLineDash([]);
  g.fillStyle='#e8c35a';F.forEach(f=>{if(f.t==='c'){g.fillRect(f.c[0]-4,f.c[1]-.5,8,1);g.fillRect(f.c[0]-.5,f.c[1]-4,1,8)}});
  g.strokeStyle='#f2f6ff';g.lineWidth=1.6;[...drawn,...(cur?[cur]:[])].forEach(d=>{g.beginPath();d.t==='l'?(g.moveTo(...d.a),g.lineTo(...d.b)):g.arc(d.c[0],d.c[1],d.r,0,TAU);g.stroke()});
  if(cur){g.fillStyle='#fff';const p=cur.t==='l'?cur.b:[cur.c[0]+cur.r,cur.c[1]];g.beginPath();g.arc(p[0],p[1],4,0,TAU);g.fill()}
  const r=result();$('fgInfo').textContent=`写した線 ${Math.round(r.reach*F.length)} / ${F.length}${snapOn?'　（ノギス：点にすいつく）':''}`}
 const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 cv.onpointerdown=e=>{e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}const p=snapP(pos(e));cur=tool==='l'?{t:'l',a:p,b:p}:{t:'c',c:p,r:0};draw()};
 cv.onpointermove=e=>{if(e.pointerId!==pid||!cur)return;const p=pos(e);if(cur.t==='l')cur.b=snapP(p);else cur.r=Math.hypot(p[0]-cur.c[0],p[1]-cur.c[1]);draw()};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId!==pid)return;pid=null;if(cur&&(cur.t==='l'?Math.hypot(cur.b[0]-cur.a[0],cur.b[1]-cur.a[1])>12:cur.r>8)){drawn.push(cur);tone(760,.05,'triangle',.05,900)}cur=null;draw()};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();draw()})}

/* ---------- 配線：同じ色の端子を線でつなぐ（線は交差できない）。最後にはんだ付け ---------- */
const WIRE_N={1:5,2:6,3:7},WIRE_K={1:3,2:4,3:5};
const WIRE_COL=['#ff5a5a','#4da3ff','#ffd43b','#51cf66','#cc5de8'];
function wirePuzzle(N,K){for(let tries=0;tries<300;tries++){const used=new Array(N*N).fill(-1),pairs=[],sol=[];let ok=true;
  for(let k=0;k<K&&ok;k++){let st=-1;for(let t=0;t<50;t++){const c=Math.random()*N*N|0;if(used[c]<0){st=c;break}}if(st<0){ok=false;break}
   const path=[st];used[st]=k;const want=3+(Math.random()*(N))|0;
   while(path.length<want){const c=path[path.length-1],x=c%N,y=c/N|0,nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&used[b*N+a]<0);if(!nb.length)break;const[a,b]=nb[Math.random()*nb.length|0];used[b*N+a]=k;path.push(b*N+a)}
   if(path.length<3){ok=false;break}pairs.push([path[0],path[path.length-1]]);sol.push(path)}
  if(ok){window.__wire={sol,N};return pairs}}return null}
function runWire(o){return new Promise(res=>{
 const tier=o.tier||1,N=WIRE_N[tier],K=WIRE_K[tier],pairs=wirePuzzle(N,K);
 const {cv,g,W,H}=forgeOpen(o.title||'配線','同じ色の端子を指でつなぐ。線は交差できない。全部つないだら、はんだ付け','t_pliers');
 const S=Math.min(W,H)/(N+.4),ox=(W-S*N)/2,oy=(H-S*N)/2,term=new Map();pairs.forEach(([a,b],k)=>{term.set(a,k);term.set(b,k)});
 const paths=pairs.map(()=>[]);let drag=-1,pid=null,phase='wire',done=false,raf=0,last=0,sold=[],gauge=0,gdir=1,sk=0;
 const cellAt=e=>{const r=cv.getBoundingClientRect(),x=Math.floor((e.clientX-r.left-ox)/S),y=Math.floor((e.clientY-r.top-oy)/S);return x>=0&&y>=0&&x<N&&y<N?y*N+x:-1};
 const owner=c=>paths.findIndex(p=>p.includes(c));
 const joined=k=>{const p=paths[k];return p.length>1&&term.get(p[0])===k&&term.get(p[p.length-1])===k&&p[0]!==p[p.length-1]&&pairs[k].includes(p[0])&&pairs[k].includes(p[p.length-1])};
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;$('fgDone').onclick=null;
  const con=paths.filter((_,k)=>joined(k)).length/K,sq=sold.length?sold.reduce((a,b)=>a+b,0)/K:0;res({score:Math.round(con*50+sq*50),reach:con>=1&&sold.length>=K?1:con*.9})}
 function draw(){g.clearRect(0,0,W,H);g.fillStyle='#16203a';g.fillRect(ox,oy,S*N,S*N);g.strokeStyle='#ffffff14';g.lineWidth=1;
  for(let i=0;i<=N;i++){g.beginPath();g.moveTo(ox+i*S,oy);g.lineTo(ox+i*S,oy+N*S);g.stroke();g.beginPath();g.moveTo(ox,oy+i*S);g.lineTo(ox+N*S,oy+i*S);g.stroke()}
  const cc=c=>[ox+(c%N+.5)*S,oy+((c/N|0)+.5)*S];
  paths.forEach((p,k)=>{if(p.length<2)return;g.strokeStyle=WIRE_COL[k];g.lineWidth=S*.28;g.lineCap='round';g.lineJoin='round';g.beginPath();p.forEach((c,i)=>{const[x,y]=cc(c);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke()});
  term.forEach((k,c)=>{const[x,y]=cc(c);g.fillStyle=WIRE_COL[k];g.beginPath();g.arc(x,y,S*.32,0,TAU);g.fill();g.fillStyle='#0d1322';g.beginPath();g.arc(x,y,S*.12,0,TAU);g.fill();
   if(phase==='solder'&&sold.length>k||phase==='done'){g.fillStyle='#d8dde6';g.beginPath();g.arc(x,y,S*.14,0,TAU);g.fill()}});
  if(phase==='solder'){const k=sk,[x,y]=cc(pairs[k][0]);g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.arc(x,y,S*.45,0,TAU);g.stroke();
   const bw=W*.7,bx=(W-bw)/2,by=H-22;g.fillStyle='#ffffff20';g.fillRect(bx,by,bw,10);g.fillStyle='#51cf6688';{const zw=.14*assistMul(o);g.fillRect(bx+bw*(.69-zw/2),by,bw*zw,10)}g.fillStyle='#fff';g.fillRect(bx+bw*gauge-2,by-5,4,20)}
  $('fgInfo').textContent=phase==='wire'?`つないだ ${paths.filter((_,k)=>joined(k)).length} / ${K}`:phase==='solder'?`はんだ付け ${sold.length} / ${K}　緑のところでタップ`:'できた！'}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;if(phase==='solder'){gauge+=gdir*dt*(.8+.15*tier);if(gauge>1){gauge=1;gdir=-1}if(gauge<0){gauge=0;gdir=1}}draw();if(!done)raf=requestAnimationFrame(loop)}
 function toSolder(){if(paths.every((_,k)=>joined(k))){phase='solder';sk=0;gauge=0;tone(880,.15,'triangle',.08,1320)}}
 cv.onpointerdown=e=>{e.preventDefault();if(phase==='solder'){const q=Math.max(0,1-Math.abs(gauge-.69)/(.2*assistMul(o)));sold.push(q);tone(q>.7?1200:500,.08,'square',.05,q>.7?900:300);sk++;if(sk>=K){phase='done';setTimeout(finish,500)}return}
  if(phase!=='wire')return;const c=cellAt(e);if(c<0)return;pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}
  if(term.has(c)){drag=term.get(c);paths[drag]=[c]}else{const k=owner(c);if(k<0)return;drag=k;paths[k]=paths[k].slice(0,paths[k].indexOf(c)+1)}draw()};
 cv.onpointermove=e=>{if(e.pointerId!==pid||drag<0)return;const c=cellAt(e);if(c<0)return;const p=paths[drag],lastC=p[p.length-1];if(c===lastC)return;
  const back=p.indexOf(c);if(back>=0){paths[drag]=p.slice(0,back+1);return}
  if(joined(drag))return;const ax=lastC%N,ay=lastC/N|0,bx=c%N,by=c/N|0;if(Math.abs(ax-bx)+Math.abs(ay-by)!==1)return;
  if(term.has(c)&&term.get(c)!==drag)return;const k2=owner(c);if(k2>=0&&k2!==drag)paths[k2]=paths[k2].slice(0,paths[k2].indexOf(c));
  p.push(c);if(joined(drag))tone(1000,.06,'triangle',.06,1300)};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId!==pid)return;pid=null;drag=-1;toSolder()};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();raf=requestAnimationFrame(loop)})}
const MINI={hit:{f:runHit,t:'金床で打つ',n:'打ち'},weld:{f:runWeld,t:'溶接機でつなぐ',n:'溶接'},cut:{f:runCut,t:'金切りばさみで切る',n:'切り'},wire:{f:runWire,t:'配線',n:'配線'},trace:{f:runScribe,t:'けがき',n:'けがき'}};

/* ---------- やすり：左右にこすってバリを取る。往復の長さ・まっすぐさ・速さがそろうほどきれいに削れる ---------- */
const FILE_SEG={1:24,2:30,3:36};
function runFile(o){return new Promise(res=>{
 const tier=o.tier||1,M=FILE_SEG[tier],AM=assistMul(o);
 const {cv,g,W,H}=forgeOpen(o.title||'やすりがけ','左右に大きくこすってバリを取る。まっすぐ・同じ速さで。削りすぎると線より下がる','t_file');
 const x0=W*.1,x1=W*.9,top=H*.42,unit=H*.06;
 const b=Array.from({length:M},(_,i)=>.85+Math.random()*.3+(i%6===0?.25:0));     /* バリの高さ（1＝unit） */
 let pid=null,pts=[],done=false,raf=0,last=0,strokes=0,msg='',msgT=0,fx=-1,fy=-1,parts=[];
 const segAt=x=>Math.floor((x-x0)/(x1-x0)*M);
 const segQ=v=>v>=0?Math.max(0,1-v/(.55*AM)):Math.max(0,1-(-v)/(.35*AM));
 const score=()=>Math.round(b.reduce((s,v)=>s+segQ(v),0)/M*100);
 function stroke(){if(pts.length<4)return;const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),L=Math.max(...xs)-Math.min(...xs);
  const t=(pts[pts.length-1][2]-pts[0][2])/1000||.01,v=L/t,ym=ys.reduce((a,c)=>a+c,0)/ys.length,dev=Math.max(...ys.map(y=>Math.abs(y-ym)));
  const lq=Math.min(1,L/((x1-x0)*.45)),sq=Math.max(.2,1-dev/(28*AM)),vq=v<180?Math.max(.3,v/180):v>1000?Math.max(.3,1-(v-1000)/1000):1,q=lq*sq*vq;
  const a=Math.max(0,segAt(Math.min(...xs))),z=Math.min(M-1,segAt(Math.max(...xs)));for(let i=a;i<=z;i++)b[i]-=(.05+.13*q)*(tier===1?1.15:1);
  strokes++;msg=q>.8?'いいストローク！':lq<.6?'もっと大きく':sq<.6?'まっすぐに':vq<.7?(v<180?'もう少し速く':'速すぎ'):'もう少し';msgT=1;tone(220+q*200,.05,'sawtooth',.04,160);
  $('fgInfo').textContent=`仕上がり ${score()}点　ストローク ${strokes}`}
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;$('fgDone').onclick=null;res({score:score(),reach:1})}
 function draw(){g.clearRect(0,0,W,H);
  /* 万力のあご */
  g.fillStyle='#3a4466';g.fillRect(x0-W*.08,top+unit*.2,W*.06,H*.4);g.fillRect(x1+W*.02,top+unit*.2,W*.06,H*.4);
  /* 材料（刃物の背） */
  g.fillStyle='#8f9bb8';g.beginPath();g.moveTo(x0,top+H*.42);g.lineTo(x0,top);
  for(let i=0;i<M;i++){const x=x0+(x1-x0)*(i+.5)/M,h=Math.max(-1,b[i]);g.lineTo(x,top-h*unit+(i%2?-2:2)*Math.max(0,h))}g.lineTo(x1,top);g.lineTo(x1,top+H*.42);g.closePath();g.fill();
  g.fillStyle='#b8c3dc';g.fillRect(x0,top+2,x1-x0,H*.05);
  /* 目標の線（ここまで削る） */
  g.setLineDash([6,5]);g.strokeStyle='#e8c35a';g.lineWidth=2;g.beginPath();g.moveTo(x0,top);g.lineTo(x1,top);g.stroke();g.setLineDash([]);
  for(let i=0;i<M;i++){const q=segQ(b[i]),x=x0+(x1-x0)*i/M;g.fillStyle=q>.85?'#4fd07a':q>.4?'#e8c35a':b[i]<0?'#ff5a5a':'#ffffff30';g.fillRect(x,top+H*.44,(x1-x0)/M-1,4)}
  /* やすり */
  if(fx>=0){g.save();g.translate(fx,Math.min(fy,top-unit*.2));g.fillStyle='#9aa6c4';g.fillRect(-W*.18,-10,W*.36,12);g.strokeStyle='#ffffff40';for(let k=-W*.18;k<W*.18;k+=5){g.beginPath();g.moveTo(k,-10);g.lineTo(k+4,2);g.stroke()}g.fillStyle='#8a5a32';g.fillRect(W*.18,-9,W*.12,10);g.restore()}
  parts.forEach(p=>{g.fillStyle=`rgba(210,220,240,${p.l})`;g.fillRect(p.x,p.y,2,2)});
  if(msgT>0){g.globalAlpha=Math.min(1,msgT*2);g.fillStyle='#ffe066';g.font='800 20px sans-serif';g.textAlign='center';g.fillText(msg,W/2,H*.16);g.globalAlpha=1}
  g.fillStyle='#9aa6c4';g.font='600 12px sans-serif';g.textAlign='center';g.fillText('← 左右に大きくこする →',W/2,H*.95)}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;msgT=Math.max(0,msgT-dt);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.3;p.l-=dt*2});parts=parts.filter(p=>p.l>0);draw();if(!done)raf=requestAnimationFrame(loop)}
 const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top,performance.now()]};
 let dir=0;
 cv.onpointerdown=e=>{e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}const p=pos(e);pts=[p];fx=p[0];fy=p[1];dir=0};
 cv.onpointermove=e=>{if(e.pointerId!==pid)return;const p=pos(e),lp=pts[pts.length-1],d=Math.sign(p[0]-lp[0]);fx=p[0];fy=p[1];
  if(d&&dir&&d!==dir){stroke();pts=[lp]}if(d)dir=d;pts.push(p);if(Math.random()<.4)parts.push({x:p[0],y:top-4,vx:Math.random()*2-1,vy:Math.random()*2,l:1})};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId!==pid)return;pid=null;stroke();pts=[];fx=-1};
 window.__file={b,stroke:(L,dev,v)=>{const t=0;pts=[];const n=12;for(let i=0;i<=n;i++)pts.push([x0+(x1-x0)*.05+L*i/n,top-20+(i%2?dev:0),i*(L/v)*1000/n]);stroke();pts=[]},score};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();$('fgInfo').textContent=`仕上がり ${score()}点`;raf=requestAnimationFrame(loop)})}

/* ---------- 穴あけ：長押しで刃を下ろす。押す力を緑の帯に保つ。強すぎると刃が折れる ---------- */
const DRILL_N={1:2,2:3,3:4};
function runDrill(o){return new Promise(res=>{
 const tier=o.tier||1,N=DRILL_N[tier],AM=assistMul(o),Z0=.45,Z1=Math.min(.95,.8+.04*(AM-1)*10);
 const {cv,g,W,H}=forgeOpen(o.title||'ボール盤で穴あけ','長押しで刃を下ろす。押す力のメーターを緑の帯に保とう。赤まで押すと刃が折れる','t_drill');
 const holes=Array.from({length:N},(_,i)=>({x:W*(.2+.6*(N>1?i/(N-1):.5)),d:0,q:[],broke:false}));
 let k=0,hold=false,p=0,over=0,done=false,raf=0,last=0,parts=[],spin=0,msg='',msgT=0;
 const score=()=>Math.round(holes.reduce((s,h)=>s+(h.broke?.25:h.q.length?h.q.reduce((a,b)=>a+b,0)/h.q.length:0),0)/N*100);
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointerup=null;$('fgDone').onclick=null;res({score:score(),reach:k>=N?1:k/N})}
 function next(){k++;p=0;over=0;hold=false;if(k>=N)setTimeout(finish,600);$('fgInfo').textContent=`穴 ${Math.min(k+1,N)} / ${N}`}
 function draw(){g.clearRect(0,0,W,H);const py=H*.62,ph=H*.12,h=holes[Math.min(k,N-1)];
  /* 材料の板 */
  g.fillStyle='#6e7a98';g.fillRect(W*.06,py,W*.88,ph);g.fillStyle='#8f9bb8';g.fillRect(W*.06,py,W*.88,5);
  holes.forEach((o,i)=>{const dd=o.d*ph;g.fillStyle=o.broke?'#ff5a5a':'#141a2c';g.fillRect(o.x-9,py,18,dd);if(i===k&&!done){g.strokeStyle='#e8c35a';g.beginPath();g.arc(o.x,py-4,4,0,TAU);g.stroke()}
   if(o.q.length||o.broke){const q=o.broke?0:o.q.reduce((a,b)=>a+b,0)/o.q.length;g.fillStyle=q>.85?'#4fd07a':q>.5?'#e8c35a':'#ff5a5a';g.fillRect(o.x-12,py+ph+6,24,4)}});
  /* ドリル */
  if(k<N){const dy=py-H*.22+h.d*ph;g.fillStyle='#3a4466';g.fillRect(h.x-W*.12,H*.04,W*.24,dy-H*.12);g.fillStyle='#55618a';g.fillRect(h.x-14,dy-H*.12,28,H*.06);
   g.save();g.translate(h.x,dy-H*.06);g.fillStyle='#c9d2e4';g.beginPath();g.moveTo(-6,0);g.lineTo(6,0);g.lineTo(6,H*.18);g.lineTo(0,H*.21);g.lineTo(-6,H*.18);g.closePath();g.fill();
   g.strokeStyle='#7d8aa6';g.lineWidth=2;for(let y=4;y<H*.18;y+=9){const o=((y+spin)%9)-4;g.beginPath();g.moveTo(-6,y+o);g.lineTo(6,y+o+5);g.stroke()}g.restore()}
  /* 力のメーター */
  const mx=W*.88,mt=H*.08,mh=H*.42;g.fillStyle='#ffffff15';g.fillRect(mx,mt,16,mh);g.fillStyle='#ff5a5a55';g.fillRect(mx,mt,16,mh*(1-.92));g.fillStyle='#4fd07a66';g.fillRect(mx,mt+mh*(1-Z1),16,mh*(Z1-Z0));
  g.fillStyle='#fff';g.fillRect(mx-4,mt+mh*(1-p)-2,24,4);g.fillStyle='#9aa6c4';g.font='600 11px sans-serif';g.textAlign='center';g.fillText('力',mx+8,mt+mh+14);
  parts.forEach(q=>{g.fillStyle=`rgba(230,200,120,${q.l})`;g.fillRect(q.x,q.y,3,2)});
  if(msgT>0){g.globalAlpha=Math.min(1,msgT*2);g.fillStyle='#ffe066';g.font='800 20px sans-serif';g.textAlign='center';g.fillText(msg,W*.45,H*.14);g.globalAlpha=1}
  g.fillStyle='#9aa6c4';g.font='600 12px sans-serif';g.textAlign='center';g.fillText(hold?'押している：刃が下がる':'画面を長押しする',W*.45,H*.95)}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;msgT=Math.max(0,msgT-dt);
  if(k<N&&!done){const h=holes[k];p=hold?Math.min(1,p+dt*(.55+.1*tier)):Math.max(0,p-dt*.9);spin+=p*40*dt*10;
   if(p>.05){h.d+=p*dt*.55/(1+.2*(tier-1));h.q.push(p>=Z0&&p<=Z1?1:p<Z0?Math.max(.3,p/Z0):Math.max(0,1-(p-Z1)/.12));if(Math.random()<p)parts.push({x:h.x+(Math.random()*30-15),y:H*.62,vx:Math.random()*3-1.5,vy:-Math.random()*3,l:1});if(Math.random()<.08)tone(120+p*200,.03,'sawtooth',.02,100)}
   over=p>.92?over+dt:Math.max(0,over-dt);
   if(over>.35){h.broke=true;msg='刃が折れた！ 押しすぎ';msgT=1.4;tone(80,.3,'square',.08,40);next()}
   else if(h.d>=1){h.d=1;const q=h.q.reduce((a,b)=>a+b,0)/h.q.length;msg=q>.85?'きれいな穴！':q>.5?'まあまあ':'ガタガタ…';msgT=1;tone(880,.1,'triangle',.06,1200);next()}}
  parts.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.25;q.l-=dt*2});parts=parts.filter(q=>q.l>0);draw();if(!done)raf=requestAnimationFrame(loop)}
 cv.onpointerdown=e=>{e.preventDefault();hold=true};cv.onpointerup=cv.onpointercancel=()=>{hold=false};
 window.__drill={set:v=>{hold=v},st:()=>({k,p,d:holes[Math.min(k,N-1)].d})};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();$('fgInfo').textContent=`穴 1 / ${N}`;raf=requestAnimationFrame(loop)})}

/* ---------- ねじ切り：タップハンドルを回す。半回転すすめて、1/4もどす（切りくずを切る）。もどさず回すと折れる ---------- */
const TAP_TURNS={1:4,2:6,3:8};   /* 必要な正味の回転（半回転＝1） */
function runTap(o){return new Promise(res=>{
 const tier=o.tier||1,NEED=TAP_TURNS[tier]*Math.PI,AM=assistMul(o);
 const {cv,g,W,H}=forgeOpen(o.title||'タップでねじ切り','ハンドルを回す。右回りで半回転すすめたら、左回りで1/4もどす。もどさずに回し続けると、タップが折れる','t_tap');
 const cx=W/2,cy=H*.5,RR=Math.min(W,H)*.36;
 let ang=0,net=0,fwd=0,back=0,cyc=[],pid=null,la=0,done=false,raf=0,msg='',msgT=0,last=0,broke=0;
 const LIM=Math.PI*1.65*AM;   /* もどさずに回せる限度（約300°） */
 const score=()=>{const q=cyc.length?cyc.reduce((a,b)=>a+b,0)/cyc.length:0;return Math.max(0,Math.round(q*100-broke*20))};
 function closeCycle(fin){if(fwd<.2)return;const deg=fwd*180/Math.PI;if(fin&&deg<140){fwd=0;return}const q=deg>=140&&deg<=250?1:deg<140?Math.max(.55,deg/140):Math.max(.3,1-(deg-250)/80);cyc.push(q);
  msg=q>.9?'いいリズム！':deg<140?'もう少しすすめてから':'もっと早くもどそう';msgT=1;fwd=0}
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;$('fgDone').onclick=null;res({score:score(),reach:Math.min(1,net/NEED)})}
 function turn(d){if(done||net>=NEED)return;ang+=d;if(d>0){if(back>Math.PI*.3){closeCycle()}back=0;fwd+=d;net+=d;
   if(fwd>LIM){broke++;msg='タップが折れた！ 1/4もどそう';msgT=1.5;tone(80,.3,'square',.08,40);net=Math.max(0,net-Math.PI);fwd=0;cyc.push(0)}}
  else{back+=-d;net=Math.max(0,net+d*.3)}
  if(net>=NEED){closeCycle(true);setTimeout(finish,500);net=NEED}}
 function draw(){g.clearRect(0,0,W,H);
  /* 穴（上から見たところ） */
  g.fillStyle='#4a5670';g.fillRect(W*.08,H*.1,W*.84,H*.8);g.fillStyle='#141a2c';g.beginPath();g.arc(cx,cy,RR*.16,0,TAU);g.fill();
  /* ハンドル */
  g.save();g.translate(cx,cy);g.rotate(ang);g.fillStyle='#8a5a32';g.fillRect(-RR,-9,RR*2,18);g.fillStyle='#e05a3a';g.fillRect(-RR,-11,RR*.3,22);g.fillRect(RR*.7,-11,RR*.3,22);g.fillStyle='#c9d2e4';g.fillRect(-14,-14,28,28);g.restore();
  /* ゲージ：切りくずのたまり具合・深さ */
  const lv=Math.min(1,fwd/LIM),gw=W*.6,gx=(W-gw)/2;g.fillStyle='#ffffff18';g.fillRect(gx,H*.04,gw,8);g.fillStyle=lv<.6?'#4fd07a':lv<.85?'#e8c35a':'#ff5a5a';g.fillRect(gx,H*.04,gw*lv,8);
  g.fillStyle='#9aa6c4';g.font='600 11px sans-serif';g.textAlign='center';g.fillText('切りくずのたまり（赤で折れる）',W/2,H*.04+22);
  g.fillStyle='#ffffff18';g.fillRect(gx,H*.93,gw,8);g.fillStyle='#5aa8ff';g.fillRect(gx,H*.93,gw*Math.min(1,net/NEED),8);g.fillText('ねじの深さ',W/2,H*.93-6);
  if(msgT>0){g.globalAlpha=Math.min(1,msgT*2);g.fillStyle='#ffe066';g.font='800 20px sans-serif';g.fillText(msg,W/2,H*.2);g.globalAlpha=1}}
 function loop(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;msgT=Math.max(0,msgT-dt);$('fgInfo').textContent=`深さ ${Math.round(Math.min(1,net/NEED)*100)}%　リズム ${score()}点`;draw();if(!done)raf=requestAnimationFrame(loop)}
 const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 cv.onpointerdown=e=>{e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}const[x,y]=pos(e);la=Math.atan2(y-cy,x-cx)};
 cv.onpointermove=e=>{if(e.pointerId!==pid)return;const[x,y]=pos(e),a=Math.atan2(y-cy,x-cx);let d=a-la;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;la=a;if(Math.hypot(x-cx,y-cy)<RR*.15)d*=.3;turn(d)};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId===pid)pid=null};
 window.__tap={turn,st:()=>({net,fwd,NEED,cyc,broke})};
 $('fgDone').style.display='';$('fgDone').onclick=()=>finish();raf=requestAnimationFrame(loop)})}
Object.assign(MINI,{file:{f:runFile,t:'やすりがけ',n:'やすり'},drill:{f:runDrill,t:'ボール盤で穴あけ',n:'穴あけ'},tap:{f:runTap,t:'タップでねじ切り',n:'ねじ切り'}});
