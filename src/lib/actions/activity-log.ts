"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActivityLog, ActivityLogCreate } from "@/lib/types/activity-log";

/**
 * 活動ログを記録する
 */
export async function createActivityLog(
  logData: ActivityLogCreate,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin.from("activity_logs").insert({
      action_type: logData.action_type,
      description: logData.description,
      user_id: logData.user_id,
      user_name: logData.user_name,
      metadata: logData.metadata || {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to create activity log:", {
        error: error,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Activity log creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 最新の活動ログを取得する
 */
export async function getRecentActivityLogs(limit: number = 10): Promise<{
  success: boolean;
  data?: ActivityLog[];
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch activity logs:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Activity log fetch error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 特定のユーザーの活動ログを取得する
 */
export async function getUserActivityLogs(
  userId: string,
  limit: number = 20,
): Promise<{
  success: boolean;
  data?: ActivityLog[];
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch user activity logs:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("User activity log fetch error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
