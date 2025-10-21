"use server";

import { cookies } from "next/headers";

import { findSessionByToken } from "@/lib/auth/database";
import { supabaseAdmin } from "@/lib/supabase/server";

type AuditLogDetailsValue = string | number | boolean | null | undefined;

export interface AuditLogWithUser {
  id: string;
  admin_user_id: string;
  admin_name?: string;
  admin_email?: string;
  action: string;
  target_type: string;
  target_id?: string;
  target_name?: string;
  target_email?: string;
  details?: Record<string, AuditLogDetailsValue>;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  created_at: string;
}

interface RawAuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  details?: Record<string, AuditLogDetailsValue>;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  created_at: string;
  admin_users?: {
    name: string;
    email: string;
  };
}

/**
 * 監査ログ一覧を取得
 */
export async function getAuditLogs(
  page = 1,
  limit = 50,
  filters?: {
    action?: string;
    target_type?: string;
    admin_user_id?: string;
    success?: boolean;
    date_from?: string;
    date_to?: string;
  },
) {
  try {
    // 現在のユーザーを取得して権限チェック
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin-session")?.value;

    if (!sessionToken) {
      return {
        success: false,
        error: "認証が必要です",
      };
    }

    const currentUser = await findSessionByToken(sessionToken);
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        error: "管理者権限が必要です",
      };
    }

    // クエリを構築
    let query = supabaseAdmin
      .from("admin_audit_logs")
      .select(
        `
        *,
        admin_users!admin_audit_logs_admin_user_id_fkey (
          name,
          email
        )
      `,
      )
      .order("created_at", { ascending: false });

    // フィルターを適用
    if (filters?.action) {
      query = query.eq("action", filters.action);
    }
    if (filters?.target_type) {
      query = query.eq("target_type", filters.target_type);
    }
    if (filters?.admin_user_id) {
      query = query.eq("admin_user_id", filters.admin_user_id);
    }
    if (filters?.success !== undefined) {
      query = query.eq("success", filters.success);
    }
    if (filters?.date_from) {
      query = query.gte("created_at", filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte("created_at", filters.date_to);
    }

    // ページネーション
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch audit logs:", error);
      return {
        success: false,
        error: "監査ログの取得に失敗しました",
      };
    }

    // データを整形
    const logs: AuditLogWithUser[] = await Promise.all(
      (data || []).map(async (log: RawAuditLog) => {
        let target_name = log.details?.target_name || log.details?.user_name;
        let target_email =
          log.details?.target_email ||
          log.details?.user_email ||
          log.details?.invitation_email;

        // target_idがある場合、対象情報を取得
        if (log.target_id) {
          try {
            if (log.target_type === "user") {
              const { data: targetUser } = await supabaseAdmin
                .from("admin_users")
                .select("name, email")
                .eq("id", log.target_id)
                .single();

              if (targetUser) {
                target_name = targetUser.name;
                target_email = targetUser.email;
              }
            } else if (log.target_type === "invitation") {
              // 削除済み招待の場合、detailsの情報を優先使用
              if (!target_email) {
                const { data: targetInvitation } = await supabaseAdmin
                  .from("admin_invitations")
                  .select("email")
                  .eq("id", log.target_id)
                  .single();

                if (targetInvitation) {
                  target_name = targetInvitation.email;
                  target_email = targetInvitation.email;
                }
              }
            }
          } catch (error) {
            // 対象が見つからない場合はdetailsの情報を使用（削除済みの場合など）
            console.warn(`Target not found for log ${log.id}:`, error);
          }
        }

        return {
          id: log.id,
          admin_user_id: log.admin_user_id,
          admin_name: log.admin_users?.name,
          admin_email: log.admin_users?.email,
          action: log.action,
          target_type: log.target_type,
          target_id: log.target_id,
          target_name: target_name as string | undefined,
          target_email: target_email as string | undefined,
          details: log.details,
          ip_address: log.ip_address,
          user_agent: log.user_agent,
          success: log.success,
          error_message: log.error_message,
          created_at: log.created_at,
        };
      }),
    );

    // 総件数を取得（ページネーション用、フィルター適用）
    let countQuery = supabaseAdmin
      .from("admin_audit_logs")
      .select("*", { count: "exact", head: true });

    // 同じフィルターを適用
    if (filters?.action) {
      countQuery = countQuery.eq("action", filters.action);
    }
    if (filters?.target_type) {
      countQuery = countQuery.eq("target_type", filters.target_type);
    }
    if (filters?.admin_user_id) {
      countQuery = countQuery.eq("admin_user_id", filters.admin_user_id);
    }
    if (filters?.success !== undefined) {
      countQuery = countQuery.eq("success", filters.success);
    }
    if (filters?.date_from) {
      countQuery = countQuery.gte("created_at", filters.date_from);
    }
    if (filters?.date_to) {
      countQuery = countQuery.lte("created_at", filters.date_to);
    }

    const { count: totalCount } = await countQuery;

    return {
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit),
        },
      },
    };
  } catch (error) {
    console.error("Get audit logs error:", error);
    return {
      success: false,
      error: "監査ログの取得に失敗しました",
    };
  }
}

/**
 * 監査ログの統計情報を取得
 */
export async function getAuditLogStats(days = 30) {
  try {
    // 現在のユーザーを取得して権限チェック
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin-session")?.value;

    if (!sessionToken) {
      return {
        success: false,
        error: "認証が必要です",
      };
    }

    const currentUser = await findSessionByToken(sessionToken);
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        error: "管理者権限が必要です",
      };
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const { data, error } = await supabaseAdmin
      .from("admin_audit_stats")
      .select("*")
      .gte("last_action_at", dateFrom.toISOString());

    if (error) {
      console.error("Failed to fetch audit stats:", error);
      return {
        success: false,
        error: "統計情報の取得に失敗しました",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Get audit stats error:", error);
    return {
      success: false,
      error: "統計情報の取得に失敗しました",
    };
  }
}
