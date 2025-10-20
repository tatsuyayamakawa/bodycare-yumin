# Square API 予約システム 要件定義書

## プロジェクト概要
bodycare-yumin サイトに顧客向け予約システムを追加し、オンラインでの予約受付と管理を実現する。Square APIと連携することで、既存の顧客情報・施術メニューを活用しつつ、シームレスな予約体験を提供する。

## 目的・ビジネス要件

### 解決したい課題
- 電話・メールでの予約受付の手間を削減
- 24時間いつでも予約可能な環境を提供
- 予約の二重管理（HP + Square）を避ける
- 既存のSquare顧客データを活用
- 顧客が予約履歴を確認できる仕組み

### 期待される効果
- 予約受付業務の効率化
- 顧客満足度の向上
- 予約キャンセル率の低減（リマインダー機能）
- データ一元管理によるオペレーションの改善

## 技術仕様

### 使用技術
- **フロントエンド**: Next.js 15 (App Router)
- **認証**: Supabase Auth
- **データベース**: Supabase (PostgreSQL)
- **外部API**: Square API
  - Bookings API（予約管理）
  - Customers API（顧客管理）
  - Catalog API（施術メニュー）
- **メール通知**: Resend (既存)
- **UI**: shadcn/ui, Tailwind CSS (既存)
- **カレンダーUI**: React Big Calendar または FullCalendar

### Square API 料金
- **Bookings API**: 無料プラン使用（お客様向け予約機能）
- **Customers API**: 完全無料
- **Catalog API**: 完全無料
- **決済機能**: Phase 3以降で検討（2.9% + 30¢/取引）

## 機能要件

### Phase 1: 基本予約機能（MVP）

#### 1.1 顧客認証システム
- **会員登録**
  - メールアドレス + パスワード（Supabase Auth）
  - 必須情報: 氏名、電話番号、メールアドレス
  - オプション情報: 生年月日、性別、住所
  - 利用規約・プライバシーポリシー同意

- **ログイン**
  - メールアドレス + パスワード
  - パスワードリセット機能
  - セッション管理

- **プロフィール管理**
  - 個人情報の編集
  - パスワード変更
  - アカウント削除

#### 1.2 施術メニュー表示
- **Square Catalog APIから取得**
  - 施術名
  - 料金
  - 所要時間
  - 説明文
  - カテゴリー分類

- **表示機能**
  - カテゴリー別フィルタ
  - 価格順・名前順ソート
  - 詳細モーダル表示
  - レスポンシブデザイン

#### 1.3 予約カレンダー
- **カレンダー表示**
  - 月表示・週表示・日表示の切り替え
  - 予約可能枠の表示（緑色）
  - 予約済み枠の表示（グレー）
  - 営業時間外の表示（非活性）
  - 本日以前の日付は選択不可

- **予約可能枠の管理**
  - 営業時間: 店舗設定に基づく
  - 予約間隔: 施術時間 + 準備時間
  - 定休日の設定
  - 臨時休業日の設定

- **予約作成フロー**
  1. 施術メニューを選択
  2. カレンダーから日時を選択
  3. 確認画面で内容を確認
  4. 予約確定
  5. 確認メール送信

#### 1.4 予約管理（顧客側）
- **マイページ**
  - 今後の予約一覧
  - 過去の予約履歴
  - 予約ステータス表示
    - 予約確定（confirmed）
    - キャンセル済み（cancelled）
    - 完了（completed）

- **予約詳細**
  - 施術メニュー
  - 予約日時
  - 料金
  - 店舗情報
  - キャンセルボタン

- **予約キャンセル**
  - キャンセル期限: 予約日時の24時間前まで
  - キャンセル理由の入力（任意）
  - キャンセル確認画面
  - キャンセル完了メール送信

#### 1.5 Square顧客との紐付け
- **自動紐付け（優先）**
  - 会員登録時にメールアドレスでSquare顧客を検索
  - 一致する場合: 自動的にSquare顧客IDを紐付け
  - 一致しない場合: 次のステップへ

- **手動紐付け（オプション）**
  - 「当店をご利用いただいたことはありますか？」の確認
  - 「はい」の場合:
    - 電話番号、または異なるメールアドレスで検索
    - 候補顧客の一覧表示
    - 顧客が選択して紐付け
  - 「いいえ」の場合:
    - Square側に新規顧客として自動作成
    - HP側の情報を同期

- **データ同期**
  - HP → Square: 基本情報の同期
  - Square → HP: 既存予約履歴の取得（可能であれば）

### Phase 2: 管理機能・通知機能

#### 2.1 管理画面（店舗側）
- **予約一覧**
  - 日別・週別・月別表示
  - ステータスフィルタ
  - 顧客情報の表示
  - Square管理画面へのリンク

- **予約操作**
  - 予約の手動作成（電話予約など）
  - 予約の変更
  - 予約のキャンセル
  - ノート・メモ追加

- **顧客管理**
  - 顧客一覧
  - Square紐付け状況の確認
  - 手動での紐付け・紐付け解除
  - 顧客情報の編集

- **カレンダー設定**
  - 営業時間の設定
  - 定休日の設定
  - 臨時休業日の追加
  - 予約枠の調整

#### 2.2 メール通知
- **予約確定メール**
  - 送信先: 顧客
  - 内容: 予約詳細、店舗情報、キャンセルポリシー

- **予約リマインダーメール**
  - 送信タイミング: 予約日の24時間前
  - 内容: 予約詳細、アクセス情報

- **キャンセル完了メール**
  - 送信先: 顧客
  - 内容: キャンセル完了通知、次回予約への案内

- **店舗側通知**
  - 新規予約時の通知メール
  - キャンセル時の通知メール

#### 2.3 Square Webhook連携
- **リアルタイム同期**
  - Square側での予約変更を検知
  - Square側でのキャンセルを検知
  - Supabase側のデータを自動更新

- **対応イベント**
  - `booking.created`
  - `booking.updated`
  - `booking.cancelled`
  - `customer.updated`

### Phase 3: 決済・高度な機能（将来実装）

#### 3.1 事前決済
- **Square Payments API連携**
  - クレジットカード決済
  - デポジット機能（予約金）
  - 全額決済オプション

- **キャンセルポリシー**
  - 期限内キャンセル: 全額返金
  - 期限外キャンセル: 返金なし
  - No-show: チャージあり

#### 3.2 回数券・ポイントシステム
- 回数券の購入・管理
- ポイント付与・利用
- 会員ランク機能

#### 3.3 レビュー・フィードバック
- 施術後のレビュー依頼
- 評価・コメント機能
- サービス改善への活用

## データベース設計

### Supabase テーブル構成

#### customers テーブル
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  square_customer_id TEXT UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  birthday DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address TEXT,
  notes TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_square_customer_id ON customers(square_customer_id);
CREATE INDEX idx_customers_email ON customers(email);
```

#### bookings テーブル
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  square_booking_id TEXT UNIQUE NOT NULL,
  square_customer_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price INTEGER NOT NULL,
  service_duration INTEGER NOT NULL,
  booking_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')) DEFAULT 'pending',
  customer_note TEXT,
  admin_note TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_square_booking_id ON bookings(square_booking_id);
CREATE INDEX idx_bookings_booking_datetime ON bookings(booking_datetime);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
```

#### business_hours テーブル（営業時間設定）
```sql
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL,
  is_open BOOLEAN DEFAULT true,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- デフォルトデータ挿入
INSERT INTO business_hours (day_of_week, is_open, open_time, close_time) VALUES
  (0, false, '09:00', '18:00'), -- 日曜定休
  (1, true, '09:00', '18:00'),  -- 月曜
  (2, true, '09:00', '18:00'),  -- 火曜
  (3, true, '09:00', '18:00'),  -- 水曜
  (4, true, '09:00', '18:00'),  -- 木曜
  (5, true, '09:00', '18:00'),  -- 金曜
  (6, true, '09:00', '18:00');  -- 土曜
```

#### holidays テーブル（臨時休業日）
```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_holidays_date ON holidays(date);
```

#### booking_slots テーブル（予約枠キャッシュ - オプション）
```sql
CREATE TABLE booking_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_datetime TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_slots_datetime ON booking_slots(slot_datetime);
CREATE INDEX idx_booking_slots_available ON booking_slots(is_available, slot_datetime);
```

### Row Level Security (RLS)

```sql
-- customers テーブルのRLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

-- bookings テーブルのRLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- business_hours, holidays は全員が読み取り可能
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view business hours"
  ON business_hours FOR SELECT
  TO authenticated
  USING (true);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view holidays"
  ON holidays FOR SELECT
  TO authenticated
  USING (true);
```

## API設計

### Server Actions（Next.js App Router）

#### 予約関連
```typescript
// src/lib/actions/booking.ts

/**
 * 予約を作成
 */
export async function createBooking(params: {
  serviceId: string;
  startAt: string;
  customerNote?: string;
}): Promise<{ success: boolean; bookingId?: string; error?: string }>;

/**
 * ユーザーの予約一覧を取得
 */
export async function getUserBookings(
  status?: 'upcoming' | 'past' | 'cancelled'
): Promise<Booking[]>;

/**
 * 予約詳細を取得
 */
export async function getBooking(bookingId: string): Promise<Booking | null>;

/**
 * 予約をキャンセル
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }>;
```

#### Square連携
```typescript
// src/lib/actions/square-catalog.ts

/**
 * Square Catalog APIから施術メニューを取得
 */
export async function getServiceMenu(): Promise<Service[]>;

/**
 * 施術メニュー詳細を取得
 */
export async function getServiceDetail(serviceId: string): Promise<Service | null>;
```

```typescript
// src/lib/actions/square-customer.ts

/**
 * Square顧客を検索（メールアドレス）
 */
export async function findSquareCustomerByEmail(
  email: string
): Promise<SquareCustomer[]>;

/**
 * Square顧客を検索（電話番号）
 */
export async function findSquareCustomerByPhone(
  phone: string
): Promise<SquareCustomer[]>;

/**
 * Square顧客を検索（名前 - あいまい検索）
 */
export async function findSquareCustomerByName(
  name: string
): Promise<SquareCustomer[]>;

/**
 * Square顧客を作成
 */
export async function createSquareCustomer(params: {
  email: string;
  givenName: string;
  familyName?: string;
  phoneNumber?: string;
  referenceId: string; // Supabase user_id
}): Promise<{ success: boolean; customerId?: string; error?: string }>;

/**
 * HP顧客とSquare顧客を紐付け
 */
export async function linkSquareCustomer(
  userId: string,
  squareCustomerId: string
): Promise<{ success: boolean; error?: string }>;
```

#### カレンダー
```typescript
// src/lib/actions/calendar.ts

/**
 * 指定期間の予約可能枠を取得
 */
export async function getAvailableSlots(params: {
  serviceId: string;
  startDate: string;
  endDate: string;
}): Promise<TimeSlot[]>;

/**
 * 営業時間を取得
 */
export async function getBusinessHours(): Promise<BusinessHour[]>;

/**
 * 休業日を取得
 */
export async function getHolidays(
  startDate: string,
  endDate: string
): Promise<Holiday[]>;
```

### Webhook エンドポイント

```typescript
// src/app/api/webhooks/square/route.ts

/**
 * Square Webhookを受信
 */
export async function POST(request: Request): Promise<Response>;
```

## ユーザーフロー

### 新規ユーザーの予約フロー

```
1. トップページまたはナビゲーションから「予約する」をクリック
   ↓
2. 未ログインの場合 → ログイン/新規登録画面
   ↓
3. 新規登録
   - メールアドレス、パスワード、氏名、電話番号を入力
   - 利用規約に同意
   - 登録ボタンをクリック
   ↓
4. （バックエンド）Square顧客との紐付け
   - メールアドレスで自動検索
   - 見つからない場合 → Square側に新規作成
   ↓
5. 施術メニュー選択画面
   - カテゴリーやフィルタで施術を選択
   - 詳細を確認
   ↓
6. 予約カレンダー画面
   - カレンダーから希望日時を選択
   - 予約可能枠のみ選択可能
   ↓
7. 予約確認画面
   - 施術メニュー、日時、料金を確認
   - 要望・備考を入力（任意）
   - 予約確定ボタンをクリック
   ↓
8. 予約完了画面
   - 予約内容の表示
   - 確認メールを送信
   - マイページへのリンク
```

### 既存ユーザーの予約確認・キャンセルフロー

```
1. ログイン
   ↓
2. マイページ
   - 今後の予約一覧を表示
   ↓
3. 予約詳細をクリック
   - 予約内容の確認
   - キャンセルボタンが表示（24時間前まで）
   ↓
4. キャンセルボタンをクリック
   - キャンセル理由を入力（任意）
   - 確認画面
   ↓
5. キャンセル確定
   - Square APIでキャンセル処理
   - キャンセル完了メール送信
   - マイページに戻る
```

## 画面設計

### 主要画面一覧

#### 顧客向け画面
1. **ログイン画面** (`/login`)
2. **新規登録画面** (`/register`)
3. **パスワードリセット画面** (`/reset-password`)
4. **施術メニュー一覧** (`/booking/services`)
5. **予約カレンダー** (`/booking/calendar`)
6. **予約確認画面** (`/booking/confirm`)
7. **予約完了画面** (`/booking/complete`)
8. **マイページ** (`/mypage`)
9. **予約履歴** (`/mypage/bookings`)
10. **予約詳細** (`/mypage/bookings/[id]`)
11. **プロフィール編集** (`/mypage/profile`)

#### 管理画面
1. **予約一覧** (`/admin/bookings`)
2. **予約詳細** (`/admin/bookings/[id]`)
3. **顧客一覧** (`/admin/customers`)
4. **顧客詳細** (`/admin/customers/[id]`)
5. **カレンダー設定** (`/admin/settings/calendar`)
6. **営業時間設定** (`/admin/settings/business-hours`)
7. **休業日設定** (`/admin/settings/holidays`)

## 非機能要件

### パフォーマンス
- **ページロード時間**: 2秒以内
- **API応答時間**: 1秒以内（Square API除く）
- **予約可能枠の表示**: 3秒以内
- **Server Components活用**: 初期表示の最適化
- **キャッシュ戦略**:
  - 施術メニュー: 1時間キャッシュ
  - 営業時間: 24時間キャッシュ
  - 予約可能枠: リアルタイム取得

### セキュリティ
- **認証**: Supabase Auth（JWT）
- **RLS**: Supabase Row Level Security
- **API認証**: Square API Key（環境変数）
- **HTTPS**: 全通信の暗号化
- **CSRF対策**: Next.js Server Actions
- **XSS対策**: サニタイゼーション
- **個人情報保護**: GDPR/個人情報保護法準拠

### 可用性
- **稼働率**: 99.9%（Vercel/Supabase SLA）
- **バックアップ**: Supabase自動バックアップ
- **エラーハンドリング**: 適切なエラーメッセージ表示
- **ログ記録**: エラーログ、アクセスログ

### ユーザビリティ
- **レスポンシブデザイン**: モバイル、タブレット、PC対応
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **多言語対応**: Phase 3で検討（日本語・英語）
- **ブラウザ対応**: 最新版Chrome, Safari, Firefox, Edge

### 保守性
- **コード品質**: ESLint, Prettier
- **型安全性**: TypeScript strict mode
- **テスト**: Unit tests, Integration tests
- **ドキュメント**: コメント、README、API仕様書
- **バージョン管理**: Git

## 開発フェーズ・スケジュール

### Phase 1: MVP（最小機能製品） - 4-6週間
- Week 1-2: 基盤構築
  - データベース設計・構築
  - Square API連携基盤
  - 認証システム実装

- Week 3-4: 予約機能実装
  - 施術メニュー表示
  - 予約カレンダーUI
  - 予約作成フロー

- Week 5-6: 顧客機能実装
  - マイページ
  - 予約履歴
  - Square顧客紐付け
  - テスト・デバッグ

### Phase 2: 管理・通知機能 - 3-4週間
- Week 7-8: 管理画面
  - 予約一覧・詳細
  - 顧客管理
  - カレンダー設定

- Week 9-10: 通知・連携
  - メール通知システム
  - Square Webhook連携
  - リアルタイム同期
  - テスト・デバッグ

### Phase 3: 決済・高度な機能 - 4-6週間（将来）
- 事前決済システム
- 回数券・ポイント
- レビュー機能
- 多言語対応

## リスク管理

### 技術リスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Square API障害 | 高 | エラーハンドリング、フォールバック機能 |
| Supabase障害 | 高 | Square側データで継続運用可能に |
| データ同期エラー | 中 | 定期的な整合性チェック |
| 予約の二重登録 | 中 | トランザクション処理、楽観的ロック |

### ビジネスリスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Square料金プラン変更 | 中 | 代替APIの調査 |
| 既存顧客の移行抵抗 | 中 | 丁寧な説明、サポート |
| 予約キャンセル増加 | 低 | リマインダー、キャンセルポリシー |

## 成功指標（KPI）

### Phase 1（MVP）
- オンライン予約率: 30%以上
- 予約完了率: 80%以上（カゴ落ち20%以下）
- システムエラー率: 1%以下
- ユーザー登録数: 100名（3ヶ月）

### Phase 2（管理・通知）
- オンライン予約率: 50%以上
- キャンセル率: 10%以下（リマインダー効果）
- 管理画面利用率: 100%（全予約を管理画面で確認）
- 顧客満足度: 4.0/5.0以上

## 付録

### 参考資料
- [Square API Reference](https://developer.squareup.com/reference/square)
- [Square Bookings API](https://developer.squareup.com/docs/bookings-api/what-it-is)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### 用語集
- **MVP**: Minimum Viable Product（最小機能製品）
- **RLS**: Row Level Security（行レベルセキュリティ）
- **OAuth**: Open Authorization（認証・認可プロトコル）
- **Webhook**: イベント駆動型のHTTPコールバック
- **Server Action**: Next.js App RouterのサーバーサイドAPI
- **ISR**: Incremental Static Regeneration（段階的静的再生成）

### 変更履歴
| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025-10-20 | 1.0 | 初版作成 | - |

---

**承認欄**

- プロジェクトオーナー: _________________ 日付: _______
- 技術責任者: _________________ 日付: _______
