/**
 * Square API ユーティリティ関数
 */

import { ApiError } from 'square';

/**
 * Square APIエラーを日本語のユーザーフレンドリーなメッセージに変換
 *
 * @param error - キャッチしたエラーオブジェクト
 * @returns ユーザーに表示するエラーメッセージ
 */
export function handleSquareError(error: unknown): string {
  // Square APIエラーの場合
  if (error instanceof ApiError) {
    const { errors } = error.result;

    if (errors && errors.length > 0) {
      const firstError = errors[0];

      // エラーコードに応じた日本語メッセージ
      switch (firstError.code) {
        case 'INVALID_REQUEST_ERROR':
          return 'リクエストが無効です。入力内容を確認してください。';

        case 'AUTHENTICATION_ERROR':
          return '認証エラーが発生しました。再度ログインしてください。';

        case 'NOT_FOUND':
          return '指定されたリソースが見つかりません。';

        case 'CONFLICT':
          return '予約が重複しています。別の日時を選択してください。';

        case 'RATE_LIMITED':
          return 'アクセス制限に達しました。しばらくしてからお試しください。';

        case 'INTERNAL_SERVER_ERROR':
          return 'サーバーエラーが発生しました。しばらくしてから再度お試しください。';

        case 'SERVICE_UNAVAILABLE':
          return 'サービスが一時的に利用できません。しばらくしてからお試しください。';

        case 'UNAUTHORIZED':
          return 'アクセス権限がありません。';

        case 'BAD_REQUEST':
          return '不正なリクエストです。入力内容を確認してください。';

        default:
          // 詳細メッセージがあればそれを返す
          if (firstError.detail) {
            return firstError.detail;
          }
          return 'エラーが発生しました。もう一度お試しください。';
      }
    }

    // エラー配列が空の場合
    return 'Square APIでエラーが発生しました。';
  }

  // 通常のErrorオブジェクトの場合
  if (error instanceof Error) {
    return error.message;
  }

  // その他の不明なエラー
  return '不明なエラーが発生しました。';
}

/**
 * Square APIエラーをコンソールにログ出力
 *
 * @param error - エラーオブジェクト
 * @param context - エラーが発生したコンテキスト
 */
export function logSquareError(error: unknown, context: string): void {
  console.error(`[Square API Error - ${context}]`, error);

  if (error instanceof ApiError) {
    const { errors, statusCode } = error.result;
    console.error('Status Code:', statusCode);
    console.error('Errors:', JSON.stringify(errors, null, 2));
  }
}

/**
 * 電話番号を国際フォーマット(E.164)に変換
 * 日本の電話番号（090-1234-5678など）を+819012345678に変換
 *
 * @param phone - 入力された電話番号
 * @returns E.164フォーマットの電話番号
 */
export function formatPhoneNumberForSquare(phone: string): string {
  // ハイフンやスペースを削除
  let cleaned = phone.replace(/[-\s()]/g, '');

  // 先頭の0を削除して+81を追加（日本の場合）
  if (cleaned.startsWith('0')) {
    cleaned = '+81' + cleaned.substring(1);
  }

  // すでに+81で始まっている場合はそのまま
  if (cleaned.startsWith('+81')) {
    return cleaned;
  }

  // その他の場合は+81を追加
  return '+81' + cleaned;
}

/**
 * 日時を ISO 8601 フォーマット（Square API要求形式）に変換
 *
 * @param date - Date オブジェクト
 * @returns ISO 8601形式の文字列
 */
export function formatDateTimeForSquare(date: Date): string {
  return date.toISOString();
}

/**
 * Square の金額（セント単位）を円に変換
 *
 * @param amount - Square APIの金額（セント単位）
 * @returns 円単位の金額
 */
export function convertSquareAmountToYen(amount: number): number {
  return amount; // 日本円の場合、1円 = 1単位
}

/**
 * 円をSquareの金額形式（セント単位）に変換
 *
 * @param yen - 円単位の金額
 * @returns Square APIの金額形式
 */
export function convertYenToSquareAmount(yen: number): number {
  return Math.round(yen); // 日本円の場合、1円 = 1単位
}

/**
 * 予約ステータスを日本語に変換
 *
 * @param status - Square予約ステータス
 * @returns 日本語のステータス
 */
export function getBookingStatusLabel(
  status: string
): string {
  const statusMap: Record<string, string> = {
    PENDING: '保留中',
    ACCEPTED: '承認済み',
    DECLINED: '拒否',
    CANCELLED: 'キャンセル',
    COMPLETED: '完了',
  };

  return statusMap[status] || status;
}
