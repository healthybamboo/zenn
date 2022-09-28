---
title: "ドメイン名をIPアドレスに変換するスクリプトを作る"
emoji: "👏"
type: "tech"
topics:
  - "shell"
  - "正規表現"
  - "sh"
  - "nslookup"
published: true
published_at: "2022-05-23 18:48"
---

# 背景
大学の課題の中で、「ドメイン名をIPアドレスに変換する」という作業が大量発生したので、この作業をシェルスクリプトを使って、自動化することにしました。

# コード
```sh:getIP.sh
cat list.csv | while read line
do
    col1=`echo ${line} | cut -d ',' -f 1`
    col2=`echo ${line} | cut -d ',' -f 2`
    
    result=$(nslookup $col2 | grep -Eo '[0-9]{1,3}.[0-9]{1,3}.[1-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}' | tail -n 1 )
    echo "${col1},${col2},${result}">> ./result.csv
    
done
```
まず「getIP.sh」というファイルを作成し、上記のコードを貼りつける。

# ドメインリスト
次に、「list.csv」という名前のファイルを「getIP.sh」と同じディレクトリに作成し、以下のような形式でリストを作成する。

- 形式
``` 
対象の名前,ドメイン名
```
- 具体例
```csv:list.csv
東京大学,www.u-tokyo.ac.jp
京都大学,www.kyoto-u.ac.jp
名古屋大学,www.nagoya-u.ac.jp
東北大学,www.tohoku.ac.jp
北海道大学,www.hokudai.ac.jp
大阪大学,www.osaka-u.ac.jp
九州大学,www.kyushu-u.ac.jp
```
# 実行
```sh
$ sh getIP.sh
```
# 結果
実行すると、以下のような形式で結果が得られるはず。
- 形式
```
対象の名前,ドメイン名,IPアドレス
```
- 具体例
``` csv:result.csv
東京大学,www.u-tokyo.ac.jp,210.152.243.234
京都大学,www.kyoto-u.ac.jp,151.101.230.132
名古屋大学,www.nagoya-u.ac.jp,133.6.82.88
東北大学,www.tohoku.ac.jp,130.34.41.233
北海道大学,www.hokudai.ac.jp,52.185.152.108
大阪大学,www.osaka-u.ac.jp,133.1.138.1
九州大学,www.kyushu-u.ac.jp,133.5.12.36
```
もし名前、ドメイン名が必要なければスプレッドシートなどを用いて列を削除

# コードの説明
## 各行の取得
```sh:getIP.sh:
cat list.csv | while read line
do
    #処理
done
```
list.csv内の各行をlineに格納する繰り返し処理を行なっている。
つまり、内部の処理では、lineを参照することで各行の値にアクセスできる。
## 各行に対しての処理
```sh
col1=`echo ${line} | cut -d ',' -f 1`
col2=`echo ${line} | cut -d ',' -f 2`
    
result=$(nslookup $col2 | grep -Eo '[0-9]{1,3}.[0-9]{1,3}.[1-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}' | tail -n 1 )
    echo "${col1},${col2},${result}">> ./result.csv
```
ファイルはcsv形式で保存されているため各行の形式は以下のようになるはずである。
``` 
列１,列２
```
そこで、echoで行を出力した結果をcutに渡し「-d ','」オプションによって「,」で行を分割する。
そして、名前部分は1 「-f １」（１番目の要素を取得する）、ドメイン名部分は「-f 2」（２番目の要素を取得する）をオプションを用いることで、それぞれ取得している。

そしてIPアドレスの取得方法だが、これは、通常通り「nslookup」コマンドを用いている。
通常「nslookup」コマンドを使用すると以下のような結果が返ってくる。
```sh
$ nslookup www.u-tokyo.ac.jp
Server:		202.11.120.202
Address:	202.11.120.202#53

Non-authoritative answer:
Name:	www.u-tokyo.ac.jp
Address: 210.152.243.234
```
そこで、「nslookup」の結果をまず「grep」コマンドで処理する。
この時オプションに「-E」（拡張正規表現）「-o」(マッチした部分だけ出力）を設定している。
IPv4アドレスは以下の形式に従うはずである。
```
(0~9の範囲で1~3文字).(0~9の範囲で1~3文字).(0~9の範囲で1~3文字).(0~9の範囲で1~3文字)
```

よって、それを正規表現で表現すると以下のようになる。
```
[0-9]{1,3}.[0-9]{1,3}.[1-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}
```
しかし、この状態で取得できたアドレスには、本来取得したい、アドレス以外にも上記のDNSサーバーのアドレスも含まれているため、本来取得したい結果を得るため、「tail -n 1」を用いている。
そしてこうして得られた結果を「,」区切りでresult.csvに出力している。

