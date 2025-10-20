import type { MetricType, PeriodType } from "../analytics-shared/types";

import type { DashboardAnalyticsData } from "@/lib/actions/analytics-dashboard";

export interface AnalyticsData {
  date: string;
  pageViews: number;
  sessions: number;
  users: number;
  desktop: number;
  mobile: number;
}

export interface AnalyticsChartProps {
  data: AnalyticsData[];
  title?: string;
  onPeriodChange?: (days?: number) => Promise<{
    success: boolean;
    data?: DashboardAnalyticsData;
    error?: string;
  }>;
}

// Re-export shared types for convenience
export type { MetricType, PeriodType };
