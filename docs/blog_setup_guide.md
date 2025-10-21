# ブログ機能セットアップガイド

## 概要
bodycare-yumin サイトにブログ機能を追加するための完全なセットアップガイドです。

## 前提条件
- Node.js 18+ がインストールされていること
- Bun がインストールされていること
- Supabase アカウントを持っていること
- Vercel アカウント（デプロイ用）

## 1. Supabase プロジェクトのセットアップ

### 1.1 Supabase プロジェクト作成
1. [Supabase Console](https://app.supabase.com) にログイン
2. 新しいプロジェクトを作成
3. プロジェクト URL と API キーをメモする

### 1.2 データベーステーブル作成
`docs/database/articles_table.sql` のSQLをSupabase SQL Editorで実行：

```sql
-- ファイル内容をそのまま実行
```

### 1.3 Row Level Security 設定
- Public読み取りポリシーが適用されていることを確認
- 管理者用ポリシーが設定されていることを確認

## 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Blog Admin Authentication
BLOG_ADMIN_USERNAME=admin
BLOG_ADMIN_PASSWORD=your_secure_password

# Cron Job Security
CRON_SECRET=your_secure_cron_secret

# Environment
NODE_ENV=development
```

## 3. 依存関係のインストール

```bash
bun install
```

必要な依存関係は既に `package.json` に追加済みです：
- @supabase/supabase-js
- @tiptap/react および関連パッケージ
- bcryptjs
- lowlight

## 4. 開発サーバーの起動

```bash
bun dev
```

## 5. 機能確認

### 5.1 フロントエンド
- `http://localhost:3000/blog` - ブログ一覧ページ
- ナビゲーションにブログリンクが追加されていることを確認

### 5.2 管理画面
- `http://localhost:3000/admin` - 管理画面
- ベーシック認証でログイン（設定したユーザー名・パスワード）
- 記事の作成・編集・削除機能をテスト

## 6. Vercel デプロイ設定

### 6.1 環境変数設定
Vercel Dashboard で以下の環境変数を設定：
- すべての `.env.local` の変数
- `CRON_SECRET` は特にセキュアな値を設定

### 6.2 Cron Jobs
`vercel.json` が既に設定済み：
- `/api/cron/publish-scheduled` が5分間隔で実行される
- 予約投稿の自動公開を処理

## 7. セキュリティ設定

### 7.1 管理画面認証
- 強力なパスワードを設定
- 可能であればパスワードをハッシュ化

### 7.2 API セキュリティ
- Cron Job エンドポイントは `CRON_SECRET` で保護
- Supabase RLS でデータアクセスを制限

## 8. 使用方法

### 8.1 記事作成
1. `/admin` にアクセス
2. 「新規作成」をクリック
3. フォームに入力：
   - タイトル（必須）
   - スラッグ（自動生成また手動入力）
   - 本文（Tiptap エディター）
   - メタディスクリプション
   - アイキャッチ画像URL
   - 公開状態選択

### 8.2 予約投稿
1. 記事作成時に「予約投稿」を選択
2. 予約日時を設定
3. Cron Jobが自動的に公開処理

### 8.3 記事編集
1. 管理画面の記事一覧から「編集」
2. 内容を修正して保存

## 9. トラブルシューティング

### 9.1 データベース接続エラー
- 環境変数の設定を確認
- Supabase プロジェクトの状態を確認

### 9.2 認証エラー
- ユーザー名・パスワードの設定を確認
- ミドルウェアの動作を確認

### 9.3 Tiptap エディターエラー
- クライアントサイドでのみ動作することを確認
- ブラウザのJavaScriptエラーをチェック

## 10. カスタマイズ

### 10.1 エディター機能追加
`src/components/blog/editor/rich-text-editor.tsx` でTiptap拡張を追加

### 10.2 スタイル調整
- Tailwind CSS クラスで見た目を調整
- `src/components/blog/article-content.tsx` で記事表示スタイルを変更

### 10.3 SEO対応
- メタタグは自動生成済み
- 必要に応じて `generateMetadata` をカスタマイズ

## 実装完了項目

✅ **Phase 1: 基盤構築**
- データベーステーブル作成
- Supabase接続設定  
- CRUD API実装（Server Actions）
- 管理ページ認証実装

✅ **Phase 2: 予約投稿システム**
- Cron Job実装
- 自動公開システム構築

✅ **Phase 3: エディター機能**
- Tiptapエディター実装
- 記事作成・編集フォーム
- 画像・テーブル・リンク対応

✅ **Phase 4: フロントエンド**
- ブログ一覧ページ
- 記事詳細ページ
- ナビゲーション追加
- レスポンシブ対応

✅ **Phase 5: 管理機能**
- 管理画面UI
- 記事管理機能
- プレビュー・編集・削除機能

すべての要件定義書の機能が実装完了しています。