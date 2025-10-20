import { Edit, Eye } from "lucide-react";
import Link from "next/link";

import type { ArticleSearchProps } from "../_lib";
import { ServerDeleteButton } from "./server-delete-button";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Article } from "@/lib/supabase/types";

interface ArticleActionsProps {
  article: Article;
  currentUser?: ArticleSearchProps["currentUser"];
  variant?: "desktop" | "mobile";
}

/**
 * 記事アクションボタン
 */
export function ArticleActions({
  article,
  currentUser,
  variant = "desktop",
}: ArticleActionsProps) {
  const isDesktop = variant === "desktop";

  return (
    <div
      className={
        isDesktop
          ? "flex items-center space-x-2"
          : "flex items-center justify-end space-x-2 border-t border-gray-100 pt-3"
      }
    >
      {article.status === "published" &&
        (isDesktop ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/blog/${article.slug}`} target="_self">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>記事を閲覧</TooltipContent>
          </Tooltip>
        ) : (
          <Link href={`/blog/${article.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="text-xs">
              <Eye className="mr-1 h-3 w-3" />
              閲覧
            </Button>
          </Link>
        ))}
      {isDesktop ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/admin/articles/${article.id}/edit`}>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>記事を編集</TooltipContent>
        </Tooltip>
      ) : (
        <Link href={`/admin/articles/${article.id}/edit`}>
          <Button variant="outline" size="sm" className="text-xs">
            <Edit className="mr-1 h-3 w-3" />
            編集
          </Button>
        </Link>
      )}
      <ServerDeleteButton
        articleId={article.id}
        articleTitle={article.title}
        currentUser={currentUser}
      />
    </div>
  );
}
