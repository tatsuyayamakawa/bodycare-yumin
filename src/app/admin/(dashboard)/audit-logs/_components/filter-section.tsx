import { Filter, Search } from "lucide-react";
import { useState } from "react";

import { type AuditLogFilters, buildUrlParams } from "../_lib";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSectionProps {
  initialFilters: AuditLogFilters;
}

/**
 * フィルターセクションコンポーネント
 *
 * 監査ログのフィルタリングUIを提供。
 * アクション、対象タイプ、結果での絞り込みが可能。
 */
export function FilterSection({ initialFilters }: FilterSectionProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    const params = buildUrlParams(filters);
    window.location.href = `/admin/audit-logs?${params.toString()}`;
  };

  const clearFilters = () => {
    window.location.href = "/admin/audit-logs";
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <Filter className="mr-2 h-5 w-5" />
          フィルター
        </h3>
        <Button variant="ghost" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "非表示" : "表示"}
        </Button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              アクション
            </label>
            <Select
              value={filters.action || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  action: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="toggle_user_status">
                  ユーザー状態変更
                </SelectItem>
                <SelectItem value="delete_invitation">招待削除</SelectItem>
                <SelectItem value="create_invitation">招待作成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              対象タイプ
            </label>
            <Select
              value={filters.target_type || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  target_type: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="user">ユーザー</SelectItem>
                <SelectItem value="invitation">招待</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              結果
            </label>
            <Select
              value={
                filters.success !== undefined
                  ? filters.success.toString()
                  : "all"
              }
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  success: value === "all" ? undefined : value === "true",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="true">成功</SelectItem>
                <SelectItem value="false">失敗</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 md:col-span-3">
            <Button onClick={applyFilters}>
              <Search className="mr-2 h-4 w-4" />
              フィルター適用
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              クリア
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
