import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditArticleClient } from "./edit-article-client";

import { Button } from "@/components/ui/button";
import { supabaseAdmin } from "@/lib/supabase/server";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  try {
    const { data: article, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("記事取得エラー:", error);
      return null;
    }

    return article;
  } catch (error) {
    console.error("記事取得エラー:", error);
    return null;
  }
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/admin/articles">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">戻る</span>
              </Button>
            </Link>
            <div className="hidden h-6 w-px bg-gray-300 sm:block" />
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
              記事を編集
            </h1>
          </div>
        </div>
      </div>

      {/* フォーム */}
      <div className="max-w-none px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto">
          <EditArticleClient article={article} />
        </div>
      </div>
    </div>
  );
}
