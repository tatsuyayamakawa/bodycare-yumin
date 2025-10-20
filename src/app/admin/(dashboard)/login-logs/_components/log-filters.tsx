"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogFiltersProps {
  currentAction?: string;
}

/**
 * ログフィルターコンポーネント
 *
 * @description
 * ログイン履歴の操作内容によるフィルタリングUI
 *
 * @param props.currentAction - 現在選択されている操作内容
 */
export function LogFilters({ currentAction }: LogFiltersProps) {
  const router = useRouter();

  const handleFilterChange = (action: string) => {
    const params = new URLSearchParams(window.location.search);

    if (action === "all") {
      params.delete("action");
    } else {
      params.set("action", action);
    }

    params.delete("page");
    router.push(`/admin/login-logs?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">操作内容:</span>
      <Select value={currentAction || "all"} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="すべて" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="login">ログイン</SelectItem>
          <SelectItem value="logout">ログアウト</SelectItem>
          <SelectItem value="login_failed">ログイン失敗</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
