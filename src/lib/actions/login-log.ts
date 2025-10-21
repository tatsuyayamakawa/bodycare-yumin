"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

// ========================================
// 型定義
// ========================================

export interface LoginLog {
  id: string;
  admin_user_id: string;
  action: "login" | "logout" | "login_failed";
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface LoginLogWithUser extends LoginLog {
  admin_name: string | null;
  admin_email: string | null;
}

interface RawLoginLog {
  id: string;
  admin_user_id: string;
  action: "login" | "logout" | "login_failed";
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  admin_users?: {
    name: string;
    email: string;
  };
}

interface LoginLogFilters {
  action?: string;
  admin_user_id?: string;
  date_from?: string;
  date_to?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ========================================
// ユーティリティ関数
// ========================================

type SupabaseQuery = ReturnType<typeof supabaseAdmin.from<"admin_login_logs">>;

/**
 * SQLクエリにフィルターを適用
 */
function applyFilters(
  query: SupabaseQuery,
  filters: LoginLogFilters,
): SupabaseQuery {
  let filteredQuery = query;

  if (filters.action && filters.action !== "all") {
    filteredQuery = filteredQuery.eq("action", filters.action);
  }

  if (filters.admin_user_id && filters.admin_user_id !== "all") {
    filteredQuery = filteredQuery.eq("admin_user_id", filters.admin_user_id);
  }

  if (filters.date_from) {
    filteredQuery = filteredQuery.gte("created_at", filters.date_from);
  }

  if (filters.date_to) {
    filteredQuery = filteredQuery.lte("created_at", filters.date_to);
  }

  return filteredQuery;
}

// ========================================
// メイン関数
// ========================================

/**
 * ログイン履歴を取得
 */
export async function getLoginLogs(
  page: number = 1,
  limit: number = 50,
  filters: LoginLogFilters = {},
): Promise<
  | { success: true; data: { logs: LoginLogWithUser[]; pagination: Pagination } }
  | { success: false; error: string }
> {
  try {
    // ページネーション計算
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // ログ総数を取得（フィルター適用）
    let countQuery = supabaseAdmin
      .from("login_logs")
      .select("*", { count: "exact", head: true });

    countQuery = applyFilters(countQuery, filters);

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting login logs:", countError);
      return {
        success: false,
        error: "ログイン履歴の件数取得に失敗しました",
      };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // ログを取得（admin_usersとJOIN）
    let logsQuery = supabaseAdmin
      .from("login_logs")
      .select(
        `
        *,
        admin_users!inner (
          name,
          email
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    logsQuery = applyFilters(logsQuery, filters);

    const { data: logs, error: logsError } = await logsQuery;

    if (logsError) {
      console.error("Error fetching login logs:", logsError);
      return {
        success: false,
        error: "ログイン履歴の取得に失敗しました",
      };
    }

    // データを整形
    const logsWithUser: LoginLogWithUser[] = (logs || []).map((log: RawLoginLog) => ({
      id: log.id,
      admin_user_id: log.admin_user_id,
      action: log.action,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      details: log.details,
      created_at: log.created_at,
      admin_name: log.admin_users?.name || null,
      admin_email: log.admin_users?.email || null,
    }));

    return {
      success: true,
      data: {
        logs: logsWithUser,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getLoginLogs:", error);
    return {
      success: false,
      error: "ログイン履歴の取得中にエラーが発生しました",
    };
  }
}
