type MetricType = "pageViews" | "sessions" | "users";

interface AnalyticsData {
  date: string;
  pageViews: number;
  sessions: number;
  users: number;
  desktop: number;
  mobile: number;
}

interface PeriodComparison {
  current: number;
  previous: number;
  changePercent: number;
  isIncrease: boolean;
}

interface AnalyticsSummaryProps {
  data: AnalyticsData[];
  selectedMetric: MetricType;
  periodComparison: PeriodComparison;
  desktopColor: string;
  mobileColor: string;
}

const metricLabels: Record<MetricType, string> = {
  pageViews: "ページビュー",
  sessions: "セッション",
  users: "ユーザー",
};

export function AnalyticsSummary({
  data,
  selectedMetric,
  periodComparison,
  desktopColor,
  mobileColor,
}: AnalyticsSummaryProps) {
  const desktopTotal = data.reduce((sum, item) => sum + item.desktop, 0);
  const mobileTotal = data.reduce((sum, item) => sum + item.mobile, 0);

  return (
    <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color: desktopColor }}>
          {desktopTotal.toLocaleString()}
        </p>
        <p className="text-muted-foreground text-xs">
          デスクトップ（{metricLabels[selectedMetric]}）
        </p>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color: mobileColor }}>
          {mobileTotal.toLocaleString()}
        </p>
        <p className="text-muted-foreground text-xs">
          モバイル（{metricLabels[selectedMetric]}）
        </p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <p
            className="text-2xl font-bold"
            style={{ color: "hsl(var(--chart-3))" }}
          >
            {periodComparison.current.toLocaleString()}
          </p>
          <div
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
              periodComparison.isIncrease
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <span>{periodComparison.isIncrease ? "↗" : "↘"}</span>
            <span className="font-medium">
              {Math.abs(periodComparison.changePercent)}%
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          総{metricLabels[selectedMetric]} (前期比)
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          前期: {periodComparison.previous.toLocaleString()}(
          {periodComparison.isIncrease ? "+" : ""}
          {(
            periodComparison.current - periodComparison.previous
          ).toLocaleString()}
          )
        </p>
      </div>
    </div>
  );
}
