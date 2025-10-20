-- ============================================
-- 予約システム セキュリティ問題修正
-- ============================================
-- 作成日: 2025-10-20
-- 説明: Supabase Advisorで検出されたセキュリティ問題を修正
-- ============================================

-- ============================================
-- 1. SECURITY DEFINER ビューの修正
-- ============================================
-- 問題: upcoming_bookings と past_bookings が SECURITY DEFINER で定義されている
-- 解決: SECURITY INVOKER に変更（クエリ実行ユーザーの権限で実行）
-- ============================================

-- upcoming_bookings ビューを再作成（SECURITY INVOKER）
DROP VIEW IF EXISTS upcoming_bookings;

CREATE VIEW upcoming_bookings
WITH (security_invoker = true) AS
SELECT
  b.*,
  c.name as customer_name,
  c.email as customer_email,
  c.phone as customer_phone
FROM bookings b
JOIN customers c ON b.user_id = c.user_id
WHERE b.booking_datetime >= NOW()
  AND b.status IN ('pending', 'accepted')
ORDER BY b.booking_datetime ASC;

COMMENT ON VIEW upcoming_bookings IS '今後の予約一覧（SECURITY INVOKER）';

-- past_bookings ビューを再作成（SECURITY INVOKER）
DROP VIEW IF EXISTS past_bookings;

CREATE VIEW past_bookings
WITH (security_invoker = true) AS
SELECT
  b.*,
  c.name as customer_name,
  c.email as customer_email,
  c.phone as customer_phone
FROM bookings b
JOIN customers c ON b.user_id = c.user_id
WHERE b.booking_datetime < NOW()
  OR b.status IN ('cancelled', 'completed')
ORDER BY b.booking_datetime DESC;

COMMENT ON VIEW past_bookings IS '過去の予約一覧（SECURITY INVOKER）';

-- ============================================
-- 2. schema_versions テーブルのRLS有効化
-- ============================================
-- 問題: schema_versions テーブルでRLSが無効
-- 解決: RLSを有効化し、適切なポリシーを設定
-- ============================================

-- RLSを有効化
ALTER TABLE schema_versions ENABLE ROW LEVEL SECURITY;

-- 全ての認証済みユーザーが閲覧可能（バージョン情報は公開情報）
CREATE POLICY "Authenticated users can view schema versions"
  ON schema_versions FOR SELECT
  TO authenticated
  USING (true);

-- サービスロールのみが挿入可能（マイグレーション用）
CREATE POLICY "Service role can insert schema versions"
  ON schema_versions FOR INSERT
  TO service_role
  WITH CHECK (true);

COMMENT ON TABLE schema_versions IS 'データベーススキーマのバージョン管理（RLS有効）';

-- ============================================
-- 確認クエリ
-- ============================================

-- ビューのセキュリティ設定を確認
SELECT
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE viewname IN ('upcoming_bookings', 'past_bookings');

-- RLS有効化状態を確認
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'schema_versions';

-- ポリシー一覧を確認
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('schema_versions', 'upcoming_bookings', 'past_bookings')
ORDER BY tablename, policyname;

-- ============================================
-- 完了
-- ============================================
-- 全てのセキュリティ問題が修正されました
-- Supabase Advisorで再度確認してください
-- ============================================
