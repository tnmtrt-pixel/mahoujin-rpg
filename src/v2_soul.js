/* =====================================================================
   特別なキャラ「ソウル」（プレゼントコード限定・★5）
   ・設定：無限の塔を建てた時代のマイスターのひとり。始原の陣に残った記憶が、形になって現れた（幽霊のような姿）。錆が効かない。
     青い鬼火と、飛ぶ斬撃で戦う。いたずら好きで、よく笑う。昔のことは多くを語らない（2.0.15 で設定を合わせた）
   ・ガチャに出ない・図鑑に出ない（SECRET_CH）。工房でつくる武器もない（はじめから持っている「幽霊の刀」だけ）
   ・刀は工具ではないので、「工具を武器にしない」ルールにはふれない
   ===================================================================== */
const SECRET_CH=['soul'];
CHARS.soul={name:'ソウル',img:'img/soul.webp',job:'sekkei',pass:{n:'錆の効かない体',d:'',k:''},sp:{n:'',d:'',shape:'yami'},art:'img/soul_act1.webp',secret:true,
 lines:['ケケッ、錆？ そんなの効かないよ。ボクはずっと昔の……ま、記憶みたいなもんだからね。']};
TYPE_IC['斬撃']='w_soul';
ATK.soul={n:'蒼炎斬',type:'斬撃',ic:'pen',d:['青い炎の斬撃を飛ばす。遠くまで飛び、当たった敵をすべて斬る','2本同時に飛ばす','威力アップ','飛ばす間隔が短くなる','3本になり、斬撃が大きく、通った跡に鬼火が残る']};
ABD.rustRes=v=>`錆の大波・判決の時のダメージ−${Math.round(v*100)}%`;
ABIL.soul=ab4(['teamAtk',.08],['cut',.08],['regen',1],['rustRes',.5]);
WNAME.soul='刀';BASEW.soul='幽霊の刀';

/* 技：飛ぶ斬撃（青い炎の三日月）。Lv5 は通った跡に鬼火が残る */
function soulAttack(f){const D=FD,A=D.atk;if(!A.soul)return;const V=D.sl||(D.sl={cuts:[],fires:[]}),L=A.soul,c=D.cd;
 c.soul=(c.soul||0)-f;
 if(c.soul<=0){const t=nearestFoes(1,D.x,D.y,560)[0];const a=t?Math.atan2(t.y-D.y,t.x-D.x):(D.mva!=null?D.mva:-Math.PI/2);
  const n=L>=5?3:L>=2?2:1,R=L>=5?38:28,dmg=16*(L>=3?1.4:1)*fPow('soul');
  for(let i=0;i<n;i++){const aa=a+(n>1?(i-(n-1)/2)*.2:0);V.cuts.push({x:D.x,y:D.y-14,vx:Math.cos(aa)*8,vy:Math.sin(aa)*8,a:aa,life:95,R,dmg,hit:new Set(),tr:0})}
  tone(520,.08,'sawtooth',.04,260);c.soul=(L>=4?42:58)*fCd()}
 for(const s of V.cuts){s.x+=s.vx*f;s.y+=s.vy*f;s.life-=f;
  for(const e of D.foes){if(e.hp<=0||s.hit.has(e.id))continue;if((e.x-s.x)**2+(e.y-s.y)**2<(e.r+s.R)**2){s.hit.add(e.id);fDamage(e,s.dmg,s.vx*.5,s.vy*.5)}}
  if(L>=5){s.tr+=f;if(s.tr>=9){s.tr=0;V.fires.push({x:s.x,y:s.y,t:0,life:100,dmg:s.dmg*.12})}}}
 V.cuts=V.cuts.filter(s=>s.life>0);
 for(const p of V.fires){const tick=Math.floor((p.t+f)/20)!==Math.floor(p.t/20);p.t+=f;if(tick)for(const e of D.foes)if((e.x-p.x)**2+(e.y-p.y)**2<(e.r+20)**2)fDamage(e,p.dmg,0,0)}
 V.fires=V.fires.filter(p=>p.t<p.life);if(V.fires.length>60)V.fires.splice(0,V.fires.length-60)}
{const _fa=fAttacks;fAttacks=function(f){_fa(f);soulAttack(f)}}
{const _d=fDrawExtra;fDrawExtra=function(g,D){_d(g,D);const V=D.sl;if(!V)return;const t=D.t;g.save();
 for(const p of V.fires){const k=1-p.t/p.life;g.globalAlpha=.75*k;const r=10+6*Math.sin(t*12+p.x);
  const gr=g.createRadialGradient(p.x,p.y-4,1,p.x,p.y,r+8);gr.addColorStop(0,'#e8fbff');gr.addColorStop(.4,'#5ac8ff');gr.addColorStop(1,'#1a4aff00');g.fillStyle=gr;
  g.beginPath();g.ellipse(p.x,p.y-6,r*.7,r+6,0,0,TAU);g.fill()}
 for(const s of V.cuts){const k=Math.min(1,s.life/20);g.save();g.translate(s.x,s.y);g.rotate(s.a);g.globalAlpha=k;
  g.shadowColor='#3aa8ff';g.shadowBlur=14;
  g.fillStyle='#2f6bff';g.beginPath();g.arc(-s.R*.55,0,s.R*1.25,-1.15,1.15);g.arc(-s.R*1.15,0,s.R*1.05,1.05,-1.05,true);g.closePath();g.fill();
  g.fillStyle='#bff0ff';g.beginPath();g.arc(-s.R*.45,0,s.R*1.15,-.9,.9);g.arc(-s.R*.85,0,s.R*1.0,.85,-.85,true);g.closePath();g.fill();g.restore()}
 g.restore()}}
{const _s=startFloor;startFloor=function(fl){const r=_s(fl);if(FD)FD.sl=null;return r}}

/* 強化版の専用武器（図面はプレゼントコードだけで手に入る。塔では出ない＝area:'gift'。図鑑には持ってから出る） */
RECIPES.soul_up={n:'蒼炎刀・鬼火丸',kind:'weapon',who:'soul',tier:4,mats:{titan:3,carbon:2,core:2},area:'gift',shape:'yami',proc:'hit',procs:['hit','grind'],tools:['anvil','grinder'],secret:true};
RECIPE_ORDER.push('soul_up');
