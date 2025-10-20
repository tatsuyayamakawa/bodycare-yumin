import { ROLE_FILTER_OPTIONS } from "../_lib";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFiltersProps {
  roleFilter: string;
  statusFilter: string;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  statusOptions: ReadonlyArray<{ value: string; label: string }>;
}

/**
 * テーブルフィルターコンポーネント
 *
 * @description
 * ユーザーテーブルと招待テーブルで共通使用するフィルターUI。
 * 権限（管理者/編集者）とステータスによる絞り込みを提供します。
 *
 * @param props.roleFilter - 現在の権限フィルター値
 * @param props.statusFilter - 現在のステータスフィルター値
 * @param props.onRoleFilterChange - 権限フィルター変更時のコールバック
 * @param props.onStatusFilterChange - ステータスフィルター変更時のコールバック
 * @param props.statusOptions - ステータスの選択肢（テーブルごとに異なる）
 */
export function TableFilters({
  roleFilter,
  statusFilter,
  onRoleFilterChange,
  onStatusFilterChange,
  statusOptions,
}: TableFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">権限:</span>
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">ステータス:</span>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
