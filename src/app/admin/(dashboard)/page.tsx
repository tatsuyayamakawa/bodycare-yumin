import { Edit, Eye, FileText, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AnalyticsChart } from "./_components/analytics-chart";
import { PopularArticles } from "./_components/popular-articles";
import { RecentActivity } from "./_components/recent-activity";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecentActivityLogs } from "@/lib/actions/activity-log";
import { getDashboardAnalytics } from "@/lib/actions/analytics-dashboard";
import { getArticleStats } from "@/lib/actions/articles";

export const metadata: Metadata = {
  title: "ダッシュボード | 管理画面",
  robots: { index: false, follow: false },
};

const colorClasses = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  orange: "text-orange-600 bg-orange-100",
  purple: "text-purple-600 bg-purple-100",
} as const;

function StatCard({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: number;
  color: keyof typeof colorClasses;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const [textColor, bgColor] = colorClasses[color].split(" ");

  return (
    <article className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-medium text-gray-500 sm:text-sm">
            {label}
          </h3>
          <p className={`text-lg font-bold sm:text-xl ${textColor}`}>{value}</p>
        </div>
        <div
          className={`rounded-md p-1.5 sm:p-2 ${bgColor}`}
          aria-hidden="true"
        >
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor}`} />
        </div>
      </div>
    </article>
  );
}

export default async function AdminDashboard() {
  const [statsResult, analyticsResult, activitiesResult] = await Promise.all([
    getArticleStats(),
    getDashboardAnalytics(30),
    getRecentActivityLogs(5),
  ]);

  const stats =
    !("error" in statsResult) && statsResult.data ? statsResult.data : null;
  const analytics =
    !analyticsResult.error && analyticsResult.data
      ? analyticsResult.data
      : null;
  const activities = activitiesResult.success
    ? activitiesResult.data || []
    : [];

  return (
    <main className="min-h-screen w-full space-y-4 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            ダッシュボード - アクセス分析
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            サイト全体の分析とアクセス状況
          </p>
        </div>
        <Link href="/blog">
          <Button variant="outline">
            <Eye className="h-4 w-4" aria-hidden="true" />
            ブログを見る
          </Button>
        </Link>
      </header>

      {stats && (
        <section
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
          aria-label="記事統計"
        >
          <StatCard
            label="総記事数"
            value={stats.total}
            color="blue"
            Icon={FileText}
          />
          <StatCard
            label="公開済み"
            value={stats.published}
            color="green"
            Icon={Eye}
          />
          <StatCard
            label="下書き"
            value={stats.draft}
            color="orange"
            Icon={Edit}
          />
          <StatCard
            label="今月の記事"
            value={stats.thisMonth}
            color="purple"
            Icon={TrendingUp}
          />
        </section>
      )}

      {analytics ? (
        <AnalyticsChart data={analytics.dailyStats} />
      ) : (
        <Card role="alert">
          <CardContent className="flex h-80 items-center justify-center p-6">
            <div className="text-center text-gray-500">
              <p className="text-sm">データの読み込みに失敗しました</p>
              <p className="mt-1 text-xs text-gray-400">
                しばらく時間をおいてから再度お試しください
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-lg">最近の活動</CardTitle>
                <CardDescription>
                  直近のスタッフによる操作の記録です。
                </CardDescription>
              </div>
              <Link href="/admin/articles">
                <Button variant="ghost" size="sm" className="text-xs">
                  すべて見る
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities} />
          </CardContent>
        </Card>
        <PopularArticles />
      </div>
    </main>
  );
}
