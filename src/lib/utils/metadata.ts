import { isSpecializedContent } from "@/lib/constants/keywords";

/**
 * タイトルに基づいてデフォルトのメタディスクリプションを生成する
 * @param title 記事のタイトル
 * @returns 生成されたメタディスクリプション
 */
export function generateDefaultMetaDescription(title: string): string {
  if (isSpecializedContent(title)) {
    return `手もみ整体 癒眠が「${title}」について詳しく解説します。`;
  } else {
    return `手もみ整体 癒眠のブログ記事「${title}」をお読みください。日々の出来事を綴っています。`;
  }
}

/**
 * ブログ詳細ページ用のフォールバックメタディスクリプションを生成する
 * @param title 記事のタイトル
 * @returns フォールバック用のメタディスクリプション
 */
export function generateFallbackMetaDescription(title: string): string {
  return `手もみ整体 癒眠のブログ記事「${title}」をご覧ください。`;
}
