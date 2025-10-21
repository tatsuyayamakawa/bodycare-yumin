import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "@/components/blog/article-content";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ViewTracker } from "@/components/blog/view-tracker";
import { getArticleBySlug, getPublishedArticles } from "@/lib/actions/articles";
import type { Article } from "@/lib/supabase/types";
import { getBaseURL } from "@/lib/utils";
import { generateFallbackMetaDescription } from "@/lib/utils/metadata";

// ========================================
// 型定義
// ========================================

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

// ========================================
// ヘルパー関数
// ========================================

/**
 * 記事のメタディスクリプションを取得
 */
function getArticleDescription(article: Article): string {
  return article.meta_description && article.meta_description.trim()
    ? article.meta_description
    : generateFallbackMetaDescription(article.title);
}

/**
 * 記事のOG画像を取得
 */
function getArticleImages(article: Article): string[] {
  if (article.featured_image_url) {
    return [article.featured_image_url];
  }
  if (article.eyecatch_default) {
    return [article.eyecatch_default];
  }
  return [];
}

/**
 * 公開日を日本語フォーマットで取得
 */
function formatPublishedDate(publishedAt: string | null): string {
  if (!publishedAt) return "";

  return new Date(publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 記事が公開状態かチェック
 */
function isArticlePublished(article: Article): boolean {
  if (article.status !== "published") {
    return false;
  }

  if (article.published_at && new Date(article.published_at) > new Date()) {
    return false;
  }

  return true;
}

// ========================================
// Next.js 関数
// ========================================

/**
 * 静的パラメータ生成
 */
export async function generateStaticParams() {
  const result = await getPublishedArticles();

  if ("error" in result || !result.data) {
    return [];
  }

  return result.data.map((article) => ({
    slug: article.slug,
  }));
}

/**
 * メタデータ生成
 */
export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);

  if ("error" in result || !result.data) {
    return {
      title: "記事が見つかりません",
    };
  }

  const article = result.data;
  const description = getArticleDescription(article);
  const images = getArticleImages(article);

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      images,
    },
  };
}

/**
 * ブログ記事ページ
 */
export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);

  // 記事が見つからない場合
  if ("error" in result || !result.data) {
    notFound();
  }

  const article = result.data;

  // 公開記事のみ表示
  if (!isArticlePublished(article)) {
    notFound();
  }

  const publishedDate = formatPublishedDate(article.published_at);
  const articleUrl = `${getBaseURL()}/blog/${article.slug}`;

  return (
    <div className="mt-24 min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* 閲覧数記録 */}
      <ViewTracker slug={slug} />

      <article className="container mx-auto max-w-6xl px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-12">
          <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time>{publishedDate}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>3分で読める</span>
            </div>
          </div>

          <h1 className="mb-8 text-3xl leading-tight font-bold text-gray-900 md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
        </header>

        {/* コンテンツ */}
        <div className="mb-12">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
            <ArticleContent content={article.content} />
          </div>
        </div>

        {/* シェアボタン */}
        <footer className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                この記事が役に立ったらシェアしてください
              </h3>
              <p className="text-gray-600">
                他の方にも有用な情報をお届けできるよう、ぜひシェアをお願いします
              </p>
            </div>

            <ShareButtons title={article.title} url={articleUrl} />
          </div>
        </footer>
      </article>
    </div>
  );
}
