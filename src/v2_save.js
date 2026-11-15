/* ================= セーブの守り（マイスターの塔 Ver 2.20 を参考） =================
 * ・ファイルに保存：引っ越しコード入りの .txt をダウンロード（iPhone は「ファイル」→「ダウンロード」）
 * ・ファイルから読み込む／コードを書き出す・貼って読み込む：別の端末へ引っ越し
 * ・端末の中の控え：1日1回、起動したときのセーブを3世代まで別の場所（mmrpg2_gen）に残す
 * ・読み込み・控えから戻す前の今のデータは mmrpg2_prev に1つ残す
 * ・7日ファイル保存していなければ、ホームで3日に1回だけ案内する
 * サーバーに預ける機能は、塔2にサーバーがないので入れていない */
const GEN_KEY='mmrpg2_gen',PREV_KEY='mmrpg2_prev',CODE_HEAD='MT2S.';
const sgYmd=t=>new Date(t+9*3600e3).toISOString().slice(0,10);
function saveCode(raw){const b=new TextEncoder().encode(raw);let s='';b.forEach(x=>s+=String.fromCharCode(x));return CODE_HEAD+btoa(s)}
/* コードを読んで、migrate を通った生の文字列を返す（読めなければ例外） */
function readCode(c){c=String(c||'').replace(/\s+/g,'');const i=c.indexOf(CODE_HEAD);if(i<0)throw new Error('head');
 const raw=new TextDecoder().decode(Uint8Array.from(atob(c.slice(i+CODE_HEAD.length)),x=>x.charCodeAt(0)));
 const g=migrate(JSON.parse(raw));if(!g)throw new Error('bad');return JSON.stringify(g)}
function curRaw(){if(G&&!inBattle)save();try{return localStorage.getItem(KEY)}catch(e){return null}}
/* 生の文字列でセーブを入れかえて読みこみ直す（今のデータは mmrpg2_prev へ） */
function applyRaw(raw,msg){try{const now=localStorage.getItem(KEY);if(now)localStorage.setItem(PREV_KEY,now);localStorage.setItem(KEY,raw)}
 catch(e){say('この端末では書きこめませんでした',1600);return}
 saveBlocked=true;closeSheet();say(msg||'セーブデータを読みこみました',1200).then(()=>location.reload())}
function sgSummary(raw){try{const g=JSON.parse(raw);const h=g.party&&g.party[0];const fl=g.floor|0;
 return `${(g.party||[]).length}人`+(h&&h.lv?`・Lv${Math.max(...g.party.map(m=>m.lv||1))}`:'')+(fl?`・最高${fl}F`:'')}catch(e){return''}}
/* 確認パネル（confirm() は出ない場面があるのでゲーム内で聞く） */
function sgAsk(html,yes,onYes){$('sheetT').textContent='確認';
 $('sheetB').innerHTML=`<div style="text-align:center;line-height:1.7;margin:6px 0 10px">${html}</div><button class="btn gold" id="sgY">${yes}</button><button class="btn ghost" id="sgN">やめる</button>`;
 $('sgN').onclick=openSaveGuard;$('sgY').onclick=onYes;$('sheet').classList.add('on')}
function saveFile(){const raw=curRaw();if(!raw){say('まだセーブがありません',1200);return}
 const d=sgYmd(Date.now()),txt=`マイスターの塔2 セーブデータ（${d}）\n設定 →「セーブの守り」→「ファイルから読み込む」で元にもどせます。\n\n${saveCode(raw)}\n`;
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=`meister-tower2-save-${d}.txt`;
 document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);
 OPT.bkF=Date.now();saveOpt();say('セーブをファイルに保存しました<br><span style="font-size:14px">（iPhone は「ファイル」→「ダウンロード」）</span>',2000)}
function loadFile(){const inp=document.createElement('input');inp.type='file';inp.accept='.txt,text/plain';
 inp.onchange=async()=>{const f=inp.files[0];if(!f)return;let raw;try{raw=readCode(await f.text())}catch(e){say('セーブのファイルではないようです',1600);return}
  sgAsk(`このファイルのセーブ（${sgSummary(raw)}）で<br>今のデータを上書きしますか？<br><span style="font-size:13px;opacity:.8">今のデータは「ひとつ前にもどす」で戻せます</span>`,'上書きして読みこむ',()=>applyRaw(raw))};
 inp.click()}
function genList(){try{const g=JSON.parse(localStorage.getItem(GEN_KEY)||'[]');return Array.isArray(g)?g.filter(x=>x&&x.d&&typeof x.c==='string'):[]}catch(e){return[]}}
/* 起動時：読めたセーブだけを1日1回控えに残す。読めなかったときは何も上書きしない */
function saveGuardBoot(){try{if(OPT.bkF===undefined){OPT.bkF=Date.now();saveOpt()}
 if(!G||!SAVE_RAW)return;const d=sgYmd(Date.now()),g=genList();if(g[0]&&g[0].d===d)return;
 g.unshift({d,c:SAVE_RAW});const out=g.slice(0,3);
 try{localStorage.setItem(GEN_KEY,JSON.stringify(out))}catch(e){try{localStorage.setItem(GEN_KEY,JSON.stringify(out.slice(0,1)))}catch(_){}}}catch(e){}}
function openSaveGuard(){const gens=genList();let prev=null;try{prev=localStorage.getItem(PREV_KEY)}catch(e){}
 const last=OPT.bkF&&G?`最後にファイル保存：${sgYmd(OPT.bkF)}`:'';
 $('sheetT').textContent='セーブの守り';
 $('sheetB').innerHTML=`<div class="sg">
  <div class="note">セーブはこのスマホのブラウザの中にあります。ブラウザのデータを消すと消えてしまいます。ときどき<b>ファイルに保存</b>しておくと安心です。</div>
  <div class="sgr"><button class="btn gold" id="sgFile">ファイルに保存</button><button class="btn" id="sgLoad">ファイルから読み込む</button></div>
  ${last?`<div class="note" style="text-align:center">${last}</div>`:''}
  <div class="sgh">端末の中の控え（1日1回・3日分）</div>
  ${gens.length?gens.map((x,i)=>`<div class="sgg"><span>${x.d}<small>${sgSummary(x.c)}</small></span><button class="btn" data-gen="${i}">この日に戻す</button></div>`).join(''):'<div class="note">まだありません（明日から1日1回たまります）</div>'}
  ${prev?`<div class="sgg"><span>ひとつ前のデータ<small>${sgSummary(prev)}</small></span><button class="btn" id="sgPrev">ひとつ前にもどす</button></div>`:''}
  ${G&&!G.flags.inh?'<div class="sgh">マイスターの塔（サイコロ版）から</div><button class="btn" id="sgInh">仲間とコインを引き継ぐ</button>':''}
  <div class="sgh">別の端末へ引っ越し</div>
  <div class="note">コードを書き出してコピーし、移したい端末の「設定 → セーブの守り」に貼って読み込みます。</div>
  <div class="sgr"><button class="btn" id="sgExp">コードを書き出す</button><button class="btn" id="sgCopy" style="display:none">コピー</button></div>
  <textarea id="sgCode" class="sgc" placeholder="MT2S. で始まるコードを貼り付けて「読み込む」" aria-label="セーブコード" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
  <button class="btn" id="sgImp">貼ったコードを読み込む</button>
  </div><button class="btn ghost" id="sgX">閉じる</button>`;
 {const ib=$('sgInh');if(ib)ib.onclick=openInherit}$('sgX').onclick=closeSheet;$('sgFile').onclick=saveFile;$('sgLoad').onclick=loadFile;
 $('sgExp').onclick=()=>{const raw=curRaw();if(!raw){say('まだセーブがありません',1200);return}$('sgCode').value=saveCode(raw);$('sgCopy').style.display=''};
 $('sgCopy').onclick=async()=>{const t=$('sgCode');try{await navigator.clipboard.writeText(t.value);say('コピーしました',900)}catch(e){t.focus();t.select();say('選択しました。長押しでコピーしてください',1500)}};
 $('sgImp').onclick=()=>{const c=$('sgCode').value.replace(/\s+/g,'');if(!c.startsWith(CODE_HEAD)){say('「MT2S.」で始まるコードを貼り付けてください',1600);return}
  let raw;try{raw=readCode(c)}catch(e){say('コードが途中で切れているようです。<br>全部コピーできているか確かめてください',2000);return}
  sgAsk(`このコードのセーブ（${sgSummary(raw)}）で<br>今のデータを上書きしますか？`,'上書きして読みこむ',()=>applyRaw(raw))};
 $('sheetB').querySelectorAll('[data-gen]').forEach(b=>b.onclick=()=>{const x=gens[+b.dataset.gen];
  try{migrate(JSON.parse(x.c))||0}catch(e){say('この控えは読めませんでした',1400);return}
  sgAsk(`${x.d} の控え（${sgSummary(x.c)}）に戻しますか？<br><span style="font-size:13px;opacity:.8">今のデータは「ひとつ前にもどす」で戻せます</span>`,'この日に戻す',()=>applyRaw(x.c,`${x.d} の控えに戻しました`))});
 const pv=$('sgPrev');if(pv)pv.onclick=()=>sgAsk('ひとつ前のデータに戻しますか？','戻す',()=>applyRaw(prev,'ひとつ前のデータに戻しました'));
 $('sheet').classList.add('on')}
/* ホームでほかの表示（シート・会話・ポップアップ）が出ていたら案内しない */
function sgBusy(){const on=id=>{const e=$(id);return e&&e.classList.contains('on')};return on('sheet')||on('talk')||!on('home')||!!document.querySelector('.fov.on,.pop2,.rpop')}
/* こまめに保存の案内：7日ファイル保存していなければ、ホームで3日に1回 */
function bkNag(){if(!G)return;const now=Date.now();if(now-(OPT.bkF||now)<7*86400e3||now-(OPT.bkN||0)<3*86400e3)return;
 if(sgBusy())return;
 OPT.bkN=now;saveOpt();$('sheetT').textContent='💾 セーブをこまめに残そう';
 $('sheetB').innerHTML=`<div class="note" style="line-height:1.7">セーブはこのスマホのブラウザの中にあります。iPhoneのSafariは、しばらく開かないとデータを消すことがあります。<br><b>ファイルに保存</b>しておけば、消えても元にもどせます。</div>
  <button class="btn gold" id="ngF">ファイルに保存</button><button class="btn ghost" id="ngX">あとで</button>`;
 $('ngF').onclick=()=>{closeSheet();saveFile()};$('ngX').onclick=closeSheet;$('sheet').classList.add('on')}
{const _oh=openHome;openHome=function(){const r=_oh.apply(this,arguments);setTimeout(bkNag,700);return r}}
/* ================= マイスターの塔（サイコロ版）からの引き継ぎ =================
 * ・同じブラウザなら自動でサイコロ版のセーブ（okc-save2）を読む。別の端末なら OKS2. のコードかセーブファイルを貼る
 * ・両方にいる仲間：持っていなければ同じ★で仲間に、持っていて★が低ければ★を上げる
 * ・コイン：サイコロ版の所持コインを1:1、上限はガチャ各11連ぶん（11連×ガチャの数）
 * ・1つのセーブで1回だけ（G.flags.inh）。サイコロ版のデータは読むだけで書きかえない */
const DICE_KEY='okc-save2',INH_CAP=GACHA10_COST*GACHA_BANNERS.length;
function diceFromCode(c){c=String(c||'').replace(/\s+/g,'');const i=c.indexOf('OKS2.');if(i<0)throw new Error('head');
 return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(c.slice(i+5)),x=>x.charCodeAt(0))))}
function diceLocal(){try{const r=localStorage.getItem(DICE_KEY);return r?JSON.parse(r):null}catch(e){return null}}
function diceGift(v){if(!v||typeof v!=='object')return null;const o=v.owned&&typeof v.owned==='object'?v.owned:{};
 const chars=GACHA_POOL.filter(id=>o[id]).map(id=>[id,Math.min(3,Math.max(1,Math.floor(+o[id]||1)))]);
 const coins=Math.min(INH_CAP,Math.max(0,Math.floor(+v.coins||0)));return{chars,coins,raw:Math.max(0,Math.floor(+v.coins||0))}}
function inhApply(d){if(!G||G.flags.inh)return;const got=[];
 d.chars.forEach(([id,st])=>{const m=owned(id);
  if(!m){const nm=newMember(id,1);nm.star=st;nm.shard=0;(G.party.length<PARTY_MAX?G.party:G.bench||(G.bench=[])).push(nm);got.push(`${CHARS[id].name} ★${st}（新しく仲間に）`)}
  else if((m.star||1)<st){m.star=st;got.push(`${CHARS[id].name} ★${st}に`)}});
 G.coin=(G.coin|0)+d.coins;G.flags.inh=1;save();closeSheet();
 $('sheetT').textContent='引き継ぎ完了';
 $('sheetB').innerHTML=`<div class="note" style="line-height:1.8;text-align:center">${UIMG('coin',20)} コイン <b>+${d.coins.toLocaleString()}</b><br>${got.length?got.join('<br>'):'仲間：塔2ですでにそろっていました'}</div><button class="btn gold" id="inhOk">OK</button>`;
 $('inhOk').onclick=()=>{closeSheet();if($('home').classList.contains('on'))openHome()};$('sheet').classList.add('on');tone(880,.2,'triangle',.1,1760)}
function inhAsk(d,from){if(!G){say('先に「はじめる」でゲームを始めてください',1600);return}
 if(G.flags.inh){say('このセーブでは、もう引き継ぎました',1400);return}
 if(!d||(!d.chars.length&&!d.coins)){say('引き継げる仲間・コインがありませんでした',1600);return}
 $('sheetT').textContent='マイスターの塔から引き継ぐ';
 $('sheetB').innerHTML=`<div class="note" style="line-height:1.8">${from}<br>
  <b>仲間</b>：${d.chars.length?d.chars.map(([id,st])=>`${CHARS[id].name}★${st}`).join('、'):'なし'}<br>
  <b>コイン</b>：${d.coins.toLocaleString()}${d.raw>d.coins?`<small>（${d.raw.toLocaleString()}のうち、上限${INH_CAP.toLocaleString()}まで）</small>`:''}<br>
  <span style="font-size:13px;opacity:.8">引き継げるのは1回だけです。サイコロ版のデータはそのまま残ります。</span></div>
  <button class="btn gold" id="inhY">引き継ぐ</button><button class="btn ghost" id="inhN">やめる</button>`;
 $('inhY').onclick=()=>inhApply(d);$('inhN').onclick=closeSheet;$('sheet').classList.add('on')}
function openInherit(){if(!G){say('先に「はじめる」でゲームを始めてください',1600);return}
 if(G.flags.inh){say('このセーブでは、もう引き継ぎました',1400);return}
 const loc=diceLocal();
 $('sheetT').textContent='マイスターの塔から引き継ぐ';
 $('sheetB').innerHTML=`<div class="sg"><div class="note">サイコロ版「マイスターの塔」の仲間とコインを1回だけ受け取れます。両方にいる仲間（ウルフ・キツネなど10人）は同じ★で仲間に。コインは上限${INH_CAP.toLocaleString()}（ガチャ各11連ぶん）。</div>
  ${loc?`<button class="btn gold" id="inhLoc">この端末のデータから引き継ぐ</button>`:'<div class="note">この端末では、サイコロ版のセーブが見つかりませんでした。別の端末で遊んでいたら、サイコロ版の「設定 → コードを書き出す」で出るコードか、セーブのファイルを使ってください。</div>'}
  <textarea id="inhCode" class="sgc" placeholder="OKS2. で始まるサイコロ版のコードを貼り付け" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
  <div class="sgr"><button class="btn" id="inhPaste">貼ったコードで引き継ぐ</button><button class="btn" id="inhFile">ファイルから</button></div></div>
  <button class="btn ghost" id="inhX">閉じる</button>`;
 $('inhX').onclick=closeSheet;
 const lb=$('inhLoc');if(lb)lb.onclick=()=>inhAsk(diceGift(loc),'この端末のサイコロ版のセーブ');
 $('inhPaste').onclick=()=>{let v;try{v=diceFromCode($('inhCode').value)}catch(e){say('「OKS2.」で始まるコードを全部貼り付けてください',1800);return}inhAsk(diceGift(v),'貼り付けたコード')};
 $('inhFile').onclick=()=>{const inp=document.createElement('input');inp.type='file';inp.accept='.txt,text/plain';
  inp.onchange=async()=>{const f=inp.files[0];if(!f)return;let v;try{v=diceFromCode(await f.text())}catch(e){say('サイコロ版のセーブファイルではないようです',1600);return}inhAsk(diceGift(v),'ファイル')};inp.click()};
 $('sheet').classList.add('on')}
/* ホームで1回だけ案内（この端末にサイコロ版のセーブがあるとき） */
function inhNag(){if(!G||G.flags.inh||OPT.inhAsked||!G.flags.intro)return;if(sgBusy())return;
 const d=diceGift(diceLocal());if(!d||(!d.chars.length&&!d.coins))return;OPT.inhAsked=1;saveOpt();inhAsk(d,'この端末に「マイスターの塔」（サイコロ版）のデータがあります。')}
{const _oh2=openHome;openHome=function(){const r=_oh2.apply(this,arguments);setTimeout(inhNag,500);return r}}
