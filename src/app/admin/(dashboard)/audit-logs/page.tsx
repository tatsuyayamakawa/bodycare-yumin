import { AuditLogsContainer } from "./_components/audit-logs-container";

import { requireAdminAuth } from "@/lib/actions/admin-auth";
import { PageHeader } from "@/app/admin/(dashboard)/_components/page-header";

interface SearchParams {
  page?: string;
  action?: string;
  target_type?: string;
  admin_user_id?: string;
  success?: string;
  date_from?: string;
  date_to?: string;
}

interface AuditLogsPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * 監査ログページ
 *
 * 管理者の操作履歴を表示・検索するページ。
 * 操作対象、操作内容、結果などでフィルタリング可能。
 */
export default async function AuditLogsPage({
  searchParams,
}: AuditLogsPageProps) {
  await requireAdminAuth();

  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      <PageHeader
        title="監査ログ"
        description="管理者の操作履歴を確認できます"
      />
      <AuditLogsContainer searchParams={resolvedSearchParams} />
    </div>
  );
}
