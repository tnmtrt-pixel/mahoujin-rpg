/* =====================================================================
   グラインダー加工（武器づくり）
   鉄の塊を指でこすって削り、図面の形（点線）に近づける。
   形の合い具合（重なり）で点数が決まり、削った形がそのまま武器の絵になる。
   ===================================================================== */
/* 図面の形（0〜1 の座標の多角形）。キャラごとの武器 */
const GRIND_SHAPE={
 wolf:[[.06,.58],[.26,.52],[.50,.40],[.72,.30],[.92,.20],[.84,.38],[.66,.54],[.44,.66],[.22,.70],[.06,.68]],
 fox:[[0.71,0.5],[0.644,0.599],[0.648,0.747],[0.559,0.739],[0.5,0.85],[0.441,0.739],[0.352,0.747],[0.356,0.599],[0.29,0.5],[0.356,0.401],[0.352,0.253],[0.441,0.261],[0.5,0.15],[0.559,0.261],[0.648,0.253],[0.644,0.401]],
 dodo:[[.08,.42],[.36,.40],[.44,.22],[.84,.20],[.94,.34],[.94,.68],[.84,.78],[.46,.78],[.36,.62],[.08,.60]],
 owl:[[0.06, 0.45], [0.64, 0.45], [0.64, 0.408], [0.664, 0.335], [0.7, 0.277], [0.744, 0.241], [0.793, 0.23], [0.842, 0.245], [0.886, 0.283], [0.92, 0.343], [0.942, 0.418], [0.95, 0.5], [0.942, 0.582], [0.92, 0.657], [0.886, 0.717], [0.842, 0.755], [0.793, 0.77], [0.744, 0.759], [0.7, 0.723], [0.664, 0.665], [0.64, 0.592], [0.64, 0.55], [0.06, 0.55]],
 gorilla:[[.06,.46],[.62,.46],[.62,.30],[.94,.50],[.62,.70],[.62,.54],[.06,.54]],
 mouse:[[0.71,0.5],[0.703,0.591],[0.682,0.675],[0.648,0.747],[0.605,0.803],[0.554,0.838],[0.5,0.85],[0.446,0.838],[0.395,0.803],[0.352,0.747],[0.318,0.675],[0.297,0.591],[0.29,0.5],[0.297,0.409],[0.318,0.325],[0.352,0.253],[0.395,0.197],[0.446,0.162],[0.5,0.15],[0.554,0.162],[0.605,0.197],[0.648,0.253],[0.682,0.325],[0.703,0.409]],
 robot:[[.06,.34],[.66,.34],[.66,.24],[.94,.24],[.94,.76],[.66,.76],[.66,.66],[.06,.66]],
 tsukiyo:[[0.398,0.19],[0.462,0.171],[0.528,0.177],[0.589,0.206],[0.643,0.258],[0.685,0.328],[0.711,0.411],[0.72,0.5],[0.711,0.589],[0.685,0.672],[0.643,0.742],[0.589,0.794],[0.528,0.823],[0.462,0.829],[0.398,0.81],[0.324,0.756],[0.376,0.759],[0.427,0.746],[0.474,0.718],[0.514,0.677],[0.544,0.624],[0.564,0.564],[0.57,0.5],[0.564,0.436],[0.544,0.376],[0.514,0.323],[0.474,0.282],[0.427,0.254],[0.376,0.241],[0.324,0.244]],
 onmyo:[[.16,.74],[.30,.22],[.50,.17],[.70,.22],[.84,.74],[.50,.82]],
 rocker:[[.06,.30],[.36,.24],[.44,.42],[.94,.44],[.94,.56],[.44,.58],[.36,.78],[.06,.72],[.14,.50]]};
const GW=120,GH=72;                    /* 削りの細かさ（マス目） */
const GRIND_TIME={1:30,2:30,3:34};     /* 制限時間（秒）：段階ごと */
const GRIND_WHEEL={1:15,2:13,3:11};    /* 固定した砥石の半径（マス）。段階が上がるほど小さく、細かい作業 */
/* 属性：できあがりにランダムで1つ。v＝強さ（ランクで少し上がる） */
const ATTRS={
 fire:{n:'炎',col:'#ff7a2f',d:v=>`この武器の攻撃+${Math.round(v*100)}%`},
 thunder:{n:'雷',col:'#ffe066',d:v=>`経験値+${Math.round(v*100)}%`},
 steel:{n:'鋼',col:'#b8c4d8',d:v=>`受けるダメージ−${Math.round(v*100)}%`},
 wind:{n:'風',col:'#7fe0c0',d:v=>`移動の速さ+${Math.round(v*100)}%`}};
const ATTR_BASE={fire:.12,thunder:.08,steel:.06,wind:.06};
const ATTR_RANK={D:.6,C:.8,B:1,A:1.2,S:1.4,SS:1.7};
const REFORGE_COST=3;                  /* 鍛え直し（属性の付け直し）に使う鉄くず */
function rollAttr(rank){const k=pick(Object.keys(ATTRS));return{k,v:+(ATTR_BASE[k]*ATTR_RANK[rank]).toFixed(3)}}
const attrTxt=a=>a&&ATTRS[a.k]?`${UIMG('at_'+a.k,20)}<span class="attr" style="color:${ATTRS[a.k].col}">${ATTRS[a.k].n}</span> ${ATTRS[a.k].d(a.v)}`:'';

function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}
function targetMask(who){const P=GRIND_SHAPE[who]||GRIND_SHAPE.wolf,m=new Uint8Array(GW*GH);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)m[y*GW+x]=inPoly((x+.5)/GW,(y+.5)/GH,P)?1:0;return m}
/* 形の保存：60×36 に縮めて 0/1 を16進の文字に */
const GSW=60,GSH=36;
function packShape(mat){let bits='';for(let y=0;y<GSH;y++)for(let x=0;x<GSW;x++){let n=0;for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++)n+=mat[(y*2+yy)*GW+x*2+xx];bits+=n>=2?'1':'0'}let h='';for(let i=0;i<bits.length;i+=4)h+=parseInt(bits.slice(i,i+4),2).toString(16);return h}
function unpackShape(h){const b=[];for(const ch of h||'')b.push(...parseInt(ch,16).toString(2).padStart(4,'0').split('').map(Number));return b}
const SHAPE_SPR={};
/* 形から絵をつくる（工房・編成の表示と、ウルフの弾に使う） */
function shapeCanvas(h,w=120,col='#c9d2e2'){const key=h+w+col;if(SHAPE_SPR[key])return SHAPE_SPR[key];const b=unpackShape(h),big=b.length>=GSW*GSH,CW=big?GSW:30,CH=big?GSH:18,c=document.createElement('canvas'),s=w/CW;c.width=w;c.height=Math.round(CH*s);const g=c.getContext('2d');
 const on=(x,y)=>x>=0&&y>=0&&x<CW&&y<CH&&b[y*CW+x];
 for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)if(on(x,y)){const edge=!on(x,y-1)||!on(x-1,y);g.fillStyle=edge?'#ffffff':col;g.fillRect(x*s,y*s,s+.5,s+.5)}
 g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,0,0,c.height);gr.addColorStop(0,'#ffffff55');gr.addColorStop(.5,'#00000000');gr.addColorStop(1,'#00000055');g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);return SHAPE_SPR[key]=c}
const shapeImg=(h,w)=>h?`<img class="wshape" src="${shapeCanvas(h,w||120).toDataURL()}" alt="">`:'';

/* ---------- ミニゲーム本体 ---------- */
/* グラインダー加工：砥石は画面の下に固定。鉄を指で動かして砥石に押し当てて削る。⟲⟳で鉄の向きを変える */
function runGrind(o){return new Promise(res=>{
 const sec=$('grind'),cv=$('gcv'),g=cv.getContext('2d'),tier=o.tier||1,R=GRIND_WHEEL[tier],T=GRIND_TIME[tier];
 const tgt=targetMask(o.who),mat=new Uint8Array(GW*GH);
 const bx0=Math.round(GW*.04),bx1=Math.round(GW*.96),by0=Math.round(GH*.14),by1=Math.round(GH*.86);
 for(let y=by0;y<by1;y++)for(let x=bx0;x<bx1;x++)mat[y*GW+x]=1;
 let tgtN=0;for(const v of tgt)tgtN+=v;
 $('gTitle').innerHTML=UIMG('m_steel',26)+' '+(o.title||'グラインダー加工');$('gSub').textContent='鉄を指で動かし、下の砥石に押し当てて削る。⟲⟳で向きを変えて、点線の形に合わせよう';
 show('grind');
 /* 作業台（ステージ）の大きさと砥石の位置（どちらも鉄のマス単位） */
 const SW=GW*1.45,SH=GH*2.35,WX=SW/2,WY=SH-2;
 const K=6,metal=document.createElement('canvas');metal.width=GW*K;metal.height=GH*K;
 {const m=metal.getContext('2d');for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(mat[y*GW+x]){const n=Math.abs(Math.sin(x*12.9+y*78.2)*43758.5)%1;m.fillStyle=`hsl(215,${8+n*6}%,${40+n*10}%)`;m.fillRect(x*K,y*K,K,K)}}
 let S=1,DPR=Math.min(2,devicePixelRatio||1),left=T,done=false,last=0,pid=null,lx=0,ly=0,sparks=[],grinding=0,spin=0;
 let cx=SW/2,cy=WY-R-GH/2-4,ang=0,angT=0;
 function fit(){const w=Math.min(innerWidth-24,520,(innerHeight-260)*SW/SH);S=w/SW;cv.style.width=w+'px';cv.style.height=SH*S+'px';cv.width=Math.round(w*DPR);cv.height=Math.round(SH*S*DPR)}
 fit();
 function score(){let inter=0,uni=0;for(let i=0;i<mat.length;i++){const a=mat[i],b=tgt[i];if(a&&b)inter++;if(a||b)uni++}const iou=inter/uni;return{iou,q:Math.round(clamp((iou-.45)/.53,0,1)*100),broke:tgtN-inter}}
 /* 作業台の点 → 鉄のマス */
 function toPiece(sx,sy){const dx=sx-cx,dy=sy-cy,c=Math.cos(ang),s=Math.sin(ang);return[dx*c+dy*s+GW/2,-dx*s+dy*c+GH/2]}
 const reach=Math.hypot(GW,GH)/2;
 function grindNow(){if(Math.abs(ang-angT)>.001)return;if(Math.hypot(cx-WX,cy-WY)>R+reach)return;
  let n=0;const m=metal.getContext('2d');
  for(let sy=WY-R;sy<=WY+R;sy+=.5)for(let sx=WX-R;sx<=WX+R;sx+=.5){if((sx-WX)**2+(sy-WY)**2>R*R)continue;
   const[px,py]=toPiece(sx,sy),x=Math.floor(px),y=Math.floor(py);if(x<0||y<0||x>=GW||y>=GH)continue;const i=y*GW+x;
   if(mat[i]){mat[i]=0;n++;m.clearRect(x*K,y*K,K,K);if(sparks.length<200&&Math.random()<.5)sparks.push({x:sx,y:sy,vx:1.5+Math.random()*2.5,vy:-(1+Math.random()*2),t:0,red:tgt[i]})}}
  if(n)grinding=6;return n}
 const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/S,(e.clientY-r.top)/S]};
 function moveBy(dx,dy){/* 砥石に当たっている間は、少し重く動く */
  const touching=Math.hypot(cx-WX,cy-WY)<R+reach;const k=touching?.65:1,d=Math.hypot(dx,dy)*k,steps=Math.max(1,Math.ceil(d/(R*.25)));
  for(let i=0;i<steps;i++){cx=clamp(cx+dx*k/steps,-GW*.2,SW+GW*.2);cy=clamp(cy+dy*k/steps,-GH*.4,WY);grindNow()}}
 cv.onpointerdown=e=>{if(done)return;e.preventDefault();pid=e.pointerId;try{cv.setPointerCapture(pid)}catch(_){}[lx,ly]=pos(e)};
 cv.onpointermove=e=>{if(e.pointerId!==pid||done)return;const[x,y]=pos(e);moveBy(x-lx,y-ly);lx=x;ly=y};
 cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId===pid)pid=null};
 const rot=d=>{if(done)return;angT+=d*Math.PI/4;tone(500,.05,'triangle',.05,600)};
 $('gRotL').onclick=()=>rot(-1);$('gRotR').onclick=()=>rot(1);
 $('gDone').onclick=()=>finish();
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);const s=score();sec.querySelector('#gDone').onclick=null;res({score:s.q,iou:s.iou,shape:packShape(mat)})}
 let raf=0;
 function frame(now){const dt=last?Math.min(.1,(now-last)/1000):0;last=now;/* 制限時間なし。「仕上げる」で終わる */
  /* 向きを変えるときは、なめらかに回す */
  if(Math.abs(ang-angT)>.001){const st=dt*7;ang+=clamp(angT-ang,-st,st);if(Math.abs(ang-angT)<=.001)ang=angT}
  grindNow();spin+=dt*30;
  g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,cv.width,cv.height);
  g.fillStyle='#0f1424';g.fillRect(0,0,SW*S,SH*S);g.strokeStyle='#ffffff0d';g.lineWidth=1;for(let x=0;x<=SW;x+=8){g.beginPath();g.moveTo(x*S,0);g.lineTo(x*S,SH*S);g.stroke()}for(let y=0;y<=SH;y+=8){g.beginPath();g.moveTo(0,y*S);g.lineTo(SW*S,y*S);g.stroke()}
  /* 鉄（と、合わせる点線の形） */
  g.save();g.translate(cx*S,cy*S);g.rotate(ang);g.translate(-GW/2*S,-GH/2*S);
  g.drawImage(metal,0,0,GW*S,GH*S);
  const P=GRIND_SHAPE[o.who]||GRIND_SHAPE.wolf;g.strokeStyle='#ffffffcc';g.setLineDash([6,4]);g.lineWidth=1.6;g.beginPath();P.forEach(([x,y],i)=>i?g.lineTo(x*GW*S,y*GH*S):g.moveTo(x*GW*S,y*GH*S));g.closePath();g.stroke();g.setLineDash([]);
  g.restore();
  /* 固定の砥石 */
  g.save();g.translate(WX*S,WY*S);
  g.fillStyle='#3a3f4c';g.beginPath();g.arc(0,0,R*S+6,Math.PI,TAU);g.fill();
  const gr=g.createRadialGradient(0,0,R*S*.2,0,0,R*S);gr.addColorStop(0,'#8a8f9c');gr.addColorStop(1,'#5a606c');g.fillStyle=gr;g.beginPath();g.arc(0,0,R*S,0,TAU);g.fill();
  g.rotate(spin);g.strokeStyle='#ffffff22';g.lineWidth=2;for(let i=0;i<12;i++){g.rotate(TAU/12);g.beginPath();g.moveTo(R*S*.35,0);g.lineTo(R*S*.95,0);g.stroke()}
  g.restore();
  g.strokeStyle=grinding>0?'#ffb07a':'#ff7a2f88';g.lineWidth=2.5;g.beginPath();g.arc(WX*S,WY*S,R*S,Math.PI*1.1,Math.PI*1.9);g.stroke();
  /* 火花 */
  for(const p of sparks){p.t+=dt*60;p.x+=p.vx*.5;p.y+=p.vy*.5;p.vy+=.15;g.fillStyle=p.red?'#ff4a4a':(p.t<6?'#fff3c0':'#ff9a3a');g.globalAlpha=Math.max(0,1-p.t/24);g.fillRect(p.x*S,p.y*S,2.2,2.2)}g.globalAlpha=1;sparks=sparks.filter(p=>p.t<24);
  if(grinding>0){grinding--;if(grinding%2===0)tone(1800+Math.random()*900,.03,'sawtooth',.012)}
  const s=score();$('gTime').textContent='';$('gMatch').textContent=`形の一致 ${s.q}%`;$('gMatch').className=s.broke>tgtN*.03?'bad':'';
  $('gWarn').textContent=s.broke>tgtN*.03?'削りすぎ！ 形が欠けている':'';
  raf=requestAnimationFrame(frame)}
 raf=requestAnimationFrame(frame)})}
