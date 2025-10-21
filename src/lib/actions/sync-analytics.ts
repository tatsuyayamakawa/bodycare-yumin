"use server";

import googleAnalytics from "@/lib/analytics/google-analytics";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface AnalyticsSyncResult {
  success: boolean;
  data?: {
    syncedCount: number;
    articles: Array<{
      id: string;
      slug: string;
      title: string;
      totalViews: number;
      monthlyViews: number;
    }>;
  };
  error?: string;
}

/**
 * Google Analytics データをデータベースと同期（最適化版）
 */
export async function syncAnalyticsData(
  forceSync = false,
): Promise<AnalyticsSyncResult> {
  try {
    // 公開済み記事を取得（Analytics関連フィールドも含む）
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("id, slug, title, published_at, analytics_synced_at")
      .eq("status", "published")
      .not("published_at", "is", null);

    if (error) {
      console.error("Failed to fetch articles:", error);
      return { success: false, error: "記事の取得に失敗しました" };
    }

    if (!articles || articles.length === 0) {
      return {
        success: true,
        data: { syncedCount: 0, articles: [] },
      };
    }

    // 増分同期：最近同期されていない記事のみを対象とする
    let articlesToSync = articles;
    if (!forceSync) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      articlesToSync = articles.filter(
        (article) =>
          !article.analytics_synced_at ||
          article.analytics_synced_at < oneHourAgo,
      );
    }

    if (articlesToSync.length === 0) {
      console.log("No articles need syncing");
      return {
        success: true,
        data: { syncedCount: 0, articles: [] },
      };
    }

    console.log(
      `Syncing ${articlesToSync.length} of ${articles.length} articles`,
    );

    // 同期対象記事のslugを抽出
    const slugs = articlesToSync.map((article) => article.slug);

    // GA4から一括でデータを取得
    const [totalViewsData, monthlyViewsData] = await Promise.all([
      googleAnalytics.getBulkPageViews(slugs, "2020-01-01", "today"), // 全期間
      googleAnalytics.getBulkPageViews(slugs, "30daysAgo", "today"), // 過去30日
    ]);

    const syncResults: Array<{
      id: string;
      slug: string;
      title: string;
      totalViews: number;
      monthlyViews: number;
    }> = [];
    const now = new Date().toISOString();

    // バッチ更新のためのデータを準備
    const updates = articlesToSync.map((article) => {
      const totalViews = totalViewsData[article.slug] || 0;
      const monthlyViews = monthlyViewsData[article.slug] || 0;

      return {
        id: article.id,
        ga_view_count: totalViews,
        ga_monthly_views: monthlyViews,
        analytics_synced_at: now,
      };
    });

    // バッチ更新実行（upsert使用）
    const { data: updatedArticles, error: batchError } = await supabaseAdmin
      .from("articles")
      .upsert(updates, {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select("id, slug, title, ga_view_count, ga_monthly_views");

    if (batchError) {
      console.error("Batch update failed:", batchError);
      return { success: false, error: "バッチ更新に失敗しました" };
    }

    // 結果をフォーマット
    if (updatedArticles) {
      updatedArticles.forEach((article) => {
        syncResults.push({
          id: article.id,
          slug: article.slug,
          title: article.title,
          totalViews: article.ga_view_count || 0,
          monthlyViews: article.ga_monthly_views || 0,
        });
      });
    }

    return {
      success: true,
      data: {
        syncedCount: syncResults.length,
        articles: syncResults,
      },
    };
  } catch (error) {
    console.error("Analytics sync error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  }
}

/**
 * 特定の記事のアナリティクスデータを同期
 */
export async function syncSingleArticleAnalytics(articleId: string): Promise<{
  success: boolean;
  data?: {
    slug: string;
    totalViews: number;
    monthlyViews: number;
  };
  error?: string;
}> {
  try {
    // 記事を取得
    const { data: article, error } = await supabaseAdmin
      .from("articles")
      .select("id, slug, title")
      .eq("id", articleId)
      .eq("status", "published")
      .single();

    if (error || !article) {
      return { success: false, error: "記事が見つかりません" };
    }

    // GA4からデータを取得
    const [totalViews, monthlyViews] = await Promise.all([
      googleAnalytics.getPageViews(
        `/blog/${article.slug}`,
        "2020-01-01",
        "today",
      ),
      googleAnalytics.getPageViews(
        `/blog/${article.slug}`,
        "30daysAgo",
        "today",
      ),
    ]);

    // データベースを更新
    const { error: updateError } = await supabaseAdmin
      .from("articles")
      .update({
        ga_view_count: totalViews,
        ga_monthly_views: monthlyViews,
        analytics_synced_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      console.error("Failed to update analytics data:", updateError);
      return { success: false, error: "データの更新に失敗しました" };
    }

    return {
      success: true,
      data: {
        slug: article.slug,
        totalViews,
        monthlyViews,
      },
    };
  } catch (error) {
    console.error("Single article analytics sync error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  }
}

/**
 * Analytics同期の統計情報を取得
 */
export async function getAnalyticsSyncStatus(): Promise<{
  success: boolean;
  data?: {
    totalArticles: number;
    syncedArticles: number;
    lastSyncTime: string | null;
    oldestSyncTime: string | null;
  };
  error?: string;
}> {
  try {
    // 総記事数
    const { count: totalArticles, error: countError } = await supabaseAdmin
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    if (countError) {
      return { success: false, error: "記事数の取得に失敗しました" };
    }

    // 同期済み記事数と同期時刻の統計
    const { data: syncStats, error: syncError } = await supabaseAdmin
      .from("articles")
      .select("analytics_synced_at")
      .eq("status", "published")
      .not("analytics_synced_at", "is", null)
      .order("analytics_synced_at", { ascending: false });

    if (syncError) {
      return { success: false, error: "同期データの取得に失敗しました" };
    }

    const syncedArticles = syncStats?.length || 0;
    const lastSyncTime = syncStats?.[0]?.analytics_synced_at || null;
    const oldestSyncTime =
      syncStats?.[syncedArticles - 1]?.analytics_synced_at || null;

    return {
      success: true,
      data: {
        totalArticles: totalArticles || 0,
        syncedArticles,
        lastSyncTime,
        oldestSyncTime,
      },
    };
  } catch (error) {
    console.error("Analytics sync status error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  }
}
