import { supabaseAdmin } from "@/lib/supabase/server";

export interface BlogActivityEntry {
  admin_user_id: string;
  action: "create_draft" | "publish" | "unpublish" | "schedule" | "delete" | "update";
  article_id: string;
  article_title: string;
  details?: Record<string, any>;
}

export async function logBlogActivity(entry: BlogActivityEntry) {
  try {
    const { error } = await supabaseAdmin
      .from("blog_activity_logs")
      .insert({
        admin_user_id: entry.admin_user_id,
        action: entry.action,
        article_id: entry.article_id,
        article_title: entry.article_title,
        details: entry.details || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Failed to log blog activity:", error);
    }
  } catch (error) {
    console.error("Blog activity log error:", error);
  }
}

export async function getBlogActivities(limit = 5) {
  try {
    // TODO: blog_activity_logsテーブルが作成されるまで空のデータを返す
    console.log("Blog activities requested, but table not yet created");
    
    // テーブル作成前は空のデータを返す
    return { success: true, data: [] };
    
    // 以下はテーブル作成後に有効化
    /*
    const { data, error } = await supabaseAdmin
      .from("blog_activity_logs")
      .select(`
        *,
        admin_users!blog_activity_logs_admin_user_id_fkey (
          name,
          email
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch blog activities:", error);
      return { success: false, error: "活動ログの取得に失敗しました" };
    }

    return { success: true, data: data || [] };
    */
  } catch (error) {
    console.error("Get blog activities error:", error);
    return { success: false, error: "活動ログの取得に失敗しました" };
  }
}