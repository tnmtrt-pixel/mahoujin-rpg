# マイスターの塔2 の組み立て：src/ の部品を1つの index.html にまとめる
#   使い方：python3 src/build.py   （どこから実行してもよい。リポジトリ直下の index.html を書きかえる）
#   バージョンは下の R("const VERSION=...") の数字を上げる
import os
HERE=os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
import re
s=open('src_beta.html').read()
mod=open('v2_module.js').read()+'\n'+open('v2_ui.js').read()+'\n'+open('v2_gacha.js').read()+'\n'+open('v2_grind.js').read()+'\n'+open('v2_equip.js').read()+'\n'+open('v2_forge.js').read()+'\n'+open('v2_story.js').read()+'\n'+open('v2_chat.js').read()+'\n'+open('v2_upper.js').read()+'\n'+open('v2_save.js').read()+'\n'+open('v2_log.js').read()+'\n'+open('v2_judge.js').read()+'\n'+open('v2_vol2.js').read()+'\n'+open('v2_words.js').read()+'\n'+open('v2_rank.js').read()+'\n'+open('v2_bug.js').read()+'\n'+open('v2_gift.js').read()+'\n'+open('v2_soul.js').read()+'\n'+open('v2_takumi.js').read()+'\n'+open('v2_fairy.js').read()+'\n'+open('v2_shadow.js').read()+'\n'+open('v2_kura.js').read()+'\n'+open('v2_jstory.js').read()+'\n'+open('v2_jgear.js').read()+'\n'+open('v2_update.js').read()
def R(a,b,cnt=1):
    global s
    n=s.count(a)
    assert n==cnt,(n,a[:80])
    s=s.replace(a,b)
R("const VERSION='0.1.0'","const VERSION='1.10.7'")
R("const KEY='mmrpg1',OPT_KEY='mmrpg1_opt',BROKEN_KEY='mmrpg1_broken'","const KEY='mmrpg2',OPT_KEY='mmrpg2_opt',BROKEN_KEY='mmrpg2_broken'")
R("$('tVer').textContent=`β版 ver ${VERSION}`;$('tNote').textContent=loadNote;","$('tVer').textContent=`ver ${VERSION}`;$('tNote').textContent=loadNote;saveGuardBoot();")
R('<button class="btn ghost" id="opX">閉じる</button>','<button class="btn" id="opSG">💾 セーブの守り（保存・引っ越し）</button><button class="btn ghost" id="opX">閉じる</button>')
R("$('opX').onclick=closeSheet;","$('opX').onclick=closeSheet;$('opSG').onclick=openSaveGuard;")
R('<div class="note" style="text-align:center;margin-top:8px">β版 ver ${VERSION}</div>','<div class="note" style="text-align:center;margin-top:8px">ver ${VERSION}</div>')
R("<title>マイスターの魔法陣 RPG（第1章）</title>","<title>マイスターの塔2（第1章）</title>")
# 古い定義の名前を変える（新しい定義はモジュール側）
for fn in ['openParty','miniHTML','renderParty','openItems','openHelp','signLines','openDest','goArea','openShop','renderShop','showCraftResult']:
    for kw in ['function ','async function ']:
        if s.count(kw+fn+'(')==1 and (kw=='async function ' or s.count('async function '+fn+'(')==0):
            s=s.replace(kw+fn+'(',kw+'_old_'+fn+'(');break
    else: raise SystemExit('no def '+fn)
R("let crafting=false;","let _oldCrafting=false;")
# セーブ
R("g.v=SAVE_V;return g}","fixV2(g);g.v=SAVE_V;return g}")
R("restUsed:[],where:{s:'town'}};save();await playIntro()};","restUsed:[],where:{s:'town'},mats:{scrap:3},tools:['file'],bps:[],arm:{},lead:sel};fixV2(G);save();await playIntro()};")
# 三面図の加入ミッション：地図ではなく町の外へもどる
R("if(!ok){openMap();await say(","if(!ok){cadBack();await say(")
R(" openMap();return true}"," cadBack();return true}")
# 再開
R(" if(G.pendCraft){showCraftResult(G.pendCraft);return}"," if(G.flags.pendFieldWin){afterField();return}\n if(G.pendCraft){showCraftResult(G.pendCraft);return}")
# 町の宝箱
R("const it=CHEST_ITEMS[k]||{oil:1};let msg=[];if(it.oil){G.items.oil+=it.oil;msg.push('オイル×'+it.oil)}if(it.cool){G.items.cool+=it.cool;msg.push('冷却水×'+it.cool)}if(it.mat){G.mat+=it.mat;msg.push('鉄くず×'+it.mat)}",
  "const it=CHEST_ITEMS2[k]||{scrap:1};Object.keys(it).forEach(q=>G.mats[q]+=it[q]);const msg=[matText(it)];")
# エンディング
R("クリア後も、町と各エリアで遊べます（レベル上げ・武器づくり・ボスの再戦）。","クリア後も、町と各エリアで遊べます（素材集め・武器と防具づくり・ボスの再戦）。")
R("${G.party.map(m=>CHARS[m.id].name+' Lv'+m.lv).join('・')}","${G.party.map(m=>CHARS[m.id].name).join('・')}")
# モジュールを差しこむ
import datetime as _dt
extra="\nconst BUILD='"+(_dt.datetime.now(_dt.timezone(_dt.timedelta(hours=9)))).strftime('%m/%d %H:%M')+"';\nconst CHEST_ITEMS2={'3,12':{oil:2,scrap:2},'17,2':{scrap:3,wire:1}};\nfunction cadBack(){}\n"
R("/* ===================== 起動 ===================== */",mod+extra+"\n/* ===================== 起動 ===================== */")
R("window.__game={","window.__game={get FD(){return FD},startField,fEnd,makeProduct,RECIPES,FAREA,FT,")
# 画面
html='''<section id="field" class="scr">
 <canvas id="fcv"></canvas>
 <div id="fstick"><i></i></div>
 <div id="fHud">
  <div class="frow"><span id="fLv">Lv1</span><div class="fbar"><i id="fXpI"></i></div><span id="fTime">0:00</span><button id="fPauseB" onclick="fPause()" aria-label="ひと休み">II</button></div>
  <div class="frow"><span class="fhl">HP</span><div class="fbar hp"><i id="fHpI"></i></div></div>
  <div id="fLoot"></div>
  <div id="fBoss"><span id="fBossN"></span><div class="fbar boss"><i id="fBossI"></i></div></div>
 </div>
 <div id="fWarn"></div>
 <div class="fov" id="fLevel"><div class="fcard"><h3>レベルアップ！</h3><div class="note">だれを強くする？</div><div id="fPicks"></div></div></div>
 <div class="fov" id="fPause"><div class="fcard"><h3>ひと休み</h3><button class="btn gold" onclick="fResume()">つづける</button><button class="btn" onclick="fRetreat()">ホームへ帰る<small class="bsm">素材は全部持ち帰る</small></button></div></div>
</section>

<section id="result" class="scr">'''
R('<section id="result" class="scr">',html)
css='''
/* ===== v0.2 町の外（サバイバー）・工房 ===== */
#field.on{position:fixed;inset:0;max-width:none;padding:0;margin:0;overflow:hidden;background:#0b1024}
#fcv{position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block}
#fstick{position:fixed;width:104px;height:104px;margin:-52px 0 0 -52px;border-radius:50%;background:radial-gradient(#ffffff10,#ffffff22 68%,#ffffff38 70%,transparent 72%);border:2px solid #ffffff44;pointer-events:none;display:none;z-index:3}
#fstick.on{display:block}
#fstick i{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:#e8c35a55;border:2px solid #ffe7a099}
#fHud{position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top) + 6px) 10px 0;pointer-events:none;z-index:2}
.frow{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.fbar{flex:1;height:10px;border-radius:6px;background:#0009;border:1px solid #ffffff30;overflow:hidden}
.fbar i{display:block;height:100%;background:linear-gradient(90deg,#5aa8ff,#9fd0ff)}
.fbar.hp i{background:linear-gradient(90deg,#3fbf6a,#8ef0a8)}
.fbar.boss{height:12px}.fbar.boss i{background:linear-gradient(90deg,#ff5a4a,#ffb07a)}
#fLv,.fhl{font-weight:800;font-size:13px;min-width:34px;text-shadow:0 1px 3px #000}
#fTime{font-family:'Dela Gothic One',sans-serif;font-size:18px;text-shadow:0 2px 4px #000;min-width:62px;text-align:right}
#fPauseB{pointer-events:auto;width:44px;height:44px;border-radius:12px;background:#0b1024aa;border:1px solid #ffffff44;font-weight:800}
#fLoot{display:flex;gap:8px;flex-wrap:wrap;font-weight:800;font-size:13px;text-shadow:0 1px 3px #000}
#fLoot span{display:flex;align-items:center;gap:2px;background:#0008;border-radius:10px;padding:1px 6px}
#fBoss{display:none;margin-top:4px;font-size:13px;font-weight:800;text-shadow:0 1px 3px #000}
#fWarn{position:absolute;left:10px;right:10px;top:42%;text-align:center;font-weight:800;font-size:18px;color:#ffe7a0;text-shadow:0 2px 6px #000,0 0 12px #000;pointer-events:none;opacity:0;z-index:2}
.fov{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:#050816cc;z-index:4;padding:16px}
.fov.on{display:flex}
.fcard{width:100%;max-width:420px;background:var(--panel);border:2px solid var(--gold);border-radius:18px;padding:14px;text-align:center}
.fcard h3{margin:0 0 4px;color:var(--gold);font-family:'Dela Gothic One',sans-serif;font-weight:400}
.fpick{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:#0b1024;border:1px solid var(--line);border-radius:14px;padding:8px 10px;margin-top:8px;min-height:64px}
.fpick img{width:48px;height:48px;object-fit:contain;flex:none}
.fpick span{flex:1;display:flex;flex-direction:column}.fpick small{color:var(--sub);font-size:12px;line-height:1.4}
.fpick .lvt{flex:none;font-weight:800;color:var(--gold);font-size:12px}
.stabs{display:flex;gap:6px;margin-bottom:8px}
.stab{flex:1;min-height:44px;border-radius:12px;background:#0b1024;border:1px solid var(--line);color:var(--sub);font-weight:800}
.stab.on{background:linear-gradient(#2c4a9a,#1c2f6a);color:var(--ink);border-color:#5a7ad0}
.rcp{background:#0b1024;border:1px solid var(--line);border-radius:14px;padding:10px;margin-top:8px}
.rh{display:flex;gap:10px;align-items:flex-start}
.rneed{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:13px;margin-top:4px;align-items:center}
.rneed .nl{font-size:11px;color:var(--sub);min-width:28px}
.rneed .lack{color:#ff8a7a}
.mini.lead{outline:2px solid var(--gold);border-radius:10px}
.mini .ld{font-size:10px;font-weight:800;background:var(--gold);color:#1b1400;border-radius:6px;padding:0 4px;margin-left:4px}
</style>'''
R("</style>",css)

R(" if(G.where&&G.where.s==='map'&&MAPS[G.area]){openMap();return}\n openTown()}"," openHome()}")
R("addBtn('町にもどる',openTown,'gold');show('result')}\nasync function loseB","addBtn('ホームへ',openHome,'gold');show('result')}\nasync function loseB")
R('<section id="party" class="scr">\n <div class="hd"><button class="back" onclick="backFromMenu()">◀ もどる</button><h2>パーティ</h2></div>\n <div id="partyList"></div>\n</section>',
  '<section id="party" class="scr">\n <div id="partyList"></div>\n</section>')
R('<div class="hd"><button class="back" onclick="openTown()">◀ 町へ</button><h2><img class="ic" src="img/icon/hammer.webp"','<div class="hd"><h2><img class="ic" src="img/icon/hammer.webp"')
R('<div class="hd"><button class="back" onclick="openTown()">◀ 町へ</button><h2><img class="ic" src="img/icon/gate.webp"','<div class="hd"><button class="back" onclick="openHome()">◀ ホーム</button><h2><img class="ic" src="img/icon/gate.webp"')
R('<section id="pick" class="scr">',open('v2_ui.html').read()+'\n<section id="pick" class="scr">')
R("</style>",open('v2_ui.css').read()+"\n</style>")

import re as _re
_m=_re.search(r'<div id="townTop">.*?</div>\n',s,_re.S)
assert _m
s=s.replace(_m.group(0),'<div id="townTop"><span class="ttl"><img class="ic" src="img/icon/node_town.webp" alt="" style="width:24px;height:24px"> 夜の工業の街</span><button class="thome" onclick="openHome()"><img class="ic" src="img/title/emblem.webp" alt="" style="width:22px;height:22px">ホームへ</button></div>\n')
R("G.town={x:TW.px,y:TW.py+1};save();openShop();return}","G.town={x:TW.px,y:TW.py+1};save();openShop('town');return}")
R('<div class="hd"><h2><img class="ic" src="img/icon/hammer.webp"','<div class="hd"><button class="back" id="shopBack" onclick="openTown()" style="display:none">◀ 町へ</button><h2><img class="ic" src="img/icon/hammer.webp"')

# ===== 塔の物語に合わせた文言 =====
_T=[
("['wolf','ウルフ','工房の旋盤で、もう一回だけ練習を——\\nん？ 路地の奥で、オレンジ色のドロドロが動いてる！？'],",
 "['wolf','ウルフ','工房の旋盤で、もう一回だけ練習を——\\nん？ 路地の奥で、オレンジ色のドロドロが動いてる！？'],\n  [null,'','ドロドロは、ずっと閉ざされていた「マイスターの塔」の扉から\\nあふれ出していた。扉が、少しだけ開いている。'],"),
("路地裏から、円をえがくように広がっておる。","塔のふもとから、円をえがくように広がっておる。"),
("[null,'','路地裏。消えかけた街灯が、チカチカとまたたいている。'],","[null,'','塔の1階。なぜか、町の路地裏とそっくりの通りが続いている。\\n消えかけた街灯が、チカチカとまたたいている。'],"),
("[null,'','廃工場。止まったままのベルトコンベアに、\\n錆びた部品がずらりと並んでいる。'],","[null,'','塔の4階。止まったままのベルトコンベアに、\\n錆びた部品がずらりと並んでいる。'],"),
("[null,'','廃工場の床下に、古い階段が続いていた。\\nその先は——誰も知らない地下工房。'],","[null,'','6階の天井から続く階段をのぼると、\\nそこは——誰も知らない、塔の上の工房だった。'],"),
("[null,'','かけらには、どこかの工場の地図が描かれている。\\n——街はずれの、廃工場だ。'],","[null,'','かけらには、上の階の地図が描かれている。\\n——止まった工場の階だ。'],"),
("[null,'','路地裏エリア クリア！\\n町の門から「廃工場」へ行けるようになった。']","[null,'','3階 突破！\\nこの先は、塔の中層「止まった工場の階」。']"),
("[null,'','床が音を立てて開き、地下へ続く階段が現れた。\\n廃工場エリア クリア！ 「地下工房」へ行けるようになった。']","[null,'','天井が音を立てて開き、上へ続く階段が現れた。\\n6階 突破！ この先は、塔の上層「図面の回廊」。']"),
("[null,'','地下工房から出ると、東の空がうっすらと明るくなっていた。'],","[null,'','塔を出ると、東の空がうっすらと明るくなっていた。\\n街のあちこちに、灯りが戻っている。'],"),
("路地裏の番人を倒したって？","塔の3階の番人を倒したって？"),
("廃工場のクレーンか……昔、あそこの配線は俺がやったんだ。","塔の中のクレーンか……あの型の配線は、昔俺がやったんだ。"),
("地下の親玉まで倒したって！？","塔の10階の親玉まで倒したって！？"),
("きみたちの道は、門の向こうから始まるって。","きみたちの道は、塔の扉の向こうから始まるって。"),
("次の星は、街はずれの廃工場の上で光ってるよ。","次の星は、塔の中ほどで光ってるよ。"),
("きみたちの道は、地下へ続いているって。","きみたちの道は、上へ、上へと続いているって。"),
("……地下は星が見えない。わたしには、先が読めない場所。","……塔の上は雲の中。わたしには、先が読めない場所。"),
("さらに奥……廃工場から濃く流れている。","さらに上……塔の中ほどから濃く流れている。"),
("……地下には、描きかけの図が眠っている。","……塔の上には、描きかけの図が眠っている。"),
("門で外へ</div>","門で塔へ</div>"),
("クリア後も、町と各エリアで遊べます","クリア後も、町と塔の各階で遊べます"),
]
for _a,_b in _T:
    assert s.count(_a)>=1,('T',_a[:40])
    s=s.replace(_a,_b)

R(' <p class="note">門の向こうへ。解放されたエリアから選ぼう。ボスは推奨Lvより低いとかなり手ごわい。</p>\n','')
R(' 行き先を選ぶ</h2></div>',' <span id="destTw">マイスターの塔</span></h2></div>')
exec(open(os.path.join(HERE,'strip.py')).read())
open(os.path.join(HERE,'..','index.html'),'w').write(s)
print('ok',len(s))
