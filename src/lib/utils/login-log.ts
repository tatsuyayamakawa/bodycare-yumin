import { supabaseAdmin } from "@/lib/supabase/server";
import { parseUserAgent } from "./user-agent-parser";

// ========================================
// 型定義
// ========================================

type LoginAction = "login" | "logout" | "login_failed";

interface LoginLogEntry {
  admin_user_id: string;
  action: LoginAction;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, unknown>;
}

// ========================================
// ヘルパー関数
// ========================================

/**
 * ログインログを記録
 */
export async function logLoginAction(entry: LoginLogEntry): Promise<void> {
  try {
    // User-Agentをパースして環境情報を追加
    const parsedUA = parseUserAgent(entry.user_agent);
    const details = {
      ...entry.details,
      browser: parsedUA.browser,
      os: parsedUA.os,
      device: parsedUA.device,
    };

    const { error } = await supabaseAdmin.from("login_logs").insert({
      admin_user_id: entry.admin_user_id,
      action: entry.action,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      details,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to log login action:", error);
    }
  } catch (error) {
    console.error("Error logging login action:", error);
  }
}

/**
 * ログイン成功を記録
 */
export async function logLoginSuccess(
  userId: string,
  ipAddress?: string,
  userAgent?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  await logLoginAction({
    admin_user_id: userId,
    action: "login",
    ip_address: ipAddress,
    user_agent: userAgent,
    details,
  });
}

/**
 * ログアウトを記録
 */
export async function logLogout(
  userId: string,
  ipAddress?: string,
  userAgent?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  await logLoginAction({
    admin_user_id: userId,
    action: "logout",
    ip_address: ipAddress,
    user_agent: userAgent,
    details,
  });
}

/**
 * ログイン失敗を記録
 */
export async function logLoginFailure(
  email: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<void> {
  // ログイン失敗の場合、user_idが不明なので"unknown"を使用
  await logLoginAction({
    admin_user_id: "unknown",
    action: "login_failed",
    ip_address: ipAddress,
    user_agent: userAgent,
    details: {
      email,
      reason,
    },
  });
}
