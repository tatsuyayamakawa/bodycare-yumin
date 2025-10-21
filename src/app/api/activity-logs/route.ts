import { NextRequest, NextResponse } from "next/server";

import { getRecentActivityLogs } from "@/lib/actions/activity-log";
import { getServerUser } from "@/lib/auth/server-utils";

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const currentUser = await getServerUser();
    if (!currentUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // クエリパラメータから件数を取得
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // 活動ログを取得
    const result = await getRecentActivityLogs(limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "活動ログの取得に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data || [],
    });
  } catch (error) {
    console.error("Activity logs API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
