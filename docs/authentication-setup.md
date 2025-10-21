# 管理者招待制認証システム セットアップガイド

## 概要

このドキュメントでは、BodycareYuminブログの新しい管理者招待制認証システムのセットアップ方法について説明します。

## 実装済み機能

### 1. 認証システム
- **JWT トークンベースセッション管理**
- **bcrypt によるパスワードハッシュ化**
- **管理者招待制によるユーザー登録**
- **セキュアなCookieベース認証**

### 2. ユーザー管理
- **管理者（admin）と編集者（editor）の役割ベースアクセス制御**
- **招待送信・管理機能**
- **ユーザー一覧表示**

### 3. セキュリティ機能
- **HTTPS での Cookie 送信**
- **CSRF 保護**
- **セッション期限管理（7日間）**
- **招待トークンの期限管理（7日間）**

## セットアップ手順

### 1. 環境変数の設定

`.env.local` ファイルに以下を追加：

```env
# JWT署名用のシークレット（本番では必ず変更してください）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# サイトURL（招待URLの生成に使用）
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. データベーススキーマの適用

Supabaseのダッシュボードで `docs/database-schema.sql` の内容を実行：

1. Supabaseダッシュボードにログイン
2. **SQL Editor** を開く
3. `docs/database-schema.sql` の内容をコピー＆ペーストして実行
4. テーブルが正しく作成されたことを確認

### 3. 初期管理者の作成

データベースに直接初期管理者アカウントを作成：

```sql
-- パスワード: admin123 (変更してください)
INSERT INTO admin_users (email, name, password_hash, role) 
VALUES (
  'admin@yourdomain.com',
  'システム管理者', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeIITcOxkKmE0oiKa',
  'admin'
);
```

**重要**: 本番環境では必ずパスワードを変更してください。

### 4. 既存のベーシック認証を無効化

以下のファイルを削除またはリネーム：
- `src/lib/auth/basic-auth.ts` → 使用されなくなりました

環境変数から削除：
```env
# 以下は不要になりました
BLOG_ADMIN_USERNAME=admin
BLOG_ADMIN_PASSWORD=secure_blog_admin_2024
```

## 使用方法

### 1. 初回ログイン

1. `/admin/login` にアクセス
2. 作成した初期管理者アカウントでログイン

### 2. 新しい管理者の招待

1. 管理画面で「ユーザー管理」をクリック
2. 「新規招待」ボタンをクリック  
3. メールアドレスと権限を選択
4. 招待URLが生成され、クリップボードにコピーされます

### 3. 招待からの登録

1. 招待URLにアクセス
2. 名前とパスワードを設定
3. 自動的にログインされ、管理画面にアクセス可能

## ファイル構成

```
src/
├── lib/auth/
│   ├── jwt.ts              # JWT・セッション管理
│   ├── database.ts         # データベース操作
│   └── basic-auth.ts       # 削除予定（旧認証）
├── lib/actions/
│   └── auth.ts             # Server Actions（認証関連）
├── app/admin/
│   ├── login/page.tsx      # ログインページ
│   ├── register/page.tsx   # 招待登録ページ
│   └── users/page.tsx      # ユーザー管理ページ
├── components/admin/
│   ├── user-management.tsx # ユーザー管理コンポーネント
│   └── sidebar.tsx         # サイドバー（ログアウト機能付き）
├── middleware.ts           # 認証ミドルウェア（更新済み）
└── docs/
    ├── database-schema.sql # データベーススキーマ
    └── authentication-setup.md # このファイル
```

## セキュリティ上の注意点

### 1. 本番環境での設定
- `JWT_SECRET` を強力なランダム文字列に設定
- HTTPSを必須に設定
- データベースアクセス制限の確認

### 2. パスワードポリシー
- 最低8文字以上
- 英数字・記号の組み合わせを推奨
- 定期的な変更を推奨

### 3. 招待管理
- 招待は7日間で自動期限切れ
- 使用済み招待は再利用不可
- 期限切れ招待の定期削除を検討

### 4. セッション管理
- セッションは7日間で自動期限切れ
- ログアウト時に即座にセッション削除
- 不正アクセス時のセッション無効化

## トラブルシューティング

### 1. ログインできない
- データベース接続を確認
- JWT_SECRETの設定確認
- 初期管理者の作成確認

### 2. 招待URLが機能しない
- NEXT_PUBLIC_SITE_URLの設定確認
- 招待トークンの期限確認
- データベースのadmin_invitationsテーブル確認

### 3. セッションが切れる
- Cookie設定の確認（HTTPSの場合）
- ブラウザのCookie設定確認
- セッションテーブルの期限切れレコード確認

## メンテナンス

### 期限切れデータの削除

定期的に以下のSQL文を実行することを推奨：

```sql
-- 期限切れの招待とセッションを削除
SELECT cleanup_expired_tokens();
```

または、cron jobとして設定：

```sql
-- Supabase Functions使用例
SELECT cron.schedule(
  'cleanup-expired-tokens',
  '0 2 * * *', -- 毎日午前2時
  'SELECT cleanup_expired_tokens();'
);
```

## マイグレーション完了確認

新しい認証システムが正常に動作することを確認：

1. [ ] 初期管理者でログイン可能
2. [ ] ユーザー管理画面にアクセス可能  
3. [ ] 新規招待の送信が可能
4. [ ] 招待URLから登録が可能
5. [ ] ログアウトが正常に動作
6. [ ] セッション期限が適切に管理される
7. [ ] 管理者以外はユーザー管理にアクセス不可

すべて確認できたら、旧ベーシック認証関連のファイル・環境変数を削除してください。