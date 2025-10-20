import { AuditLogFilters } from "../_lib";
import { AuditLogsView } from "./audit-logs-view";

import { ErrorView } from "@/app/admin/(dashboard)/_components/error-view";

import { getAuditLogs } from "@/lib/actions/audit-log";

const LOGS_PER_PAGE = 50;

/**
 * success パラメータを boolean に変換
 */
function parseSuccessParam(success?: string): boolean | undefined {
  if (success === "true") return true;
  if (success === "false") return false;
  return undefined;
}

/**
 * 検索パラメータからフィルターを構築
 */
function buildFilters(searchParams: {
  action?: string;
  target_type?: string;
  admin_user_id?: string;
  success?: string;
  date_from?: string;
  date_to?: string;
}): AuditLogFilters {
  return {
    action: searchParams.action,
    target_type: searchParams.target_type,
    admin_user_id: searchParams.admin_user_id,
    success: parseSuccessParam(searchParams.success),
    date_from: searchParams.date_from,
    date_to: searchParams.date_to,
  };
}

/**
 * 監査ログデータ取得コンテナコンポーネント
 *
 * サーバーサイドで監査ログデータを取得し、
 * ビューコンポーネントに渡す責務を持つ。
 */
export async function AuditLogsContainer({
  searchParams,
}: {
  searchParams: {
    page?: string;
    action?: string;
    target_type?: string;
    admin_user_id?: string;
    success?: string;
    date_from?: string;
    date_to?: string;
  };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const filters = buildFilters(searchParams);

  const result = await getAuditLogs(page, LOGS_PER_PAGE, filters);

  if (!result.success || !result.data) {
    return <ErrorView message={result.error} />;
  }

  return <AuditLogsView initialData={result.data} initialFilters={filters} />;
}
