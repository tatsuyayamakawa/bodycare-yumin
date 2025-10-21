import type { JSONContent } from "@tiptap/core";

export type ArticleStatus = "draft" | "published" | "private" | "scheduled";

// Tiptap JSON content type (alias to @tiptap/core JSONContent)
export type TiptapContent = JSONContent;

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: TiptapContent; // Tiptap JSON content
  meta_description?: string;
  status: ArticleStatus;
  featured_image_url?: string;
  eyecatch_default?: string;
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleData {
  title: string;
  slug: string;
  content: TiptapContent;
  meta_description?: string;
  status: ArticleStatus;
  featured_image_url?: string;
  eyecatch_default?: string;
  published_at?: string;
  scheduled_at?: string;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string;
}
