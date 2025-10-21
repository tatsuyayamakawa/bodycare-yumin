-- ログイン/ログアウト専用ログテーブル
-- 監査ログから分離して軽量化
-- 保持期間: 30日間（自動削除）

CREATE TABLE IF NOT EXISTS login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('login', 'logout', 'login_failed')),
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX idx_login_logs_admin_user_id ON login_logs(admin_user_id);
CREATE INDEX idx_login_logs_created_at ON login_logs(created_at);
CREATE INDEX idx_login_logs_action ON login_logs(action);

-- RLS有効化
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみ閲覧可能
CREATE POLICY "管理者はログイン履歴を閲覧可能"
  ON login_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- 自動削除: 30日以上前のログを削除する関数
CREATE OR REPLACE FUNCTION delete_old_login_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM login_logs
  WHERE created_at < now() - INTERVAL '30 days';
END;
$$;

-- 毎日実行するためのスケジュール（pg_cronが有効な場合）
-- SELECT cron.schedule('delete-old-login-logs', '0 0 * * *', 'SELECT delete_old_login_logs()');

-- コメント
COMMENT ON TABLE login_logs IS 'ログイン/ログアウトの履歴（30日間保持）';
COMMENT ON COLUMN login_logs.action IS 'login: ログイン成功, logout: ログアウト, login_failed: ログイン失敗';
COMMENT ON COLUMN login_logs.details IS 'email, reason等の追加情報';
