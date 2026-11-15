# コマンドバトル・地図のコードを取りのぞく（s は組み立て済みのページ全体）
import re as _re2
_DEL=set('''ENCOUNTERS MAPS NODE_IC NODE_ICN ITEM_IC BOSS_AI FOE_SCALE WEAPON_BASE WEAPON_TIER EXP_NEXT findNode craftTier curMap isDone nodeState mapBusy setMapBusy openMap lootText addLoot backToMap enterNode clear menuFrom backFromMenu SHAPE_NAME upgradeWeapon _oldCrafting craftFor BT foeArt foeSVG startBattle alive buildB renderB stTxt bSpd logL popOn foeEl canChoose startTurn nextActor prevActor cost syncTools bindTools cmdGrid setCmdHTML clearTg menuIdle menuMain firstChoosable menuSkill menuItem pickTarget setCmd aiFor autoAll sv dmgCalc addSt longT hit nameOf heal execTurn memAct foeAct doSpecial winB afterWinBusy afterWin loseB _m1_renderParty CHEST_ITEMS'''.split())
_a=s.index('<script>')+len('<script>');_b=s.index('</script>',_a);_js=s[_a:_b]
_lines=_js.split('\n');_groups=[];_cur=None
for _l in _lines:
    if (_l and not _l[0].isspace() and _l[0] not in '}])') or _cur is None:
        _cur=[_l];_groups.append(_cur)
    else:_cur.append(_l)
def _name(l):
    m=_re2.match(r'(?:async\s+)?function\s+([\w$]+)|(?:const|let)\s+([\w$]+)',l)
    return m and (m.group(1) or m.group(2))
_out=[];_removed=[]
for g in _groups:
    n=_name(g[0])
    if n and (n in _DEL or n.startswith('_old_')):_removed.append(n);continue
    _out.append('\n'.join(g))
_js2='\n'.join(_out)
# 再開から古い地図・戦闘の続きを消す
_js2=_js2.replace(" if(G.flags.pendWin){const f=findNode(G.flags.pendWin);if(f&&f.node.t==='boss'){G.area=f.area;openMap();setMapBusy(true);await afterWin(true,f.node,true);return}delete G.flags.pendWin}\n","")
_js2=_js2.replace("window.__game={get FD(){return FD},startField,fEnd,makeProduct,RECIPES,FAREA,FT,get G(){return G},set G(v){G=v},get BT(){return BT},save,migrate,enterNode,openTown,openMap,openDest,goArea,startBattle,newMember,curMap,stage,MAPS,AREAS,FOES,VERSION};",
 "window.__game={get FD(){return FD},startField,fEnd,makeProduct,RECIPES,FAREA,FT,get G(){return G},set G(v){G=v},save,migrate,openTown,openHome,openDest,goArea,newMember,stage,AREAS,FOES,VERSION};")
s=s[:_a]+_js2+s[_b:]
# 地図・戦闘の画面
s=_re2.sub(r'<section id="map" class="scr">.*?</section>\n\n?','',s,flags=_re2.S)
s=_re2.sub(r'<section id="battle" class="scr">.*?</section>\n\n?','',s,flags=_re2.S)
# 残った参照を調べる
_left=[n for n in set(_removed) if _re2.search(r'(?<![\w$.])'+_re2.escape(n)+r'(?![\w$])',_js2)]
print('removed',len(_removed),'still referenced:',sorted(_left))
