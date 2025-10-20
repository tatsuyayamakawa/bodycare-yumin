"use client";

import { User } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { USER_STATUS_FILTER_OPTIONS, formatDate } from "../_lib";
import { RoleBadge, UserStatusBadge } from "./badge-components";
import { TableFilters } from "./table-filters";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminUser } from "@/lib/auth/database";
import { useCsrfToken } from "@/lib/hooks/use-csrf";

interface UsersTableProps {
  users: AdminUser[];
  currentUser: AdminUser;
  roleFilter: string;
  statusFilter: string;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

/**
 * 登録済みユーザーテーブル
 *
 * @description
 * 登録済みユーザーの一覧を表示し、管理するコンポーネント。
 * - ユーザーの有効化/無効化
 * - 権限・ステータスによるフィルタリング
 * - 現在のユーザーは操作不可
 *
 * @param props.users - ユーザーの配列
 * @param props.currentUser - 現在ログイン中のユーザー
 * @param props.roleFilter - 権限フィルター値
 * @param props.statusFilter - ステータスフィルター値
 * @param props.onRoleFilterChange - 権限フィルター変更ハンドラー
 * @param props.onStatusFilterChange - ステータスフィルター変更ハンドラー
 */
export function UsersTable({
  users,
  currentUser,
  roleFilter,
  statusFilter,
  onRoleFilterChange,
  onStatusFilterChange,
}: UsersTableProps) {
  const csrfToken = useCsrfToken();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      if (statusFilter === "all") return true;
      if (statusFilter === "active") return user.is_active;
      if (statusFilter === "inactive") return !user.is_active;

      return true;
    });
  }, [users, roleFilter, statusFilter]);

  /**
   * ユーザーのアクティブ状態を切り替え
   */
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "無効" : "有効";
    if (!confirm(`このユーザーを${action}にしてもよろしいですか？`)) {
      return;
    }

    if (!csrfToken) {
      toast.error("CSRF トークンが取得できませんでした");
      return;
    }

    try {
      const response = await fetch("/api/admin/toggle-user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          userId,
          isActive: !currentStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("ユーザーステータスの変更に失敗しました");
    }
  };

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-labelledby="users-table-heading"
    >
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2
            id="users-table-heading"
            className="flex items-center text-lg font-medium text-gray-900"
          >
            <User className="mr-2 h-5 w-5" />
            登録済みユーザー ({filteredUsers.length})
          </h2>
          <TableFilters
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onRoleFilterChange={onRoleFilterChange}
            onStatusFilterChange={onStatusFilterChange}
            statusOptions={USER_STATUS_FILTER_OPTIONS}
          />
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
                権限
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                登録日
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500">
                    条件に一致するユーザーは見つかりません。
                  </p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => {
                const isLast = index === filteredUsers.length - 1;

                return (
                  <tr
                    key={user.id}
                    className={`group ${user.id === currentUser.id ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}`}
                  >
                    <td
                      className={`px-6 py-3 whitespace-nowrap ${isLast ? "group-hover:rounded-bl-lg" : ""}`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                        {user.id === currentUser.id && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            あなた
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-3 text-sm whitespace-nowrap text-gray-500">
                      {user.created_at ? formatDate(user.created_at) : "-"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <UserStatusBadge isActive={user.is_active} />
                    </td>
                    <td
                      className={`px-6 py-3 text-sm whitespace-nowrap text-gray-500 ${isLast ? "group-hover:rounded-br-lg" : ""}`}
                    >
                      <div className="flex justify-start">
                        {user.id !== currentUser.id && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={
                                  user.is_active ? "destructive" : "default"
                                }
                                size="sm"
                                onClick={() =>
                                  toggleUserStatus(user.id, user.is_active)
                                }
                                className={
                                  !user.is_active
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : ""
                                }
                              >
                                {user.is_active ? "無効化" : "有効化"}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {user.is_active
                                  ? "ユーザーを無効にする"
                                  : "ユーザーを有効にする"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
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
