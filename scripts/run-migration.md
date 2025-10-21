# データベースマイグレーション実行手順

## Supabase SQL Editorを使用する場合（推奨）

1. [Supabase Dashboard](https://app.supabase.com/) にアクセス
2. プロジェクトを選択
3. 左メニューから **SQL Editor** を選択
4. **New query** をクリック
5. `scripts/add-analytics-columns.sql` の内容をコピー&ペースト
6. **Run** ボタンをクリックして実行

## psqlコマンドを使用する場合

```bash
# Supabaseの接続情報を確認（Settings > Database > Connection string）
# 例：postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres

psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres" \
  -f scripts/add-analytics-columns.sql
```

## 実行確認

マイグレーション実行後、以下のクエリで確認：

```sql
-- 新しいカラムが追加されているか確認
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'articles'
AND column_name IN ('ga_view_count', 'ga_monthly_views', 'analytics_synced_at');

-- インデックスが作成されているか確認
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'articles'
AND indexname LIKE 'idx_articles_ga_%';
```

期待される結果：
- `ga_view_count` (integer, default: 0)
- `ga_monthly_views` (integer, default: 0)
- `analytics_synced_at` (timestamp with time zone, nullable)
- 3つのインデックスが作成される