"use client";

import { useRouter } from "next/navigation";

import {
  type AuditLogsViewProps,
  formatDate,
  getActionLabel,
  getTargetTypeIcon,
  getTargetTypeLabel,
  maskIpAddress,
} from "../_lib";

import { ResultBadge } from "@/app/admin/(dashboard)/_components/status-badge";

import { PaginationWrapper as Pagination } from "@/components/ui/pagination-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 監査ログビューコンポーネント
 *
 * 監査ログの一覧表示とフィルタリング機能を提供。
 * ページネーション機能を含む。
 */
export function AuditLogsView({
  initialData,
  initialFilters,
}: AuditLogsViewProps) {
  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // ページをリセット
    params.delete("page");

    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* ログ一覧 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              監査ログ ({initialData.pagination.total}件)
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  操作対象:
                </span>
                <Select
                  value={initialFilters.target_type || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("target_type", value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="user">ユーザー</SelectItem>
                    <SelectItem value="invitation">招待</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  操作内容:
                </span>
                <Select
                  value={initialFilters.action || "all"}
                  onValueChange={(value) => handleFilterChange("action", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="toggle_user_status">
                      ユーザー状態変更
                    </SelectItem>
                    <SelectItem value="delete_invitation">招待削除</SelectItem>
                    <SelectItem value="create_invitation">招待作成</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">結果:</span>
                <Select
                  value={
                    initialFilters.success !== undefined
                      ? initialFilters.success.toString()
                      : "all"
                  }
                  onValueChange={(value) =>
                    handleFilterChange("success", value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="true">成功</SelectItem>
                    <SelectItem value="false">失敗</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  管理者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  IPアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作対象
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  対象者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  結果
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialData.logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">
                      条件に一致する監査ログは見つかりません。
                    </p>
                  </td>
                </tr>
              ) : (
                initialData.logs.map((log, index) => {
                  const isLast = index === initialData.logs.length - 1;

                  return (
                    <tr key={log.id} className="group hover:bg-gray-50">
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${isLast ? "group-hover:rounded-bl-lg" : ""}`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {log.admin_name || "不明"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.admin_email}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {maskIpAddress(log.ip_address)}
                      </td>

                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {formatDate(log.created_at)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {getTargetTypeIcon(log.target_type)}
                          <span className="ml-2">
                            {getTargetTypeLabel(log.target_type)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.target_name || log.target_email ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {log.target_name || "不明"}
                            </div>
                            {log.target_email && (
                              <div className="text-sm text-gray-500">
                                {log.target_email}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {getActionLabel(log.action)}
                      </td>

                      <td
                        className={`px-6 py-4 whitespace-nowrap ${isLast ? "group-hover:rounded-br-lg" : ""}`}
                      >
                        <ResultBadge success={log.success} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={initialData.pagination.page}
          totalPages={initialData.pagination.totalPages}
          totalItems={initialData.pagination.total}
          pageSize={initialData.pagination.limit}
          hasNextPage={
            initialData.pagination.page < initialData.pagination.totalPages
          }
          hasPreviousPage={initialData.pagination.page > 1}
          basePath="/admin/audit-logs"
        />
      </div>
    </div>
  );
}
