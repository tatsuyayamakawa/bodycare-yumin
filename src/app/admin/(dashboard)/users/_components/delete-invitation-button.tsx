"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCsrfToken } from "@/lib/hooks/use-csrf";

interface DeleteInvitationButtonProps {
  invitationId: string;
}

/**
 * 招待削除ボタン
 */
export function DeleteInvitationButton({
  invitationId,
}: DeleteInvitationButtonProps) {
  const csrfToken = useCsrfToken();

  const deleteInvitation = async () => {
    if (!confirm("この招待を削除してもよろしいですか？")) {
      return;
    }

    if (!csrfToken) {
      toast.error("CSRF トークンが取得できませんでした");
      return;
    }

    try {
      const response = await fetch("/api/admin/delete-invitation", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ invitationId }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete invitation:", error);
      toast.error("招待の削除に失敗しました");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="destructive" size="sm" onClick={deleteInvitation}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>招待を削除</p>
      </TooltipContent>
    </Tooltip>
  );
}
