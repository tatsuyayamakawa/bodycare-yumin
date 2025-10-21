-- 修正版: 記事閲覧数機能のためのデータベース設定

-- 1. 記事テーブルに閲覧数カラムを追加
ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 2. 記事閲覧履歴テーブルを作成（詳細な分析のため）
CREATE TABLE IF NOT EXISTS article_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. インデックスの作成（修正版 - シンプル版）
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views (article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views (viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_ip_address ON article_views (ip_address);

-- 4. 閲覧数を更新するファンクション（重複チェック付き）
CREATE OR REPLACE FUNCTION increment_article_view_count(
    p_article_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- 同じIPアドレスから24時間以内の閲覧をチェック（重複防止）
    IF p_ip_address IS NOT NULL THEN
        SELECT COUNT(*) INTO duplicate_count
        FROM article_views
        WHERE article_id = p_article_id
          AND ip_address = p_ip_address
          AND viewed_at > NOW() - INTERVAL '24 hours';
          
        -- 重複の場合は処理しない
        IF duplicate_count > 0 THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- 閲覧履歴を記録
    INSERT INTO article_views (article_id, ip_address, user_agent, referrer)
    VALUES (p_article_id, p_ip_address, p_user_agent, p_referrer);

    -- 記事の閲覧数を更新
    UPDATE articles 
    SET view_count = view_count + 1 
    WHERE id = p_article_id;

    RETURN TRUE;
END;
$$;

-- 5. 人気記事取得用のビュー
CREATE OR REPLACE VIEW popular_articles AS
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

-- 6. 今月の人気記事取得用のビュー
CREATE OR REPLACE VIEW popular_articles_this_month AS
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

-- 7. RLS設定（記事閲覧は誰でも可能、閲覧履歴の詳細は管理者のみ）
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- 閲覧履歴の挿入は誰でも可能（匿名含む）
CREATE POLICY "Anyone can insert article views" ON article_views
    FOR INSERT WITH CHECK (true);

-- 閲覧履歴の参照は管理者のみ
CREATE POLICY "Admin users can view article views" ON article_views
    FOR SELECT USING (
        (SELECT auth.uid()) IN (
            SELECT id FROM admin_users WHERE is_active = true
        )
    );