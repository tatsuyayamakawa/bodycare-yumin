import Link from "next/link";

import { ArticleSearch } from "./article-search";

import { Button } from "@/components/ui/button";

import { getArticles } from "@/lib/actions/articles";
import { getServerUser } from "@/lib/auth/server-utils";

interface ArticleListProps {
  searchParams: {
    page?: string;
    status?: string;
  };
}

const ARTICLES_PER_PAGE = 20;

/**
 * 記事一覧コンポーネント
 */
export async function ArticleList({ searchParams }: ArticleListProps) {
  const page = Number(searchParams.page) || 1;
  const statusFilter = searchParams.status;

  // データ取得
  const [result, currentUser] = await Promise.all([
    getArticles(undefined, page, ARTICLES_PER_PAGE),
    getServerUser(),
  ]);

  // エラーハンドリング
  if ("error" in result) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{result.error}</p>
      </div>
    );
  }

  if (!result.data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">不明なエラー</p>
      </div>
    );
  }

  // 空の状態
  if (result.data.length === 0 && page === 1) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-gray-500">まだ記事がありません。</p>
        <Link href="/admin/articles/new">
          <Button>最初の記事を作成</Button>
        </Link>
      </div>
    );
  }

  return (
    <ArticleSearch
      articles={result.data}
      pagination={result.pagination}
      statusFilter={statusFilter}
      currentUser={currentUser}
    />
  );
}
