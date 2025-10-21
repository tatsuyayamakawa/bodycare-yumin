import { NextRequest, NextResponse } from "next/server";

import { getRecentActivityLogs } from "@/lib/actions/activity-log";

interface ActivityLog {
  id: string;
  action_type: string;
  description?: string;
  user_name?: string;
  created_at: string;
  metadata?: {
    article_title?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const result = await getRecentActivityLogs(limit);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }

    // 活動ログ形式に変換
    const activities =
      result.data?.map((log: ActivityLog) => ({
        id: log.id,
        action_type: log.action_type,
        description: getActivityDescription(log),
        user_name: log.user_name || "不明",
        created_at: log.created_at,
        success: true,
      })) || [];

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Recent activities API error:", error);
    return NextResponse.json(
      { success: false, error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}

function getActivityDescription(log: ActivityLog): string {
  // 記録された description があればそれを使用、なければフォールバック
  return log.description || "操作を実行しました";
}
