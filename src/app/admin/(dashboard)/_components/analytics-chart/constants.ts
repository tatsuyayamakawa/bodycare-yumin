import type { MetricType } from "./types";

import type { ChartConfig } from "@/components/ui/chart";

/**
 * チャート設定
 */
export const CHART_CONFIG = {
  desktop: {
    label: "デスクトップ",
    color: "var(--color-chart-1)",
  },
  mobile: {
    label: "モバイル",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

/**
 * メトリック説明文
 */
export const METRIC_DESCRIPTIONS: Record<MetricType, string> = {
  pageViews:
    "ウェブサイトで表示されたページの総数です。同じページを複数回見た場合もそれぞれカウントされます。",
  sessions:
    "ユーザーがサイトを訪問してから離脱するまでの一連の操作です。30分間操作がない場合セッションが終了します。",
  users:
    "期間内にサイトを訪問したユニークユーザー数です。同じユーザーが複数回訪問しても1人としてカウントされます。",
};

/**
 * CSVエクスポート用のヘッダー
 */
export const CSV_HEADERS = [
  "日付",
  "ページビュー",
  "セッション",
  "ユーザー",
  "デスクトップ",
  "モバイル",
];
