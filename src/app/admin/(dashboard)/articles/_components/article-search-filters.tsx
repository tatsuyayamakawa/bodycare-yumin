"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { ARTICLE_STATUS_FILTER_OPTIONS } from "../_lib";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArticleSearchFiltersProps {
  statusFilter?: string;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

/**
 * 記事検索フィルターコンポーネント
 *
 * @description
 * 記事のステータスフィルターと検索入力をまとめたコンポーネント。
 */

interface ArticleSearchFiltersProps {
  statusFilter?: string;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

/**
 * 記事検索フィルターコンポーネント
 *
 * @description
 * 記事のステータスフィルターと検索入力をまとめたコンポーネント。
 * - ステータス: URLパラメータで管理
 * - 検索: クライアントサイドでリアルタイム絞り込み
 */
export function ArticleSearchFilters({
  statusFilter,
  searchTerm,
  onSearchTermChange,
}: ArticleSearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleStatusFilterChange = useCallback(
    (status: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);

        if (status === "all") {
          params.delete("status");
        } else {
          params.set("status", status);
        }

        // ページをリセット
        params.delete("page");

        const newUrl = params.toString()
          ? `/admin/articles?${params.toString()}`
          : "/admin/articles";
        router.push(newUrl);
      });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* ステータスフィルター */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">ステータス:</span>
        <Select
          value={statusFilter || "all"}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            {ARTICLE_STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 検索入力 */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="記事を検索..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
