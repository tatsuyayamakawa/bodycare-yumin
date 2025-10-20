"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteArticle } from "@/lib/actions/articles";

interface DeleteArticleButtonProps {
  articleId: string;
  articleTitle: string;
}

export function DeleteArticleButton({
  articleId,
  articleTitle,
}: DeleteArticleButtonProps) {
  const handleDelete = async () => {
    if (
      !confirm(`「${articleTitle}」を削除しますか？この操作は取り消せません。`)
    ) {
      return;
    }

    const result = await deleteArticle(articleId);
    if ("error" in result) {
      alert(result.error);
    } else {
      window.location.reload();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>記事を削除</p>
      </TooltipContent>
    </Tooltip>
  );
}
