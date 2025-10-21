-- articlesテーブルにeyecatch_defaultカラムを追加
ALTER TABLE articles ADD COLUMN IF NOT EXISTS eyecatch_default VARCHAR;

-- 既存の記事にデフォルト値を設定する場合（オプション）
-- UPDATE articles SET eyecatch_default = '/eyecatch.png' WHERE eyecatch_default IS NULL;