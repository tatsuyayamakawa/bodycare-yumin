"use client";

import { useEffect, useState } from "react";

import type { SearchConsoleDashboardProps, SearchConsoleStats } from "./types";
import { formatNumber, formatPercent, formatPosition } from "./utils";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  PageSearchData,
  SearchQueryData,
} from "@/lib/analytics/google-search-console";

export function SearchConsoleDashboard({
  period,
  initialStats,
  initialQueries = [],
  initialPages = [],
}: SearchConsoleDashboardProps) {
  const [stats, setStats] = useState<SearchConsoleStats | null>(
    initialStats || null,
  );
  const [queries, setQueries] = useState<SearchQueryData[]>(initialQueries);
  const [pages, setPages] = useState<PageSearchData[]>(initialPages);

  // データが変更されたときに状態を更新
  useEffect(() => {
    if (initialStats) setStats(initialStats);
    if (initialQueries) setQueries(initialQueries);
    if (initialPages) setPages(initialPages);
  }, [initialStats, initialQueries, initialPages]);



  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>検索コンソール分析</CardTitle>
          <CardDescription>Google検索でのパフォーマンス</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-sm">Search Consoleデータが利用できません</p>
              <p className="mt-1 text-xs text-gray-400">
                設定を確認してください
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 統計サマリー */}
      <Card>
        <CardHeader>
          <CardTitle>検索パフォーマンス概要</CardTitle>
          <CardDescription>
            過去
            {period === "7d"
              ? "7日間"
              : period === "30d"
                ? "30日間"
                : "3ヶ月間"}
            の検索結果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">
                合計クリック数
              </p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totalClicks)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">合計表示回数</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totalImpressions)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">平均CTR</p>
              <p className="text-2xl font-bold">
                {formatPercent(stats.averageCTR)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">平均掲載順位</p>
              <p className="text-2xl font-bold">
                {formatPosition(stats.averagePosition)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* トップ検索クエリ */}
      <Card>
        <CardHeader>
          <CardTitle>トップ検索クエリ</CardTitle>
          <CardDescription>
            クリック数の多い検索キーワード（上位20件）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queries.slice(0, 20).map((query, index) => (
              <div
                key={query.query}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{query.query}</span>
                  </div>
                  <div className="mt-1 flex gap-4 text-sm text-gray-500">
                    <span>順位: {formatPosition(query.position)}</span>
                    <span>CTR: {formatPercent(query.ctr)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{query.clicks} クリック</div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(query.impressions)} 表示
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ページ別パフォーマンス */}
      <Card>
        <CardHeader>
          <CardTitle>ページ別検索パフォーマンス</CardTitle>
          <CardDescription>検索流入の多いページ（上位15件）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages.slice(0, 15).map((page, index) => (
              <div
                key={page.page}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-mono text-sm">{page.page}</span>
                  </div>
                  <div className="mt-1 flex gap-4 text-sm text-gray-500">
                    <span>順位: {formatPosition(page.position)}</span>
                    <span>CTR: {formatPercent(page.ctr)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{page.clicks} クリック</div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(page.impressions)} 表示
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
