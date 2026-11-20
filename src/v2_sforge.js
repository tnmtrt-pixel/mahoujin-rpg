/* =====================================================================
   第3章の工房（③）：新しい加工5つ・特許の図面・練度Lv10・アウル・スコープ
   ・新しい加工は、創技の塔の後半で出会った5人が教えてくれる（会ったときに工具がもらえ、練度Lv5から）
     高周波焼入れ＝雷牙／鏡面研削＝クロミオ／レーザー加工＝シオン／放電加工＝ぷかり／ブロック工法＝サカマタ
   ・どのミニゲームも、押す・離す・タップだけ。練度（Lv1〜10）で幅や速さがやさしくなる
   ・特許の図面（10Fでノクスが渡す）：工具の練度 Lv6〜10 が要る。アウル・スコープは汎用武器の枠を1つ使う
   ・練度の上限 Lv10 は、V3_OPEN の間だけ（公開前のふつうの版は Lv5 のまま）
   ===================================================================== */
/* ---------- 練度 Lv10 ---------- */
if(V3_OPEN)TLV_XP.push(380,470,570,680,800);
/* ---------- 工具と加工 ---------- */
Object.assign(TOOLS,{
 ihcoil:{n:'高周波焼入れ機',d:'雷牙が教えてくれる。電気で表面だけを一瞬で熱して硬くする',where:'創技の塔で雷牙に会う'},
 mgrind:{n:'鏡面研削盤',  d:'クロミオが教えてくれる。影まで映る面に仕上げる',where:'創技の塔でクロミオに会う'},
 laser: {n:'レーザー加工機',d:'シオンが教えてくれる。光で鉄を切りぬく',where:'創技の塔でシオンに会う'},
 edm:   {n:'放電加工機',  d:'ぷかりが教えてくれる。ふれずに、電気の火花でけずる',where:'創技の塔でぷかりに会う'},
 crane: {n:'ブロック工法のクレーン',d:'サカマタが教えてくれる。大きな物をブロックに分けて組み上げる',where:'創技の塔でサカマタに会う'}});
const S_TOOLS={raiga:'ihcoil',kuromio:'mgrind',shion:'laser',pukari:'edm',sakamata:'crane'};
Object.assign(UI_IC,{ihcoil:'t_yakiire',mgrind:'t_kyomen',laser:'t_laser',edm:'t_houden',crane:'t_block'});
Object.assign(PROC_MAIN,{quench:['ihcoil'],mirror:['mgrind'],laser:['laser'],edm:['edm'],block:['crane']});
Object.assign(PROC_LBL,{quench:'高周波焼入れ',mirror:'鏡面研削',laser:'レーザー加工',edm:'放電加工',block:'ブロック工法'});
Object.assign(PROC_TOOL,{quench:'ihcoil',mirror:'mgrind',laser:'laser',edm:'edm',block:'crane'});
Object.assign(PROC_HOW,{quench:'高周波焼入れ：押して熱する→オレンジで離す→下へはらって冷やす（3か所）',mirror:'鏡面研削：回る砥石の金色の印が、いちばん下に来た瞬間にタップ',
 laser:'レーザー加工：光の点が線を進む。厚いところは押し、うすいところは離す',edm:'放電加工：押すと電極が下がり、離すと上がる。すき間を青い帯に保つ',block:'ブロック工法：ゆれるブロックが点線の真上に来たらタップして積む'});
if(V3_OPEN){PROC_ORDER.push('quench','mirror','laser','edm','block');Object.values(S_TOOLS).forEach(t=>{if(!TOOL_ORDER.includes(t))TOOL_ORDER.push(t)});PRACTICE_LIST.push('quench','mirror','laser','edm','block')}
/* 新しい工具は練度の上がり方を大きく（3倍）。道場の練習でも少し上がる */
const S_NEWT=Object.values(S_TOOLS);
{const _x=toolXpGain;toolXpGain=function(R,q){const before={};S_NEWT.forEach(t=>before[t]=(G.tlx||{})[t]||0);const m=_x(R,q);S_NEWT.forEach(t=>{const d=((G.tlx||{})[t]||0)-before[t];if(d>0)G.tlx[t]+=d*2});return m}}
/* ミニゲームに渡す練度（道場では、その工具の練度を使う） */
const sLv=(o,t)=>{const p=/^練習・/.test(o.title||'');return Math.max(1,Math.min(10,p&&typeof G!=='undefined'&&G&&G.tools&&G.tools.includes(t)?tlv(t):(o.assist||1)))};
function sPracXp(o,t,score){if(!/^練習・/.test(o.title||'')||typeof G==='undefined'||!G||!G.tools||!G.tools.includes(t))return;G.tlx=G.tlx||{};G.tlx[t]=(G.tlx[t]||0)+8+Math.round(score/8);save()}
const sRank=v=>Math.round(Math.max(0,Math.min(1,v))*100);

/* ---------- 高周波焼入れ ---------- */
function runQuench(o){return new Promise(res=>{const LV=sLv(o,'ihcoil');
 const {cv,g,W,H}=forgeOpen(o.title||'高周波焼入れ','押して熱する→オレンジで離す→下へはらって冷やす。3か所','t_yakiire');
 const band=18+LV*2.2,spd=1-LV*.035,TGT=860,CRACK=1080,LOW=780,ROOM=30;
 const S={i:0,ph:'ready',T:ROOM,spots:[0,1,2].map(()=>({T:ROOM})),out:[],relT:0,y0:0,dn:false,steam:[],shake:0};let raf=0,last=0,done=false;
 const col=T=>{const k=[[ROOM,[60,62,70]],[500,[70,40,40]],[700,[150,20,15]],[800,[220,50,20]],[860,[255,130,30]],[930,[255,200,60]],[1000,[255,240,170]],[1100,[255,255,255]]];
  for(let i=1;i<k.length;i++)if(T<=k[i][0]){const a=k[i-1],b=k[i],t=(T-a[0])/(b[0]-a[0]);return a[1].map((v,j)=>Math.round(v+(b[1][j]-v)*t))}return[255,255,255]};
 const name=T=>T>=CRACK?'白（割れる！）':T>=960?'黄色（熱しすぎ）':T>=TGT-band&&T<=TGT+band?'オレンジ（いま！）':T>=LOW?'赤オレンジ':T>=600?'赤（まだ）':'黒';
 const spotX=i=>W*(.25+i*.25);
 function fin1(dt,late){const sp=S.spots[S.i],T=sp.T;let ts;if(T>=CRACK)ts=0;else if(T<LOW)ts=.15;else{const d=Math.abs(T-TGT);ts=d<=band*.5?1:d<=band?.85:d<=band*2?.5:.25}
  const qs=late?0:dt<=.5?1:dt<=1?.7:dt<=2?.4:0,sc=T>=CRACK?0:ts*.7+qs*.3;S.out.push(sc);sp.q=1;sp.ok=sc>=.6;
  for(let i=0;i<26;i++)S.steam.push({x:spotX(S.i)+(Math.random()-.5)*40,y:H*.5,vx:(Math.random()-.5)*1.2,vy:-1-Math.random()*2,t:0});
  tone(T>=CRACK?120:1400,T>=CRACK?.4:.25,T>=CRACK?'square':'sine',.06);if(T>=CRACK)S.shake=12;S.i++;S.T=ROOM;
  $('fgInfo').textContent=`${S.i} / 3`;if(S.i>=3){S.ph='done';setTimeout(finish,700)}else S.ph='ready'}
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointermove=cv.onpointerup=null;const sc=sRank(S.out.reduce((a,b)=>a+b,0)/3);sPracXp(o,'ihcoil',sc);res({score:sc,reach:1})}
 cv.onpointerdown=e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}if(S.ph==='ready'){S.ph='heat';S.T=ROOM;tone(220,.2,'sawtooth',.03)}else if(S.ph==='wait'){S.dn=true;S.y0=e.clientY}};
 cv.onpointermove=e=>{if(S.ph==='wait'&&S.dn&&e.clientY-S.y0>40)fin1((performance.now()-S.relT)/1000,false)};
 cv.onpointerup=()=>{if(S.ph==='heat'){S.ph='wait';S.relT=performance.now();S.dn=false;S.spots[S.i].T=S.T;tone(660,.08,'triangle')}else S.dn=false};
 function loop(ts){const dt=last?Math.min(50,ts-last)/16.67:0;last=ts;
  if(S.ph==='heat'){S.T+=(4+S.T*.012)/spd*dt*.9;if(S.T>=CRACK){S.spots[S.i].T=S.T;fin1(0,true)}}
  if(S.ph==='wait'){if((performance.now()-S.relT)/1000>2.2)fin1(9,true);else{const sp=S.spots[S.i];sp.T=Math.max(ROOM,sp.T-1.2*dt)}}
  g.clearRect(0,0,W,H);g.save();if(S.shake>0){g.translate((Math.random()-.5)*S.shake,(Math.random()-.5)*S.shake);S.shake*=.85}
  const y=H*.5,r=H*.07+10,grd=g.createLinearGradient(0,y-r,0,y+r);grd.addColorStop(0,'#7a808c');grd.addColorStop(.5,'#c9ced8');grd.addColorStop(1,'#565b66');g.fillStyle=grd;g.fillRect(W*.08,y-r,W*.84,r*2);
  for(let i=0;i<3;i++){const x=spotX(i),sp=S.spots[i],T=i===S.i&&S.ph==='heat'?S.T:sp.T,c=col(T),a=Math.min(1,(T-ROOM)/500);
   if(sp.q){g.fillStyle=sp.ok?'#3a4258':'#5a3a3a';g.fillRect(x-r*.9,y-r,r*1.8,r*2)}
   else if(a>0){g.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${a})`;g.shadowColor=`rgb(${c})`;g.shadowBlur=T>700?20:0;g.fillRect(x-r*.9,y-r,r*1.8,r*2);g.shadowBlur=0}
   g.strokeStyle=i===S.i&&S.ph!=='done'?'#ffd25a':'#ffffff55';g.setLineDash([4,4]);g.strokeRect(x-r*.9,y-r-2,r*1.8,r*2+4);g.setLineDash([])}
  if(S.ph!=='done'&&S.i<3){const x=spotX(S.i);g.strokeStyle=S.ph==='heat'?'#ffb347':'#b87333';g.lineWidth=5;for(let k=-2;k<=2;k++){g.beginPath();g.ellipse(x+k*9,y,6,r+14,0,0,TAU);g.stroke()}}
  S.steam=S.steam.filter(p=>p.t<60);for(const p of S.steam){p.t++;p.x+=p.vx;p.y+=p.vy;g.fillStyle=`rgba(220,230,255,${.5*(1-p.t/60)})`;g.beginPath();g.arc(p.x,p.y,6+p.t*.3,0,TAU);g.fill()}
  const tx=W-26,ty=18,th=H*.36,T=S.ph==='heat'?S.T:S.ph==='wait'?S.spots[S.i].T:ROOM,f=Math.min(1,(T-ROOM)/(1150-ROOM)),yb=v=>ty+th*(1-(v-ROOM)/(1150-ROOM));
  g.fillStyle='#1a2140';g.fillRect(tx-7,ty,14,th);g.fillStyle='rgba(255,150,40,.45)';g.fillRect(tx-12,yb(TGT+band),24,yb(TGT-band)-yb(TGT+band));g.fillStyle=`rgb(${col(T)})`;g.fillRect(tx-5,ty+th*(1-f),10,th*f);
  g.fillStyle='#e8ecf6';g.font='800 16px sans-serif';g.textAlign='left';g.fillText(S.ph==='ready'?`${S.i+1}か所目：押して熱する`:S.ph==='heat'?name(T)+'　→ 離す':S.ph==='wait'?'↓ 下へはらって冷やす！':'',12,28);
  g.restore();if(!done)raf=requestAnimationFrame(loop)}
 $('fgDone').style.display='none';$('fgInfo').textContent='0 / 3';raf=requestAnimationFrame(loop)})}

/* ---------- 鏡面研削 ---------- */
function runMirror(o){return new Promise(res=>{const LV=sLv(o,'mgrind');
 const {cv,g,W,H}=forgeOpen(o.title||'鏡面研削','回る砥石の金色の印が、いちばん下に来た瞬間にタップ。3段階、だんだん速くなる','t_kyomen');
 const tol=.16+LV*.012,spm=1-LV*.03,STG=[{n:'#400 荒仕上げ',rps:.55},{n:'#1000 中仕上げ',rps:.8},{n:'#3000 鏡面仕上げ',rps:1.1}],NEED=4;
 const S={k:0,a:0,hit:0,log:[],fx:[],shine:0,scr:0,flash:0,msg:'',mt:0};let raf=0,last=0,done=false;
 const cx=W/2,cy=H*.36,R=Math.min(W,H)*.22,off=()=>((S.a-Math.PI/2)%TAU+Math.PI*3)%TAU-Math.PI;
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=null;const sc=sRank(S.log.reduce((a,b)=>a+b,0)/Math.max(1,S.log.length));sPracXp(o,'mgrind',sc);res({score:sc,reach:1})}
 cv.onpointerdown=e=>{e.preventDefault();if(S.k>=3)return;const d=Math.abs(off()),sc=d<=tol*.45?1:d<=tol?.75:0;S.log.push(sc);S.msg=sc>=1?'ぴったり！':sc>0?'よい':'はずれ…';S.mt=1;
  if(sc>0){S.hit++;S.shine=Math.min(1,S.shine+1/12);S.flash=1;tone(sc>=1?2400:1800,.08,'triangle',.06);for(let i=0;i<14;i++)S.fx.push({x:cx,y:cy+R,vx:(Math.random()-.5)*6,vy:-Math.random()*4,t:0})}
  else{S.scr++;tone(200,.15,'square',.05)}
  if(S.hit>=(S.k+1)*NEED){S.k++;$('fgInfo').textContent=`${Math.min(3,S.k+1)} / 3`;if(S.k>=3)setTimeout(finish,800)}};
 function loop(ts){const dt=last?Math.min(50,ts-last)/1000:0;last=ts;if(S.k<3)S.a+=dt*TAU*STG[S.k].rps/spm;S.mt=Math.max(0,S.mt-dt);
  g.clearRect(0,0,W,H);const sh=S.shine,py=cy+R,pw=W*.8,ph=H*.16,gr=g.createLinearGradient(cx-pw/2,py,cx+pw/2,py+ph);gr.addColorStop(0,`hsl(225,8%,${30+sh*35}%)`);gr.addColorStop(.5,`hsl(225,12%,${45+sh*45}%)`);gr.addColorStop(1,`hsl(225,8%,${28+sh*35}%)`);
  g.fillStyle=gr;g.fillRect(cx-pw/2,py,pw,ph);g.save();g.beginPath();g.rect(cx-pw/2,py,pw,ph);g.clip();g.strokeStyle=`rgba(20,22,30,${.5*(1-sh)})`;g.lineWidth=1;for(let i=0;i<40;i++){const yy=py+((i*37)%100)/100*ph;g.beginPath();g.moveTo(cx-pw/2,yy);g.lineTo(cx+pw/2,yy);g.stroke()}
  g.strokeStyle='rgba(200,60,60,.5)';for(let i=0;i<S.scr;i++){const xx=cx-pw/2+((i*53)%97)/97*pw;g.beginPath();g.moveTo(xx,py+4);g.lineTo(xx+18,py+ph-4);g.stroke()}g.restore();
  g.strokeStyle='rgba(255,210,90,.4)';g.lineWidth=14;g.beginPath();g.arc(cx,cy,R+10,Math.PI/2-tol,Math.PI/2+tol);g.stroke();
  g.fillStyle='#6b6f80';g.beginPath();g.arc(cx,cy,R,0,TAU);g.fill();g.fillStyle='#545867';for(let i=0;i<60;i++){const a=S.a+i*.7,rr=R*(.25+((i*13)%10)/12*.7);g.fillRect(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,2,2)}
  g.fillStyle='#2a2e3a';g.beginPath();g.arc(cx,cy,R*.18,0,TAU);g.fill();g.fillStyle='#ffd25a';g.beginPath();g.arc(cx+Math.cos(S.a)*R*.86,cy+Math.sin(S.a)*R*.86,R*.11,0,TAU);g.fill();
  S.fx=S.fx.filter(f=>++f.t<22);for(const f of S.fx){f.x+=f.vx;f.y+=f.vy;f.vy+=.3;g.fillStyle=`rgba(255,${220-f.t*6},120,${1-f.t/22})`;g.fillRect(f.x,f.y,2,2)}
  if(S.flash>0){g.fillStyle=`rgba(255,255,255,${S.flash*.15})`;g.fillRect(0,0,W,H);S.flash*=.85}
  g.fillStyle='#e8ecf6';g.font='800 15px sans-serif';g.textAlign='left';g.fillText(S.k<3?STG[S.k].n:'仕上がり！',12,24);g.textAlign='right';g.fillText(`なめらかさ ${Math.round(sh*100)}%`,W-12,24);
  if(S.mt>0){g.globalAlpha=S.mt;g.fillStyle='#ffe066';g.font='800 22px sans-serif';g.textAlign='center';g.fillText(S.msg,cx,H*.94);g.globalAlpha=1}
  if(!done)raf=requestAnimationFrame(loop)}
 $('fgDone').style.display='none';$('fgInfo').textContent='1 / 3';raf=requestAnimationFrame(loop)})}

/* ---------- レーザー加工 ---------- */
function runLaser(o){return new Promise(res=>{const LV=sLv(o,'laser');
 const {cv,g,W,H}=forgeOpen(o.title||'レーザー加工','光の点が線を進む。厚いところ（太い青）は押したまま、うすいところは離す','t_laser');
 const dur=9-LV*.25,grace=.012+LV*.0025,THICK=[[.06,.18],[.30,.42],[.55,.62],[.74,.90]],thickAt=u=>THICK.some(([a,b])=>u>=a&&u<=b);
 const cx=W/2,cy=H*.48,s=Math.min(W,H)*.36,raw=[[0,-.15],[.35,-.75],[.5,-.15],[.7,.1],[.45,.55],[0,.8],[-.45,.55],[-.7,.1],[-.5,-.15],[-.35,-.75],[0,-.15]],PTS=[];
 for(let i=0;i<raw.length-1;i++){const a=raw[i],b=raw[i+1];for(let k=0;k<12;k++){const t=k/12;PTS.push([cx+(a[0]+(b[0]-a[0])*t)*s,cy+(a[1]+(b[1]-a[1])*t)*s])}}PTS.push(PTS[0]);
 const CUM=[0];for(let i=1;i<PTS.length;i++)CUM.push(CUM[i-1]+Math.hypot(PTS[i][0]-PTS[i-1][0],PTS[i][1]-PTS[i-1][1]));const LEN=CUM[CUM.length-1];
 const at=u=>{const d=u*LEN;let i=1;while(i<CUM.length&&CUM[i]<d)i++;i=Math.min(i,CUM.length-1);const a=PTS[i-1],b=PTS[i],t=(d-CUM[i-1])/Math.max(1e-6,CUM[i]-CUM[i-1]);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]};
 const S={ph:'ready',u:0,pw:0,marks:[],ok:0,n:0,sparks:[],drop:0};let down=false,raf=0,last=0,done=false;
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointerup=cv.onpointercancel=null;const sc=sRank(S.ok/Math.max(1,S.n));sPracXp(o,'laser',sc);res({score:sc,reach:1})}
 cv.onpointerdown=e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}down=true;if(S.ph==='ready')S.ph='cut'};cv.onpointerup=cv.onpointercancel=()=>{down=false};
 function loop(ts){const dt=last?Math.min(50,ts-last)/1000:0;last=ts;S.pw+=((down?1:0)-S.pw)*Math.min(1,dt*14);
  if(S.ph==='cut'){S.u+=dt/dur;const u=S.u,th=thickAt(u),near=THICK.some(([a,b])=>Math.abs(u-a)<grace||Math.abs(u-b)<grace);let k;
   if(S.pw>.5)k=th||near?'ok':'burn';else k=!th||near?'ok':'uncut';if(k==='ok')S.ok++;S.n++;S.marks.push({u,k});
   if(S.pw>.5){const p=at(u);for(let i=0;i<2;i++)S.sparks.push({x:p[0],y:p[1],vx:(Math.random()-.5)*4,vy:-Math.random()*3,t:0})}
   $('fgInfo').textContent=k==='burn'?'焦げてる！ 離して':k==='uncut'?'切れてない！ 押して':Math.round(Math.min(1,u)*100)+'%';
   if(S.u>=1){S.ph='done';tone(660,.2,'triangle');setTimeout(finish,1200)}}
  g.clearRect(0,0,W,H);g.fillStyle='#3a4258';g.fillRect(W*.06,H*.06,W*.88,H*.84);const good=S.ok/Math.max(1,S.n)>=.7;if(S.ph==='done'&&good)S.drop=Math.min(1,S.drop+.03);
  g.save();if(S.ph==='done'&&good){g.translate(0,S.drop*H*.6);g.globalAlpha=1-S.drop}g.beginPath();PTS.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle='#4a5470';g.fill();g.restore();
  g.lineCap='round';for(let i=0;i<120;i++){const u0=i/120,u1=(i+1)/120,a=at(u0),b=at(u1),th=thickAt((u0+u1)/2);g.strokeStyle=th?'#2b6cff':'#9fb4dd';g.lineWidth=th?9:3;g.globalAlpha=.55;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}g.globalAlpha=1;
  for(let i=1;i<S.marks.length;i++){const m=S.marks[i],a=at(S.marks[i-1].u),b=at(m.u);g.strokeStyle=m.k==='ok'?'#120a1a':m.k==='burn'?'#ff7a2a':'#cfd6e6';g.lineWidth=m.k==='burn'?10:m.k==='ok'?4:2;g.setLineDash(m.k==='uncut'?[3,4]:[]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}g.setLineDash([]);
  if(S.ph!=='done'){const p=at(Math.min(1,S.u)),r=6+S.pw*10,rg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r*3);rg.addColorStop(0,'#fff');rg.addColorStop(.3,`rgba(220,120,255,${.6+.4*S.pw})`);rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.beginPath();g.arc(p[0],p[1],r*3,0,TAU);g.fill();
   const nx=at(Math.min(1,S.u+.05)),th=thickAt(Math.min(1,S.u+.05));g.fillStyle=th?'#7fb0ff':'#e8ecf6';g.font='800 13px sans-serif';g.textAlign='center';g.fillText(th?'厚い':'うすい',nx[0],nx[1]-16)}
  S.sparks=S.sparks.filter(q=>++q.t<20);for(const q of S.sparks){q.x+=q.vx;q.y+=q.vy;q.vy+=.2;g.fillStyle=`rgba(255,${180-q.t*6},80,${1-q.t/20})`;g.fillRect(q.x,q.y,2,2)}
  if(S.ph==='ready'){g.fillStyle='#e8ecf6';g.font='800 16px sans-serif';g.textAlign='center';g.fillText('押すとスタート',W/2,H*.96)}
  if(!done)raf=requestAnimationFrame(loop)}
 $('fgDone').style.display='none';raf=requestAnimationFrame(loop)})}

/* ---------- 放電加工 ---------- */
function runEdm(o){return new Promise(res=>{const LV=sLv(o,'edm');
 const {cv,g,W,H}=forgeOpen(o.title||'放電加工','押すと電極が下がり、離すと上がる。すき間を青い帯に保つ（近すぎるとショート）','t_houden');
 const lo=14-LV*.5,hi=26+LV*.8,cut=.065+LV*.002;const S={ph:'ready',gap:45,v:0,depth:0,t:0,inb:0,tot:0,short:0,shortT:0,debris:0,sparks:[],bub:[]};let down=false,raf=0,last=0,done=false,zt=0;
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=cv.onpointerup=cv.onpointercancel=null;const ib=S.inb/Math.max(1,S.tot),sc=sRank(Math.max(0,ib-S.short*.06)*(S.t<14?1:S.t<20?.9:.8));sPracXp(o,'edm',sc);res({score:sc,reach:1})}
 cv.onpointerdown=e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}down=true;if(S.ph==='ready')S.ph='run'};cv.onpointerup=cv.onpointercancel=()=>{down=false};
 function loop(ts){const dt=last?Math.min(50,ts-last)/1000:0;last=ts;
  if(S.ph==='run'){S.t+=dt;const tv=down?-38:30;S.v+=(tv-S.v)*Math.min(1,dt*6);if(S.shortT>0){S.shortT-=dt;S.v=40}S.gap+=S.v*dt;
   S.debris+=dt;if(S.debris>1.6+Math.random()*1.6){S.debris=0;S.gap-=7+Math.random()*6;for(let i=0;i<8;i++)S.bub.push({x:W/2+(Math.random()-.5)*60,y:H*.62,t:0,r:2+Math.random()*3})}
   S.gap=Math.max(0,Math.min(60,S.gap));const inb=S.gap>=lo&&S.gap<=hi;S.tot++;if(inb)S.inb++;
   if(S.gap<=2&&S.shortT<=0){S.short++;S.shortT=.5;tone(110,.3,'square',.07);$('fgInfo').textContent='ショート！'}
   else if(inb){S.depth+=cut*dt*1.5*(1-Math.abs((S.gap-(lo+hi)/2)/((hi-lo)/2))*.4);$('fgInfo').textContent=`深さ ${Math.round(S.depth*100)}%`;if(ts-zt>60){zt=ts;tone(2600+Math.random()*1600,.03,'square',.015)}for(let i=0;i<3;i++)S.sparks.push({x:W/2+(Math.random()-.5)*70,t:0})}
   else $('fgInfo').textContent=S.gap>hi?'遠すぎ。押して近づける':'近すぎ！ 離して';
   if(S.depth>=1){S.ph='done';setTimeout(finish,600)}}
  g.clearRect(0,0,W,H);g.fillStyle='#10304a';g.fillRect(W*.08,H*.28,W*.84,H*.66);const top=H*.62,dep=Math.min(1,S.depth)*H*.18;g.fillStyle='#8a92a6';g.fillRect(W*.1,top,W*.8,H*.3);g.fillStyle='#10304a';g.fillRect(W/2-46,top,92,dep);
  const gx=W-34,gy=H*.12,gh=H*.5,yv=v=>gy+gh*(1-v/60);g.fillStyle='#1a2140';g.fillRect(gx,gy,14,gh);g.fillStyle='rgba(60,200,255,.45)';g.fillRect(gx-4,yv(hi),22,yv(lo)-yv(hi));g.fillStyle='rgba(255,80,80,.5)';g.fillRect(gx-4,yv(4),22,yv(0)-yv(4));g.fillStyle='#fff';g.fillRect(gx-6,yv(S.gap)-2,26,4);
  const ey=top+dep-S.gap*1.6-6;g.fillStyle='#c98a3a';g.fillRect(W/2-40,H*.08,80,Math.max(4,ey-H*.08));g.fillStyle='#e0a050';g.fillRect(W/2-44,ey-10,88,10);
  S.sparks=S.sparks.filter(q=>++q.t<6);for(const q of S.sparks){g.strokeStyle=`rgba(180,240,255,${1-q.t/6})`;g.lineWidth=1.5;g.beginPath();g.moveTo(q.x,ey);let y=ey;for(let k=0;k<3;k++){y+=(top+dep-ey)/3;g.lineTo(q.x+(Math.random()-.5)*10,y)}g.stroke()}
  if(S.shortT>0){g.fillStyle=`rgba(255,255,255,${S.shortT})`;g.fillRect(0,0,W,H)}
  S.bub=S.bub.filter(b=>++b.t<60);for(const b of S.bub){b.y-=1.2;g.strokeStyle=`rgba(200,230,255,${.6*(1-b.t/60)})`;g.beginPath();g.arc(b.x,b.y,b.r,0,TAU);g.stroke()}
  g.fillStyle='#1a2140';g.fillRect(14,14,110,10);g.fillStyle='#7fe0ff';g.fillRect(14,14,110*Math.min(1,S.depth),10);
  if(S.ph==='ready'){g.fillStyle='#e8ecf6';g.font='800 16px sans-serif';g.textAlign='center';g.fillText('押すとスタート',W/2,H*.2)}
  if(!done)raf=requestAnimationFrame(loop)}
 $('fgDone').style.display='none';raf=requestAnimationFrame(loop)})}

/* ---------- ブロック工法 ---------- */
function runBlock(o){return new Promise(res=>{const LV=sLv(o,'crane');
 const {cv,g,W,H}=forgeOpen(o.title||'ブロック工法','クレーンでゆれるブロックが、点線の真上に来たらタップして積む（船底→船体→甲板→船橋→マスト）','t_block');
 const spd=2.6-LV*.1,tol=(5+LV*.6)*W/360,BL=[{n:'船底',w:.78,h:.09,c:'#a33'},{n:'船体',w:.70,h:.10,c:'#c44'},{n:'甲板',w:.62,h:.05,c:'#ccb88a'},{n:'船橋',w:.30,h:.12,c:'#e8ecf6'},{n:'マスト',w:.06,h:.16,c:'#d9a441'}];
 const S={i:0,ph:'swing',t:0,placed:[],fall:null,shake:0};let raf=0,last=0,done=false;
 const target=()=>S.placed.length?S.placed[S.placed.length-1].x:W/2,baseY=()=>H*.86-S.placed.reduce((a,p)=>a+BL[p.i].h*H*.75,0),hookX=()=>W/2+Math.sin(S.t*spd)*W*.32;
 function finish(){if(done)return;done=true;cancelAnimationFrame(raf);cv.onpointerdown=null;const av=S.placed.reduce((a,p)=>a+p.sc,0)/S.placed.length*(S.placed[4].sc>=.85?1:.9);const sc=sRank(av);sPracXp(o,'crane',sc);res({score:sc,reach:1})}
 cv.onpointerdown=e=>{e.preventDefault();if(S.ph!=='swing')return;S.ph='fall';S.fall={x:hookX(),y:H*.16,vy:0};tone(300,.08,'triangle')};
 function land(){const a=Math.abs(S.fall.x-target()),sc=a<=tol*.5?1:a<=tol?.85:a<=tol*3?.5:.15;S.placed.push({i:S.i,x:S.fall.x,sc});S.shake=a>tol?8:3;tone(a<=tol?880:180,.2,a<=tol?'triangle':'square',.07);
  $('fgInfo').textContent=a<=tol*.5?'ぴったり！':a<=tol?'よい':a<=tol*3?'ずれ':'大ずれ…';S.i++;S.fall=null;if(S.i>=BL.length){S.ph='done';setTimeout(finish,1100)}else S.ph='swing'}
 function blk(i,x,yTop){const b=BL[i],w=b.w*W*.8,h=b.h*H*.75;g.fillStyle=b.c;if(i===0){g.beginPath();g.moveTo(x-w/2,yTop);g.lineTo(x+w/2,yTop);g.lineTo(x+w/2-w*.12,yTop+h);g.lineTo(x-w/2+w*.12,yTop+h);g.closePath();g.fill()}else g.fillRect(x-w/2,yTop,w,h);
  g.strokeStyle='#0008';g.lineWidth=1;g.strokeRect(x-w/2,yTop,w,h);if(i===3){g.fillStyle='#4a7fd0';for(let k=0;k<3;k++)g.fillRect(x-w*.4+k*w*.3,yTop+h*.3,w*.18,h*.3)}}
 function loop(ts){const dt=last?Math.min(50,ts-last)/1000:0;last=ts;S.t+=dt;
  if(S.ph==='fall'){S.fall.vy+=1400*dt;S.fall.y+=S.fall.vy*dt;const bh=BL[S.i].h*H*.75;if(S.fall.y+bh>=baseY()){S.fall.y=baseY()-bh;land()}}
  g.clearRect(0,0,W,H);g.save();if(S.shake>0){g.translate((Math.random()-.5)*S.shake,0);S.shake*=.85}
  g.fillStyle='#183a5a';g.fillRect(0,H*.88,W,H*.12);g.fillStyle='#3a4258';g.fillRect(0,H*.86,W,H*.02);
  let y=H*.86;for(const p of S.placed){y-=BL[p.i].h*H*.75;blk(p.i,p.x,y)}
  if(S.ph!=='done'&&S.i<BL.length){const b=BL[S.i],w=b.w*W*.8,h=b.h*H*.75,tx=target(),by=baseY();g.setLineDash([5,5]);g.strokeStyle='#ffffffaa';g.strokeRect(tx-w/2,by-h,w,h);g.setLineDash([])}
  g.strokeStyle='#d9a441';g.lineWidth=6;g.beginPath();g.moveTo(0,H*.06);g.lineTo(W,H*.06);g.stroke();
  if(S.ph==='swing'&&S.i<BL.length){const x=hookX();g.strokeStyle='#ccc';g.lineWidth=2;g.beginPath();g.moveTo(x,H*.06);g.lineTo(x,H*.16);g.stroke();blk(S.i,x,H*.16)}
  if(S.ph==='fall')blk(S.i,S.fall.x,S.fall.y);
  g.fillStyle='#e8ecf6';g.font='800 14px sans-serif';g.textAlign='left';g.fillText(`${Math.min(S.i+1,5)}/5　${BL[Math.min(S.i,4)].n}`,10,H*.12);g.restore();if(!done)raf=requestAnimationFrame(loop)}
 $('fgDone').style.display='none';raf=requestAnimationFrame(loop)})}
Object.assign(MINI,{quench:{f:runQuench,t:'高周波焼入れ',n:'焼入れ'},mirror:{f:runMirror,t:'鏡面研削',n:'鏡面研削'},laser:{f:runLaser,t:'レーザー加工',n:'レーザー'},edm:{f:runEdm,t:'放電加工',n:'放電'},block:{f:runBlock,t:'ブロック工法',n:'組み立て'}});

/* ---------- 新しい加工の工具をもらう（創技の塔の後半で出会ったとき） ---------- */
async function sGrantTools(show){if(!G||!V3_OPEN)return;const got=[];
 Object.entries(S_TOOLS).forEach(([id,t])=>{if(G.flags['hp_'+id]&&!G.tools.includes(t)){G.tools.push(t);G.tlx=G.tlx||{};G.tlx[t]=Math.max(G.tlx[t]||0,TLV_XP[4]);got.push([id,t])}});
 if(!got.length)return;save();if(show)for(const[id,t]of got)await say(`${MIC(t,40)} <b>${TOOLS[t].n}</b>をもらった！<br><span style="font-size:14px">${CHARS[id].name}が「${PROC_LBL[Object.keys(PROC_TOOL).find(p=>PROC_TOOL[p]===t)]}」を教えてくれた。練度Lv5から</span>`,1900)}
{const _j=fJoin;fJoin=async function(){const r=await _j.apply(this,arguments);if(towerAt()==='sougi')await sGrantTools(true);return r}}
{const _o=openShop;openShop=function(){sGrantTools(false);return _o.apply(this,arguments)}}

/* ---------- 特許の図面（10Fでノクスが渡す）：工具の練度 Lv6〜10 が要る ---------- */
const PT=[ // [id, 名前, 種類, 部位, 加工, 要る練度, 材料, 効果]
 ['pt_engine','黒閃ロータリーエンジン','armor','feet',['block','quench'],6,{carbon:4,cell:3,core:3},'移動の速さ+10%（ほかの足の装備より速い）'],
 ['pt_osc',   '雷眼オシロスコープ',   'armor','head',['edm'],7,{cell:4,titan:3,core:3},'ボスに与えるダメージ+12%（弱点が見える）'],
 ['pt_aebs',  '鉄壁AEBS',            'armor','body',['mirror'],7,{titan:4,carbon:3,core:3},'体力が3割以下のとき、受けるダメージ−25%（ぶつかる直前に守る）'],
 ['pt_nut',   '不動ハードロックナット','armor','feet',['quench'],6,{titan:3,carbon:3,core:2},'受けるダメージ−8%（ゆるまない・ひるまない）'],
 ['pt_scope', 'アウル・スコープ',     'gen',  null,  ['laser','mirror'],8,{cell:4,carbon:4,core:4},'汎用武器の枠を1つ使う。攻撃はしない。アウルムの近くをタップすると、正体が数秒見える（その間だけダメージが通る）']];
const PT_FX={};
PT.forEach(([id,n,kind,slot,ps,lv,mats,fx])=>{RECIPES[id]={n,kind,tier:5,vol:3,secret:true,patent:true,needLv:lv,mats,shape:'ch',area:'s4',proc:ps[0],procs:ps.length>1?ps:undefined,tools:[...new Set(ps.flatMap(p=>PROC_MAIN[p]))],quiz:'net',...(slot?{slot}:{}),...(kind==='gen'?{impl:'scope'}:{})};
 if(!RECIPES[id].procs)delete RECIPES[id].procs;RECIPE_ORDER.push(id);PT_FX[id]=fx});
Object.assign(ARMOR_IC,{pt_engine:'pt_rotary',pt_osc:'pt_oscillo',pt_aebs:'pt_aebs',pt_nut:'pt_hardlock'});GEN_IC.pt_scope='pt_owlscope';
ATK.scope={n:'アウル・スコープ',type:'正体を明かす',ic:'pen',d:['攻撃はしない。アウルムの近くをタップすると、ゆがみがはがれて正体が数秒見える','','','','','']};TYPE_IC['正体を明かす']='pt_owlscope';
J_NET_LV.s4=2;
/* 要る練度 */
const ptLack=R=>R&&R.needLv?R.tools.filter(t=>hasTool(t)&&tlv(t)<R.needLv):[];
{const _c=canMake;canMake=function(id){const r=_c(id),R=RECIPES[id],l=ptLack(R);if(l.length){r.ok=false;r.lackLv=l}return r}}
{const _rf=recipeFx;recipeFx=function(R){let o=_rf(R);const id=Object.keys(RECIPES).find(k=>RECIPES[k]===R);if(id==='pt_scope')o=o.filter(([k])=>!['強くなると','使いかた','威力'].includes(k));if(PT_FX[id])o.push(['特許の効果',PT_FX[id]]);
 if(R.needLv)o.push(['要る練度',R.tools.map(t=>`${TOOLS[t].n} Lv${R.needLv}以上（いま ${G.tools.includes(t)?'Lv'+tlv(t):'持っていない'}）`).join('<br>')]);return o}}
/* 10Fをこえたら、特許の図面（要解読）を受け取る */
{const _cf=commitFloor;commitFloor=function(fl){const r=_cf(fl);if(towerAt()==='sougi'&&fl>=10&&V3_OPEN){G.bpRaw=G.bpRaw||[];PT.forEach(([id])=>{if(!G.bps.includes(id)&&!G.bpRaw.includes(id))G.bpRaw.push(id)});save()}return r}}
/* 効き目 */
{const _ab=teamAb;teamAb=function(){const a=_ab();if(typeof armId==='function'){if(armId('feet')==='pt_engine')a.wspd=(a.wspd||0)+.1;if(armId('feet')==='pt_nut')a.cut=(a.cut||0)+.08}return a}}
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(e&&e.boss&&typeof armId==='function'&&armId('head')==='pt_osc')d*=1.12;return _fd(e,d,kx,ky)}}
{const _h=fHurt;fHurt=function(v,src){v=_h(v,src);if(typeof armId==='function'&&armId('body')==='pt_aebs'&&FD&&FD.hp<FD.maxhp*.3)v*=.75;return v}}

/* ---------- アウル・スコープ：攻撃はしない（技にならない）。20Fのアウルムで、タップした場所の正体を明かす ---------- */
{const _s=startFloor;startFloor=function(fl){const r=_s.apply(this,arguments);if(FD&&FD.atk&&'scope' in FD.atk)delete FD.atk.scope;return r}}
const scopeOn=()=>typeof genEqList==='function'&&genEqList().includes('pt_scope');
const auBoss=()=>FD&&FD.run&&towerAt()==='sougi'&&FD.boss&&FD.boss.k==='s_aurum'&&FD.boss.hp>0?FD.boss:null;
{let t0=0,x0=0,y0=0;const c=$('fcv');
 c.addEventListener('pointerdown',e=>{t0=performance.now();x0=e.clientX;y0=e.clientY});
 c.addEventListener('pointerup',e=>{const B=auBoss();if(!B||!scopeOn()||FD.paused)return;if(performance.now()-t0>280||Math.hypot(e.clientX-x0,e.clientY-y0)>14)return;
  const wx=FD.x+(e.clientX-fW/2)/fZ,wy=FD.y+(e.clientY-fH/2)/fZ;FD.scopeFx={x:wx,y:wy,t:0};
  if(Math.hypot(wx-B.x,wy-B.y)<B.r+110){FD.reveal=210;tone(1600,.12,'sine',.06,2400);fBanner('正体が見えた！ 今だ！',90,'pt_owlscope')}else tone(500,.08,'triangle',.03)})}
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(e&&e.k==='s_aurum'&&towerAt()==='sougi'&&scopeOn())d*=(FD.reveal>0?1.5:.2);return _fd(e,d,kx,ky)}}
{const _u=fUpdate;fUpdate=function(f){_u(f);if(FD&&FD.run&&!FD.paused){if(FD.reveal>0)FD.reveal-=f;if(FD.scopeFx){FD.scopeFx.t+=f;if(FD.scopeFx.t>24)FD.scopeFx=null}}}}
{const _b=fBossCome;fBossCome=async function(){const r=await _b.apply(this,arguments);if(auBoss()&&scopeOn())setTimeout(()=>{if(auBoss())fBanner('アウル・スコープ：アウルムの近くをタップすると正体が見える。見えている間だけダメージが通る',300,'pt_owlscope')},600);return r}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const B=auBoss();if(!B||!scopeOn())return;g.save();
 if(D.reveal>0){g.globalAlpha=.8;g.strokeStyle='#ffe066';g.lineWidth=4;g.beginPath();g.arc(B.x,B.y,B.r+18,-Math.PI/2,-Math.PI/2+TAU*D.reveal/210);g.stroke()}
 else{for(let i=0;i<6;i++){g.globalAlpha=.35;g.fillStyle=i%2?'#c060ff':'#ff40c0';const y=B.y-B.r+Math.random()*B.r*2;g.fillRect(B.x-B.r-10+Math.random()*16,y,B.r*2+Math.random()*20,4+Math.random()*6)}}
 if(D.scopeFx){const k=D.scopeFx.t/24;g.globalAlpha=1-k;g.strokeStyle='#ffd25a';g.lineWidth=3;g.beginPath();g.arc(D.scopeFx.x,D.scopeFx.y,20+60*k,0,TAU);g.stroke()}g.restore()}}
