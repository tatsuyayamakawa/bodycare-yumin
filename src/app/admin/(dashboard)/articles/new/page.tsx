"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArticleForm } from "@/components/blog/editor/article-form";
import { Button } from "@/components/ui/button";

export default function NewArticlePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/articles");
  };

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
              新しい記事を作成
            </h1>
          </div>
        </div>
      </div>

      {/* フォーム */}
      <div className="max-w-none px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto">
          <ArticleForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
