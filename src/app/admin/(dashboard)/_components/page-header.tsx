import { type ReactNode } from "react";

interface PageHeaderProps {
  /** ページタイトル */
  title: string;
  /** ページの説明文 */
  description: string;
  /** ヘッダー右側に配置するアクションボタンなど */
  actions?: ReactNode;
}

/**
 * 管理画面の共通ページヘッダー
 *
 * @description
 * タイトル、説明文、アクションボタンを含むページヘッダーコンポーネント。
 * すべての管理画面ページで統一されたレイアウトを提供します。
 *
 * @param props.title - ページタイトル
 * @param props.description - ページの説明文
 * @param props.actions - ヘッダー右側に配置するアクションボタンなど（省略可能）
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="記事一覧"
 *   description="ブログ記事の管理・編集を行います"
 *   actions={<Button>新規作成</Button>}
 * />
 * ```
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
