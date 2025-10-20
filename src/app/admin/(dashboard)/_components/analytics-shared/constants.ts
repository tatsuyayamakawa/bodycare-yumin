import type { MetricType, PeriodType } from "./types";

/**
 * メトリックラベル
 */
export const METRIC_LABELS: Record<MetricType, string> = {
  pageViews: "ページビュー",
  sessions: "セッション",
  users: "ユーザー",
};

/**
 * 期間ラベル
 */
export const PERIOD_LABELS: Record<PeriodType, string> = {
  "7d": "7日間",
  "30d": "30日間",
  "3m": "3ヶ月",
};
