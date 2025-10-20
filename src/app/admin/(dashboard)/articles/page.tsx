import { Eye, Plus } from "lucide-react";
import Link from "next/link";

import { ArticleList } from "./_components/article-list";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/app/admin/(dashboard)/_components/page-header";

interface SearchParams {
  page?: string;
  status?: string;
}

interface ArticlesPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * 記事一覧ページ
 */
export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="space-y-6">
      <PageHeader
        title="記事一覧"
        description="ブログ記事の管理・編集を行います"
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/blog" target="_self">
              <Button variant="outline">
                <Eye className="h-4 w-4" />
                ブログを見る
              </Button>
            </Link>
            <Link href="/admin/articles/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="h-4 w-4" />
                新規作成
              </Button>
            </Link>
          </div>
        }
      />
      <ArticleList searchParams={resolvedSearchParams} />
    </main>
  );
}
