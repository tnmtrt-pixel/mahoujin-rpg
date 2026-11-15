# 使い方: python3 src/make_gift.py コード  → v2_gift.js の GIFTS2 に入れるハッシュを表示
#   コードそのものはリポジトリに書かないこと（公開されているため）
import sys,hashlib,unicodedata,re
c=re.sub(r'[\s\-ー－]','',unicodedata.normalize('NFKC',sys.argv[1]).strip().upper())
print(c, hashlib.sha256(('meister-tower2:'+c).encode()).hexdigest())
