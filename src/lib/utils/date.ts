/**
 * 日本時間での日付ユーティリティ関数
 */

/**
 * UTCタイムスタンプを日本時間でフォーマット
 */
export function formatJSTDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * UTCタイムスタンプを日本時間の短縮形式でフォーマット
 */
export function formatJSTDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * UTCタイムスタンプを日本時間での相対時間表記に変換
 */
export function formatJSTTimeAgo(dateString: string): string {
  // 現在時刻を日本時間で取得
  const now = new Date();
  const nowJST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  
  // UTCタイムスタンプを日本時間に変換
  const date = new Date(dateString);
  const dateJST = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  
  const diffInSeconds = Math.floor((nowJST.getTime() - dateJST.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "1分未満前";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}時間前`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}日前`;
  }
}

/**
 * 日本時間での現在時刻を取得
 */
export function getNowJST(): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
}