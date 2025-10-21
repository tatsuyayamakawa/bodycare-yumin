// 記事のステータス定義
export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published', 
  PRIVATE: 'private',
  SCHEDULED: 'scheduled',
} as const;

export type ArticleStatus = typeof ARTICLE_STATUS[keyof typeof ARTICLE_STATUS];

// ステータスラベル
export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  [ARTICLE_STATUS.DRAFT]: '下書き',
  [ARTICLE_STATUS.PUBLISHED]: '公開',
  [ARTICLE_STATUS.PRIVATE]: '非公開', 
  [ARTICLE_STATUS.SCHEDULED]: '予約投稿',
};

// ステータス色設定（記事テーブル用）
export const ARTICLE_STATUS_COLORS: Record<ArticleStatus, string> = {
  [ARTICLE_STATUS.DRAFT]: 'bg-gray-100 text-gray-800',
  [ARTICLE_STATUS.PUBLISHED]: 'bg-green-100 text-green-800',
  [ARTICLE_STATUS.PRIVATE]: 'bg-red-100 text-red-800',
  [ARTICLE_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-800',
};

// フォームのバリデーションメッセージ
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'タイトルは必須です',
  SLUG_REQUIRED: 'スラッグは必須です', 
  SLUG_FORMAT: 'スラッグは英小文字、数字、ハイフンのみ使用可能です',
  CONTENT_REQUIRED: '記事本文を入力してください',
  TITLE_FOR_GENERATION: 'タイトルを入力してからアイキャッチを生成してください',
  TITLE_FOR_META: 'タイトルを入力してからメタディスクリプションを生成してください',
} as const;