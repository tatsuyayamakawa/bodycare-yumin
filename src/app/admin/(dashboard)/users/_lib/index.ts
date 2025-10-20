import { AdminInvitation, AdminUser } from "@/lib/auth/database";

// ==================== Types ====================

export interface UserManagementViewProps {
  users: AdminUser[];
  invitations: AdminInvitation[];
  currentUser: AdminUser;
}

export interface InvitationStatus {
  isExpired: boolean;
  isUsed: boolean;
}

// ==================== Constants ====================

/**
 * 権限のフィルター選択肢
 */
export const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "admin", label: "管理者" },
  { value: "editor", label: "編集者" },
] as const;

/**
 * ユーザーステータスのフィルター選択肢
 */
export const USER_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "active", label: "アクティブ" },
  { value: "inactive", label: "無効" },
] as const;

/**
 * 招待ステータスのフィルター選択肢
 */
export const INVITATION_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "pending", label: "未使用" },
  { value: "expired", label: "期限切れ" },
] as const;

// ==================== Utils ====================

/**
 * 日付を日本語形式でフォーマット
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ロールのラベルを取得
 */
export function getRoleLabel(role: string): string {
  return role === "admin" ? "管理者" : "編集者";
}

/**
 * ロールバッジの色を取得
 */
export function getRoleBadgeColor(role: string): string {
  return role === "admin"
    ? "bg-red-100 text-red-800"
    : "bg-blue-100 text-blue-800";
}

/**
 * 招待のステータスを取得
 */
export function getInvitationStatus(
  invitation: AdminInvitation,
): InvitationStatus {
  return {
    isExpired: new Date(invitation.expires_at) < new Date(),
    isUsed: !!invitation.used_at,
  };
}
