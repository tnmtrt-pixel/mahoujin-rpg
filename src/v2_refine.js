/* =====================================================================
   素材のバランス（決定 11/20：D＝強い装備は素材を多く使う＋余った素材は「精錬」で上の素材に）
   ・段階3＝2倍、段階4＝2.5倍、段階5＝3倍（特許の装備は2倍）。段階1〜2はそのまま
   ・工房に「精錬」タブ：基本の素材をまとめてチタン・蓄電池・カーボン繊維に、さらに錆の核に変えられる
   ・伝説（マイスター）の装備は、特殊な素材（記憶合金・共鳴基板・蒼炎晶）を使う。特殊な素材は精錬で、基本の素材と無限の塔の素材を組み合わせて作る（V3_OPEN の間だけ）
   ===================================================================== */
{const MUL={3:2,4:2.5,5:3};RECIPE_ORDER.forEach(id=>{const R=RECIPES[id];if(!R||R.legend||R.matScaled)return;const m=R.patent?2:MUL[R.tier];if(!m)return;
 Object.keys(R.mats).forEach(k=>R.mats[k]=Math.ceil(R.mats[k]*m));R.matScaled=1})}
/* 特殊な素材（伝説の装備用） */
Object.assign(MATS,{
 kioku: {n:'記憶合金',d:'チタンに記憶の結晶とノイズを溶かしこんだ合金。形を覚えている。伝説の装備に使う'},
 kyomei:{n:'共鳴基板',d:'蓄電池と基板に記憶の結晶を焼きつけた基板。昔の陣とひびき合う。伝説の装備に使う'},
 souen: {n:'蒼炎晶',  d:'カーボン繊維と黒曜石・うろこを、記憶の結晶で固めた青い結晶。伝説の装備に使う'}});
Object.assign(UI_IC,{kioku:'m_steel',kyomei:'m_board',souen:'m_obsid'});
const REF_SPECIAL=['kioku','kyomei','souen'];
if(V3_OPEN){REF_SPECIAL.forEach(k=>{if(!MAT_ORDER.includes(k))MAT_ORDER.splice(MAT_ORDER.indexOf('core'),0,k)});
 Object.assign(RECIPES.mt_kura.mats={},{kioku:3,core:6});Object.assign(RECIPES.mt_tako.mats={},{kioku:2,kyomei:2,core:6});Object.assign(RECIPES.mt_fairy.mats={},{kyomei:3,core:6});
 Object.assign(RECIPES.mt_shadow.mats={},{kyomei:2,souen:2,core:8});Object.assign(RECIPES.mt_soul.mats={},{souen:3,kioku:2,core:8})}
/* 精錬のレシピ */
const REFINE=[
 {g:'基本の素材 → 上の素材',in:{scrap:6},out:'titan'},{in:{bolt:6},out:'titan'},{in:{plate:4},out:'titan'},{in:{gear:5},out:'titan'},
 {in:{wire:5},out:'cell'},{in:{board:4},out:'cell'},{in:{spring:5},out:'cell'},
 {in:{oil:6},out:'carbon'},{in:{rubber:5},out:'carbon'},{in:{brass:4},out:'carbon'},
 {g:'上の素材 → 錆の核',in:{titan:3,cell:2,carbon:2},out:'core'},
 ...(V3_OPEN?[{g:'特殊な素材（伝説の装備用）',in:{titan:6,mcrys:8,noise:2},out:'kioku'},{in:{cell:6,board:4,mcrys:8,noise:2},out:'kyomei'},{in:{carbon:6,obsid:2,scale:2,mcrys:8,noise:3},out:'souen'}]:[])];
const refMax=r=>Math.min(...Object.entries(r.in).map(([k,n])=>Math.floor((G.mats[k]||0)/n)));
function refineHTML(){let h=`<div class="note">同じ素材がたまったら、まとめて上の素材に変えられる。強い装備ほど、たくさんの素材を使う。</div>`;
 REFINE.forEach((r,i)=>{if(r.g)h+=`<div style="font-weight:800;margin:10px 0 4px">${r.g}</div>`;const mx=refMax(r);
  h+=`<div class="rcp"><div class="rh" style="align-items:center;gap:6px;flex-wrap:wrap"><span style="flex:1;display:flex;gap:6px;align-items:center;flex-wrap:wrap">${Object.entries(r.in).map(([k,n])=>`<span class="${(G.mats[k]||0)>=n?'':'lk'}" style="white-space:nowrap">${MIC(k,22)}${MATS[k].n}×${n}<small style="opacity:.7">（${G.mats[k]||0}）</small></span>`).join('＋')}
   <b style="color:var(--gold)">→ ${MIC(r.out,26)}${MATS[r.out].n}</b><small style="opacity:.7">（${G.mats[r.out]||0}）</small></span>
   <span style="display:flex;gap:4px"><button class="btn" data-rf="${i}" data-rn="1" ${mx<1?'disabled':''} style="width:auto;margin:0;padding:8px 10px;font-size:14px">1つ</button><button class="btn" data-rf="${i}" data-rn="${mx}" ${mx<2?'disabled':''} style="width:auto;margin:0;padding:8px 10px;font-size:14px">まとめて${mx>1?'×'+mx:''}</button></span></div></div>`});
 return h}
function doRefine(i,n){const r=REFINE[i];n=Math.min(n|0,refMax(r));if(n<1)return;Object.entries(r.in).forEach(([k,v])=>G.mats[k]-=v*n);G.mats[r.out]=(G.mats[r.out]||0)+n;save();tone(880,.15,'triangle',.1,1320);renderShop();say(`${MIC(r.out,30)} ${MATS[r.out].n}を ${n} 個つくった！`,900)}
{const _r=renderShop;renderShop=function(){if(G&&G.mats)MAT_ORDER.forEach(k=>{if(G.mats[k]==null)G.mats[k]=0});const ref=shopTab==='ref';if(ref)shopTab='__ref';_r.apply(this,arguments);if(ref)shopTab='ref';
 const tabs=$('shopBody').querySelector('.stabs');if(tabs&&!tabs.querySelector('[data-t2="ref"]')){const b=document.createElement('button');b.className='stab'+(ref?' on':'');b.dataset.t2='ref';b.textContent='精錬';
  const rec=tabs.querySelector('[data-t="rec"]');tabs.insertBefore(b,rec);b.onclick=()=>{shopTab='ref';renderShop()}}
 if(ref){$('shopBody').insertAdjacentHTML('beforeend',refineHTML());$('shopBody').querySelectorAll('[data-rf]').forEach(b=>b.onclick=()=>doRefine(+b.dataset.rf,+b.dataset.rn))}}}
