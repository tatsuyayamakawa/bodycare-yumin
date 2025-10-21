-- 既存のビューを完全に削除
DROP VIEW IF EXISTS admin_audit_stats CASCADE;

-- 新しいビューを明示的にSECURITY INVOKERで作成
CREATE VIEW admin_audit_stats 
WITH (security_invoker = true) AS
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

-- ビューの所有者を適切に設定
ALTER VIEW admin_audit_stats OWNER TO postgres;

-- セキュリティプロパティを確認（SECURITY INVOKERになっているはず）
SELECT 
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views 
WHERE viewname = 'admin_audit_stats';

-- 追加確認：セキュリティオプションを表示
SELECT 
  c.relname,
  c.reloptions
FROM pg_class c
WHERE c.relname = 'admin_audit_stats' AND c.relkind = 'v';

-- ビューに対するRLSポリシーは、基底テーブル（admin_audit_logs）のポリシーが適用される
-- 追加のセキュリティポリシーは不要（admin_audit_logsのポリシーで制御）

-- 確認用：ビューの定義を表示
-- SELECT definition FROM pg_views WHERE viewname = 'admin_audit_stats';