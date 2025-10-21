-- セキュリティアドバイザー警告修正: SECURITY DEFINERをビューから削除

-- 既存のビューを削除
DROP VIEW IF EXISTS popular_articles;
DROP VIEW IF EXISTS popular_articles_this_month;

-- 修正版: SECURITY DEFINERなしでビューを再作成
CREATE VIEW popular_articles AS
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

-- 今月の人気記事取得用のビュー（SECURITY DEFINERなし）
CREATE VIEW popular_articles_this_month AS
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

-- ビューに対するRLSポリシー設定（必要に応じて）
-- 注意: ビューはRLSを直接持てないため、基底テーブル(articles)のRLSが適用される