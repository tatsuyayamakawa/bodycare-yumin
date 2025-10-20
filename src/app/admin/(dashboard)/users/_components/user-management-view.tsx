"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { type UserManagementViewProps } from "../_lib";
import { InvitationsTable } from "./invitations-table";
import { UsersTable } from "./users-table";

/**
 * URLパラメータを更新するヘルパー関数
 *
 * @param router - Next.js router インスタンス
 * @param paramName - 更新するパラメータ名
 * @param value - 設定する値（"all"の場合はパラメータを削除）
 */
function updateSearchParam(
  router: ReturnType<typeof useRouter>,
  paramName: string,
  value: string,
) {
  const params = new URLSearchParams(window.location.search);
  if (value === "all") {
    params.delete(paramName);
  } else {
    params.set(paramName, value);
  }
  router.push(`/admin/users?${params.toString()}`);
}

/**
 * ユーザー管理ビュー
 *
 * @description
 * 登録済みユーザーと送信済み招待を表示・管理するコンポーネント。
 * URLパラメータでフィルター状態を管理し、ページリロード後も状態を保持します。
 *
 * @param props.users - 登録済みユーザーの配列
 * @param props.invitations - 送信済み招待の配列
 * @param props.currentUser - 現在ログイン中のユーザー
 */
export function UserManagementView({
  users,
  invitations,
  currentUser,
}: UserManagementViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userRoleFilter = searchParams.get("userRole") || "all";
  const userStatusFilter = searchParams.get("userStatus") || "all";
  const invitationRoleFilter = searchParams.get("invitationRole") || "all";
  const invitationStatusFilter = searchParams.get("invitationStatus") || "all";

  const handleUserRoleFilterChange = useCallback(
    (value: string) => updateSearchParam(router, "userRole", value),
    [router],
  );

  const handleUserStatusFilterChange = useCallback(
    (value: string) => updateSearchParam(router, "userStatus", value),
    [router],
  );

  const handleInvitationRoleFilterChange = useCallback(
    (value: string) => updateSearchParam(router, "invitationRole", value),
    [router],
  );

  const handleInvitationStatusFilterChange = useCallback(
    (value: string) => updateSearchParam(router, "invitationStatus", value),
    [router],
  );

  return (
    <div className="space-y-8">
      {/* 既存ユーザー一覧 */}
      <UsersTable
        users={users}
        currentUser={currentUser}
        roleFilter={userRoleFilter}
        statusFilter={userStatusFilter}
        onRoleFilterChange={handleUserRoleFilterChange}
        onStatusFilterChange={handleUserStatusFilterChange}
      />

      {/* 未使用の招待一覧 */}
      <InvitationsTable
        invitations={invitations}
        roleFilter={invitationRoleFilter}
        statusFilter={invitationStatusFilter}
        onRoleFilterChange={handleInvitationRoleFilterChange}
        onStatusFilterChange={handleInvitationStatusFilterChange}
      />
    </div>
  );
}
