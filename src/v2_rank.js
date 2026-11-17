/* =====================================================================
   ランキング・プロフィール（無限の塔の攻略階数）
   ・識別IDと合言葉（sec）は、サイコロ版マイスターの塔と共通（同じ Cloudflare サーバー meister-tower-online）。
     サイコロ版を遊んでいれば、そのIDを使う＝同じ人。遊んでいなければ塔2で作る
   ・名前・称号・アイコンは塔2だけのもの（サイコロ版とは別）。はじめて引き継ぐときだけ、サイコロ版の値を写す
   ・名前の単語と称号の一覧はサイコロ版の写し（v2_words.js）。番号はサイコロ版と同じ。塔2だけの単語・称号は後ろに足す
   ・サイコロ版で解放ずみの単語・称号は、引き継いだときの分を持ち越す（G.prof.dw / dt）
   ・ランキングの表示は準備中。名前の登録とサーバーへの送信はする
   ===================================================================== */
const MT_API='https://meister-tower-online.tnmtrt.workers.dev';
const mFloor=()=>towerFloor('meister');
const ownN=()=>ownedAll().length;
const star3N=()=>ownedAll().filter(m=>(m.star||1)>=3).length;
const memLv=id=>{const m=findOwn(id);return m?m.lv|0:0};
/* 塔2だけの単語（DW_N より後ろ） */
const RW_MT2=[[['白黒の','J:10'],['審判の','tw:judge'],['無限の','I:1'],['バグった','I:10']],[['天秤','J:3'],['木槌','tw:judge'],['バグ','I:1'],['工房','B:10']],[['証人','J:1'],['裁判官','tw:judge'],['デバッガー','I:1'],['加工職人','B:20']]];
const RW=DWORDS.map((l,p)=>[...l,...RW_MT2[p]]);
/* 称号：サイコロ版14個＋塔2だけ */
const RT=[...DTITLES,'白黒の証人','審判を越えた者','工房の主'];
const RT_OK=[()=>true,()=>mFloor()>=5,()=>mFloor()>10,()=>!!G.flags.ch1,()=>GACHA_POOL.every(id=>ownChar(id)),()=>star3N()>=5,null,null,null,null,null,null,
 ()=>towerFloor('inf')>=50,()=>towerFloor('inf')>=100,()=>towerFloor('judge')>=10,()=>!!G.flags.tw_judge,()=>(G.bps||[]).length>=30];
const RT_TXT=['最初から','塔の5Fに到達','塔の10Fをこえる','塔の20Fをクリア','vol.1の仲間を全員そろえる','★3の仲間を5人','サイコロ版で手に入れる','サイコロ版で手に入れる','サイコロ版で手に入れる','サイコロ版で手に入れる','サイコロ版で手に入れる','サイコロ版で手に入れる',
 '無限の塔で50Fに到達','無限の塔で100Fに到達','審判の塔の10Fに到達','審判の塔の20Fをクリア','図面を30枚集める'];
const CNAME_X={takumi:'匠',sora:'匠空',verdict:'ヴェルディクト',eclipse:'エクリプス'};
const cnm=id=>(CHARS[id]&&CHARS[id].name)||CNAME_X[id]||'？';
/* 単語の解放条件（塔2での条件）。null＝サイコロ版でだけ解放できる */
function wCond(c){if(c==null)return{ok:()=>true,t:''};
 if(typeof c==='number'){const T=[null,[()=>mFloor()>=5,'塔の5Fに到達'],[()=>mFloor()>10,'塔の10Fをこえる'],[()=>!!G.flags.ch1,'塔の20Fをクリア'],[()=>GACHA_POOL.every(id=>ownChar(id)),'vol.1の仲間を全員そろえる'],[()=>star3N()>=5,'★3の仲間を5人']][c];return T?{ok:T[0],t:T[1]}:null}
 let m;
 if((m=/^c:(\w+)$/.exec(c))){const id=m[1];if(id==='verdict')return{ok:()=>towerFloor('judge')>10,t:'審判の塔の10Fをこえる'};if(id==='eclipse')return{ok:()=>!!G.flags.tw_judge,t:'審判の塔の20Fをクリア'};
  return CHARS[id]&&ATK[id]?{ok:()=>ownChar(id)&&mFloor()>10,t:`${cnm(id)}を仲間にして塔の10Fをこえる`}:null}
 if((m=/^u:(\w+):(\d+)$/.exec(c))){const id=m[1],n=+m[2];return CHARS[id]&&ATK[id]?{ok:()=>memLv(id)>=n,t:`${cnm(id)}をLv${n}にする`}:null}
 if((m=/^([FINSJB]):(\d+)$/.exec(c))){const n=+m[2],k=m[1];
  return {F:{ok:()=>mFloor()>=n,t:`塔の${n}Fに到達`},I:{ok:()=>towerFloor('inf')>=n,t:n<=1?'無限の塔に挑む（ver2.0.0から）':`無限の塔で${n}Fに到達`},N:{ok:()=>ownN()>=n,t:`仲間を${n}人にする`},
   S:{ok:()=>star3N()>=n,t:`★3の仲間を${n}人にする`},J:{ok:()=>towerFloor('judge')>=n,t:`審判の塔の${n}Fに到達`},B:{ok:()=>(G.bps||[]).length>=n,t:`図面を${n}枚集める`}}[k]}
 if(c==='tw:judge')return{ok:()=>!!G.flags.tw_judge,t:'審判の塔の20Fをクリア'};
 return null}
const RW_C=RW.map(l=>l.map(w=>wCond(w[1])));
const rwV2=(p,i)=>{const c=String(RW[p][i][1]||'');const m=/^[cu]:(\w+)/.exec(c);return !!(m&&VOL2.includes(m[1]))};
const rwOk=(p,i)=>{if(!RW[p]||!RW[p][i])return false;if(!V2_OPEN&&rwV2(p,i))return false;const P=G.prof;if(P&&P.dw&&P.dw.includes(p+':'+i))return true;const c=RW_C[p][i];return !!(c&&c.ok())};
const rwTxt=(p,i)=>{const w=RW[p]&&RW[p][i];if(!w)return'？';let t=w[0];if(t.includes('{c}'))t=t.replace('{c}',cnm(String(w[1]).split(':')[1]));return t};
const rwLock=(p,i)=>{const c=RW_C[p][i];return c?c.t:'サイコロ版で解放'};
const rtOk=i=>{if(!RT[i])return false;const P=G.prof;if(P&&P.dt&&P.dt.includes(i))return true;return !!(RT_OK[i]&&RT_OK[i]())};
const rHex=n=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('')};
const rTag=id=>id.slice(-4).toUpperCase();
const rName=w=>(w||[]).map((n,p)=>rwTxt(p,n)).join('');
const rIdTxt=id=>id.toUpperCase().match(/.{4}/g).join('-');
function rRand(){return [0,1,2].map(p=>{const ok=RW[p].map((_,i)=>i).filter(i=>rwOk(p,i));return ok[Math.floor(Math.random()*ok.length)]})}
const rIconOk=id=>!!id&&ownChar(id)&&!!CHARS[id];
const rIconDef=()=>(G.party&&G.party[0]&&G.party[0].id)||(ownedAll()[0]||{}).id||'wolf';
function rProf(){let p=G.prof;if(!p||typeof p!=='object'||!/^[0-9a-f]{24}$/.test(p.id||''))p=G.prof={id:rHex(12),reg:false};
 if(!/^[0-9a-f]{32}$/.test(p.sec||''))p.sec=rHex(16);
 if(!Array.isArray(p.dw))p.dw=[];if(!Array.isArray(p.dt))p.dt=[];
 if(!Array.isArray(p.w)||p.w.length!==3)p.w=rRand();
 p.w=p.w.map((n,i)=>rwOk(i,n)?n:RW[i].findIndex((_,k)=>rwOk(i,k)));
 if(!rtOk(p.title|0))p.title=0;if(!rIconOk(p.icon))p.icon=rIconDef();return p}
const rFace=(id,s=44)=>`<img class="rkic" src="${FACE(id)}" width="${s}" height="${s}" alt="" onerror="this.onerror=null;this.src='${CHARS[id]?CHARS[id].img:''}'">`;

/* ---------- サイコロ版から引き継ぐ ---------- */
function dSnap(ds){const st=ds.st||{},cup=ds.cup||{},inf=ds.inf||{},own=ds.owned||{},use=ds.use||{},boss=ds.boss||{},keep=ds.keepW||{};
 const S=Object.values(own).filter(v=>v===3).length,F=Math.max(+ds.best||1,+ds.floor||1);
 const N={L:st.days|0,M:st.ms|0,G:st.pulls|0,N:Object.keys(own).filter(k=>own[k]).length,S,F,W:st.wins|0,I:inf.best|0};
 const T=[1,F>=5,F>10,(+ds.clears||0)>=1,!!ds.dexReward,S>=5,(st.days|0)>=7,(st.ms|0)>=30,(st.pvp|0)>=10,!!own.sora,!!cup.champ,!!cup.meister,(inf.best|0)>=50,(inf.best|0)>=100];
 const CUP={cup1:!!cup.entered,cupwin:!!cup.win1,cupfin:!!cup.final,cupchamp:!!cup.champ,meister:!!cup.meister};
 const ok=c=>{if(c==null)return true;if(typeof c==='number')return !!T[c];let m;if((m=/^c:(\w+)$/.exec(c)))return !!boss[m[1]];if((m=/^u:(\w+):(\d+)$/.exec(c)))return (use[m[1]]|0)>=+m[2];
  if((m=/^([LMGNSFWI]):(\d+)$/.exec(c)))return N[m[1]]>=+m[2];return !!CUP[c]};
 const dw=[];DWORDS.forEach((l,p)=>l.forEach((w,i)=>{if(w[1]!=null&&(ok(w[1])||keep[p]===i))dw.push(p+':'+i)}));
 const dt=T.map((v,i)=>v?i:-1).filter(i=>i>0);const pr=ds.prof||{};if(pr.title>0&&pr.title<DTITLES.length&&!dt.includes(pr.title|0))dt.push(pr.title|0);
 return {dw,dt}}
function diceProf(ds){const pr=ds&&ds.prof;if(!pr||!/^[0-9a-f]{24}$/.test(pr.id||'')||!/^[0-9a-f]{32}$/.test(pr.sec||''))return null;return pr}
function rLink(ds){const pr=diceProf(ds);if(!pr)return false;const sn=dSnap(ds);
 G.prof={id:pr.id,sec:pr.sec,dw:sn.dw,dt:sn.dt,from:'dice',reg:true,at:Date.now(),
  w:(Array.isArray(pr.w)?pr.w:[]).slice(0,3).map((n,p)=>(n|0)<DW_N[p]?n|0:0),title:(pr.title|0)<DTITLES.length?pr.title|0:0,icon:String(pr.icon||'')};
 /* 名前に使っていた単語は、条件にかかわらず使える */
 G.prof.w.forEach((n,p)=>{const k=p+':'+n;if(!G.prof.dw.includes(k))G.prof.dw.push(k)});
 rProf();G.prof.dirty=1;save();rSync();return true}

/* ---------- サーバーへ送る（失敗したら次に開いたとき送りなおす） ---------- */
let rBusy=false;
async function rSync(){const p=G&&G.prof;if(!p||!p.reg||!p.dirty||rBusy)return;if(G.flags&&G.flags.tamper)return;  /* 書きかえのあったセーブはランキングに送らない（2.0.12） */rBusy=true;
 try{const r=await fetch(MT_API+'/api/mt2/profile',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:p.id,sec:p.sec,w:p.w,icon:p.icon,title:p.title|0,v:VERSION})});
  const j=await r.json().catch(()=>({}));if(r.ok&&j.ok){p.dirty=0;p.authNg=0;p.syncAt=Date.now();save()}else if(j.err==='auth'){p.authNg=1;save()}}catch(e){}finally{rBusy=false}}

let rEdit=false,rDraft=null,rImp=false;
function openRank(){show('rank');rEdit=false;rDraft=null;rImp=false;renderRank();rSync()}
function renderRank(){const p=rProf(),el=$('rkBody'),ds=diceLocal(),dp=diceProf(ds),linked=p.from==='dice';
 let h='';
 if(rImp)h=rImpHTML();
 else if(!rEdit&&p.reg)h=`<div class="rkcard"><div class="rkh">プレイヤー</div><div class="rkme">${rFace(p.icon,56)}<div><div class="rkname">${rName(p.w)}<small>#${rTag(p.id)}</small></div><div class="rkttl">${RT[p.title|0]}</div></div></div>
   <div class="rkid">識別ID　${rIdTxt(p.id)}${linked?'<small>サイコロ版と同じID（名前・称号・アイコンは塔2だけのもの）</small>':''}</div>
   ${p.authNg?'<div class="note" style="color:#ff9a8a">サーバーに登録できませんでした（IDの合言葉がちがいます）。サイコロ版から引き継ぎなおしてください。</div>':''}
   <button class="btn ghost" id="rkEd">プロフィールを変える</button></div>`;
 else h=rEditHTML(p);
 if(!rImp&&!linked)h+=`<div class="rkcard"><div class="rkh">サイコロ版から引き継ぐ</div>
   ${dp?`<div class="note">このブラウザにサイコロ版のプロフィールがあります（<b>#${rTag(dp.id)}</b>）。同じIDで登録し、名前・称号・アイコンを写します。サイコロ版で解放した単語と称号も使えるようになります。</div><button class="btn gold" id="rkLink">サイコロ版から引き継ぐ</button>`
   :`<div class="note">サイコロ版マイスターの塔のIDと、解放した単語・称号を引き継げます。ホーム画面のアイコンから遊んでいる人は、サイコロ版のセーブコード（OKS2. で始まる）を貼り付けてください。</div>`}
   <button class="btn ghost" id="rkImp">コードを貼って引き継ぐ</button></div>`;
 h+=`<div class="rkcard rkboard"><div class="rkh">無限の塔　攻略階数ランキング</div>
  <div class="rksoon"><b>準備中</b><span>無限の塔（ver2.0.0）で、何階まで登ったか（攻略階数）を全国のプレイヤーと競えるようになります。<br>いまのうちに名前を登録しておこう。</span></div>
  <div class="note">ランキングに出るのは、名前・称号・アイコンと、識別IDの末尾4けた（#${rTag(p.id)}）と記録だけです。本名は使わないでね。</div></div>`;
 el.innerHTML=h;
 const on=(id,f)=>{const b=$(id);if(b)b.onclick=f};
 on('rkEd',()=>{rEdit=true;rDraft=null;renderRank()});
 on('rkLink',()=>{if(p.reg&&!confirm('いまの塔2のプロフィールを、サイコロ版のIDと名前に置きかえます。よろしいですか？'))return;if(rLink(ds)){say('サイコロ版から引き継いだ！',1400);rEdit=false;renderRank()}else say('サイコロ版のプロフィールが読めませんでした',1600)});
 on('rkImp',()=>{rImp=true;renderRank()});
 if(rImp){on('rkImpNo',()=>{rImp=false;renderRank()});
  on('rkImpOk',()=>{let v;try{v=diceFromCode($('rkCode').value)}catch(e){say('「OKS2.」で始まるコードを全部貼り付けてください',1800);return}
   if(!diceProf(v)){say('このコードにはプロフィールが入っていません。サイコロ版で一度ランキングを開いてから、コードを出しなおしてください',2600);return}
   if(p.reg&&!confirm('いまの塔2のプロフィールを、サイコロ版のIDと名前に置きかえます。よろしいですか？'))return;
   rLink(v);rImp=false;say('サイコロ版から引き継いだ！',1400);renderRank()});return}
 if(!rEdit&&p.reg)return;
 const d=rDraft;
 const prev=()=>{$('rkPrev').innerHTML=`${rName(d.w)}<small>#${rTag(p.id)}</small>`;$('rkPT').textContent=RT[d.title];$('rkPI').innerHTML=rFace(d.icon,56)};
 el.querySelectorAll('select[data-rp]').forEach(s=>s.onchange=()=>{d.w[+s.dataset.rp]=+s.value;prev()});
 const ts=$('rkTtl');if(ts)ts.onchange=()=>{d.title=+ts.value;prev()};
 el.querySelectorAll('[data-ric]').forEach(b=>b.onclick=()=>{d.icon=b.dataset.ric;el.querySelectorAll('[data-ric]').forEach(x=>x.classList.toggle('on',x===b));prev()});
 on('rkRand',()=>{rDraft={...d,w:rRand()};renderRank()});
 on('rkOk',()=>{if(d.w.some((n,i)=>!rwOk(i,n))||!rtOk(d.title)||!rIconOk(d.icon)){say('使えないものが入っている',1000);return}
  Object.assign(p,{w:[...d.w],title:d.title,icon:d.icon,reg:true,dirty:1});p.at=p.at||Date.now();rEdit=false;rDraft=null;save();rSync();tone(880,.15,'triangle',.08,1320);
  say(`登録した！<br><b>${rName(p.w)}</b> #${rTag(p.id)}`,1500);renderRank()});
 on('rkNo',()=>{rEdit=false;rDraft=null;renderRank()})}
function rEditHTML(p){const d=rDraft||(rDraft={w:[...p.w],title:p.title|0,icon:p.icon});
 const sel=pi=>{const free=[],lock=[];RW[pi].forEach((w,i)=>(rwOk(pi,i)?free:lock).push(i));
  return `<label class="rksel"><span>${['前','中','後'][pi]}</span><select data-rp="${pi}">${free.map(i=>`<option value="${i}" ${d.w[pi]===i?'selected':''}>${rwTxt(pi,i)}</option>`).join('')}</select></label>`};
 const n=RW.reduce((s,l,pi)=>s+l.filter((_,i)=>rwOk(pi,i)).length,0),all=RW.reduce((s,l)=>s+l.length,0);
 const tF=RT.map((_,i)=>i).filter(rtOk),tL=RT.map((_,i)=>i).filter(i=>!rtOk(i));
 const icons=ownedAll().map(m=>m.id).filter(id=>CHARS[id]);
 return `<div class="rkcard"><div class="rkh">${p.reg?'プロフィールを変える':'名前の登録'}</div>
  <div class="rkme"><span id="rkPI">${rFace(d.icon,56)}</span><div><div class="rkname" id="rkPrev">${rName(d.w)}<small>#${rTag(p.id)}</small></div><div class="rkttl" id="rkPT">${RT[d.title]}</div></div></div>
  <div class="note">名前は「前・中・後」の3つの単語を組み合わせて作る（サイコロ版と同じ単語）。塔を登ったり仲間を育てたりすると、使える単語や称号が増える（いま使える単語 ${n}個）。</div>
  <div class="rksels">${sel(0)}${sel(1)}${sel(2)}
   <label class="rksel"><span>称</span><select id="rkTtl">${tF.map(i=>`<option value="${i}" ${d.title===i?'selected':''}>${RT[i]}</option>`).join('')}</select></label></div>
  <div class="rkh" style="margin-top:6px">アイコン（持っているキャラから）</div>
  <div class="rkics">${icons.map(id=>`<button type="button" data-ric="${id}" class="${d.icon===id?'on':''}" aria-label="${CHARS[id].name}">${rFace(id,46)}</button>`).join('')}</div>
  <div class="rkid">識別ID　${rIdTxt(p.id)}<small>（自動でつく。名前が同じ人と見分けるための番号）</small></div>
  <div class="rkbtns"><button class="btn ghost" id="rkRand">🎲 ランダム</button><button class="btn gold" id="rkOk">${p.reg?'保存する':'登録する'}</button>${p.reg?'<button class="btn ghost" id="rkNo">やめる</button>':''}</div></div>`}
function rImpHTML(){return `<div class="rkcard"><div class="rkh">コードを貼って引き継ぐ</div>
  <div class="note">サイコロ版の 設定 →「セーブコード」で出したコード（OKS2. で始まる）を、全部貼り付けてください。</div>
  <textarea id="rkCode" class="rkcode" placeholder="OKS2. で始まるコード"></textarea>
  <div class="rkbtns"><button class="btn gold" id="rkImpOk">引き継ぐ</button><button class="btn ghost" id="rkImpNo">やめる</button></div></div>`}
/* ホームを開いたときにも、送れていないプロフィールを送る */
{const _oh=openHome;openHome=function(){const r=_oh.apply(this,arguments);try{if(G&&G.prof&&G.prof.dirty)setTimeout(rSync,1500)}catch(e){}return r}}
