# Square API 連携仕様書

## 目次
1. [概要](#概要)
2. [認証設定](#認証設定)
3. [使用するAPI](#使用するapi)
4. [データフロー](#データフロー)
5. [実装詳細](#実装詳細)
6. [エラーハンドリング](#エラーハンドリング)
7. [Webhook連携](#webhook連携)
8. [テスト方法](#テスト方法)

## 概要

### 連携の目的
- Square側の施術メニュー（Catalog）を表示
- Square側の顧客情報と連携
- 予約情報をSquare Bookingsに保存
- HP側とSquare側でデータを同期

### 連携方式
- **REST API**: Square API（Bookings, Customers, Catalog）
- **認証**: OAuth 2.0（Access Token）
- **Webhook**: イベント駆動型の同期

## 認証設定

### 必要な認証情報

```env
# .env.local

# Square API設定
SQUARE_ENVIRONMENT=sandbox # または production
SQUARE_ACCESS_TOKEN=your_access_token_here
SQUARE_APPLICATION_ID=your_application_id_here
SQUARE_LOCATION_ID=your_location_id_here

# Webhook用
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key_here
```

### アクセストークンの取得手順

1. **Square Developer Portal にアクセス**
   - https://developer.squareup.com/apps

2. **アプリケーションを作成**
   - 「Create App」をクリック
   - アプリ名を入力（例: bodycare-yumin-booking）

3. **必要な権限（Scopes）を設定**
   - `APPOINTMENTS_READ`: 予約情報の読み取り
   - `APPOINTMENTS_WRITE`: 予約の作成・更新
   - `CUSTOMERS_READ`: 顧客情報の読み取り
   - `CUSTOMERS_WRITE`: 顧客の作成・更新
   - `ITEMS_READ`: カタログ（施術メニュー）の読み取り

4. **Access Tokenをコピー**
   - Sandbox用とProduction用で異なるトークンを使用

5. **Location IDを取得**
   - Square Dashboard > 設定 > 店舗情報 から確認

## 使用するAPI

### 1. Bookings API

#### エンドポイント
- **ベースURL（Sandbox）**: `https://connect.squareupsandbox.com/v2`
- **ベースURL（Production）**: `https://connect.squareup.com/v2`

#### 主要な操作

##### 予約作成
```http
POST /bookings
```

**リクエストボディ:**
```json
{
  "booking": {
    "customerId": "CUSTOMER_ID",
    "serviceVariationId": "SERVICE_VARIATION_ID",
    "startAt": "2025-11-01T10:00:00Z",
    "locationId": "LOCATION_ID",
    "customerNote": "初めての利用です"
  }
}
```

**レスポンス:**
```json
{
  "booking": {
    "id": "BOOKING_ID",
    "version": 0,
    "status": "PENDING",
    "customerId": "CUSTOMER_ID",
    "serviceVariationId": "SERVICE_VARIATION_ID",
    "startAt": "2025-11-01T10:00:00Z",
    "locationId": "LOCATION_ID",
    "createdAt": "2025-10-20T12:00:00Z"
  }
}
```

##### 予約一覧取得
```http
GET /bookings?customer_id=CUSTOMER_ID&limit=100
```

##### 予約詳細取得
```http
GET /bookings/{booking_id}
```

##### 予約キャンセル
```http
POST /bookings/{booking_id}/cancel
```

**リクエストボディ:**
```json
{
  "bookingVersion": 0
}
```

### 2. Customers API

##### 顧客検索（メールアドレス）
```http
POST /customers/search
```

**リクエストボディ:**
```json
{
  "query": {
    "filter": {
      "emailAddress": {
        "exact": "customer@example.com"
      }
    }
  }
}
```

##### 顧客検索（電話番号）
```http
POST /customers/search
```

**リクエストボディ:**
```json
{
  "query": {
    "filter": {
      "phoneNumber": {
        "exact": "+819012345678"
      }
    }
  }
}
```

##### 顧客検索（名前 - あいまい検索）
```http
POST /customers/search
```

**リクエストボディ:**
```json
{
  "query": {
    "filter": {
      "givenName": {
        "fuzzy": "太郎"
      }
    }
  }
}
```

##### 顧客作成
```http
POST /customers
```

**リクエストボディ:**
```json
{
  "emailAddress": "customer@example.com",
  "givenName": "太郎",
  "familyName": "山田",
  "phoneNumber": "+819012345678",
  "referenceId": "supabase_user_id_here"
}
```

##### 顧客詳細取得
```http
GET /customers/{customer_id}
```

##### 顧客情報更新
```http
PUT /customers/{customer_id}
```

**リクエストボディ:**
```json
{
  "emailAddress": "newemail@example.com",
  "givenName": "太郎",
  "familyName": "山田",
  "phoneNumber": "+819012345678"
}
```

### 3. Catalog API

##### カタログアイテム一覧取得
```http
GET /catalog/list?types=ITEM
```

**レスポンス例:**
```json
{
  "objects": [
    {
      "type": "ITEM",
      "id": "ITEM_ID",
      "itemData": {
        "name": "全身もみほぐし（60分）",
        "description": "肩こり、腰痛に効果的な全身施術",
        "categoryId": "CATEGORY_ID",
        "variations": [
          {
            "type": "ITEM_VARIATION",
            "id": "VARIATION_ID",
            "itemVariationData": {
              "name": "60分コース",
              "priceMoney": {
                "amount": 6000,
                "currency": "JPY"
              },
              "serviceDuration": 60
            }
          }
        ]
      }
    }
  ]
}
```

##### カタログ検索
```http
POST /catalog/search
```

**リクエストボディ:**
```json
{
  "objectTypes": ["ITEM"],
  "query": {
    "textQuery": {
      "keywords": ["もみほぐし"]
    }
  }
}
```

## データフロー

### 予約作成フロー

```
┌─────────────────────────────────────────────────────────┐
│ 1. お客様がHP上で施術・日時を選択                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. フロントエンド → Server Action呼び出し                │
│    createBooking({ serviceId, startAt, note })         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Server Action内の処理                                │
│    a. Supabaseからuser_id, square_customer_idを取得     │
│    b. Square Bookings APIで予約作成                     │
│    c. Supabaseにも予約情報を保存                         │
│    d. メール送信（Resend）                              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. レスポンス返却                                        │
│    { success: true, bookingId: "xxx" }                 │
└─────────────────────────────────────────────────────────┘
```

### Square顧客紐付けフロー

```
┌─────────────────────────────────────────────────────────┐
│ 1. お客様がHP会員登録（email, password, name, phone）    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Supabase Authでユーザー作成                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Square Customers APIでメールアドレス検索              │
│    POST /customers/search                              │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌───────────────┐               ┌──────────────┐
│ 既存顧客あり  │               │ 既存顧客なし │
└───────────────┘               └──────────────┘
        ↓                               ↓
┌───────────────┐               ┌──────────────┐
│自動紐付け     │               │新規作成      │
│Supabaseに     │               │Square側に    │
│customer_id    │               │POST /customers│
│を保存         │               └──────────────┘
└───────────────┘                       ↓
        ↓                       ┌──────────────┐
        └───────────────────────│紐付け保存    │
                                │Supabaseに    │
                                │customer_id   │
                                │を保存         │
                                └──────────────┘
```

## 実装詳細

### ディレクトリ構造

```
src/
├── lib/
│   ├── square/
│   │   ├── client.ts                 # Square Client初期化
│   │   ├── types.ts                  # 型定義
│   │   └── utils.ts                  # ユーティリティ関数
│   ├── actions/
│   │   ├── booking.ts                # 予約関連のServer Actions
│   │   ├── square-catalog.ts         # Square Catalog API操作
│   │   └── square-customer.ts        # Square Customers API操作
│   └── types/
│       └── booking.ts                # 予約関連の型定義
└── app/
    └── api/
        └── webhooks/
            └── square/
                └── route.ts          # Square Webhook受信
```

### Square Client初期化

```typescript
// src/lib/square/client.ts

import { Client, Environment } from 'square';

const environment =
  process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox;

export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment,
});

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID!;
```

### 型定義

```typescript
// src/lib/square/types.ts

export interface SquareBooking {
  id: string;
  version: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
  customerId: string;
  serviceVariationId: string;
  startAt: string;
  locationId: string;
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SquareCustomer {
  id: string;
  emailAddress?: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SquareService {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration: number; // 分単位
  categoryId?: string;
  categoryName?: string;
}

export interface BookingCreateParams {
  serviceId: string;
  startAt: string;
  customerNote?: string;
}

export interface CustomerSearchParams {
  email?: string;
  phone?: string;
  name?: string;
}
```

### Server Actions実装例

```typescript
// src/lib/actions/booking.ts

'use server';

import { squareClient, SQUARE_LOCATION_ID } from '@/lib/square/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendBookingConfirmationEmail } from '@/lib/email/booking';

export async function createBooking({
  serviceId,
  startAt,
  customerNote,
}: BookingCreateParams) {
  try {
    const supabase = createClient();

    // 1. 現在のユーザー取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '認証エラー' };
    }

    // 2. 顧客情報とSquare IDを取得
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('square_customer_id, email, name, phone')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer?.square_customer_id) {
      return { success: false, error: '顧客情報が見つかりません' };
    }

    // 3. Square Catalog APIでサービス詳細を取得
    const catalogResponse = await squareClient.catalogApi.retrieveCatalogObject(
      serviceId
    );
    const serviceVariation = catalogResponse.result.object;

    if (!serviceVariation) {
      return { success: false, error: 'サービスが見つかりません' };
    }

    const serviceName =
      serviceVariation.itemVariationData?.name || 'サービス';
    const servicePrice =
      serviceVariation.itemVariationData?.priceMoney?.amount || 0;
    const serviceDuration =
      serviceVariation.itemVariationData?.serviceDuration || 60;

    // 4. Square Bookings APIで予約作成
    const bookingResponse = await squareClient.bookingsApi.createBooking({
      booking: {
        customerId: customer.square_customer_id,
        serviceVariationId: serviceId,
        startAt: startAt,
        locationId: SQUARE_LOCATION_ID,
        customerNote: customerNote,
      },
    });

    const squareBooking = bookingResponse.result.booking;

    if (!squareBooking) {
      return { success: false, error: '予約作成に失敗しました' };
    }

    // 5. Supabaseに予約情報を保存
    const endDateTime = new Date(startAt);
    endDateTime.setMinutes(endDateTime.getMinutes() + serviceDuration);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        square_booking_id: squareBooking.id,
        square_customer_id: customer.square_customer_id,
        service_id: serviceId,
        service_name: serviceName,
        service_price: servicePrice,
        service_duration: serviceDuration,
        booking_datetime: startAt,
        end_datetime: endDateTime.toISOString(),
        status: squareBooking.status?.toLowerCase() || 'pending',
        customer_note: customerNote,
      })
      .select()
      .single();

    if (bookingError) {
      // Square側はすでに作成済みなので、エラーログを記録
      console.error('Supabase保存エラー:', bookingError);
      // ロールバックは困難なため、手動対応が必要
    }

    // 6. 確認メール送信
    await sendBookingConfirmationEmail({
      email: customer.email,
      name: customer.name,
      serviceName,
      bookingDatetime: startAt,
      price: servicePrice,
    });

    // 7. キャッシュ再検証
    revalidatePath('/mypage/bookings');

    return {
      success: true,
      bookingId: squareBooking.id,
      booking,
    };
  } catch (error: any) {
    console.error('予約作成エラー:', error);
    return {
      success: false,
      error: error.message || '予約作成中にエラーが発生しました',
    };
  }
}

export async function getUserBookings(status?: 'upcoming' | 'past') {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('認証エラー');
    }

    let query = supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('booking_datetime', { ascending: status !== 'past' });

    if (status === 'upcoming') {
      query = query
        .gte('booking_datetime', new Date().toISOString())
        .in('status', ['pending', 'accepted']);
    } else if (status === 'past') {
      query = query.or(
        `booking_datetime.lt.${new Date().toISOString()},status.in.(cancelled,completed)`
      );
    }

    const { data: bookings, error } = await query;

    if (error) {
      throw error;
    }

    return bookings;
  } catch (error: any) {
    console.error('予約取得エラー:', error);
    throw error;
  }
}

export async function cancelBooking(bookingId: string, reason?: string) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: '認証エラー' };
    }

    // 1. Supabaseから予約情報を取得（権限チェック）
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .eq('square_booking_id', bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: '予約が見つかりません' };
    }

    // 2. キャンセル期限チェック
    const bookingTime = new Date(booking.booking_datetime);
    const now = new Date();
    const hoursDiff = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    const settings = await supabase
      .from('booking_settings')
      .select('value')
      .eq('key', 'cancellation_deadline_hours')
      .single();

    const deadlineHours = parseInt(settings.data?.value || '24', 10);

    if (hoursDiff < deadlineHours) {
      return {
        success: false,
        error: `予約の${deadlineHours}時間前まではキャンセル可能です`,
      };
    }

    // 3. Square側でキャンセル
    await squareClient.bookingsApi.cancelBooking({
      bookingId: booking.square_booking_id,
      bookingVersion: 0,
    });

    // 4. Supabase側を更新
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('square_booking_id', bookingId);

    if (updateError) {
      console.error('Supabase更新エラー:', updateError);
    }

    // 5. キャッシュ再検証
    revalidatePath('/mypage/bookings');

    return { success: true };
  } catch (error: any) {
    console.error('キャンセルエラー:', error);
    return {
      success: false,
      error: error.message || 'キャンセル中にエラーが発生しました',
    };
  }
}
```

## エラーハンドリング

### Square APIエラー対応

```typescript
// src/lib/square/utils.ts

import { ApiError } from 'square';

export function handleSquareError(error: unknown): string {
  if (error instanceof ApiError) {
    const { errors } = error.result;

    if (errors && errors.length > 0) {
      const firstError = errors[0];

      switch (firstError.code) {
        case 'INVALID_REQUEST_ERROR':
          return 'リクエストが無効です';
        case 'AUTHENTICATION_ERROR':
          return '認証エラーが発生しました';
        case 'NOT_FOUND':
          return '指定されたリソースが見つかりません';
        case 'CONFLICT':
          return '予約が重複しています';
        case 'RATE_LIMITED':
          return 'アクセス制限に達しました。しばらくしてからお試しください';
        default:
          return firstError.detail || 'エラーが発生しました';
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '不明なエラーが発生しました';
}
```

### 使用例

```typescript
try {
  const response = await squareClient.bookingsApi.createBooking(params);
} catch (error) {
  const errorMessage = handleSquareError(error);
  return { success: false, error: errorMessage };
}
```

## Webhook連携

### Webhookエンドポイント実装

```typescript
// src/app/api/webhooks/square/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook署名検証
function verifyWebhookSignature(
  body: string,
  signature: string,
  url: string
): boolean {
  const hmac = crypto.createHmac(
    'sha256',
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!
  );
  hmac.update(url + body);
  const hash = hmac.digest('base64');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-square-hmacsha256-signature');
    const url = request.url;

    // 署名検証
    if (!signature || !verifyWebhookSignature(body, signature, url)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // イベントタイプに応じた処理
    switch (event.type) {
      case 'booking.created':
        await handleBookingCreated(event.data);
        break;

      case 'booking.updated':
        await handleBookingUpdated(event.data);
        break;

      case 'booking.cancelled':
        await handleBookingCancelled(event.data);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(event.data);
        break;

      default:
        console.log('未対応のイベント:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhookエラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleBookingUpdated(data: any) {
  const booking = data.object.booking;

  await supabase
    .from('bookings')
    .update({
      status: booking.status.toLowerCase(),
      updated_at: new Date().toISOString(),
    })
    .eq('square_booking_id', booking.id);
}

async function handleBookingCancelled(data: any) {
  const booking = data.object.booking;

  await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('square_booking_id', booking.id);
}

async function handleCustomerUpdated(data: any) {
  const customer = data.object.customer;

  await supabase
    .from('customers')
    .update({
      email: customer.email_address,
      name: `${customer.given_name} ${customer.family_name}`,
      phone: customer.phone_number,
      synced_at: new Date().toISOString(),
    })
    .eq('square_customer_id', customer.id);
}
```

### Webhook設定手順

1. **Square Developer PortalでWebhook URL設定**
   - https://developer.squareup.com/apps
   - アプリ選択 > Webhooks
   - Webhook URLを追加: `https://yourdomain.com/api/webhooks/square`

2. **購読イベントを選択**
   - `booking.created`
   - `booking.updated`
   - `booking.cancelled`
   - `customer.updated`

3. **署名キーを取得**
   - 自動生成される署名キーを`.env.local`に保存

## テスト方法

### Sandboxモードでのテスト

```typescript
// src/lib/square/test.ts

import { squareClient } from './client';

export async function testSquareConnection() {
  try {
    // 1. Location情報を取得してテスト
    const response = await squareClient.locationsApi.listLocations();
    console.log('Square接続成功:', response.result);
    return true;
  } catch (error) {
    console.error('Square接続エラー:', error);
    return false;
  }
}

export async function testCreateCustomer() {
  try {
    const response = await squareClient.customersApi.createCustomer({
      emailAddress: 'test@example.com',
      givenName: 'テスト',
      familyName: '太郎',
      phoneNumber: '+819012345678',
      referenceId: 'test-user-123',
    });
    console.log('顧客作成成功:', response.result);
    return response.result.customer;
  } catch (error) {
    console.error('顧客作成エラー:', error);
    return null;
  }
}
```

### ユニットテスト例

```typescript
// __tests__/lib/actions/booking.test.ts

import { createBooking } from '@/lib/actions/booking';

jest.mock('@/lib/square/client');
jest.mock('@/lib/supabase/server');

describe('createBooking', () => {
  it('正常に予約を作成できる', async () => {
    const result = await createBooking({
      serviceId: 'test-service-id',
      startAt: '2025-11-01T10:00:00Z',
      customerNote: 'テスト予約',
    });

    expect(result.success).toBe(true);
    expect(result.bookingId).toBeDefined();
  });

  it('認証エラーの場合はエラーを返す', async () => {
    // モックで認証エラーをシミュレート
    const result = await createBooking({
      serviceId: 'test-service-id',
      startAt: '2025-11-01T10:00:00Z',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('認証');
  });
});
```

## 参考資料

- [Square API Reference](https://developer.squareup.com/reference/square)
- [Square Bookings API Guide](https://developer.squareup.com/docs/bookings-api/what-it-is)
- [Square Customers API Guide](https://developer.squareup.com/docs/customers-api/what-it-does)
- [Square Catalog API Guide](https://developer.squareup.com/docs/catalog-api/what-it-does)
- [Square Webhooks Guide](https://developer.squareup.com/docs/webhooks/overview)

## トラブルシューティング

### よくある問題

1. **認証エラー**
   - アクセストークンが正しいか確認
   - 環境（Sandbox/Production）が一致しているか確認

2. **予約作成失敗**
   - Location IDが正しいか確認
   - サービスIDが存在するか確認
   - 開始時刻が未来の日時か確認

3. **Webhook受信エラー**
   - URLが公開されているか確認（localhostは不可）
   - 署名検証が正しく実装されているか確認

---

**更新履歴**
- 2025-10-20: 初版作成
