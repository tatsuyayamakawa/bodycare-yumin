/**
 * Tiptap JSONContent型定義
 * article-content, article-card, editorコンポーネントで共通利用
 */

export interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
  attrs?: Record<string, unknown>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
}

export interface TiptapDoc {
  type?: string;
  content?: TiptapNode[];
}

export type TiptapContent = string | TiptapDoc | null | undefined;
