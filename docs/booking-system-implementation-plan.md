# Square API 予約システム 実装フェーズ計画書

## 目次
1. [実装概要](#実装概要)
2. [Phase 1: MVP（基本予約機能）](#phase-1-mvp基本予約機能)
3. [Phase 2: 管理・通知機能](#phase-2-管理通知機能)
4. [Phase 3: 決済・高度な機能](#phase-3-決済高度な機能)
5. [チェックリスト](#チェックリスト)

---

## 実装概要

### 全体スケジュール
- **Phase 1（MVP）**: 4-6週間
- **Phase 2（管理・通知）**: 3-4週間
- **Phase 3（決済・高度）**: 4-6週間（将来実装）

### 優先順位
1. **最優先**: Phase 1（お客様が予約できる最小機能）
2. **高優先**: Phase 2（運用に必要な管理機能）
3. **中優先**: Phase 3（ビジネス拡大時の機能）

---

## Phase 1: MVP（基本予約機能）

**期間**: 4-6週間
**目標**: お客様がHPから予約できる最小限の機能を実装

### Week 1-2: 基盤構築

#### 1.1 Square API連携基盤（3日）

**タスク:**
- [ ] Square開発者アカウント作成
- [ ] Sandboxアプリケーション作成
- [ ] 必要な権限設定（Scopes）
- [ ] Access Token取得
- [ ] Location ID確認

**実装ファイル:**
```
src/lib/square/
  ├── client.ts          # Square Client初期化
  ├── types.ts           # 型定義
  └── utils.ts           # エラーハンドリング
```

**実装内容:**
```typescript
// src/lib/square/client.ts
import { Client, Environment } from 'square';

const environment = process.env.SQUARE_ENVIRONMENT === 'production'
  ? Environment.Production
  : Environment.Sandbox;

export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment,
});

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID!;
```

**環境変数設定:**
```env
# .env.local
SQUARE_ENVIRONMENT=sandbox
SQUARE_ACCESS_TOKEN=your_sandbox_token
SQUARE_APPLICATION_ID=your_app_id
SQUARE_LOCATION_ID=your_location_id
```

**テスト:**
- [ ] Square API接続テスト
- [ ] Location情報取得テスト

---

#### 1.2 データベース構築（3日）

**タスク:**
- [ ] Supabaseプロジェクト確認
- [ ] テーブル作成（SQL実行）
- [ ] RLSポリシー設定
- [ ] インデックス確認

**実行SQL:**
```bash
# docs/database/booking-system-schema.sql を実行
```

**作成テーブル:**
- customers
- bookings
- business_hours
- holidays
- booking_slots
- booking_settings

**テスト:**
- [ ] テーブル作成確認
- [ ] RLSポリシー動作確認
- [ ] サンプルデータ挿入・取得

---

#### 1.3 認証システム実装（4日）

**タスク:**
- [ ] Supabase Auth設定確認
- [ ] ログインページ作成
- [ ] 新規登録ページ作成
- [ ] パスワードリセット機能
- [ ] プロフィール編集ページ

**実装ファイル:**
```
src/app/
  ├── login/
  │   └── page.tsx
  ├── register/
  │   └── page.tsx
  ├── reset-password/
  │   └── page.tsx
  └── mypage/
      └── profile/
          └── page.tsx

src/lib/actions/
  └── auth.ts           # 認証関連のServer Actions
```

**実装内容:**
```typescript
// src/lib/actions/auth.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function signUp(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  // 1. Supabase Authで登録
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message };
  }

  // 2. customers テーブルに情報を保存
  const { error: customerError } = await supabase.from('customers').insert({
    user_id: authData.user.id,
    email,
    name,
    phone,
  });

  if (customerError) {
    return { success: false, error: customerError.message };
  }

  // 3. Square顧客との紐付け（後で実装）
  // await linkSquareCustomer(authData.user.id, email);

  return { success: true };
}
```

**テスト:**
- [ ] 新規登録フロー
- [ ] ログインフロー
- [ ] パスワードリセット
- [ ] プロフィール編集

---

### Week 3-4: 予約機能実装

#### 1.4 Square顧客紐付け機能（3日）

**タスク:**
- [ ] Square Customers API連携
- [ ] メールアドレスで顧客検索
- [ ] 電話番号で顧客検索
- [ ] 新規顧客作成
- [ ] 紐付け処理実装

**実装ファイル:**
```
src/lib/actions/
  └── square-customer.ts

src/app/register/
  └── (components)/
      └── square-link-dialog.tsx
```

**実装内容:**
```typescript
// src/lib/actions/square-customer.ts
'use server';

import { squareClient } from '@/lib/square/client';
import { createClient } from '@/lib/supabase/server';

export async function linkSquareCustomerOnSignup(userId: string, email: string) {
  const supabase = createClient();

  try {
    // 1. メールアドレスでSquare顧客を検索
    const searchResponse = await squareClient.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: { exact: email },
        },
      },
    });

    const customers = searchResponse.result.customers || [];

    if (customers.length > 0) {
      // 既存顧客が見つかった → 自動紐付け
      const squareCustomer = customers[0];

      await supabase.from('customers').update({
        square_customer_id: squareCustomer.id,
        synced_at: new Date().toISOString(),
      }).eq('user_id', userId);

      return { success: true, found: true, customer: squareCustomer };
    } else {
      // 見つからなかった → Square側に新規作成
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!customer) {
        return { success: false, error: '顧客情報が見つかりません' };
      }

      const createResponse = await squareClient.customersApi.createCustomer({
        emailAddress: email,
        givenName: customer.name,
        phoneNumber: customer.phone,
        referenceId: userId,
      });

      const newSquareCustomer = createResponse.result.customer;

      if (newSquareCustomer) {
        await supabase.from('customers').update({
          square_customer_id: newSquareCustomer.id,
          synced_at: new Date().toISOString(),
        }).eq('user_id', userId);
      }

      return { success: true, found: false, customer: newSquareCustomer };
    }
  } catch (error: any) {
    console.error('Square顧客紐付けエラー:', error);
    return { success: false, error: error.message };
  }
}
```

**テスト:**
- [ ] 既存顧客の自動紐付け
- [ ] 新規顧客作成
- [ ] エラーハンドリング

---

#### 1.5 施術メニュー表示（3日）

**タスク:**
- [ ] Square Catalog API連携
- [ ] 施術メニュー一覧取得
- [ ] 施術メニュー表示UI作成
- [ ] カテゴリーフィルタ実装

**実装ファイル:**
```
src/lib/actions/
  └── square-catalog.ts

src/app/booking/
  └── services/
      ├── page.tsx
      └── (components)/
          ├── service-list.tsx
          └── service-card.tsx
```

**実装内容:**
```typescript
// src/lib/actions/square-catalog.ts
'use server';

import { squareClient } from '@/lib/square/client';
import { SquareService } from '@/lib/square/types';

export async function getServiceMenu(): Promise<SquareService[]> {
  try {
    const response = await squareClient.catalogApi.listCatalog(
      undefined,
      'ITEM'
    );

    const items = response.result.objects || [];
    const services: SquareService[] = [];

    for (const item of items) {
      if (item.type === 'ITEM' && item.itemData) {
        const variations = item.itemData.variations || [];

        for (const variation of variations) {
          if (variation.type === 'ITEM_VARIATION' && variation.itemVariationData) {
            services.push({
              id: variation.id,
              name: `${item.itemData.name} - ${variation.itemVariationData.name}`,
              description: item.itemData.description || '',
              price: variation.itemVariationData.priceMoney?.amount || 0,
              currency: variation.itemVariationData.priceMoney?.currency || 'JPY',
              duration: variation.itemVariationData.serviceDuration || 60,
              categoryId: item.itemData.categoryId,
            });
          }
        }
      }
    }

    return services;
  } catch (error) {
    console.error('施術メニュー取得エラー:', error);
    return [];
  }
}
```

**テスト:**
- [ ] 施術メニュー一覧表示
- [ ] 詳細モーダル表示
- [ ] レスポンシブデザイン

---

#### 1.6 予約カレンダーUI（4日）

**タスク:**
- [ ] カレンダーライブラリ選定・導入
- [ ] 営業時間取得
- [ ] 休業日取得
- [ ] 予約可能枠の計算
- [ ] カレンダーUI実装

**実装ファイル:**
```
src/app/booking/
  └── calendar/
      ├── page.tsx
      └── (components)/
          ├── booking-calendar.tsx
          └── time-slot-picker.tsx

src/lib/actions/
  └── calendar.ts
```

**ライブラリ:**
```bash
bun add react-big-calendar date-fns
bun add -D @types/react-big-calendar
```

**実装内容:**
```typescript
// src/lib/actions/calendar.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function getAvailableSlots(params: {
  serviceId: string;
  date: string;
}) {
  const supabase = createClient();
  const targetDate = new Date(params.date);
  const dayOfWeek = targetDate.getDay();

  // 1. 営業時間を取得
  const { data: businessHour } = await supabase
    .from('business_hours')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .single();

  if (!businessHour || !businessHour.is_open) {
    return []; // 定休日
  }

  // 2. 休業日チェック
  const { data: holiday } = await supabase
    .from('holidays')
    .select('*')
    .eq('date', params.date)
    .single();

  if (holiday) {
    return []; // 臨時休業
  }

  // 3. 設定を取得
  const { data: settings } = await supabase
    .from('booking_settings')
    .select('*');

  const slotInterval = parseInt(
    settings?.find((s) => s.key === 'slot_interval_minutes')?.value || '30',
    10
  );

  // 4. スロット生成
  const slots = [];
  const openTime = new Date(`${params.date}T${businessHour.open_time}`);
  const closeTime = new Date(`${params.date}T${businessHour.close_time}`);

  let currentSlot = new Date(openTime);

  while (currentSlot < closeTime) {
    // 既存予約との重複チェック
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('*')
      .lte('booking_datetime', currentSlot.toISOString())
      .gte('end_datetime', currentSlot.toISOString())
      .in('status', ['pending', 'accepted']);

    const isAvailable = !existingBookings || existingBookings.length === 0;

    slots.push({
      datetime: currentSlot.toISOString(),
      isAvailable,
    });

    currentSlot = new Date(currentSlot.getTime() + slotInterval * 60 * 1000);
  }

  return slots;
}
```

**テスト:**
- [ ] カレンダー表示
- [ ] 予約可能枠の表示
- [ ] 日付選択
- [ ] 時間帯選択

---

#### 1.7 予約作成フロー（3日）

**タスク:**
- [ ] 予約確認画面作成
- [ ] 予約作成処理実装
- [ ] Square Bookings API連携
- [ ] 予約完了画面作成
- [ ] メール通知実装

**実装ファイル:**
```
src/app/booking/
  ├── confirm/
  │   └── page.tsx
  └── complete/
      └── page.tsx

src/lib/actions/
  └── booking.ts

src/lib/email/
  └── booking.ts
```

**実装内容:**
```typescript
// 前述のcreateBooking関数を実装
// src/lib/actions/booking.ts
```

**メール実装:**
```typescript
// src/lib/email/booking.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(params: {
  email: string;
  name: string;
  serviceName: string;
  bookingDatetime: string;
  price: number;
}) {
  const { email, name, serviceName, bookingDatetime, price } = params;

  await resend.emails.send({
    from: 'no-reply@yourdomain.com',
    to: email,
    subject: '【予約確定】ご予約ありがとうございます',
    html: `
      <h2>${name} 様</h2>
      <p>ご予約ありがとうございます。</p>
      <h3>予約内容</h3>
      <ul>
        <li>施術: ${serviceName}</li>
        <li>日時: ${new Date(bookingDatetime).toLocaleString('ja-JP')}</li>
        <li>料金: ¥${price.toLocaleString()}</li>
      </ul>
      <p>ご来店をお待ちしております。</p>
    `,
  });
}
```

**テスト:**
- [ ] 予約確認画面表示
- [ ] 予約作成処理
- [ ] Square側への保存確認
- [ ] Supabase側への保存確認
- [ ] メール送信確認

---

### Week 5-6: 顧客機能・テスト

#### 1.8 マイページ実装（3日）

**タスク:**
- [ ] マイページレイアウト作成
- [ ] 今後の予約一覧表示
- [ ] 過去の予約履歴表示
- [ ] 予約詳細表示

**実装ファイル:**
```
src/app/mypage/
  ├── page.tsx
  ├── bookings/
  │   ├── page.tsx
  │   └── [id]/
  │       └── page.tsx
  └── (components)/
      ├── booking-list.tsx
      └── booking-card.tsx
```

**テスト:**
- [ ] 予約一覧表示
- [ ] 予約詳細表示
- [ ] ステータス別表示

---

#### 1.9 予約キャンセル機能（2日）

**タスク:**
- [ ] キャンセルボタン実装
- [ ] キャンセル期限チェック
- [ ] キャンセル処理実装
- [ ] キャンセル完了メール

**実装:**
```typescript
// 前述のcancelBooking関数を実装
```

**テスト:**
- [ ] キャンセル期限内のキャンセル
- [ ] キャンセル期限外のエラー表示
- [ ] Square側の反映確認
- [ ] メール送信確認

---

#### 1.10 統合テスト・デバッグ（5日）

**タスク:**
- [ ] E2Eテスト実施
- [ ] バグ修正
- [ ] パフォーマンス最適化
- [ ] UI/UX改善
- [ ] ドキュメント更新

**テストシナリオ:**
1. 新規ユーザー登録 → Square紐付け → 予約作成 → マイページ確認
2. 既存ユーザーログイン → 予約作成 → 予約キャンセル
3. エラーケースのテスト

**チェック項目:**
- [ ] 全フロー動作確認
- [ ] レスポンシブデザイン確認
- [ ] アクセシビリティ確認
- [ ] エラーハンドリング確認

---

## Phase 2: 管理・通知機能

**期間**: 3-4週間
**目標**: 店舗側の運用に必要な管理機能を実装

### Week 7-8: 管理画面実装

#### 2.1 管理画面認証（1日）

**タスク:**
- [ ] 管理者ロール設定
- [ ] 管理画面アクセス制御
- [ ] ベーシック認証またはSupabase Admin

**実装ファイル:**
```
src/middleware.ts
src/app/admin/layout.tsx
```

---

#### 2.2 予約管理画面（4日）

**タスク:**
- [ ] 予約一覧画面
- [ ] カレンダー表示
- [ ] 予約詳細・編集
- [ ] ステータス管理

**実装ファイル:**
```
src/app/admin/
  └── bookings/
      ├── page.tsx
      ├── [id]/
      │   └── page.tsx
      └── (components)/
          ├── admin-booking-calendar.tsx
          └── booking-management-table.tsx
```

---

#### 2.3 顧客管理画面（3日）

**タスク:**
- [ ] 顧客一覧表示
- [ ] Square紐付け状況確認
- [ ] 手動紐付け機能
- [ ] 顧客詳細・編集

**実装ファイル:**
```
src/app/admin/
  └── customers/
      ├── page.tsx
      └── [id]/
          └── page.tsx
```

---

#### 2.4 カレンダー設定画面（2日）

**タスク:**
- [ ] 営業時間設定
- [ ] 休業日設定
- [ ] 予約枠設定

**実装ファイル:**
```
src/app/admin/
  └── settings/
      ├── business-hours/
      │   └── page.tsx
      └── holidays/
          └── page.tsx
```

---

### Week 9-10: 通知・同期機能

#### 2.5 メール通知システム（3日）

**タスク:**
- [ ] リマインダーメール実装
- [ ] Cron Job設定（Vercel Cron）
- [ ] 店舗側通知メール

**実装ファイル:**
```
src/app/api/cron/
  └── send-reminders/
      └── route.ts

vercel.json（Cron設定）
```

**Cron設定:**
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

#### 2.6 Square Webhook連携（3日）

**タスク:**
- [ ] Webhookエンドポイント実装
- [ ] 署名検証
- [ ] イベントハンドリング
- [ ] Square Developer Portalで設定

**実装:**
```typescript
// 前述のWebhookエンドポイントを実装
// src/app/api/webhooks/square/route.ts
```

---

#### 2.7 テスト・デバッグ（4日）

**タスク:**
- [ ] 管理画面テスト
- [ ] メール送信テスト
- [ ] Webhook同期テスト
- [ ] バグ修正

---

## Phase 3: 決済・高度な機能

**期間**: 4-6週間（将来実装）
**実装時期**: Phase 1, 2完了後、必要に応じて

### 主要機能
1. Square Payments API連携
2. 事前決済システム
3. 回数券・ポイントシステム
4. レビュー機能
5. 多言語対応

---

## チェックリスト

### Phase 1 完了条件
- [ ] お客様がHP会員登録できる
- [ ] Square顧客と自動紐付けできる
- [ ] 施術メニューが表示される
- [ ] 予約カレンダーから予約できる
- [ ] マイページで予約確認できる
- [ ] 予約をキャンセルできる
- [ ] 確認メールが送信される
- [ ] Supabase, Square両方にデータが保存される

### Phase 2 完了条件
- [ ] 管理画面にアクセスできる
- [ ] 予約一覧を確認できる
- [ ] 顧客一覧を確認できる
- [ ] 営業時間を設定できる
- [ ] 休業日を設定できる
- [ ] リマインダーメールが自動送信される
- [ ] Square側の変更がHP側に同期される

### 本番環境移行チェックリスト
- [ ] Square本番アクセストークン取得
- [ ] 本番環境変数設定
- [ ] Supabase本番DB準備
- [ ] メール送信ドメイン設定
- [ ] Webhook URL本番設定
- [ ] SSL証明書確認
- [ ] パフォーマンステスト
- [ ] セキュリティ監査
- [ ] バックアップ設定
- [ ] モニタリング設定

---

## 次のステップ

要件定義書がすべて完成しました：

1. ✅ **要件定義書**: [docs/booking-system-requirements.md](docs/booking-system-requirements.md)
2. ✅ **データベース設計**: [docs/database/booking-system-schema.sql](docs/database/booking-system-schema.sql)
3. ✅ **API連携仕様**: [docs/square-api-integration.md](docs/square-api-integration.md)
4. ✅ **実装計画**: [docs/booking-system-implementation-plan.md](docs/booking-system-implementation-plan.md)

### 実装開始前に確認すること

1. **Square準備**
   - [ ] Squareアカウント作成
   - [ ] Sandbox環境でテスト
   - [ ] 施術メニュー登録
   - [ ] 既存顧客データ確認

2. **技術準備**
   - [ ] 必要なパッケージ確認
   - [ ] Supabaseプロジェクト確認
   - [ ] 環境変数の準備

3. **承認・確認**
   - [ ] 要件定義の承認
   - [ ] スケジュールの合意
   - [ ] 予算の確認

実装を開始する準備ができましたら、お知らせください！

---

**作成日**: 2025-10-20
**バージョン**: 1.0
