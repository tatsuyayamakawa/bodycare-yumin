-- Google Analytics 4用のカラムをarticlesテーブルに追加

-- GA4のアクセス数データを保存するカラムを追加
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS ga_view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ga_monthly_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS analytics_synced_at TIMESTAMP WITH TIME ZONE;

-- パフォーマンス向上のためのインデックスを追加
CREATE INDEX IF NOT EXISTS idx_articles_ga_view_count ON articles(ga_view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_ga_monthly_views ON articles(ga_monthly_views DESC);
CREATE INDEX IF NOT EXISTS idx_articles_analytics_synced_at ON articles(analytics_synced_at);

-- コメント追加
COMMENT ON COLUMN articles.ga_view_count IS 'Google Analytics 4からの総アクセス数';
COMMENT ON COLUMN articles.ga_monthly_views IS 'Google Analytics 4からの月間アクセス数';
COMMENT ON COLUMN articles.analytics_synced_at IS 'Google Analyticsと最後に同期した日時';