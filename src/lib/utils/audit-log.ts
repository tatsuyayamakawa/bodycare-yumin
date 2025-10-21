import { supabaseAdmin } from "@/lib/supabase/server";

export interface AuditLogEntry {
  admin_user_id: string;
  action: string;
  target_type: "user" | "invitation" | "blog_post" | "settings" | "session";
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export async function logAdminAction(entry: AuditLogEntry) {
  try {
    const { error } = await supabaseAdmin
      .from("admin_audit_logs")
      .insert({
        admin_user_id: entry.admin_user_id,
        action: entry.action,
        target_type: entry.target_type,
        target_id: entry.target_id || null,
        details: entry.details || null,
        ip_address: entry.ip_address || null,
        user_agent: entry.user_agent || null,
        success: true,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Failed to log admin action:", error);
    }
  } catch (error) {
    console.error("Audit log error:", error);
  }
}

export async function logAdminActionFailure(
  entry: Omit<AuditLogEntry, 'success'>,
  errorMessage: string
) {
  try {
    const { error } = await supabaseAdmin
      .from("admin_audit_logs")
      .insert({
        admin_user_id: entry.admin_user_id,
        action: entry.action,
        target_type: entry.target_type,
        target_id: entry.target_id || null,
        details: entry.details || null,
        ip_address: entry.ip_address || null,
        user_agent: entry.user_agent || null,
        success: false,
        error_message: errorMessage,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Failed to log admin action failure:", error);
    }
  } catch (error) {
    console.error("Audit log error:", error);
  }
}

// 使用例: await logAdminAction({
//   admin_user_id: currentUser.id,
//   action: "toggle_user_status",
//   target_type: "user", 
//   target_id: userId,
//   details: { previous_status: currentStatus, new_status: !currentStatus },
//   ip_address: request.ip,
//   user_agent: request.headers.get("user-agent")
// });