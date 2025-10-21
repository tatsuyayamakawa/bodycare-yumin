-- ブログ記事管理テーブル
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content JSONB NOT NULL, -- Tiptapのコンテンツ形式
  meta_description TEXT,
  featured_image_url VARCHAR,
  status VARCHAR CHECK (status IN ('draft', 'published', 'private', 'scheduled')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ, -- 予約投稿日時
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON articles(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 予約投稿自動公開用のファンクション
CREATE OR REPLACE FUNCTION publish_scheduled_articles()
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET status = 'published', 
      published_at = NOW()
  WHERE status = 'scheduled' 
    AND scheduled_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) の設定
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 公開された記事は誰でも読み取り可能
CREATE POLICY "Public articles are viewable by everyone" ON articles
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

-- 管理者のみがすべての操作を実行可能（認証済みユーザー）
-- 注意: 実際の運用では適切な認証システムに合わせて調整が必要
CREATE POLICY "Admin can do everything" ON articles
  FOR ALL USING ((select auth.role()) = 'authenticated');

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_articles_updated_at 
BEFORE UPDATE ON articles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();