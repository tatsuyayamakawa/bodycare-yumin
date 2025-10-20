-- ============================================
-- Square API 予約システム - データベーススキーマ
-- ============================================
-- 作成日: 2025-10-20
-- 説明: 予約システムに必要な全テーブル定義
-- ============================================

-- ============================================
-- 1. customers テーブル（顧客情報）
-- ============================================
-- 説明: HP会員とSquare顧客の紐付け情報を管理
-- ============================================

CREATE TABLE IF NOT EXISTS customers (
  -- 基本情報
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  square_customer_id TEXT UNIQUE,

  -- 顧客情報
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  birthday DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address TEXT,

  -- 管理情報
  notes TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_square_customer_id ON customers(square_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- トリガー（更新日時の自動更新）
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customers_updated_at();

-- コメント
COMMENT ON TABLE customers IS 'HP会員とSquare顧客の情報を管理';
COMMENT ON COLUMN customers.user_id IS 'Supabase AuthのユーザーID';
COMMENT ON COLUMN customers.square_customer_id IS 'Square顧客ID（紐付け済みの場合）';
COMMENT ON COLUMN customers.synced_at IS 'Squareと最後に同期した日時';

-- ============================================
-- 2. bookings テーブル（予約情報）
-- ============================================
-- 説明: 予約の詳細情報を管理
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  -- 基本情報
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  square_booking_id TEXT UNIQUE NOT NULL,
  square_customer_id TEXT NOT NULL,

  -- 施術情報
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price INTEGER NOT NULL,
  service_duration INTEGER NOT NULL,

  -- 予約日時
  booking_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,

  -- ステータス
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')) DEFAULT 'pending',

  -- メモ・備考
  customer_note TEXT,
  admin_note TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_square_booking_id ON bookings(square_booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_datetime ON bookings(booking_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime_range ON bookings(booking_datetime, end_datetime);

-- トリガー（更新日時の自動更新）
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- コメント
COMMENT ON TABLE bookings IS '予約情報を管理';
COMMENT ON COLUMN bookings.status IS 'pending: 保留中, accepted: 承認済み, declined: 拒否, cancelled: キャンセル, completed: 完了';
COMMENT ON COLUMN bookings.service_duration IS '施術時間（分）';
COMMENT ON COLUMN bookings.service_price IS '料金（円）';

-- ============================================
-- 3. business_hours テーブル（営業時間）
-- ============================================
-- 説明: 曜日ごとの営業時間を管理
-- ============================================

CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL,
  is_open BOOLEAN DEFAULT true,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  break_start_time TIME,
  break_end_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_business_hours_day ON business_hours(day_of_week);

-- トリガー（更新日時の自動更新）
CREATE OR REPLACE FUNCTION update_business_hours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_hours_updated_at
  BEFORE UPDATE ON business_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_business_hours_updated_at();

-- デフォルトデータ挿入
INSERT INTO business_hours (day_of_week, is_open, open_time, close_time) VALUES
  (0, false, '09:00', '18:00'), -- 日曜定休
  (1, true, '09:00', '18:00'),  -- 月曜
  (2, true, '09:00', '18:00'),  -- 火曜
  (3, true, '09:00', '18:00'),  -- 水曜
  (4, true, '09:00', '18:00'),  -- 木曜
  (5, true, '09:00', '18:00'),  -- 金曜
  (6, true, '09:00', '18:00')   -- 土曜
ON CONFLICT (day_of_week) DO NOTHING;

-- コメント
COMMENT ON TABLE business_hours IS '曜日ごとの営業時間を管理';
COMMENT ON COLUMN business_hours.day_of_week IS '曜日（0=日曜, 1=月曜, ..., 6=土曜）';
COMMENT ON COLUMN business_hours.break_start_time IS '休憩開始時刻（任意）';
COMMENT ON COLUMN business_hours.break_end_time IS '休憩終了時刻（任意）';

-- ============================================
-- 4. holidays テーブル（臨時休業日）
-- ============================================
-- 説明: 定休日以外の休業日を管理
-- ============================================

CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);

-- コメント
COMMENT ON TABLE holidays IS '臨時休業日を管理';
COMMENT ON COLUMN holidays.reason IS '休業理由（例: 年末年始、臨時休業）';

-- ============================================
-- 5. booking_slots テーブル（予約枠キャッシュ）
-- ============================================
-- 説明: 予約可能枠をキャッシュ（パフォーマンス最適化用）
-- ============================================

CREATE TABLE IF NOT EXISTS booking_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_datetime TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_available BOOLEAN DEFAULT true,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_booking_slots_datetime ON booking_slots(slot_datetime);
CREATE INDEX IF NOT EXISTS idx_booking_slots_available ON booking_slots(is_available, slot_datetime);
CREATE INDEX IF NOT EXISTS idx_booking_slots_booking_id ON booking_slots(booking_id);

-- トリガー（更新日時の自動更新）
CREATE OR REPLACE FUNCTION update_booking_slots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_slots_updated_at
  BEFORE UPDATE ON booking_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_slots_updated_at();

-- コメント
COMMENT ON TABLE booking_slots IS '予約枠のキャッシュ（パフォーマンス最適化）';
COMMENT ON COLUMN booking_slots.duration_minutes IS 'スロット時間（分）';

-- ============================================
-- 6. booking_settings テーブル（予約設定）
-- ============================================
-- 説明: システム全体の予約設定を管理
-- ============================================

CREATE TABLE IF NOT EXISTS booking_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- トリガー（更新日時の自動更新）
CREATE OR REPLACE FUNCTION update_booking_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_settings_updated_at
  BEFORE UPDATE ON booking_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_settings_updated_at();

-- デフォルト設定
INSERT INTO booking_settings (key, value, description) VALUES
  ('cancellation_deadline_hours', '24', '予約キャンセル可能期限（時間前）'),
  ('max_future_booking_days', '60', '予約可能な最大日数（日後まで）'),
  ('slot_interval_minutes', '30', '予約枠の間隔（分）'),
  ('buffer_time_minutes', '15', '予約間の準備時間（分）'),
  ('square_location_id', '', 'Square店舗ID'),
  ('reminder_email_hours', '24', 'リマインダーメール送信タイミング（時間前）')
ON CONFLICT (key) DO NOTHING;

-- コメント
COMMENT ON TABLE booking_settings IS '予約システムの設定を管理';

-- ============================================
-- Row Level Security (RLS) ポリシー
-- ============================================

-- customers テーブル
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の顧客データのみ閲覧可能
CREATE POLICY "Users can view their own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分の顧客データのみ更新可能
CREATE POLICY "Users can update their own customer data"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

-- ユーザーは自分の顧客データを作成可能
CREATE POLICY "Users can insert their own customer data"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- bookings テーブル
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の予約のみ閲覧可能
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分の予約を作成可能
CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の予約のみ更新可能（キャンセルなど）
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- business_hours テーブル
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは営業時間を閲覧可能
CREATE POLICY "Authenticated users can view business hours"
  ON business_hours FOR SELECT
  TO authenticated
  USING (true);

-- holidays テーブル
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは休業日を閲覧可能
CREATE POLICY "Authenticated users can view holidays"
  ON holidays FOR SELECT
  TO authenticated
  USING (true);

-- booking_slots テーブル
ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは予約枠を閲覧可能
CREATE POLICY "Authenticated users can view booking slots"
  ON booking_slots FOR SELECT
  TO authenticated
  USING (true);

-- booking_settings テーブル
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは設定を閲覧可能
CREATE POLICY "Authenticated users can view booking settings"
  ON booking_settings FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- ビュー（便利な問い合わせ）
-- ============================================

-- 今後の予約一覧ビュー
CREATE OR REPLACE VIEW upcoming_bookings AS
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

-- 過去の予約一覧ビュー
CREATE OR REPLACE VIEW past_bookings AS
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

-- ============================================
-- ファンクション（便利な処理）
-- ============================================

-- 特定日の予約枠を生成
CREATE OR REPLACE FUNCTION generate_booking_slots(
  target_date DATE,
  slot_duration INTEGER DEFAULT 30
)
RETURNS TABLE (
  slot_time TIMESTAMPTZ,
  is_available BOOLEAN
) AS $$
DECLARE
  business_hour RECORD;
  current_slot TIMESTAMPTZ;
  end_slot TIMESTAMPTZ;
BEGIN
  -- 曜日の営業時間を取得
  SELECT * INTO business_hour
  FROM business_hours
  WHERE day_of_week = EXTRACT(DOW FROM target_date)::INTEGER;

  -- 休業日チェック
  IF NOT business_hour.is_open OR EXISTS (
    SELECT 1 FROM holidays WHERE date = target_date
  ) THEN
    RETURN;
  END IF;

  -- スロット生成
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

-- 予約可能かチェック
CREATE OR REPLACE FUNCTION is_slot_available(
  check_datetime TIMESTAMPTZ,
  duration_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  end_time TIMESTAMPTZ;
BEGIN
  end_time := check_datetime + (duration_minutes || ' minutes')::INTERVAL;

  -- 既存予約との重複チェック
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
-- サンプルデータ（開発環境のみ）
-- ============================================
-- 本番環境では実行しないこと

-- サンプル顧客データは auth.users に依存するため省略

-- サンプル休業日
-- INSERT INTO holidays (date, reason) VALUES
--   ('2025-12-31', '年末休業'),
--   ('2026-01-01', '元日'),
--   ('2026-01-02', '年始休業');

-- ============================================
-- インデックス作成完了後の統計情報更新
-- ============================================
ANALYZE customers;
ANALYZE bookings;
ANALYZE business_hours;
ANALYZE holidays;
ANALYZE booking_slots;
ANALYZE booking_settings;

-- ============================================
-- スキーマバージョン管理
-- ============================================
CREATE TABLE IF NOT EXISTS schema_versions (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  description TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO schema_versions (version, description) VALUES
  ('1.0.0', '初期スキーマ作成 - 予約システム基盤');

-- ============================================
-- 完了
-- ============================================
