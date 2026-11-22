/* ---------- 塔に入るたびに、その塔のはじまりの話を出す（3.1.7） ----------
   はじめての時は、もとの処理が出す（ここでは何もしない）。2回目からはここで出す。会話の「スキップ」で飛ばせる。
   マイスターの塔は、はじまりの話がゲームの最初の物語なので出さない。 */
{const _g=goFloor;goFloor=async function(f){const F=G.flags||{},tw=towerAt();
 const O=tw==='judge'&&F.j_open?[J_OPEN,'ev_j_open']:tw==='sougi'&&F.s_open?[S_OPEN,'ev_s_arrive']:tw==='inf'&&F.infOpen?[storyFit(INF_OPEN,null,['mouse','robot','takumi','wolf']),'ev_inf_open']:null;
 if(O){audio();await talk(O[0],O[1])}return _g.apply(this,arguments)}}
