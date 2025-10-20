"use client";

import { memo, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { AnalyticsControls } from "../analytics-controls";
import { AnalyticsSummary } from "../analytics-summary";

import { CHART_CONFIG, METRIC_DESCRIPTIONS } from "./constants";
import type {
  AnalyticsChartProps,
  AnalyticsData,
  MetricType,
  PeriodType,
} from "./types";
import {
  calculatePeriodComparison,
  exportCSV,
  formatAnalyticsData,
} from "./utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDashboardAnalytics } from "@/lib/actions/analytics-dashboard";

export const AnalyticsChart = memo(function AnalyticsChart({
  data: initialData,
  title,
  onPeriodChange,
}: AnalyticsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("pageViews");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("30d");
  const [data, setData] = useState<AnalyticsData[]>(initialData);
  const [dataCache, setDataCache] = useState<
    Partial<Record<PeriodType, AnalyticsData[]>>
  >({
    "30d": initialData,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 前期比較の計算をメモ化
  const periodComparison = useMemo(
    () => calculatePeriodComparison(data, selectedMetric, selectedPeriod),
    [data, selectedMetric, selectedPeriod],
  );

  // 期間変更ハンドラー
  const handlePeriodChange = async (period: PeriodType) => {
    if (selectedPeriod === period) return;

    const cached = dataCache[period];
    if (cached) {
      setSelectedPeriod(period);
      setData(cached);
      return;
    }

    setIsLoadingData(true);
    try {
      const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
      const result = await (onPeriodChange
        ? onPeriodChange(days)
        : getDashboardAnalytics(days));
      if (!result.error && result.data?.dailyStats) {
        const newData = result.data.dailyStats;
        setDataCache((prev) => ({ ...prev, [period]: newData }));
        setData(newData);
        setSelectedPeriod(period);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // CSVエクスポート機能
  const handleExportCSV = () => {
    exportCSV(data, selectedMetric, selectedPeriod);
  };

  // データの日付をフォーマット（メモ化）
  const formattedData = useMemo(
    () => formatAnalyticsData(data, selectedMetric),
    [data, selectedMetric],
  );

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title ?? "アクセス解析"}</CardTitle>
          <CardDescription>過去30日間のアクセス状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-sm">データがありません</p>
              <p className="mt-1 text-xs text-gray-400">
                しばらく時間をおいてから再度お試しください
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-lg">{title ?? "アクセス解析"}</CardTitle>
            <CardDescription>
              {METRIC_DESCRIPTIONS[selectedMetric]}
            </CardDescription>
          </div>
          <AnalyticsControls
            selectedPeriod={selectedPeriod}
            selectedMetric={selectedMetric}
            onPeriodChange={handlePeriodChange}
            onMetricChange={setSelectedMetric}
            onExport={handleExportCSV}
            isLoading={isLoadingData}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isLoadingData && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-600">
                  データを読み込んでいます
                </p>
              </div>
            </div>
          )}
          <div className={isLoadingData ? "opacity-50" : ""}>
            <ChartContainer config={CHART_CONFIG} className="h-80 w-full">
              <AreaChart data={formattedData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value, index) =>
                    index % 2 === 0 ? value : ""
                  }
                />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        <span key={name} className="flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3"
                            style={{
                              backgroundColor:
                                name === "desktop"
                                  ? "var(--color-desktop)"
                                  : "var(--color-mobile)",
                            }}
                          />
                          <span>
                            {name === "desktop" ? "デスクトップ" : "モバイル"}
                          </span>
                          <span className="font-medium">
                            {value.toLocaleString()}
                          </span>
                        </span>,
                      ]}
                    />
                  }
                />
                <Area
                  dataKey="desktop"
                  type="linear"
                  fill="url(#fillDesktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
                <Area
                  dataKey="mobile"
                  type="linear"
                  fill="url(#fillMobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>

            <AnalyticsSummary
              data={formattedData}
              selectedMetric={selectedMetric}
              periodComparison={periodComparison}
              desktopColor={CHART_CONFIG.desktop.color}
              mobileColor={CHART_CONFIG.mobile.color}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
