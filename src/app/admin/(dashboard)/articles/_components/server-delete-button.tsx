import { DeleteArticleButton } from "./delete-article-button";

import type { AdminUser } from "@/lib/auth/server-utils";

interface ServerDeleteButtonProps {
  articleId: string;
  articleTitle: string;
  currentUser?: AdminUser | null;
}

export function ServerDeleteButton({
  articleId,
  articleTitle,
  currentUser,
}: ServerDeleteButtonProps) {
  // サーバーサイドで権限チェック
  if (currentUser?.role !== "admin") {
    return null;
  }

  return (
    <DeleteArticleButton articleId={articleId} articleTitle={articleTitle} />
  );
}
