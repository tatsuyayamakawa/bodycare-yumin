-- 活動ログテーブルの作成
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs (action_type);

-- RLS（Row Level Security）の設定
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能にするポリシー（パフォーマンス最適化済み）
CREATE POLICY "Admin users can view activity logs" ON activity_logs
    FOR SELECT USING (
        (SELECT auth.uid()) IN (SELECT id FROM admin_users WHERE is_active = true)
    );

CREATE POLICY "Admin users can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (
        (SELECT auth.uid()) IN (SELECT id FROM admin_users WHERE is_active = true)
    );

-- 活動タイプの制約
ALTER TABLE activity_logs 
ADD CONSTRAINT activity_logs_action_type_check 
CHECK (action_type IN (
    'article_created',
    'article_published', 
    'article_unpublished',
    'article_updated',
    'article_deleted',
    'draft_saved',
    'user_login',
    'user_registered',
    'scheduled_post_published'
));