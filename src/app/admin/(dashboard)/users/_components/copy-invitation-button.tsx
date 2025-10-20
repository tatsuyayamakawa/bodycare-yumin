"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyInvitationButtonProps {
  token: string;
}

/**
 * 招待URLコピーボタン
 */
export function CopyInvitationButton({ token }: CopyInvitationButtonProps) {
  const copyInvitationUrl = async () => {
    try {
      const url = `${window.location.origin}/admin/register?token=${token}`;
      await navigator.clipboard.writeText(url);
      toast.success("招待URLをクリップボードにコピーしました");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("URLのコピーに失敗しました");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={copyInvitationUrl}>
          <Copy className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>招待URLをコピー</p>
      </TooltipContent>
    </Tooltip>
  );
}
