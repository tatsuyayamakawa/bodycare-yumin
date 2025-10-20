"use client";

import { useMemo, useState } from "react";

import type { ArticleSearchProps } from "../_lib";
import { extractTextFromTiptapContent } from "../_lib";
import { ArticleSearchFilters } from "./article-search-filters";
import { ArticleTable } from "./article-table";

import { PaginationWrapper as Pagination } from "@/components/ui/pagination-wrapper";
import type { Article } from "@/lib/supabase/types";

/**
 * 記事をフィルタリング
 */
function filterArticles(
  articles: Article[],
  searchTerm: string,
  statusFilter?: string,
): Article[] {
  return articles.filter((article) => {
    // ステータスフィルター
    if (
      statusFilter &&
      statusFilter !== "all" &&
      article.status !== statusFilter
    ) {
      return false;
    }

    // 検索語フィルター
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = article.title.toLowerCase().includes(searchLower);
      const contentMatch = article.content
        ? extractTextFromTiptapContent(article.content)
            .toLowerCase()
            .includes(searchLower)
        : false;

      return titleMatch || contentMatch;
    }

    return true;
  });
}

/**
 * 記事検索・一覧表示コンポーネント
 */
export function ArticleSearch({
  articles,
  pagination,
  statusFilter,
  currentUser,
}: ArticleSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(
    () => filterArticles(articles, searchTerm, statusFilter),
    [articles, searchTerm, statusFilter],
  );

  const showPagination = pagination && !searchTerm.trim();

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-labelledby="article-list-heading"
    >
      <h2 id="article-list-heading" className="sr-only">
        記事検索とフィルタリング
      </h2>
      <div className="border-b border-gray-200 px-6 py-4">
        <ArticleSearchFilters
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      </div>

      <ArticleTable
        articles={filteredArticles}
        isPending={false}
        statusFilter={statusFilter}
        searchTerm={searchTerm}
        currentUser={currentUser}
      />

      {showPagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          basePath="/admin/articles"
        />
      )}
    </section>
  );
}
