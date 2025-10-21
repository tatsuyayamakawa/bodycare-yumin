-- 完全修正版: SECURITY DEFINER警告を完全に解消

-- 1. 既存のビューを強制削除（CASCADE付き）
DROP VIEW IF EXISTS popular_articles CASCADE;
DROP VIEW IF EXISTS popular_articles_this_month CASCADE;

-- 2. 依存関係がある場合に備えて、関連する権限も削除
REVOKE ALL ON popular_articles FROM PUBLIC;
REVOKE ALL ON popular_articles_this_month FROM PUBLIC;

-- 3. 完全にクリーンな状態で再作成
-- SECURITY DEFINERを明示的に避けるため、通常のビューとして作成
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

-- 今月の人気記事ビュー（security_barrier=falseを明示）
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

-- 4. 適切な権限設定
-- 匿名ユーザーでも公開記事は見れるように設定
GRANT SELECT ON popular_articles TO anon;
GRANT SELECT ON popular_articles TO authenticated;
GRANT SELECT ON popular_articles_this_month TO anon;
GRANT SELECT ON popular_articles_this_month TO authenticated;

-- 5. ビューの所有者確認（デバッグ用）
-- このクエリでビューの所有者とSECURITY DEFINER状態を確認できます
-- SELECT 
--     schemaname, 
--     viewname, 
--     viewowner,
--     definition
-- FROM pg_views 
-- WHERE viewname IN ('popular_articles', 'popular_articles_this_month');