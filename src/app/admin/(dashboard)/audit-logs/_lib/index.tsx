import { AlertCircle, Shield, User } from "lucide-react";

import { AuditLogWithUser } from "@/lib/actions/audit-log";

// ==================== Types ====================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditLogFilters {
  action?: string;
  target_type?: string;
  admin_user_id?: string;
  success?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface AuditLogsViewProps {
  initialData: {
    logs: AuditLogWithUser[];
    pagination: Pagination;
  };
  initialFilters: AuditLogFilters;
}

// ==================== Constants ====================

export const ACTION_LABELS: Record<string, string> = {
  toggle_user_status: "ユーザー状態変更",
  delete_invitation: "招待削除",
  create_invitation: "招待作成",
};

export const TARGET_TYPE_LABELS: Record<string, string> = {
  user: "ユーザー",
  invitation: "招待",
};

// ==================== Utils ====================

/**
 * 日付を日本語形式でフォーマット
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * アクションのラベルを取得
 */
export function getActionLabel(action: string): string {
  return ACTION_LABELS[action] || action;
}

/**
 * 対象タイプのラベルを取得
 */
export function getTargetTypeLabel(targetType: string): string {
  return TARGET_TYPE_LABELS[targetType] || targetType;
}

/**
 * 対象タイプのアイコンを取得
 */
export function getTargetTypeIcon(targetType: string): React.ReactNode {
  switch (targetType) {
    case "user":
      return <User className="h-4 w-4" />;
    case "invitation":
      return <Shield className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

/**
 * IPアドレスをマスク
 */
export function maskIpAddress(ip: string | null | undefined): string {
  if (!ip) return "-";

  // IPv6の場合
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, -1).join(":") + ":***";
  }

  // IPv4の場合
  const parts = ip.split(".");
  if (parts.length === 4) {
    return parts.slice(0, 3).join(".") + ".***";
  }

  return ip;
}

/**
 * フィルターからURLパラメータを構築
 */
export function buildUrlParams(filters: AuditLogFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.action && filters.action !== "all") {
    params.set("action", filters.action);
  }
  if (filters.target_type && filters.target_type !== "all") {
    params.set("target_type", filters.target_type);
  }
  if (filters.admin_user_id && filters.admin_user_id !== "all") {
    params.set("admin_user_id", filters.admin_user_id);
  }
  if (filters.success !== undefined) {
    params.set("success", filters.success.toString());
  }
  if (filters.date_from) {
    params.set("date_from", filters.date_from);
  }
  if (filters.date_to) {
    params.set("date_to", filters.date_to);
  }

  return params;
}

/**
 * ページネーション表示範囲を計算
 */
export function calculatePaginationRange(pagination: Pagination): {
  start: number;
  end: number;
} {
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  return { start, end };
}
