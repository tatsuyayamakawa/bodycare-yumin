import { ErrorView } from "@/app/admin/(dashboard)/_components/error-view";
import { LoginLogsView } from "./login-logs-view";

import { getLoginLogs } from "@/lib/actions/login-log";

interface LoginLogFilters {
  action?: string;
  admin_user_id?: string;
  date_from?: string;
  date_to?: string;
}

interface LoginLogsContainerProps {
  page: number;
  filters: LoginLogFilters;
}

const LOGS_PER_PAGE = 50;

/**
 * ログイン履歴コンテナ
 *
 * @description
 * ログデータを取得し、適切なビューを表示するコンテナコンポーネント
 *
 * @param props.page - ページ番号
 * @param props.filters - フィルター条件
 */
export async function LoginLogsContainer({
  page,
  filters,
}: LoginLogsContainerProps) {
  const result = await getLoginLogs(page, LOGS_PER_PAGE, filters);

  if (!result.success) {
    return <ErrorView message={result.error} />;
  }

  if (!result.data) {
    return <ErrorView message="データの取得に失敗しました" />;
  }

  return <LoginLogsView initialData={result.data} initialFilters={filters} />;
}
