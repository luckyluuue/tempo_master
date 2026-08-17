# PolyPulse Practice

[日本語](README.ja.md) / [English](README.en.md) / [Español](README.es.md)

アプリを開く:

https://luckyluuue.github.io/tempo_master/

右手と左手で異なる分割を刻む、アラベスクNo.1・ポリリズム・メトロノーム練習用のPWAです。

## 使い方

上部の `ポリリズム` / `メトロノーム` / `Arabesque No.1` で練習モードを切り替えられます。BPMと拍子は各モードで共通です。

ポリリズムでは、打数を変えると右手/左手それぞれの刻み数が変わります。再生モードは `両手` / `右手だけ` / `左手だけ` を切り替えられます。

メトロノームでは、細分、音色、1拍目のアクセントを切り替えられます。

Arabesque No.1では、画面上の楽譜の小節をクリックすると、その小節から登録済みの最後の小節まで右手と左手のリズムだけを鳴らせます。小節ごとの発音位置と楽譜上のクリック範囲は `src/arabesqueData.js` に定義しています。

設定値はブラウザに保存され、次回起動時の初期値として復元されます。再生中かどうかは保存されません。

## ローカル確認

```bash
npm install
npm run dev
```

その後、表示されたURLをブラウザで開きます。日本語ページを直接見る場合は `http://127.0.0.1:5173/ja/` です。

## Android

Androidへのインストール手順は [android-install.md](android-install.md) にまとめています。

## GitHub Pages

GitHub Pagesで公開する手順は [github-pages.md](github-pages.md) にまとめています。

## 構成

```text
index.html
ja/
en/
es/
styles.css
app.js
src/
  main.js
  arabesqueData.js
  rhythmEngine.js
  settings.js
  soundProfiles.js
  timing.js
  ui.js
  i18n.js
```
