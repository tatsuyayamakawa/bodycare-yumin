# 手もみ整体 癒眠

手もみ整体 癒眠の公式Webサイトです。

このプロジェクトは [Next.js](https://nextjs.org) を使用して構築されています。

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org) 15.3.1
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **フォーム処理**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **地図表示**: [@vis.gl/react-google-maps](https://github.com/visgl/react-google-maps)
- **アイコン**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **通知**: [Sonner](https://sonner.emilkowal.ski/)
- **メール送信**: [Resend](https://resend.com/) + [@react-email/components](https://react.email/docs/introduction)
- **パッケージマネージャー**: [Bun](https://bun.sh/)

## 機能

- レスポンシブデザイン
- サービス紹介
- アクセス情報（Googleマップ統合）
- オンライン予約システム
- お問い合わせフォーム
- 営業カレンダー

## 開発環境のセットアップ

1. リポジトリのクローン:

```bash
git clone [https://github.com/tatsuyayamakawa/bodycare-yumin.git]
cd bodycare-yumin
```

2. 依存関係のインストール:

```bash
bun install
```

3. 環境変数の設定:

`.env.local`ファイルを作成し、必要な環境変数を設定してください。

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RESEND_API_KEY=your_resend_api_key
```

4. 開発サーバーの起動:

```bash
bun run dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開いて結果を確認できます。

## 利用可能なスクリプト

- `bun run dev` - 開発サーバーを起動
- `bun run build` - プロダクション用ビルドを作成
- `bun run start` - ビルドされたアプリケーションを起動
- `bun run lint` - ESLintでコード検証を実行
- `bun run format` - Prettierでコードをフォーマット
- `bun run type-check` - TypeScriptの型チェックを実行
- `bun run check` - lint と type-check を実行
- `bun run clean` - ビルドキャッシュをクリア
- `bun run analyze` - バンドル分析を実行

&copy; 2012 - 2025 bodycare-yumin.com All rights reserved.
