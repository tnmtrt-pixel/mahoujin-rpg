/* =====================================================================
   匠（第2章のクリアで仲間になる・★3）
   ・第1章で街を暗くした元マイスター。審判を終えて「直し続ける」と決め、仲間になる
   ・技は「再生の陣」：魔法陣の線を地面に描き、線の上の敵を削る。工具は武器にしない（武器は初代マイスターの図面）
   ・ガチャ・図鑑には出ない（SECRET_CH）
   ===================================================================== */
SECRET_CH.push('takumi');
CHARS.takumi={name:'匠',img:'img/takumi.webp',job:'sekkei',pass:{n:'直し続ける',d:'',k:''},sp:{n:'',d:'',shape:'hikari'},secret:true,
 lines:['……今度は、仲間として。ずれても、直し続けるよ。']};
TYPE_IC['陣']='w_takumi';
ATK.takumi={n:'再生の陣',type:'陣',ic:'pen',d:['魔法陣の線を地面に描く。線にふれた敵を削り続ける','線が2本になる','威力アップ','線が長く残る','線が3本の陣になり、描くたびに体力を回復']};
ABIL.takumi=ab4(['teamAtk',.08],['xp',.08],['hp',15],['teamAtk',.15]);
WNAME.takumi='図面';BASEW.takumi='初代マイスターの図面';
function takumiAttack(f){const D=FD,A=D.atk;if(!A.takumi)return;const V=D.tk||(D.tk={lines:[]}),L=A.takumi,c=D.cd;
 c.takumi=(c.takumi||0)-f;
 if(c.takumi<=0){const t=nearestFoes(1,D.x,D.y,380)[0];const a0=t?Math.atan2(t.y-D.y,t.x-D.x):Math.random()*TAU,n=L>=5?3:L>=2?2:1,len=300,dmg=7*(L>=3?1.4:1)*fPow('takumi');
  for(let i=0;i<n;i++){const a=a0+i*TAU/(n===2?4:3),cx=t?t.x:D.x,cy=t?t.y:D.y;
   V.lines.push({x1:cx-Math.cos(a)*len/2,y1:cy-Math.sin(a)*len/2,x2:cx+Math.cos(a)*len/2,y2:cy+Math.sin(a)*len/2,t:0,life:L>=4?240:160,dmg,tick:0})}
  if(L>=5&&typeof v2Heal==='function')v2Heal(2);
  tone(784,.1,'sine',.04,1175);c.takumi=110*fCd()}
 for(const l of V.lines){l.t+=f;l.tick+=f;if(l.tick>=15){l.tick=0;const dx=l.x2-l.x1,dy=l.y2-l.y1,ll=dx*dx+dy*dy;
   for(const e of D.foes){let u=((e.x-l.x1)*dx+(e.y-l.y1)*dy)/ll;u=Math.max(0,Math.min(1,u));const px=l.x1+dx*u,py=l.y1+dy*u;if((e.x-px)**2+(e.y-py)**2<(e.r+14)**2)fDamage(e,l.dmg,0,0)}}}
 V.lines=V.lines.filter(l=>l.t<l.life)}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);takumiAttack(f)}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.tk;if(!V)return;g.save();
 for(const l of V.lines){const k=Math.min(1,l.t/10),fade=1-Math.max(0,(l.t-l.life+30)/30);g.globalAlpha=fade;g.lineCap='round';
  const mx=l.x1+(l.x2-l.x1)*k,my=l.y1+(l.y2-l.y1)*k;
  g.strokeStyle='#5aa8ff';g.lineWidth=12;g.globalAlpha=fade*.35;g.beginPath();g.moveTo(l.x1,l.y1);g.lineTo(mx,my);g.stroke();
  g.globalAlpha=fade;g.strokeStyle='#e8f6ff';g.lineWidth=4;g.beginPath();g.moveTo(l.x1,l.y1);g.lineTo(mx,my);g.stroke();
  g.fillStyle='#ffd25a';[[l.x1,l.y1],[mx,my]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,5,0,TAU);g.fill()})}
 g.restore()}}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(FD)FD.tk=null;return r}}

FACES.takumi=['smile','worry','serious'];
