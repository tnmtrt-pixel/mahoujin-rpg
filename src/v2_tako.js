/* =====================================================================
   特別なキャラ「タコナイン」（プレゼントコード限定・★5）
   ・設定：無限の塔を建てた時代のマイスター（始原の陣に残った記憶が形になった）。王冠のリーダーと8匹の子分、9匹そろって1人の仲間。隊列を組んで戦う
   ・技「タコ隊列」：リーダーのまわりに子分が並び、それぞれの武器で近くの敵を攻撃
     数はレベルで増える（2→4→5→6→8匹）。体力が減ると目を回して抜ける（最低2匹）。回復すると戻る
     数が減ると残ったタコの攻撃が速くなる（半分でも強さ約7割）
   ・武器は剣・弓・槍・斧・刀・杖・墨鉄砲・墨玉（工具は使わない）
   ・ガチャ・図鑑には出ない（SECRET_CH）。専用武器「タコナインの武器セット」
   ===================================================================== */
SECRET_CH.push('tako');
CHARS.tako={name:'タコナイン',img:'img/tako.webp',job:'kaji',pass:{n:'九匹の隊列',d:'',k:''},sp:{n:'',d:'',shape:'mizu'},art:'img/tako.webp',secret:true,
 lines:['タコナイン、ここに参上！ 九匹そろえば錆なんかこわくないタコ！ 全員、隊列を組めー！']};
TYPE_IC['隊列']='w_tako';
ATK.tako={n:'タコ隊列',type:'隊列',ic:'pen',d:['リーダーのまわりに子分のタコが並び、それぞれの武器で攻撃する（2匹）。体力が減ると目を回して抜ける','子分が4匹になる','子分が5匹になり、威力アップ','子分が6匹になり、威力アップ','子分が8匹そろい、威力アップ']};
ABD.fullAtk=v=>`体力が満タンのとき攻撃+${Math.round(v*100)}%`;
ABIL.tako=ab4(['teamAtk',.08],['cut',.08],['hp',.08],['fullAtk',.15]);
WNAME.tako='武器セット';BASEW.tako='タコナインの武器セット';
/* 子分：1剣 2弓 3槍 4斧 5刀 6杖 7墨鉄砲 8墨玉。加わる順番 */
const TAKO_JOIN=[1,2,3,6,4,7,5,8],TAKO_N=[2,4,5,6,8];
const TAKO_W={1:{m:1,cd:50,d:11},2:{m:0,cd:56,d:9,sp:9,c:'#c08040'},3:{m:1,cd:58,d:13,reach:86},4:{m:1,cd:70,d:17},5:{m:1,cd:46,d:10},6:{m:0,cd:64,d:12,sp:6,c:'#4ac8ff'},7:{m:0,cd:42,d:6,sp:8,c:'#2a1838',slow:1},8:{m:0,cd:90,d:14,sp:5,c:'#1a1220',boom:1}};
function takoAttack(f){const D=FD,A=D.atk;if(!A.tako)return;const L=A.tako;
 const V=D.tko||(D.tko={m:[],b:[],fx:[],ink:[],n:0});
 const full=TAKO_N[Math.min(5,L)-1],ratio=Math.max(0,D.hp/D.maxhp),n=Math.max(Math.min(2,full),Math.min(full,Math.ceil(full*ratio-1e-6)));
 while(V.m.length<full){const id=TAKO_JOIN[V.m.length];V.m.push({id,cd:20+V.m.length*7,on:true,pop:0,sw:0})}
 const pw=fPow('tako')*(L>=5?1.5:L>=4?1.35:L>=3?1.2:1),spd=Math.sqrt(n/full);
 V.m.forEach((m,i)=>{const a=-Math.PI/2+i*TAU/full,want=i<n;m.x=D.x+Math.cos(a)*50;m.y=D.y-8+Math.sin(a)*40;
  if(m.on&&!want){m.on=false;V.fx.push({x:m.x,y:m.y,vx:Math.cos(a)*2.2,vy:Math.sin(a)*1.6-1.5,t:0});tone(500,.12,'triangle',.04,180)}
  if(!m.on&&want){m.on=true;m.pop=14;tone(660,.06,'sine',.04,990)}
  if(m.pop>0)m.pop-=f;if(m.sw>0)m.sw-=f;
  if(!m.on)return;m.cd-=f;if(m.cd>0)return;const W=TAKO_W[m.id];
  const t=nearestFoes(1,m.x,m.y,W.m?(W.reach||70):260)[0];if(!t){m.cd=10;return}
  const ang=Math.atan2(t.y-m.y,t.x-m.x);m.ang=ang;m.sw=10;
  if(W.m){fDamage(t,W.d*pw,Math.cos(ang)*2.5,Math.sin(ang)*2.5);if(m.id===4)for(const e of D.foes)if(e!==t&&e.hp>0&&(e.x-t.x)**2+(e.y-t.y)**2<45*45)fDamage(e,W.d*pw*.6,0,0);
   V.fx.push({sl:1,x:t.x,y:t.y,a:ang,t:0,c:m.id===5?'#e8f0ff':'#ffffff'})}
  else V.b.push({x:m.x,y:m.y,vx:Math.cos(ang)*W.sp,vy:Math.sin(ang)*W.sp,life:70,dmg:W.d*pw,id:m.id,tx:t.x,ty:t.y,c:W.c});
  m.cd=W.cd*spd*fCd()});
 for(const s of V.b){s.x+=s.vx*f;s.y+=s.vy*f;s.life-=f;const W=TAKO_W[s.id];
  if(W.boom){if((s.x-s.tx)**2+(s.y-s.ty)**2<14*14||s.life<=0){for(const e of D.foes)if(e.hp>0&&(e.x-s.x)**2+(e.y-s.y)**2<(e.r+42)**2)fDamage(e,s.dmg,0,0);V.ink.push({x:s.x,y:s.y,t:0});s.life=0}continue}
  for(const e of D.foes){if(e.hp<=0)continue;if((e.x-s.x)**2+(e.y-s.y)**2<(e.r+6)**2){fDamage(e,s.dmg,s.vx*.2,s.vy*.2);if(W.slow)e.trap=Math.max(e.trap||0,40);s.life=0;break}}}
 V.b=V.b.filter(s=>s.life>0);
 for(const p of V.ink){p.t+=f;for(const e of D.foes)if((e.x-p.x)**2+(e.y-p.y)**2<(e.r+30)**2)e.trap=Math.max(e.trap||0,2)}
 V.ink=V.ink.filter(p=>p.t<120);V.fx.forEach(x=>{x.t+=f;if(!x.sl){x.x+=x.vx*f;x.y+=x.vy*f;x.vy+=.12*f}});V.fx=V.fx.filter(x=>x.t<(x.sl?10:50))}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);takoAttack(f)}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.tko;if(!V)return;const t=D.t||0;g.save();
 for(const p of V.ink){const k=Math.min(1,(120-p.t)/30);g.globalAlpha=.55*k;g.fillStyle='#24152e';g.beginPath();g.ellipse(p.x,p.y+6,32,13,0,0,TAU);g.fill()}
 g.globalAlpha=1;
 for(const s of V.b){g.save();g.translate(s.x,s.y);g.rotate(Math.atan2(s.vy,s.vx));
  if(s.id===2){g.strokeStyle='#8a5a2a';g.lineWidth=2;g.beginPath();g.moveTo(-10,0);g.lineTo(8,0);g.stroke();g.fillStyle='#ddd';g.beginPath();g.moveTo(12,0);g.lineTo(6,-3);g.lineTo(6,3);g.fill()}
  else if(s.id===6){g.fillStyle='#4ac8ff';g.shadowColor='#4ac8ff';g.shadowBlur=10;g.beginPath();g.arc(0,0,5,0,TAU);g.fill()}
  else{g.fillStyle=s.c;g.beginPath();g.arc(0,0,s.id===8?7:4,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(-1.5,-1.5,1.5,0,TAU);g.fill()}
  g.restore()}
 V.m.forEach((m,i)=>{if(!m.on||m.x==null)return;const sp=fspr('img/ui/tk_'+m.id+'.webp',30);const sc=m.pop>0?1+.4*Math.sin(m.pop/14*Math.PI):1,h=30*sc,bob=Math.sin(t*10+i)*1.5;
  g.save();g.translate(m.x,m.y+bob);if(m.sw>0&&m.ang!=null)g.translate(Math.cos(m.ang)*m.sw*.6,Math.sin(m.ang)*m.sw*.6);
  if(sp){const w=h*sp.width/sp.height;g.drawImage(sp,-w/2,-h/2,w,h)}else{g.fillStyle='#ff4a4a';g.beginPath();g.arc(0,0,10,0,TAU);g.fill()}g.restore()});
 for(const x of V.fx){if(x.sl){const k=1-x.t/10;g.save();g.translate(x.x,x.y);g.rotate(x.a);g.globalAlpha=k;g.strokeStyle=x.c;g.lineWidth=3;g.beginPath();g.arc(0,0,16,-1.1,1.1);g.stroke();g.restore();continue}
  const sp=fspr('img/ui/tk_dz.webp',30),k=1-Math.max(0,x.t-35)/15;g.save();g.globalAlpha=k;g.translate(x.x,x.y);g.rotate(x.t*.25);
  if(sp){const w=30*sp.width/sp.height;g.drawImage(sp,-w/2,-15,w,30)}g.restore()}
 g.restore()}}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(FD)FD.tko=null;return r}}
/* 体力が満タンのとき攻撃アップ */
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(FD&&FD.ab&&FD.ab.fullAtk&&FD.hp>=FD.maxhp)d*=1+FD.ab.fullAtk;return _fd(e,d,kx,ky)}}
