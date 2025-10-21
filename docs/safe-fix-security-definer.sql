-- 安全版: エラーを回避してSECURITY DEFINER警告を解消

-- 1. 既存のビューを安全に削除（存在しない場合はスキップ）
DROP VIEW IF EXISTS popular_articles CASCADE;
DROP VIEW IF EXISTS popular_articles_this_month CASCADE;

-- 2. 完全にクリーンな状態で再作成
-- security_barrier=falseを明示してSECURITY DEFINERを回避
CREATE VIEW popular_articles 
WITH (security_barrier=false)
AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.view_count,
    a.published_at,
    a.created_at
FROM articles a
WHERE a.status = 'published'
  AND a.published_at IS NOT NULL
  AND a.published_at <= NOW()
ORDER BY a.view_count DESC, a.published_at DESC;

-- 今月の人気記事ビュー
CREATE VIEW popular_articles_this_month
WITH (security_barrier=false)
AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.view_count,
    a.published_at,
    a.created_at,
    COUNT(av.id) as monthly_views
FROM articles a
LEFT JOIN article_views av ON a.id = av.article_id 
    AND av.viewed_at >= DATE_TRUNC('month', NOW())
WHERE a.status = 'published'
  AND a.published_at IS NOT NULL
  AND a.published_at <= NOW()
GROUP BY a.id, a.title, a.slug, a.view_count, a.published_at, a.created_at
ORDER BY monthly_views DESC, a.view_count DESC, a.published_at DESC;

-- 3. 適切な権限設定（ビューが作成されてから）
GRANT SELECT ON popular_articles TO anon;
GRANT SELECT ON popular_articles TO authenticated;
GRANT SELECT ON popular_articles_this_month TO anon;
GRANT SELECT ON popular_articles_this_month TO authenticated;

-- 4. 確認用クエリ（実行後に使用）
-- SELECT 
--     schemaname, 
--     viewname, 
--     viewowner,
--     definition
-- FROM pg_views 
-- WHERE viewname IN ('popular_articles', 'popular_articles_this_month');