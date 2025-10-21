// 専門的なキーワード一覧
// SEO説明文の自動生成で使用するキーワード
// プロジェクトに応じて内容を変更してください
export const SPECIALIZED_KEYWORDS = [
  '肩こり',
  '腰痛',
  '頭痛',
  '整体',
  'マッサージ',
  'ストレッチ',
  '姿勢',
  '疲労',
  '血行',
  '筋肉',
  '骨盤',
  '首',
  '背中',
  // 必要に応じて追加・削除してください
] as const;

// 専門キーワードが含まれているかチェックする関数
export function isSpecializedContent(title: string): boolean {
  return SPECIALIZED_KEYWORDS.some(keyword => title.includes(keyword));
}