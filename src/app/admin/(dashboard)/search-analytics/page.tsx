"use client";

import { useState, useEffect } from "react";

import { PeriodSelector } from "./_components/period-selector";
import { SearchConsoleDashboard } from "./_components/search-console-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPageSearchPerformance,
  getSearchConsoleStats,
  getSearchQueries,
} from "@/lib/actions/search-console";

function LoadingFallback() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>検索コンソール分析</CardTitle>
          <CardDescription>Google検索でのパフォーマンス</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>トップ検索クエリ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SearchAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "3m">("30d");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    stats: any;
    queries: any[];
    pages: any[];
  } | null>(null);

  // 初期データ読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
        
        const [statsResult, queriesResult, pagesResult] = await Promise.all([
          getSearchConsoleStats(days),
          getSearchQueries(days),
          getPageSearchPerformance(days),
        ]);

        setData({
          stats: statsResult.success ? statsResult.data : null,
          queries: queriesResult.success ? queriesResult.data : [],
          pages: pagesResult.success ? pagesResult.data : [],
        });
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [period]);

  const handlePeriodChange = async (newPeriod: "7d" | "30d" | "3m") => {
    setPeriod(newPeriod);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            検索アナリティクス
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Google検索からのアクセス分析とキーワードパフォーマンス
          </p>
        </div>
        <PeriodSelector 
          period={period} 
          onPeriodChange={handlePeriodChange}
          disabled={loading}
        />
      </div>

      {loading ? (
        <LoadingFallback />
      ) : (
        <SearchConsoleDashboard
          period={period}
          initialStats={data?.stats}
          initialQueries={data?.queries || []}
          initialPages={data?.pages || []}
        />
      )}
    </div>
  );
}