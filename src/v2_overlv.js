/* =====================================================================
   技のLv6〜（3.0.1）：★で上限が上がった分は「手数」が増える
   ・Lv5をこえた1つごとに、攻撃の間隔が約15%ずつ短くなる（クールダウンが速く進む）
   ・技の説明に Lv6〜14 の行を足す
   ===================================================================== */
const OVER_STEP=.15;
Object.values(ATK).forEach(A=>{if(!A||!Array.isArray(A.d))return;while(A.d.length<ATK_MAX)A.d.push('威力アップ');for(let L=A.d.length;L<ATK_MAX+9;L++)A.d.push(`手数+${Math.round(OVER_STEP*100)}%（攻撃の間隔が短くなる。Lv${L+1}で合計+${Math.round(OVER_STEP*100*(L+1-ATK_MAX))}%）`)});
{const _fa=fAttacks;fAttacks=function(f){const D=FD;if(D&&D.atk&&D.cd){for(const k in D.atk){const L=D.atk[k]|0;if(L>ATK_MAX&&D.cd[k]>0)D.cd[k]-=f*OVER_STEP*(L-ATK_MAX)}}return _fa(f)}}
/* いつも出ている技（周回・光輪・輪など）は手数が変わらないので、Lv6からは威力+20%ずつ（シオン・ぷかりは範囲も+5%ずつ）（3.0.2） */
const OVER_CONT=['fox','kurogane','lionex','seraph','hakurou','fairy','tako','shion','pukari'],OVER_POW=.2,OVER_RNG=.05;
const overRng=k=>{const L=FD&&FD.atk?FD.atk[k]|0:0;return L>ATK_MAX?1+OVER_RNG*(L-ATK_MAX):1};
OVER_CONT.forEach(k=>{const A=ATK[k];if(!A)return;for(let L=ATK_MAX;L<A.d.length;L++){const n=L+1-ATK_MAX;A.d[L]=`威力+${OVER_POW*100}%${['shion','pukari'].includes(k)?`・範囲+${OVER_RNG*100}%`:''}（Lv${L+1}で合計 威力+${Math.round(OVER_POW*100*n)}%）`}});
{const _x=fPowX;fPowX=function(id){let m=_x(id);const L=FD&&FD.atk?FD.atk[id]|0:0;if(L>ATK_MAX&&OVER_CONT.includes(id))m*=1+OVER_POW*(L-ATK_MAX);return m}}
