"use client";

import { Mail } from "lucide-react";
import { useMemo } from "react";

import { INVITATION_STATUS_FILTER_OPTIONS, formatDate, getInvitationStatus } from "../_lib";
import { InvitationStatusBadge, RoleBadge } from "./badge-components";
import { CopyInvitationButton } from "./copy-invitation-button";
import { DeleteInvitationButton } from "./delete-invitation-button";
import { TableFilters } from "./table-filters";

import { AdminInvitation } from "@/lib/auth/database";

interface InvitationsTableProps {
  invitations: AdminInvitation[];
  roleFilter: string;
  statusFilter: string;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

/**
 * 送信済み招待テーブル
 *
 * @description
 * 管理者が送信した招待の一覧を表示し、管理するコンポーネント。
 * - 招待URLのコピー
 * - 招待の削除
 * - 権限・ステータスによるフィルタリング
 *
 * @param props.invitations - 招待の配列
 * @param props.roleFilter - 権限フィルター値
 * @param props.statusFilter - ステータスフィルター値
 * @param props.onRoleFilterChange - 権限フィルター変更ハンドラー
 * @param props.onStatusFilterChange - ステータスフィルター変更ハンドラー
 */
export function InvitationsTable({
  invitations,
  roleFilter,
  statusFilter,
  onRoleFilterChange,
  onStatusFilterChange,
}: InvitationsTableProps) {
  const filteredInvitations = useMemo(() => {
    return invitations.filter((invitation) => {
      const status = getInvitationStatus(invitation);

      if (roleFilter !== "all" && invitation.role !== roleFilter) {
        return false;
      }

      if (statusFilter === "all") return true;
      if (statusFilter === "used") return status.isUsed;
      if (statusFilter === "expired") return status.isExpired && !status.isUsed;
      if (statusFilter === "pending")
        return !status.isUsed && !status.isExpired;

      return true;
    });
  }, [invitations, roleFilter, statusFilter]);

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-labelledby="invitations-table-heading"
    >
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2
            id="invitations-table-heading"
            className="flex items-center text-lg font-medium text-gray-900"
          >
            <Mail className="mr-2 h-5 w-5" />
            送信済み招待 ({filteredInvitations.length})
          </h2>
          <TableFilters
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onRoleFilterChange={onRoleFilterChange}
            onStatusFilterChange={onStatusFilterChange}
            statusOptions={INVITATION_STATUS_FILTER_OPTIONS}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                招待先
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                権限
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                期限
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                ステータス
              </th>
              <th className="w-50 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvitations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500">
                    条件に一致する招待は見つかりません。
                  </p>
                </td>
              </tr>
            ) : (
              filteredInvitations.map((invitation, index) => {
                const status = getInvitationStatus(invitation);
                const isLast = index === filteredInvitations.length - 1;

                return (
                  <tr key={invitation.id} className="group hover:bg-gray-50">
                    <td
                      className={`px-6 py-3 whitespace-nowrap ${isLast ? "group-hover:rounded-bl-lg" : ""}`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {invitation.email}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <RoleBadge role={invitation.role} />
                    </td>
                    <td className="px-6 py-3 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(invitation.expires_at)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <InvitationStatusBadge status={status} />
                    </td>
                    <td
                      className={`px-6 py-3 text-sm whitespace-nowrap text-gray-500 ${isLast ? "group-hover:rounded-br-lg" : ""}`}
                    >
                      <div className="flex justify-start">
                        <div className="flex items-center space-x-2">
                          {!status.isUsed && !status.isExpired && (
                            <CopyInvitationButton token={invitation.token} />
                          )}
                          <DeleteInvitationButton
                            invitationId={invitation.id}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
