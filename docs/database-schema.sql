-- 管理者ユーザーテーブル
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 招待テーブル
CREATE TABLE admin_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_by uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  used_at timestamp with time zone DEFAULT NULL,
  used_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamp with time zone DEFAULT now()
);

-- 管理者セッションテーブル
CREATE TABLE admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_accessed_at timestamp with time zone DEFAULT now()
);

-- インデックス
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_invitations_token ON admin_invitations(token);
CREATE INDEX idx_admin_invitations_expires_at ON admin_invitations(expires_at);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);

-- Row Level Security (RLS) の設定
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- 管理者のみがアクセスできるポリシー
CREATE POLICY "Admin users can view all admin_users" ON admin_users
  FOR SELECT USING ((select auth.role()) = 'service_role');

CREATE POLICY "Admin users can manage invitations" ON admin_invitations
  FOR ALL USING ((select auth.role()) = 'service_role');

CREATE POLICY "Admin users can manage sessions" ON admin_sessions
  FOR ALL USING ((select auth.role()) = 'service_role');

-- トリガーでupdated_atを自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql
SET search_path = public;

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 期限切れのデータを削除する関数
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    -- 期限切れの招待を削除
    DELETE FROM admin_invitations WHERE expires_at < now() AND used_at IS NULL;
    
    -- 期限切れのセッションを削除
    DELETE FROM admin_sessions WHERE expires_at < now();
END;
$$ language plpgsql
SET search_path = public;