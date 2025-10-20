/**
 * 数値を千単位でフォーマット
 */
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toLocaleString();
}

/**
 * パーセンテージをフォーマット
 */
export function formatPercent(num: number): string {
  return `${(num * 100).toFixed(2)}%`;
}

/**
 * 検索順位をフォーマット
 */
export function formatPosition(position: number): string {
  return position.toFixed(1);
}
