import { NextRequest, NextResponse } from "next/server";

import {
  getAnalyticsSyncStatus,
  syncAnalyticsData,
} from "@/lib/actions/sync-analytics";

export async function POST(request: NextRequest) {
  try {
    // Vercel Cronまたはcron-jobサービスからの認証チェック
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    // 本番環境でのみ認証を強制
    if (isProduction && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting analytics sync...");

    // アナリティクスデータを同期
    const result = await syncAnalyticsData();

    if (!result.success) {
      console.error("Analytics sync failed:", result.error);
      return NextResponse.json(
        {
          error: "Analytics sync failed",
          details: result.error,
        },
        { status: 500 },
      );
    }

    console.log(
      `Analytics sync completed. Synced ${result.data?.syncedCount} articles.`,
    );

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${result.data?.syncedCount} articles`,
      data: result.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics sync cron error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 同期状況の確認エンドポイント
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    // 本番環境でのみ認証を強制
    if (isProduction && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await getAnalyticsSyncStatus();

    if (!status.success) {
      return NextResponse.json(
        {
          error: "Failed to get sync status",
          details: status.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: status.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics sync status error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
