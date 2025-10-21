-- 最終修正版: ビューを使わずに関数で実装してSECURITY DEFINER警告を完全回避

-- 1. 問題のあるビューを完全削除
DROP VIEW IF EXISTS popular_articles CASCADE;
DROP VIEW IF EXISTS popular_articles_this_month CASCADE;

-- 2. ビューの代わりに関数で実装（SECURITY INVOKER）
CREATE OR REPLACE FUNCTION get_popular_articles(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    view_count INTEGER,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
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
    ORDER BY a.view_count DESC, a.published_at DESC
    LIMIT limit_count;
END;
$$;

-- 3. 今月の人気記事取得関数
CREATE OR REPLACE FUNCTION get_popular_articles_this_month(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    view_count INTEGER,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    monthly_views BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
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
    ORDER BY monthly_views DESC, a.view_count DESC, a.published_at DESC
    LIMIT limit_count;
END;
$$;

-- 4. 権限設定
GRANT EXECUTE ON FUNCTION get_popular_articles(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_articles_this_month(INTEGER) TO anon, authenticated;