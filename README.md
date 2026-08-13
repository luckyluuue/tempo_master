# PolyPulse Practice

右手と左手で異なる分割を刻む、ポリリズム練習用プロトタイプです。

## 使い方

静的サーバーでこのフォルダを配信して使います。初期値は 4/4、BPM 72、周期 1拍、右手 3、左手 2 です。右手は右手内で常に同じ音、左手は左手内で常に同じ音が鳴ります。

手元で簡単に確認する場合:

```bash
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000/` を開きます。

上部の `ポリリズム` / `メトロノーム` で練習モードを切り替えられます。BPMと拍子は両方のモードで共通です。

ポリリズムでは、打数を変えると右手/左手それぞれの刻み数が変わります。

再生モードは `両手` / `右手だけ` / `左手だけ` を切り替えられます。片手ずつ太ももを叩いて慣れてから、両手モードに戻す練習を想定しています。

メトロノームでは、細分、音色、1拍目のアクセントを切り替えられます。

設定値はブラウザに保存され、次回起動時の初期値として復元されます。再生中かどうかは保存されません。

## Android化の方針

まずはこの静的WebアプリをPWAとして育てるのが一番軽いです。スマホでの使い勝手と音の遅延に納得できたら、次の段階で Capacitor を使ってAndroidアプリとして包む構成にできます。

音の生成はWeb Audio APIで実装しているため、Android化しても同じリズムエンジンを再利用できます。

Androidへのインストール手順は [docs/android-install.md](docs/android-install.md) にまとめています。

GitHub Pagesで公開する手順は [docs/github-pages.md](docs/github-pages.md) にまとめています。

GitHub Pagesでは `/ja/`、`/en/`、`/es/` の言語別URLを公開し、ルート `/` はブラウザ言語に応じて自動的に振り分けます。

## 構成

```text
index.html
styles.css
app.js
src/
  main.js
  rhythmEngine.js
  settings.js
  soundProfiles.js
  timing.js
  ui.js
```
