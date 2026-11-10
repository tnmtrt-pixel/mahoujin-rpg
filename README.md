# マイスターの魔法陣 RPG（第1章・β版）

iPhone の Safari 向けのブラウザRPG。マイスターの塔のキャラクターたちが、夜の工業の街で「錆」と戦う。

- 遊ぶ：https://tnmtrt-pixel.github.io/mahoujin-rpg/
- バージョン：`index.html` の `const VERSION` を見る（タイトル画面にも表示）
- セーブ：各端末のブラウザに保存される（localStorage `mmrpg1`）

## ファイル

- `index.html` … ゲーム本体（HTML・CSS・JavaScript を1ファイルにまとめたもの）
- `img/` … 画像（キャラ・敵・背景・町・アイコンなど）

## 更新のしかた

`index.html` と `img/` を差しかえて、`VERSION` の数字を上げてから main に入れる。GitHub Pages が自動で公開しなおす（1〜2分）。
