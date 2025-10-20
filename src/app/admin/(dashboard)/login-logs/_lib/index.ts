import { LoginLogWithUser } from "@/lib/actions/login-log";

// ==================== Types ====================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginLogFilters {
  action?: string;
  admin_user_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface LoginLogsViewProps {
  initialData: {
    logs: LoginLogWithUser[];
    pagination: Pagination;
  };
  initialFilters: LoginLogFilters;
}

// ==================== Constants ====================

export const ACTION_LABELS: Record<string, string> = {
  login: "ログイン",
  logout: "ログアウト",
  login_failed: "ログイン失敗",
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
