-- 管理者監査ログテーブル
CREATE TABLE admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL, -- 例: 'toggle_user_status', 'delete_invitation', 'create_post'
  target_type text NOT NULL CHECK (target_type IN ('user', 'invitation', 'blog_post', 'settings', 'session')),
  target_id uuid, -- 対象のID（削除済みの場合もあるのでNULL許可）
  details jsonb, -- 操作の詳細情報（以前の値、新しい値など）
  ip_address inet, -- IPアドレス
  user_agent text, -- ブラウザ情報
  success boolean NOT NULL DEFAULT true, -- 操作の成功/失敗
  error_message text, -- エラーが発生した場合のメッセージ
  created_at timestamp with time zone DEFAULT now()
);

-- インデックス
CREATE INDEX idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_admin_audit_logs_target_type ON admin_audit_logs(target_type);
CREATE INDEX idx_admin_audit_logs_target_id ON admin_audit_logs(target_id);
CREATE INDEX idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- Row Level Security (RLS) の設定
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみがアクセスできるポリシー
CREATE POLICY "Admin users can view audit logs" ON admin_audit_logs
  FOR SELECT USING ((select auth.role()) = 'service_role');

CREATE POLICY "System can insert audit logs" ON admin_audit_logs
  FOR INSERT WITH CHECK ((select auth.role()) = 'service_role');

-- 古いログを削除する関数（例：6ヶ月より古いログを削除）
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_audit_logs 
    WHERE created_at < now() - interval '6 months';
END;
$$ language plpgsql
SET search_path = public;

-- 定期実行用のコメント
-- SELECT cron.schedule('cleanup-old-audit-logs', '0 0 1 * *', 'SELECT cleanup_old_audit_logs();');

-- 操作統計を取得するビュー（SECURITY DEFINERを使用しない安全な実装）
CREATE OR REPLACE VIEW admin_audit_stats AS
SELECT 
  l.admin_user_id,
  u.name as admin_name,
  u.email as admin_email,
  l.action,
  l.target_type,
  COUNT(*) as action_count,
  MAX(l.created_at) as last_action_at
FROM admin_audit_logs l
LEFT JOIN admin_users u ON l.admin_user_id = u.id
WHERE l.created_at >= now() - interval '30 days'
GROUP BY l.admin_user_id, u.name, u.email, l.action, l.target_type
ORDER BY action_count DESC;

-- ビューに対してもRLSポリシーを設定
ALTER VIEW admin_audit_stats OWNER TO postgres;

-- 統計ビュー用のポリシー（管理者のみアクセス可能）
CREATE POLICY "Admin users can view audit stats" ON admin_audit_logs
  FOR SELECT USING ((select auth.role()) = 'service_role');