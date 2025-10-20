"use client";

import { AnalyticsChart } from "./analytics-chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDashboardAnalytics,
  type DashboardAnalyticsData,
} from "@/lib/actions/analytics-dashboard";

interface AnalyticsDashboardClientProps {
  initialData: DashboardAnalyticsData | null;
}

export function AnalyticsDashboardClient({
  initialData,
}: AnalyticsDashboardClientProps) {
  if (!initialData) {
    return (
      <Card role="alert">
        <CardHeader>
          <CardTitle>アクセス解析</CardTitle>
          <CardDescription>過去30日間のアクセス状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center text-center text-gray-500">
            <div>
              <p className="text-sm">データの読み込みに失敗しました</p>
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
    <AnalyticsChart
      data={initialData.dailyStats}
      title="アクセス解析"
      onPeriodChange={getDashboardAnalytics}
    />
  );
}
