"use client";

import { Download } from "lucide-react";

import { METRIC_LABELS, PERIOD_LABELS } from "../analytics-shared/constants";
import type { MetricType, PeriodType } from "../analytics-shared/types";
import type { AnalyticsControlsProps } from "./types";

import { Button } from "@/components/ui/button";

export function AnalyticsControls({
  selectedPeriod,
  selectedMetric,
  onPeriodChange,
  onMetricChange,
  onExport,
  isLoading,
}: AnalyticsControlsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* 期間選択 */}
      <div className="flex rounded-lg border p-1">
        {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onPeriodChange(period)}
            disabled={isLoading}
          >
            {PERIOD_LABELS[period]}
          </Button>
        ))}
      </div>

      {/* メトリック選択 */}
      <div className="flex rounded-lg border p-1">
        {(Object.keys(METRIC_LABELS) as MetricType[]).map((metric) => (
          <Button
            key={metric}
            variant={selectedMetric === metric ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onMetricChange(metric)}
          >
            {METRIC_LABELS[metric]}
          </Button>
        ))}
      </div>

      {/* CSVエクスポートボタン */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-3 text-xs"
        onClick={onExport}
      >
        <Download className="h-3 w-3" />
        CSV
      </Button>
    </div>
  );
}
