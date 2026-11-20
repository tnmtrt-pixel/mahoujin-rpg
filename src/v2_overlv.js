/* =====================================================================
   技のLv6〜（3.0.1）：★で上限が上がった分は「手数」が増える
   ・Lv5をこえた1つごとに、攻撃の間隔が約15%ずつ短くなる（クールダウンが速く進む）
   ・技の説明に Lv6〜14 の行を足す
   ===================================================================== */
const OVER_STEP=.15;
Object.values(ATK).forEach(A=>{if(!A||!Array.isArray(A.d))return;while(A.d.length<ATK_MAX)A.d.push('威力アップ');for(let L=A.d.length;L<ATK_MAX+9;L++)A.d.push(`手数+${Math.round(OVER_STEP*100)}%（攻撃の間隔が短くなる。Lv${L+1}で合計+${Math.round(OVER_STEP*100*(L+1-ATK_MAX))}%）`)});
{const _fa=fAttacks;fAttacks=function(f){const D=FD;if(D&&D.atk&&D.cd){for(const k in D.atk){const L=D.atk[k]|0;if(L>ATK_MAX&&D.cd[k]>0)D.cd[k]-=f*OVER_STEP*(L-ATK_MAX)}}return _fa(f)}}
