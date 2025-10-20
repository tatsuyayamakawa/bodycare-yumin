import type { AdminUser } from "@/lib/auth/session";
import type {
  Article,
  ArticleStatus,
  TiptapContent,
} from "@/lib/supabase/types";

// ==================== Types ====================

// Tiptapのノード型定義
export interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
}

export interface ArticleSearchProps {
  articles: Article[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  statusFilter?: string;
  currentUser?: AdminUser | null;
}

// ==================== Constants ====================

/**
 * 記事ステータスのフィルター選択肢
 */
export const ARTICLE_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "published", label: "公開済み" },
  { value: "draft", label: "下書き" },
  { value: "private", label: "非公開" },
  { value: "scheduled", label: "予約投稿" },
] as const;

export const statusLabels: Record<ArticleStatus, string> = {
  draft: "下書き",
  published: "公開",
  private: "非公開",
  scheduled: "予約投稿",
};

export const statusColors: Record<ArticleStatus, string> = {
  draft: "bg-purple-100 text-purple-800", // 下書き: 紫色（最近の活動と統一）
  published: "bg-blue-100 text-blue-800", // 公開: 青色（最近の活動と統一）
  private: "bg-gray-100 text-gray-800", // 非公開: グレー色（最近の活動と統一）
  scheduled: "bg-green-100 text-green-800", // 予約投稿: 緑色（最近の活動と統一）
};

// ==================== Utils ====================

/**
 * TiptapのJSONContentから文字列を抽出する関数
 */
export function extractTextFromTiptapContent(content: TiptapContent): string {
  if (!content) return "";

  let text = "";

  function extractFromNode(node: TiptapNode): void {
    if (node.type === "text") {
      text += node.text || "";
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: TiptapNode) => extractFromNode(child));
    }

    // 段落やブロック要素の後にスペースを追加
    if (node.type === "paragraph" || node.type === "heading") {
      text += " ";
    }
  }

  extractFromNode(content);
  return text.trim();
}
