import { BookOpen, Sparkles } from "lucide-react";

import { ArticleCard } from "@/components/blog/article-card";
import { getPublishedArticles } from "@/lib/actions/articles";

export const metadata = {
  title: "ブログ",
  description: "ブログページです。最新の情報やお役立ち情報をお届けします。",
};


async function BlogArticles() {
  const result = await getPublishedArticles();

  if ('error' in result || !result.data) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <BookOpen className="h-12 w-12 text-red-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          読み込みエラー
        </h3>
        <p className="text-gray-500">
          記事の読み込みに失敗しました。しばらく時間をおいて再度お試しください。
        </p>
      </div>
    );
  }

  if (result.data.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <Sparkles className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          記事を準備中
        </h3>
        <p className="text-gray-500">
          現在、新しい記事を準備しています。もうしばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {result.data.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-24">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto w-fit text-center">
            <h1 className="text-foreground font-zen-old-mincho text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
              ブログ
            </h1>
          </div>
        </div>

        {/* 装飾的な要素 */}
        <div className="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-blue-200 opacity-20"></div>
        <div className="absolute right-10 bottom-20 h-32 w-32 animate-pulse rounded-full bg-purple-200 opacity-20 delay-1000"></div>
      </div>

      {/* 記事一覧セクション */}
      <div className="container mx-auto px-4 py-16">
        <BlogArticles />
      </div>
    </div>
  );
}
