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

-- RLSを有効化（既に有効な場合はスキップされる）
ALTER TABLE schema_versions ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除してから再作成
DROP POLICY IF EXISTS "Authenticated users can view schema versions" ON schema_versions;
CREATE POLICY "Authenticated users can view schema versions"
  ON schema_versions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Service role can insert schema versions" ON schema_versions;
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
-- 3. ファンクションのsearch_path設定
-- ============================================
-- 問題: 全てのファンクションでsearch_pathが設定されていない
-- 解決: SET search_path = public を追加（セキュリティリスク軽減）
-- ============================================

-- update_customers_updated_at
DROP FUNCTION IF EXISTS update_customers_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customers_updated_at();

-- update_bookings_updated_at
DROP FUNCTION IF EXISTS update_bookings_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- update_business_hours_updated_at
DROP FUNCTION IF EXISTS update_business_hours_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_business_hours_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_hours_updated_at
  BEFORE UPDATE ON business_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_business_hours_updated_at();

-- update_booking_slots_updated_at
DROP FUNCTION IF EXISTS update_booking_slots_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_booking_slots_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_slots_updated_at
  BEFORE UPDATE ON booking_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_slots_updated_at();

-- update_booking_settings_updated_at
DROP FUNCTION IF EXISTS update_booking_settings_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_booking_settings_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_settings_updated_at
  BEFORE UPDATE ON booking_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_settings_updated_at();

-- generate_booking_slots
DROP FUNCTION IF EXISTS generate_booking_slots(DATE, INTEGER);
CREATE OR REPLACE FUNCTION generate_booking_slots(
  target_date DATE,
  slot_duration INTEGER DEFAULT 30
)
RETURNS TABLE (
  slot_time TIMESTAMPTZ,
  is_available BOOLEAN
)
SET search_path = public
AS $$
DECLARE
  business_hour RECORD;
  current_slot TIMESTAMPTZ;
  end_slot TIMESTAMPTZ;
BEGIN
  SELECT * INTO business_hour
  FROM business_hours
  WHERE day_of_week = EXTRACT(DOW FROM target_date)::INTEGER;

  IF NOT business_hour.is_open OR EXISTS (
    SELECT 1 FROM holidays WHERE date = target_date
  ) THEN
    RETURN;
  END IF;

  current_slot := target_date + business_hour.open_time;
  end_slot := target_date + business_hour.close_time;

  WHILE current_slot < end_slot LOOP
    RETURN QUERY
    SELECT
      current_slot,
      NOT EXISTS (
        SELECT 1 FROM bookings
        WHERE booking_datetime <= current_slot
          AND end_datetime > current_slot
          AND status IN ('pending', 'accepted')
      );

    current_slot := current_slot + (slot_duration || ' minutes')::INTERVAL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- is_slot_available
DROP FUNCTION IF EXISTS is_slot_available(TIMESTAMPTZ, INTEGER);
CREATE OR REPLACE FUNCTION is_slot_available(
  check_datetime TIMESTAMPTZ,
  duration_minutes INTEGER
)
RETURNS BOOLEAN
SET search_path = public
AS $$
DECLARE
  end_time TIMESTAMPTZ;
BEGIN
  end_time := check_datetime + (duration_minutes || ' minutes')::INTERVAL;

  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE status IN ('pending', 'accepted')
      AND (
        (booking_datetime <= check_datetime AND end_datetime > check_datetime)
        OR (booking_datetime < end_time AND end_datetime >= end_time)
        OR (booking_datetime >= check_datetime AND end_datetime <= end_time)
      )
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 完了
-- ============================================
-- 全てのセキュリティ問題が修正されました
-- Supabase Advisorで再度確認してください
-- ============================================
