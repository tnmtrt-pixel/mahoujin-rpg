/* =====================================================================
   第2章の装備：審判の塔の素材3種・段階5（伍）の審判シリーズ防具・ガチャ vol.2 の限定
   ・白の防具（3つ）＝審判の塔で図面が見つかる。黒の防具（3つ）＝図面ガチャ vol.2 の限定（強さは同じ＋追加の効果）
   ・同じ色を3か所そろえるとセット効果。白＝回復と守り、黒＝攻撃
   ・工具ガチャ vol.2 の限定＝中級工具の上位版4つ（持っていると元の工具のかわりに使い、その加工の点数+5）
   ・すべて V2_OPEN の間だけ見える（審判の塔とガチャ vol.2 が開いているときだけ手に入る）
   ===================================================================== */
/* ---------- 素材 ---------- */
Object.assign(MATS,{
 obsid: {n:'黒曜石',d:'黒く光る火山のガラス。審判の塔の下の層（開廷・天秤）に多い。段階5の装備に使う'},
 silver:{n:'銀',    d:'白く光るさびにくい金属。審判の塔の中の層（黙秘・陪審）に多い。段階5の装備に使う'},
 scale: {n:'うろこ',d:'天秤の番人たちが落とす硬いうろこ。審判の塔の上の層（書庫・雷鳴・玉座）に多い。段階5の装備に使う'}});
MAT_ORDER.splice(MAT_ORDER.indexOf('core'),0,'obsid','silver','scale');
Object.assign(MAT_ATTR,{obsid:'fire',silver:'steel',scale:'wind'});
Object.assign(UI_IC,{obsid:'m_obsid',silver:'m_silver',scale:'m_scale'});
[['jk','obsid'],['jt','obsid'],['jm','silver'],['jb','silver'],['js','scale'],['jr','scale'],['jg','scale']].forEach(([k,m])=>{if(FAREA[k])FAREA[k].drop={...FAREA[k].drop,[m]:.009}});
{const FM=TW_TABLE.judge.FLOOR_MATS;for(let f=1;f<=20;f++){const m=f<=6?'obsid':f<=13?'silver':'scale';FM[f]=[m,(FM[f]||[])[0]||'titan']}}
/* 公開版で、審判の塔の素材を一覧に出さない */
if(!V2_OPEN)['obsid','silver','scale'].forEach(k=>{const i=MAT_ORDER.indexOf(k);if(i>=0)MAT_ORDER.splice(i,1)});

/* ---------- 段階5（伍） ---------- */
TIER_MUL[5]=3.4;KANJI_TIER[5]='伍';
const JD_ARM=[ // [id, 名前, 部位, 図面のエリア／限定, 加工, 材料]
 ['jw_head','白天秤の冠','head','jm',['hit','weld'],{obsid:3,silver:3,core:3}],
 ['jw_body','白の法衣','body','js',['cut','wire'],{obsid:2,silver:3,scale:2,core:3}],
 ['jw_feet','白翼のブーツ','feet','jr',['trace','weld'],{silver:2,scale:3,core:3}],
 ['jb_head','黒天秤の冠','head',null,['hit','weld'],{obsid:4,silver:3,core:3}],
 ['jb_body','黒の法衣','body',null,['cut','wire'],{obsid:3,silver:2,scale:3,core:3}],
 ['jb_feet','黒翼のブーツ','feet',null,['trace','weld'],{obsid:2,scale:3,core:3}]];
JD_ARM.forEach(([id,n,slot,area,ps,mats])=>{RECIPES[id]={n,kind:'armor',slot,tier:5,mats,shape:'ch',proc:ps[0],procs:ps,tools:[...new Set(ps.flatMap(p=>PROC_MAIN[p]))],
 area:area||'gacha2',...(area?{}:{limited:true,vol:2})};RECIPE_ORDER.push(id)});
Object.assign(ARMOR_IC,{jw_head:'ar_jdcrown',jw_body:'ar_jdrobe',jw_feet:'ar_jdboots',jb_head:'ar_jdcrown_b',jb_body:'ar_jdrobe_b',jb_feet:'ar_jdboots_b'});
/* 黒の追加効果（説明） */
const JB_FX={jb_head:'ボスに与えるダメージ+10%',jb_body:'審判の塔の階のルール（黒い床・雷）で受けるダメージ−30%',jb_feet:'移動の速さ+8%'};
{const _rf=recipeFx;recipeFx=function(R){const o=_rf(R);const id=Object.keys(RECIPES).find(k=>RECIPES[k]===R);
 if(JB_FX[id])o.push(['黒の効果',JB_FX[id]]);if(/^j[wb]_/.test(id||''))o.push(['セット',`${id[1]==='w'?'白':'黒'}の3つ（冠・法衣・ブーツ）をそろえると：${id[1]==='w'?'10秒ごとの回復+2・受けるダメージ−5%':'チームの攻撃+10%'}`]);return o}}
const armId=s=>G.arm&&G.arm[s]&&G.arm[s].rid;
const armSet=c=>['head','body','feet'].every(s=>(armId(s)||'').startsWith('j'+c+'_'));
/* 効き目 */
{const _ab=teamAb;teamAb=function(){const a=_ab();if(armId('feet')==='jb_feet')a.wspd=(a.wspd||0)+.08;
 if(armSet('w')){a.regen=(a.regen||0)+2;a.cut=(a.cut||0)+.05}if(armSet('b'))a.teamAtk=(a.teamAtk||0)+.1;return a}}
jRuleRes=()=>armId('body')==='jb_body'?.7:1;
{const _fd=fDamage;fDamage=function(e,d,kx,ky){if(e&&e.boss&&armId('head')==='jb_head')d*=1.1;return _fd(e,d,kx,ky)}}

/* ---------- 工具ガチャ vol.2：中級工具の上位版（限定） ---------- */
Object.assign(TOOLS,{
 tsolder:{n:'温調はんだごて',d:'限定。はんだごての上位版。配線の点数+5',limited:true,up:'solder',vol:2},
 radial: {n:'ラジアルボール盤',d:'限定。ボール盤の上位版。穴あけの点数+5',limited:true,up:'drill',vol:2},
 hcrimp: {n:'油圧圧着工具',d:'限定。電工ペンチの上位版。配線の点数+5',limited:true,up:'pliers',vol:2},
 sgrind: {n:'平面研削盤',d:'限定。グラインダーの上位版。削るの点数+5',limited:true,up:'grinder',vol:2}});
const LIM_TOOLS2=['tsolder','radial','hcrimp','sgrind'];
Object.assign(UI_IC,{tsolder:'t_tsolder',radial:'t_radial',hcrimp:'t_hcrimp',sgrind:'t_sgrind'});
LIM_TOOLS2.forEach(k=>{UPG[TOOLS[k].up]=k;if(V2_OPEN&&!TOOL_ORDER.includes(k))TOOL_ORDER.push(k)});
{const _tb=toolBonus;toolBonus=R=>{const pr=procOf(R);return _tb(R)+((pr==='wire'&&(hasLim('tsolder')||hasLim('hcrimp')))||(pr==='drill'&&hasLim('radial'))||(pr==='grind'&&hasLim('sgrind'))?5:0)}}
