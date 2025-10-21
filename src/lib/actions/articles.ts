"use server";

import { revalidatePath } from "next/cache";

import { createActivityLog } from "./activity-log";

import { getServerUser } from "@/lib/auth/server-utils";
import { supabaseAdmin } from "@/lib/supabase/server";
import type {
  Article,
  CreateArticleData,
  UpdateArticleData,
} from "@/lib/supabase/types";
import type { ActivityType } from "@/lib/types/activity-log";
import { generateDefaultMetaDescription } from "@/lib/utils/metadata";

// ========================================
// 定数
// ========================================

const DEFAULT_EYECATCH_IMAGE = "/eyecatch_default.png";

// ========================================
// ヘルパー関数
// ========================================

/**
 * エラーレスポンスを返す
 */
function errorResponse(message: string) {
  return { error: message };
}

/**
 * 記事のステータスに基づいて活動ログのタイプと説明を決定
 */
function determineActivityLog(
  article: Article,
  isNewArticle: boolean,
  originalStatus?: string,
): { actionType: ActivityType; description: string } {
  const title = article.title;
  const status = article.status;

  if (isNewArticle) {
    switch (status) {
      case "published":
        return {
          actionType: "article_published",
          description: `記事「${title}」を公開しました`,
        };
      case "scheduled":
        return {
          actionType: "scheduled_post_published",
          description: `記事「${title}」を予約投稿として設定しました`,
        };
      case "draft":
        return {
          actionType: "draft_saved",
          description: `記事「${title}」の下書きを保存しました`,
        };
      case "private":
        return {
          actionType: "article_unpublished",
          description: `記事「${title}」を非公開として作成しました`,
        };
      default:
        return {
          actionType: "article_published",
          description: `記事「${title}」を公開しました`,
        };
    }
  }

  // 更新時のステータス変更
  if (status === "published" && originalStatus !== "published") {
    return {
      actionType: "article_published",
      description: `記事「${title}」を公開しました`,
    };
  }
  if (status !== "published" && originalStatus === "published") {
    return {
      actionType: "article_unpublished",
      description: `記事「${title}」を非公開にしました`,
    };
  }

  switch (status) {
    case "draft":
      return {
        actionType: "draft_saved",
        description: `記事「${title}」の下書きを保存しました`,
      };
    case "scheduled":
      return {
        actionType: "scheduled_post_published",
        description: `記事「${title}」を予約投稿として設定しました`,
      };
    case "private":
      return {
        actionType: "article_unpublished",
        description: `記事「${title}」を非公開として保存しました`,
      };
    default:
      return {
        actionType: "article_updated",
        description: `記事「${title}」を更新しました`,
      };
  }
}

/**
 * 記事の活動ログを記録
 */
async function logArticleActivity(
  article: Article,
  isNewArticle: boolean,
  originalStatus?: string,
) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) return;

    const { actionType, description } = determineActivityLog(
      article,
      isNewArticle,
      originalStatus,
    );

    await createActivityLog({
      action_type: actionType,
      description,
      user_id: currentUser.id,
      user_name: currentUser.name,
      metadata: {
        article_id: article.id,
        article_title: article.title,
        article_slug: article.slug,
        status: article.status,
      },
    });
  } catch (logError) {
    console.error("Activity log error:", logError);
    // ログエラーは処理を止めない
  }
}

// ========================================
// 記事操作（CRUD）
// ========================================

/**
 * 記事を作成する
 */
export async function createArticle(data: CreateArticleData) {
  try {
    // スラッグの重複チェック
    const { data: existingArticle } = await supabaseAdmin
      .from("articles")
      .select("id")
      .eq("slug", data.slug)
      .single();

    if (existingArticle) {
      return errorResponse("スラッグが既に使用されています");
    }

    // メタディスクリプションが空の場合はデフォルト生成
    const metaDescription = data.meta_description?.trim()
      ? data.meta_description
      : generateDefaultMetaDescription(data.title);

    // 記事データの準備
    const articleData = {
      ...data,
      meta_description: metaDescription,
      published_at:
        data.status === "published" ? new Date().toISOString() : null,
      eyecatch_default: !data.featured_image_url
        ? DEFAULT_EYECATCH_IMAGE
        : data.eyecatch_default,
    };

    // 記事を挿入
    const { data: article, error } = await supabaseAdmin
      .from("articles")
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error("記事作成エラー:", error);
      return errorResponse("記事の作成に失敗しました");
    }

    // 活動ログを記録
    await logArticleActivity(article, true);

    revalidatePath("/admin/articles");
    return { data: article };
  } catch (error) {
    console.error("記事作成エラー:", error);
    return errorResponse("記事の作成に失敗しました");
  }
}

/**
 * 記事を更新する
 */
export async function updateArticle(data: UpdateArticleData) {
  try {
    const { id, ...updateData } = data;

    // 既存記事の現在のステータスを取得（ログ用）
    const { data: currentArticle } = await supabaseAdmin
      .from("articles")
      .select("published_at, status")
      .eq("id", id)
      .single();

    // メタディスクリプションが未設定の場合のみデフォルト生成
    if (data.title && data.meta_description === undefined) {
      updateData.meta_description = generateDefaultMetaDescription(data.title);
    }

    // アイキャッチが設定されていない場合はデフォルト画像を設定
    if (!data.featured_image_url && !data.eyecatch_default) {
      updateData.eyecatch_default = DEFAULT_EYECATCH_IMAGE;
    }

    // 公開日時の設定
    if (data.status === "published" && !data.published_at) {
      if (currentArticle && currentArticle.status !== "published") {
        updateData.published_at = new Date().toISOString();
      }
    } else if (data.status !== "published") {
      updateData.published_at = undefined;
    }

    // スケジュール公開以外の場合は scheduled_at をクリア
    if (data.status !== "scheduled") {
      updateData.scheduled_at = undefined;
    }

    // 記事を更新
    const { data: article, error } = await supabaseAdmin
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("記事更新エラー:", error);
      return errorResponse("記事の更新に失敗しました");
    }

    // 活動ログを記録
    await logArticleActivity(article, false, currentArticle?.status);

    revalidatePath("/admin/articles");
    revalidatePath(`/blog/${article.slug}`);
    return { data: article };
  } catch (error) {
    console.error("記事更新エラー:", error);
    return errorResponse("記事の更新に失敗しました");
  }
}

/**
 * 記事を削除する（管理者のみ）
 */
export async function deleteArticle(id: string) {
  try {
    // 権限チェック
    const currentUser = await getServerUser();
    if (!currentUser) {
      return errorResponse("認証が必要です");
    }
    if (currentUser.role !== "admin") {
      return errorResponse("記事の削除には管理者権限が必要です");
    }

    // 削除前に記事情報を取得（ログ用）
    const { data: article } = await supabaseAdmin
      .from("articles")
      .select("title")
      .eq("id", id)
      .single();

    // 記事を削除
    const { error } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("記事削除エラー:", error);
      return errorResponse("記事の削除に失敗しました");
    }

    // 削除ログを記録
    if (article) {
      try {
        await createActivityLog({
          action_type: "article_deleted",
          description: `記事「${article.title}」を削除しました`,
          user_id: currentUser.id,
          user_name: currentUser.name,
          metadata: {
            article_id: id,
            article_title: article.title,
          },
        });
      } catch (logError) {
        console.error("Activity log error:", logError);
      }
    }

    revalidatePath("/admin/articles");
    return { success: true };
  } catch (error) {
    console.error("記事削除エラー:", error);
    return errorResponse("記事の削除に失敗しました");
  }
}

// ========================================
// 記事取得
// ========================================

/**
 * 記事一覧を取得（ページネーション対応）
 */
export async function getArticles(
  status?: string,
  page: number = 1,
  pageSize: number = 20,
) {
  try {
    let query = supabaseAdmin
      .from("articles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    // ページネーション
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error("記事取得エラー:", error);
      return errorResponse("記事の取得に失敗しました");
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return {
      data: articles,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: count || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("記事取得エラー:", error);
    return errorResponse("記事の取得に失敗しました");
  }
}

/**
 * 公開済み記事を取得
 */
export async function getPublishedArticles() {
  try {
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (error) {
      console.error("公開記事取得エラー:", error);
      return errorResponse("記事の取得に失敗しました");
    }

    return { data: articles };
  } catch (error) {
    console.error("公開記事取得エラー:", error);
    return errorResponse("記事の取得に失敗しました");
  }
}

/**
 * スラッグで記事を取得
 */
export async function getArticleBySlug(slug: string) {
  try {
    const { data: article, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("記事取得エラー:", error);
      return errorResponse("記事が見つかりませんでした");
    }

    return { data: article };
  } catch (error) {
    console.error("記事取得エラー:", error);
    return errorResponse("記事の取得に失敗しました");
  }
}

/**
 * 予約投稿を公開する
 */
export async function publishScheduledArticles() {
  try {
    const { error } = await supabaseAdmin.rpc("publish_scheduled_articles");

    if (error) {
      console.error("予約投稿処理エラー:", error);
      return errorResponse("予約投稿の処理に失敗しました");
    }

    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("予約投稿処理エラー:", error);
    return errorResponse("予約投稿の処理に失敗しました");
  }
}

// ========================================
// 統計・分析
// ========================================

/**
 * 記事統計データを取得
 */
export async function getArticleStats() {
  try {
    // 全記事を一度に取得（status と created_at のみ）
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("status, created_at");

    if (error) {
      console.error("記事統計取得エラー:", error);
      return errorResponse("統計データの取得に失敗しました");
    }

    // 今月の範囲を計算
    const currentMonth = new Date();
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    // クライアント側で集計
    const stats = (articles || []).reduce(
      (acc, article) => {
        acc.total += 1;

        if (article.status === "published") {
          acc.published += 1;
        } else if (article.status === "draft") {
          acc.draft += 1;
        }

        const createdAt = new Date(article.created_at);
        if (createdAt >= startOfMonth && createdAt <= endOfMonth) {
          acc.thisMonth += 1;
        }

        return acc;
      },
      { total: 0, published: 0, draft: 0, thisMonth: 0 },
    );

    return {
      data: stats,
    };
  } catch (error) {
    console.error("統計データ取得エラー:", error);
    return errorResponse("統計データの取得に失敗しました");
  }
}

/**
 * 人気記事を取得（最近公開された記事を表示）
 */
export async function getPopularArticles(limit: number = 3): Promise<{
  success: boolean;
  data?: Pick<
    Article,
    "id" | "title" | "slug" | "published_at" | "created_at"
  >[];
  error?: string;
}> {
  try {
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("id, title, slug, published_at, created_at")
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("人気記事取得エラー:", error);
      return { success: false, error: "人気記事の取得に失敗しました" };
    }

    return { success: true, data: articles || [] };
  } catch (error) {
    console.error("人気記事取得エラー:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "不明なエラー",
    };
  }
}
