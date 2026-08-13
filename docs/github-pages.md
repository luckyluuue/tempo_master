# GitHub Pagesで公開する手順

このアプリはビルド不要の静的サイトなので、GitHub Pagesの `Deploy from a branch` で公開できます。

公開後のURLは通常、次の形になります。

```text
https://<GitHubユーザー名>.github.io/<リポジトリ名>/
```

## 1. GitHubでリポジトリを作る

GitHubで新しいリポジトリを作成します。

おすすめ設定:

```text
Repository name: tempo_master
Visibility: Public
Initialize this repository with README: Off
```

GitHub Freeの場合、GitHub PagesはPublicリポジトリなら使えます。PrivateリポジトリでPagesを使うには、有料プラン等が必要になる場合があります。

## 2. ローカルからpushする

このフォルダで、まだGit初期化していない場合:

```bash
git init
git branch -M main
git add .nojekyll README.md index.html styles.css app.js manifest.webmanifest service-worker.js src assets docs
git commit -m "Prepare PWA for GitHub Pages"
git remote add origin https://github.com/luckyluuue/tempo_master.git
git push -u origin main
```

すでにリポジトリがある場合は、`remote add` の代わりに現在のremoteを確認してからpushしてください。

```bash
git remote -v
```

## 3. GitHub Pagesを有効化する

GitHub上でリポジトリを開きます。

1. `Settings` を開く
2. 左メニューの `Pages` を開く
3. `Build and deployment` の `Source` で `Deploy from a branch` を選ぶ
4. `Branch` で `main` を選ぶ
5. フォルダは `/(root)` を選ぶ
6. `Save` を押す

数十秒から数分で公開されます。

## 4. Androidにインストールする

公開URLをAndroid Chromeで開きます。

```text
https://luckyluuue.github.io/tempo_master/
```

日本語ページと英語ページは次のURLです。

```text
https://luckyluuue.github.io/tempo_master/ja/
https://luckyluuue.github.io/tempo_master/en/
```

ルートURLはブラウザ言語に応じて自動的に日本語または英語へ移動します。

Chromeの右上メニューから `アプリをインストール` または `ホーム画面に追加` を選びます。

## 更新したとき

ファイルを変更したら、通常通りcommitしてpushします。

```bash
git add <変更したファイル>
git commit -m "Update app"
git push
```

`service-worker.js` を変更した場合やキャッシュを更新したい場合は、`CACHE_NAME` のバージョンを上げてからpushしてください。

## 注意

- GitHub PagesはHTTPSで配信されるため、PWAインストールに向いています。
- このアプリは相対パスで構成しているので、`/<リポジトリ名>/` 配下でも動く想定です。
- `.nojekyll` はGitHub PagesのJekyll処理を避け、静的ファイルをそのまま配信するために置いています。
