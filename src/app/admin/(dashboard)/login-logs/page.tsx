import { LoginLogsContainer } from "./_components/login-logs-container";

import { requireAdminAuth } from "@/lib/actions/admin-auth";
import { PageHeader } from "@/app/admin/(dashboard)/_components/page-header";

interface SearchParams {
  page?: string;
  action?: string;
  admin_user_id?: string;
  date_from?: string;
  date_to?: string;
}

interface LoginLogsPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * ログイン履歴ページ
 *
 * @description
 * 管理者のログイン・ログアウト履歴を表示します。
 * - ログイン/ログアウト履歴の一覧表示
 * - アクションによるフィルタリング
 * - ページネーション（50件/ページ）
 * - 30日間のログを保持
 *
 * @param props.searchParams - URL検索パラメータ
 * @returns ログイン履歴ページのJSX要素
 *
 * @example
 * // URL: /admin/login-logs?page=2&action=login
 * // - 2ページ目のログイン履歴を表示
 */
export default async function LoginLogsPage({
  searchParams,
}: LoginLogsPageProps) {
  await requireAdminAuth();

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const filters = {
    action: resolvedSearchParams.action,
    admin_user_id: resolvedSearchParams.admin_user_id,
    date_from: resolvedSearchParams.date_from,
    date_to: resolvedSearchParams.date_to,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ログイン履歴"
        description="ログイン・ログアウトの履歴を確認できます（30日間保持）"
      />
      <LoginLogsContainer page={page} filters={filters} />
    </div>
  );
}
