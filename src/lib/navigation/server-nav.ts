import type { AdminUser } from "@/lib/auth/session";
import { getServerUser } from "@/lib/auth/server-utils";

export interface NavigationItem {
  name: string;
  href: string;
  icon: string; // アイコン名を文字列で渡す
}

export interface ServerNavData {
  user: AdminUser | null;
  navigationItems: NavigationItem[];
}

/**
 * サーバーサイドでナビゲーション情報を取得
 */
export async function getServerNavigation(): Promise<ServerNavData> {
  const user = await getServerUser();

  const navigationItems: NavigationItem[] = [
    {
      name: "ダッシュボード",
      href: "/admin",
      icon: "Gauge",
    },
    {
      name: "予約管理",
      href: "/admin/bookings",
      icon: "Calendar",
    },
    {
      name: "記事一覧",
      href: "/admin/articles",
      icon: "FileText",
    },
    {
      name: "新規作成",
      href: "/admin/articles/new",
      icon: "PlusCircle",
    },
    {
      name: "検索アナリティクス",
      href: "/admin/search-analytics",
      icon: "Search",
    },
    // 管理者のみユーザー管理を表示
    ...(user?.role === "admin"
      ? [
          {
            name: "ユーザー管理",
            href: "/admin/users",
            icon: "Users",
          },
          {
            name: "監査ログ",
            href: "/admin/audit-logs",
            icon: "Shield",
          },
          {
            name: "ログイン履歴",
            href: "/admin/login-logs",
            icon: "KeyRound",
          },
        ]
      : []),
  ];

  return {
    user,
    navigationItems,
  };
}
