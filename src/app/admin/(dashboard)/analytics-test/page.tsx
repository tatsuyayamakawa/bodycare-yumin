"use client";

import { AlertCircle, CheckCircle, RefreshCw, TestTube } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GA4Config {
  propertyId?: string;
  hasCredentials: boolean;
  nodeEnv: string;
}

interface SiteStats {
  totalViews: number;
  sessions: number;
  users: number;
}

interface GA4TestResults {
  siteStats: SiteStats;
}

interface SyncArticle {
  title: string;
  totalViews: number;
  monthlyViews: number;
}

interface SyncData {
  syncedCount: number;
  articles?: SyncArticle[];
}

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  config?: GA4Config;
  testResults?: GA4TestResults;
  data?: SyncData;
  timestamp?: string;
}

export default function AnalyticsTestPage() {
  const [connectionTest, setConnectionTest] = useState<TestResult | null>(null);
  const [syncTest, setSyncTest] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const testGA4Connection = async () => {
    setLoading("connection");
    try {
      const response = await fetch("/api/debug/ga4-test");
      const result = await response.json();
      setConnectionTest(result);
    } catch (error) {
      setConnectionTest({
        success: false,
        error: "Failed to test GA4 connection",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(null);
    }
  };

  const testAnalyticsSync = async () => {
    setLoading("sync");
    try {
      const response = await fetch("/api/cron/sync-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setSyncTest(result);
    } catch (error) {
      setSyncTest({
        success: false,
        error: "Failed to test analytics sync",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(null);
    }
  };

  const StatusBadge = ({ success }: { success: boolean }) => (
    <Badge
      variant={success ? "default" : "destructive"}
      className="flex items-center gap-1"
    >
      {success ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      {success ? "Success" : "Failed"}
    </Badge>
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Analytics Test Page
        </h1>
        <p className="text-muted-foreground">
          Google Analytics 4の接続状況とデータ同期をテストします
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* GA4接続テスト */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              GA4接続テスト
            </CardTitle>
            <CardDescription>
              Google Analytics 4 APIの接続状況を確認
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testGA4Connection}
              disabled={loading === "connection"}
              className="w-full"
            >
              {loading === "connection" && (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              接続テスト実行
            </Button>

            {connectionTest && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">ステータス:</span>
                  <StatusBadge success={connectionTest.success} />
                </div>

                {connectionTest.config && (
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">設定状況:</div>
                    <div className="text-muted-foreground space-y-1">
                      <div>
                        Property ID:{" "}
                        {connectionTest.config.propertyId ? "✓" : "✗"}
                      </div>
                      <div>
                        認証情報:{" "}
                        {connectionTest.config.hasCredentials ? "✓" : "✗"}
                      </div>
                      <div>環境: {connectionTest.config.nodeEnv}</div>
                    </div>
                  </div>
                )}

                {connectionTest.testResults && (
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">テスト結果:</div>
                    <div className="text-muted-foreground space-y-1">
                      <div>
                        総PV: {connectionTest.testResults.siteStats.totalViews}
                      </div>
                      <div>
                        セッション数:{" "}
                        {connectionTest.testResults.siteStats.sessions}
                      </div>
                      <div>
                        ユーザー数: {connectionTest.testResults.siteStats.users}
                      </div>
                    </div>
                  </div>
                )}

                {connectionTest.error && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
                    <div className="text-destructive font-medium">エラー:</div>
                    <div className="text-destructive/80 mt-1 text-sm">
                      {connectionTest.details || connectionTest.error}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics同期テスト */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Analytics同期テスト
            </CardTitle>
            <CardDescription>記事データとGA4の同期処理をテスト</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testAnalyticsSync}
              disabled={loading === "sync"}
              className="w-full"
            >
              {loading === "sync" && (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              同期テスト実行
            </Button>

            {syncTest && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">ステータス:</span>
                  <StatusBadge success={syncTest.success} />
                </div>

                {syncTest.success && syncTest.data && (
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">同期結果:</div>
                    <div className="text-muted-foreground space-y-1">
                      <div>同期記事数: {syncTest.data.syncedCount}</div>
                      {syncTest.data.articles &&
                        syncTest.data.articles.length > 0 && (
                          <div className="mt-2">
                            <div className="text-foreground mb-1 font-medium">
                              記事一覧:
                            </div>
                            <div className="max-h-32 space-y-1 overflow-y-auto">
                              {syncTest.data.articles
                                .slice(0, 5)
                                .map((article: SyncArticle, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-muted rounded p-2 text-xs"
                                  >
                                    <div className="font-medium">
                                      {article.title}
                                    </div>
                                    <div>
                                      総PV: {article.totalViews} | 月間:{" "}
                                      {article.monthlyViews}
                                    </div>
                                  </div>
                                ))}
                              {syncTest.data.articles.length > 5 && (
                                <div className="text-muted-foreground text-xs">
                                  ...他 {syncTest.data.articles.length - 5} 記事
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {syncTest.error && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
                    <div className="text-destructive font-medium">エラー:</div>
                    <div className="text-destructive/80 mt-1 text-sm">
                      {syncTest.details || syncTest.error}
                    </div>
                  </div>
                )}

                {syncTest.timestamp && (
                  <div className="text-muted-foreground text-xs">
                    実行時刻: {new Date(syncTest.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>設定手順</CardTitle>
          <CardDescription>
            GA4連携が失敗する場合は以下を確認してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-inside list-decimal space-y-2 text-sm">
            <li>Google Cloud Consoleで Google Analytics Data API を有効化</li>
            <li>サービスアカウントを作成し、JSONキーをダウンロード</li>
            <li>GA4プロパティにサービスアカウントを「閲覧者」として追加</li>
            <li>
              環境変数 GA4_PROPERTY_ID と GOOGLE_ANALYTICS_CREDENTIALS を設定
            </li>
            <li>
              データベースマイグレーション (scripts/add-analytics-columns.sql)
              を実行
            </li>
          </ol>
          <div className="bg-muted mt-4 rounded-md p-3">
            <div className="text-sm font-medium">詳細な設定手順:</div>
            <div className="text-muted-foreground mt-1 text-sm">
              docs/google-analytics-setup.md を参照してください
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
