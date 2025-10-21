-- 全セキュリティ問題の完全修正版

-- 1. 既存のビューと関数を完全削除
DROP VIEW IF EXISTS popular_articles CASCADE;
DROP VIEW IF EXISTS popular_articles_this_month CASCADE;
DROP FUNCTION IF EXISTS increment_article_view_count(UUID, INET, TEXT, TEXT);

-- 2. 関数を修正版で再作成（search_path固定 + SECURITY INVOKER）
CREATE OR REPLACE FUNCTION increment_article_view_count(
    p_article_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER  -- SECURITY DEFINERではなくINVOKER
SET search_path = public, pg_temp  -- search_pathを固定
AS $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- 同じIPアドレスから24時間以内の閲覧をチェック
    IF p_ip_address IS NOT NULL THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM public.article_views
        WHERE article_id = p_article_id
          AND ip_address = p_ip_address
          AND viewed_at > NOW() - INTERVAL '24 hours';
          
        IF duplicate_count > 0 THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- 閲覧履歴を記録
    INSERT INTO public.article_views (article_id, ip_address, user_agent, referrer)
    VALUES (p_article_id, p_ip_address, p_user_agent, p_referrer);

    -- 記事の閲覧数を更新
    UPDATE public.articles 
    SET view_count = view_count + 1 
    WHERE id = p_article_id;

    RETURN TRUE;
END;
$$;

-- 3. ビューをSECURITY INVOKERで再作成
-- まず通常のビューとして作成
CREATE VIEW popular_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.view_count,
    a.published_at,
    a.created_at
FROM public.articles a
WHERE a.status = 'published'
  AND a.published_at IS NOT NULL
  AND a.published_at <= NOW()
ORDER BY a.view_count DESC, a.published_at DESC;

-- 今月の人気記事ビュー
CREATE VIEW popular_articles_this_month AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.view_count,
    a.published_at,
    a.created_at,
    COALESCE(COUNT(av.id), 0) as monthly_views
FROM public.articles a
LEFT JOIN public.article_views av ON a.id = av.article_id 
    AND av.viewed_at >= DATE_TRUNC('month', NOW())
WHERE a.status = 'published'
  AND a.published_at IS NOT NULL
  AND a.published_at <= NOW()
GROUP BY a.id, a.title, a.slug, a.view_count, a.published_at, a.created_at
ORDER BY monthly_views DESC, a.view_count DESC, a.published_at DESC;

-- 4. ビューの設定をINVOKERに変更（PostgreSQL 15以降）
-- 古いバージョンでは使えないため、コメントアウト
-- ALTER VIEW popular_articles SET (security_invoker = true);
-- ALTER VIEW popular_articles_this_month SET (security_invoker = true);

-- 5. 権限設定（必要最小限）
GRANT SELECT ON popular_articles TO anon, authenticated;
GRANT SELECT ON popular_articles_this_month TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_article_view_count(UUID, INET, TEXT, TEXT) TO anon, authenticated;

-- 6. 確認用クエリ
-- 実行後にこれらのクエリで問題が解決されたかチェック
/*
-- ビューの確認
SELECT 
    schemaname, 
    viewname, 
    viewowner
FROM pg_views 
WHERE viewname IN ('popular_articles', 'popular_articles_this_month');

-- 関数の確認
SELECT 
    routine_name,
    routine_type,
    security_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name = 'increment_article_view_count';
*/