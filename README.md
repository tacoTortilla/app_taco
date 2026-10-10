# 🌮 Taco Navi

タコス店とタコス情報をまとめてチェックできる React アプリです。

## 機能
- お店を探す：キーワード検索・エリア・タグ（テイクアウト等）での絞り込み、並び替え
- タコス図鑑：タコスの種類ごとの解説。タップでそのタコスが食べられるお店へ
- お気に入り：ブラウザ（localStorage）に保存

## ローカルで動かす
```bash
npm install
npm run dev      # http://localhost:5173
```

## GitHub Pages で公開
`main` に push すると `.github/workflows/deploy.yml` がビルドして公開します。
初回のみ、リポジトリの **Settings → Pages → Source** を **GitHub Actions** にしてください。

公開URL: https://tacotortilla.github.io/app_taco/

## データ
- `src/data/shops.json` … 店舗（現在はサンプル）
- `src/data/tacos.json` … タコスの種類
- データ取得は `src/api.js` に集約しているので、サーバ版ではここを API 呼び出しに差し替えます。
