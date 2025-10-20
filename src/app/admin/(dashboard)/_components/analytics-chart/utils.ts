import { CSV_HEADERS } from "./constants";
import type { AnalyticsData, MetricType, PeriodType } from "./types";

/**
 * 期間のカットオフ日を計算
 */
export function getPeriodCutoffDates(period: PeriodType) {
  const now = new Date();
  const currentCutoffDate = new Date();
  const previousCutoffDate = new Date();

  switch (period) {
    case "7d":
      currentCutoffDate.setDate(now.getDate() - 7);
      previousCutoffDate.setDate(now.getDate() - 14);
      break;
    case "30d":
      currentCutoffDate.setDate(now.getDate() - 30);
      previousCutoffDate.setDate(now.getDate() - 60);
      break;
    case "3m":
      currentCutoffDate.setMonth(now.getMonth() - 3);
      previousCutoffDate.setMonth(now.getMonth() - 6);
      break;
  }

  return { currentCutoffDate, previousCutoffDate };
}

/**
 * 前期比較を計算
 */
export function calculatePeriodComparison(
  data: AnalyticsData[],
  selectedMetric: MetricType,
  selectedPeriod: PeriodType,
) {
  const { currentCutoffDate, previousCutoffDate } =
    getPeriodCutoffDates(selectedPeriod);

  const previousData = data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= previousCutoffDate && itemDate < currentCutoffDate;
  });

  const currentTotal = data.reduce(
    (sum, item) => sum + item[selectedMetric],
    0,
  );
  const previousTotal = previousData.reduce(
    (sum, item) => sum + item[selectedMetric],
    0,
  );
  const changePercent =
    previousTotal === 0
      ? 0
      : ((currentTotal - previousTotal) / previousTotal) * 100;

  return {
    current: currentTotal,
    previous: previousTotal,
    changePercent: Math.round(changePercent * 10) / 10,
    isIncrease: changePercent >= 0,
  };
}

/**
 * CSVデータを生成
 */
export function generateCSVData(
  data: AnalyticsData[],
  selectedMetric: MetricType,
) {
  return data.map((item) => [
    new Date(item.date).toLocaleDateString("ja-JP"),
    item.pageViews,
    item.sessions,
    item.users,
    item.desktop || Math.round(item[selectedMetric] * 0.6),
    item.mobile || Math.round(item[selectedMetric] * 0.4),
  ]);
}

/**
 * CSVファイルをエクスポート
 */
export function exportCSV(
  data: AnalyticsData[],
  selectedMetric: MetricType,
  selectedPeriod: PeriodType,
) {
  const csvData = generateCSVData(data, selectedMetric);

  const csvContent = [
    CSV_HEADERS.join(","),
    ...csvData.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `analytics_${selectedPeriod}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * データの日付をフォーマット
 */
export function formatAnalyticsData(
  data: AnalyticsData[],
  selectedMetric: MetricType,
) {
  return data.map((item) => {
    const date = new Date(item.date);
    const displayDate = isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("ja-JP", {
          month: "short",
          day: "numeric",
        });

    return {
      ...item,
      displayDate,
      desktop: Math.round(item[selectedMetric] * 0.6),
      mobile: Math.round(item[selectedMetric] * 0.4),
    };
  });
}
