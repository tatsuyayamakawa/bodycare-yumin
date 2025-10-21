import { NextRequest, NextResponse } from "next/server";

import { deleteInvitationAction } from "@/lib/actions/auth";

export async function DELETE(request: NextRequest) {
  try {
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: "招待IDが必要です" },
        { status: 400 }
      );
    }

    const result = await deleteInvitationAction(invitationId);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Delete invitation API error:", error);
    return NextResponse.json(
      { success: false, error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}