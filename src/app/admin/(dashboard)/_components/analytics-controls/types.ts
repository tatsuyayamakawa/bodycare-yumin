import type { MetricType, PeriodType } from "../analytics-shared/types";

export interface AnalyticsControlsProps {
  selectedPeriod: PeriodType;
  selectedMetric: MetricType;
  onPeriodChange: (period: PeriodType) => void;
  onMetricChange: (metric: MetricType) => void;
  onExport: () => void;
  isLoading?: boolean;
}
