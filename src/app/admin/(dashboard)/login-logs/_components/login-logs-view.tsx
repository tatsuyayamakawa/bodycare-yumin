"use client";

import { type LoginLogsViewProps, formatDate, maskIpAddress } from "../_lib";
import { ActionBadge } from "@/app/admin/(dashboard)/_components/status-badge";
import { LogFilters } from "./log-filters";

import { PaginationWrapper as Pagination } from "@/components/ui/pagination-wrapper";

/**
 * ログイン履歴ビュー
 *
 * @description
 * ログイン履歴の一覧表示とページネーション機能を提供します。
 *
 * @param props.initialData - ログデータとページネーション情報
 * @param props.initialFilters - 初期フィルター設定
 */
export function LoginLogsView({
  initialData,
  initialFilters,
}: LoginLogsViewProps) {
  return (
    <div className="space-y-6">
      {/* ログ一覧 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              ログイン履歴 ({initialData.pagination.total}件)
            </h3>
            <LogFilters currentAction={initialFilters.action} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  ユーザー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  IPアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  環境情報
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialData.logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">
                      条件に一致するログイン履歴は見つかりません。
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
                        <ActionBadge action={log.action} />
                      </td>
                      <td
                        className={`px-6 py-4 text-sm text-gray-500 ${isLast ? "group-hover:rounded-br-lg" : ""}`}
                      >
                        {log.details && typeof log.details === "object" ? (
                          <div>
                            {"browser" in log.details &&
                              "os" in log.details && (
                                <div className="text-xs">
                                  {String(log.details.browser)} /{" "}
                                  {String(log.details.os)}
                                </div>
                              )}
                            {"device" in log.details && (
                              <div className="text-xs text-gray-400">
                                {String(log.details.device)}
                              </div>
                            )}
                            {log.action === "login_failed" &&
                              "reason" in log.details && (
                                <div className="mt-1 text-xs text-red-600">
                                  失敗理由: {String(log.details.reason)}
                                </div>
                              )}
                          </div>
                        ) : (
                          "-"
                        )}
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
          basePath="/admin/login-logs"
        />
      </div>
    </div>
  );
}
