/**
 * Square API型定義
 *
 * Square APIで使用する各種型定義
 */

/**
 * Square予約のステータス
 */
export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'COMPLETED';

/**
 * Square予約オブジェクト
 */
export interface SquareBooking {
  id: string;
  version: number;
  status: BookingStatus;
  customerId: string;
  serviceVariationId: string;
  startAt: string;
  locationId: string;
  customerNote?: string;
  sellerNote?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Square顧客オブジェクト
 */
export interface SquareCustomer {
  id: string;
  emailAddress?: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

/**
 * Square施術メニュー（サービス）
 */
export interface SquareService {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration: number; // 分単位
  categoryId?: string;
  categoryName?: string;
  imageUrl?: string;
}

/**
 * Square Catalog Item（カタログアイテム）
 */
export interface SquareCatalogItem {
  id: string;
  type: 'ITEM' | 'ITEM_VARIATION' | 'CATEGORY';
  itemData?: {
    name: string;
    description?: string;
    categoryId?: string;
    variations?: SquareCatalogItemVariation[];
  };
}

/**
 * Square Catalog Item Variation（アイテムバリエーション）
 */
export interface SquareCatalogItemVariation {
  id: string;
  type: 'ITEM_VARIATION';
  itemVariationData?: {
    name: string;
    priceMoney?: {
      amount: number;
      currency: string;
    };
    serviceDuration?: number;
  };
}

/**
 * 予約作成パラメータ
 */
export interface BookingCreateParams {
  serviceId: string;
  startAt: string;
  customerNote?: string;
}

/**
 * 顧客検索パラメータ
 */
export interface CustomerSearchParams {
  email?: string;
  phone?: string;
  name?: string;
}

/**
 * 予約可能時間枠
 */
export interface TimeSlot {
  datetime: string;
  isAvailable: boolean;
}

/**
 * Square APIエラーレスポンス
 */
export interface SquareError {
  category: string;
  code: string;
  detail?: string;
  field?: string;
}

/**
 * Square APIエラー詳細
 */
export interface SquareApiErrorDetail {
  errors?: SquareError[];
}
