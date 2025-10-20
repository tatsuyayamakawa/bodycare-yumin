# 予約システム データベースセットアップガイド

このガイドでは、予約システムに必要なSupabaseデータベーステーブルを作成する手順を説明します。

## 前提条件

- Supabaseプロジェクトが作成済み
- Supabaseダッシュボードへのアクセス権限
- 環境変数が設定済み（`.env.local`）

## セットアップ手順

### 1. Supabase ダッシュボードにログイン

1. https://app.supabase.com にアクセス
2. プロジェクトを選択
3. 左サイドバーから「SQL Editor」を選択

### 2. SQLスクリプトの実行

#### オプション1: 手動実行（推奨）

1. 以下のSQLファイルの内容をコピー：
   - `docs/database/booking-system-schema.sql`

2. SQL Editorに貼り付け

3. 「Run」ボタンをクリックして実行

4. エラーがないことを確認

#### オプション2: セクションごとに実行

大きなSQLファイルの場合、以下の順序でセクションごとに実行することを推奨：

1. **customers テーブル**
   ```sql
   CREATE TABLE IF NOT EXISTS customers (...);
   CREATE INDEX ...;
   CREATE TRIGGER ...;
   ```

2. **bookings テーブル**
   ```sql
   CREATE TABLE IF NOT EXISTS bookings (...);
   CREATE INDEX ...;
   CREATE TRIGGER ...;
   ```

3. **business_hours テーブル**
   ```sql
   CREATE TABLE IF NOT EXISTS business_hours (...);
   INSERT INTO business_hours ...;
   ```

4. **holidays テーブル**
   ```sql
   CREATE TABLE IF NOT EXISTS holidays (...);
   ```

5. **booking_slots テーブル**
   ```sql
   CREATE TABLE IF NOT EXISTS booking_slots (...);
   ```

6. **booking_settings テーブル**
   ```sql
   CREATE TABLE IF NOT EXISTS booking_settings (...);
   INSERT INTO booking_settings ...;
   ```

7. **RLS ポリシー**
   ```sql
   ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
   CREATE POLICY ...;
   ```

8. **ビューとファンクション**
   ```sql
   CREATE OR REPLACE VIEW ...;
   CREATE OR REPLACE FUNCTION ...;
   ```

### 3. テーブル作成の確認

SQL Editorで以下のクエリを実行して、テーブルが正しく作成されたことを確認：

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'customers',
    'bookings',
    'business_hours',
    'holidays',
    'booking_slots',
    'booking_settings'
  )
ORDER BY table_name;
```

**期待される結果:**
```
table_name
-----------------
booking_settings
booking_slots
bookings
business_hours
customers
holidays
```

### 4. RLSポリシーの確認

以下のクエリでRLSポリシーが有効になっていることを確認：

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN (
  'customers',
  'bookings',
  'business_hours',
  'holidays',
  'booking_slots',
  'booking_settings'
);
```

`rowsecurity`列が`true`になっていることを確認してください。

### 5. 初期データの確認

#### business_hours（営業時間）

```sql
SELECT * FROM business_hours ORDER BY day_of_week;
```

**期待される結果:** 7行（日曜〜土曜の営業時間設定）

#### booking_settings（予約設定）

```sql
SELECT * FROM booking_settings ORDER BY key;
```

**期待される結果:** 6行（各種設定値）

## トラブルシューティング

### エラー: "permission denied for schema public"

**原因:** スキーマへのアクセス権限がない

**解決策:**
```sql
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
```

### エラー: "extension uuid-ossp does not exist"

**原因:** UUID拡張機能が有効になっていない

**解決策:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### エラー: "function gen_random_uuid() does not exist"

**原因:** pgcrypto拡張機能が有効になっていない

**解決策:**
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### テーブルが既に存在する場合

既存のテーブルを削除して再作成する場合（**注意: データが失われます**）：

```sql
-- 警告: 本番環境では絶対に実行しないでください
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS business_hours CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;
DROP TABLE IF EXISTS booking_slots CASCADE;
DROP TABLE IF EXISTS booking_settings CASCADE;
```

その後、`booking-system-schema.sql`を再実行してください。

## 次のステップ

データベースセットアップが完了したら、次のタスクに進みます：

1. ✅ データベーステーブル作成完了
2. ⬜ Supabase型定義の更新
3. ⬜ 認証システムの実装
4. ⬜ Square API連携（顧客・予約）

## 参考情報

- [Supabase SQL Editor ドキュメント](https://supabase.com/docs/guides/database/overview)
- [Row Level Security (RLS) ガイド](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)

---

**作成日:** 2025-10-20
**更新日:** 2025-10-20
