import type { TiptapContent, TiptapNode } from "../types/tiptap";

/**
 * TiptapのJSONコンテンツからプレーンテキストを抽出
 */
export function extractTextFromTiptapJson(content: TiptapContent): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (!content.content) return "";

  let text = "";
  const traverse = (node: TiptapNode) => {
    if (node.type === "text" && node.text) {
      text += node.text;
    }
    if (node.content) {
      node.content.forEach(traverse);
    }
  };

  if (Array.isArray(content.content)) {
    content.content.forEach(traverse);
  }

  return text;
}

/**
 * 読書時間を推定（日本語の平均読書速度: 500文字/分）
 */
export function calculateReadingTime(
  content: TiptapContent,
  fallbackText = "",
): string {
  const contentText = extractTextFromTiptapJson(content);
  const text = contentText || fallbackText;

  if (!text) return "3分で読める";

  const wordsPerMinute = 500; // 日本語の平均読書速度
  const wordCount = text.length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return `${minutes}分で読める`;
}
