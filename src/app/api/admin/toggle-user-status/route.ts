import { NextRequest, NextResponse } from "next/server";

import { toggleUserStatusAction } from "@/lib/actions/auth";

export async function POST(request: NextRequest) {
  try {
    const { userId, isActive } = await request.json();

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "無効なパラメータです" },
        { status: 400 }
      );
    }

    const result = await toggleUserStatusAction(userId, isActive);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Toggle user status API error:", error);
    return NextResponse.json(
      { success: false, error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}