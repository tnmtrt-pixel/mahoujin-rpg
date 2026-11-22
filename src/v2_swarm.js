/* =====================================================================
   序盤の群れ（3.0.2）：階に入ってすぐは、弱い敵がたくさん押し寄せて、一掃できる気持ちよさを出す
   ・探索の最初の60秒は、ふつうの湧きに加えて「追加の湧き」（ふつうの1.5倍ぶん）と、10秒ごとの「群れ」（8体が同じ方向から扇形に）
   ・この間に出た敵は体力が少ない（最大で45%）。60〜90秒でだんだん元にもどる
   ・ボス戦・チュートリアル・強敵（大きい敵）は変えない
   ===================================================================== */
const SW={T0:60,T1:90,HP:.45,RATE:1.5,PACK:8,EVERY:600};
const swK=()=>{if(!FD||!FD.run||FD.boss||FD.bossDone||towerAt()==='tut')return 0;const t=fSearchT();return t<=SW.T0?1:t>=SW.T1?0:(SW.T1-t)/(SW.T1-SW.T0)};
{const _s=fSpawn;fSpawn=function(kind,ang,dist){const e=_s.apply(this,arguments);if(e&&!e.big&&!e.boss){const k=swK();if(k>0){const m=1-(1-SW.HP)*k;e.hp*=m;e.max*=m;e.sw=1}}return e}}
{const _u=fUpdate;fUpdate=function(f){_u(f);const D=FD;if(!D||!D.run||D.paused)return;const k=swK();if(k<=0)return;
 const w=waveNow();D.swAcc=(D.swAcc||0)+w[2]*SW.RATE*k*f/60;while(D.swAcc>=1){D.swAcc--;fSpawn(pick(w[1]))}
 D.swT=(D.swT||0)+f;if(D.swT>=SW.EVERY){D.swT=0;const a0=Math.random()*TAU,kind=pick(w[1]),n=Math.round(SW.PACK*(.6+.4*k));
  for(let i=0;i<n;i++)fSpawn(kind,a0+(i-(n-1)/2)*.11,null)}}}
/* 3.2.1：ザコをもっと柔らかく、もっと多く（強敵・ボスはそのまま）。たたら島は自分の波を使うので、出る速さはそのまま */
const MOB={HP:.6,RATE:1.3};
{const _sp=fSpawn;fSpawn=function(kind){const e=_sp.apply(this,arguments);if(e&&!e.big&&!e.boss){e.hp*=MOB.HP;e.max*=MOB.HP}return e}}
{const _w=waveNow;waveNow=function(){const w=_w.apply(this,arguments);return w&&w.length>2?[w[0],w[1],w[2]*MOB.RATE,...w.slice(3)]:w}}
