# ts-dev-template

自分用

## 手順

### 1. (まだなら)bunをインストール

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```
とか いろいろやり方はあるはず

### 2. リポジトリのセットアップ

```bash
bun init -y

# 必要に応じて
npm i @minecraft/vanilla-data
# とか
```

### 3. manifest.jsonを調整

特にdependenciesのversionなんかはベータAPI使いたくない場合には気を付ける あとuuidは勿論忘れちゃダメ

### 4. tsconfigいじってコード書く

[tsconfig.json](/tsconfig.json) を適宜いじる

- `@utils/Vector` とかのユーティリティ付き
- [`@typesentry`](https://github.com/Takenoko-II/TypeSentry) なんかもある

### 5. 型チェック&バンドル

```bash
bun run build
```
で型チェックとバンドルを実行できる...はず
