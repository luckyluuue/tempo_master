# Androidへのインストール手順

このアプリはPWAとしてAndroidにインストールできます。APKを作る前段階として、まずはこの方法が一番軽いです。

## 推奨: HTTPSで公開してインストール

PWAとしてきれいにインストールするには、`https://` のURLで配信する必要があります。

静的ファイルだけで動くため、GitHub Pages、Cloudflare Pages、Netlify、Vercelなどにそのまま置けます。

公開するファイル:

```text
index.html
styles.css
app.js
manifest.webmanifest
service-worker.js
assets/
src/
```

公開後、Android ChromeでURLを開きます。

1. AndroidのChromeで公開URLを開く
2. 右上メニューを開く
3. `アプリをインストール` または `ホーム画面に追加` を選ぶ
4. ホーム画面の `PolyPulse` アイコンから起動する

一度起動すると、Service Workerにより主要ファイルがキャッシュされます。

## 公開前にAndroid実機で試す

PCとAndroidをUSB接続し、Android側からPCのローカルサーバーを `localhost` として見る方法です。外部公開せずに試せます。

必要なもの:

- Android端末
- Android Chrome
- USBデバッグを有効化
- PC側で `adb` コマンドが使えること

PCでこのフォルダを配信します。

```bash
python -m http.server 8000
```

別のターミナルで、AndroidからPCの `8000` 番を見られるようにします。

```bash
adb reverse tcp:8000 tcp:8000
```

Android Chromeで次を開きます。

```text
http://127.0.0.1:8000/
```

その後、Chromeのメニューから `アプリをインストール` または `ホーム画面に追加` を選びます。

## インストール後に更新した場合

ファイルを更新したら、`service-worker.js` の `CACHE_NAME` を上げます。すでに `v17` のような形で管理しています。

Android側で反映されない場合:

1. ChromeでアプリURLを開く
2. ページを再読み込みする
3. それでも古い場合は、Chromeのサイト設定からストレージを削除して再アクセスする

## APK化したい場合

PWAで使い勝手が固まったら、次の段階で Capacitor を使ってAPK化できます。その場合も現在の `src/` とWeb Audioのリズムエンジンはそのまま再利用できます。
