import { InviteUserButton } from "./_components/invite-user-button";
import { UserManagementView } from "./_components/user-management-view";

import { requireAdminAuth } from "@/lib/actions/admin-auth";
import { getAllInvitations, getAllUsers } from "@/lib/auth/database";
import { PageHeader } from "@/app/admin/(dashboard)/_components/page-header";

/**
 * ユーザー管理ページ
 *
 * @description
 * 管理者とユーザーのアカウント管理を提供します。
 * - 登録済みユーザーの一覧表示・管理
 * - 招待の送信・管理
 * - ユーザーの有効化/無効化
 * - 権限とステータスのフィルタリング
 *
 * @returns ユーザー管理ページのJSX要素
 */
export default async function UsersPage() {
  const currentUser = await requireAdminAuth();

  const [users, invitations] = await Promise.all([
    getAllUsers(),
    getAllInvitations(),
  ]);

  return (
    <main className="space-y-6">
      <PageHeader
        title="ユーザー管理"
        description="アカウントの管理と新規招待を行います"
        actions={<InviteUserButton />}
      />
      <UserManagementView
        users={users}
        invitations={invitations}
        currentUser={currentUser}
      />
    </main>
  );
}
