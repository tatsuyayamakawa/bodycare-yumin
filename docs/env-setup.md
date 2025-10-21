# 環境変数設定ガイド

以下の環境変数を `.env.local` ファイルに追加してください：

```env
# Supabase設定（既存）
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT認証設定（新規追加）
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# サイトURL（招待URL生成用）
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 旧ベーシック認証（削除可能）
# BLOG_ADMIN_USERNAME=admin
# BLOG_ADMIN_PASSWORD=secure_blog_admin_2024
```

## 重要な注意事項

1. **JWT_SECRET**: 最低32文字以上の強力なランダム文字列を設定してください
2. **本番環境**: 初期パスワード（admin123, editor123）は必ず変更してください
3. **Supabase RLS**: Row Level Security が有効になっており、service_roleのみアクセス可能です

## パスワード変更方法

初期パスワードを変更する場合は、以下のSQLを使用：

```sql
-- 新しいパスワードをハッシュ化（Node.jsで実行）
-- bcrypt.hash('新しいパスワード', 12)

-- データベースで更新
UPDATE admin_users 
SET password_hash = '$2a$12$新しいハッシュ値'
WHERE email = 'admin@bodycare-yumin.com';
```