import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { calculateReadingTime } from "./utils";

import { Article } from "@/lib/supabase/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const readingTime = calculateReadingTime(
    article.content,
    article.meta_description || "",
  );

  return (
    <Link href={`/blog/${article.slug}`} className="block">
      <article className="group relative flex h-[480px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* グラデーションオーバーレイ */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {(article.featured_image_url || article.eyecatch_default) && (
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={article.featured_image_url || article.eyecatch_default || ""}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative flex flex-1 flex-col p-6">
          {/* メタ情報 */}
          <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time>{publishedDate}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime}</span>
            </div>
          </div>

          {/* タイトル */}
          <h2 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900">
            {article.title}
          </h2>

          {/* 説明文 */}
          {article.meta_description && (
            <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">
              {article.meta_description}
            </p>
          )}

          {/* 続きを読むリンク */}
          <div className="mt-auto flex items-center">
            <span className="inline-flex items-center gap-2 font-medium text-blue-600 transition-all duration-200 group-hover:gap-3 group-hover:text-blue-700">
              続きを読む
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
