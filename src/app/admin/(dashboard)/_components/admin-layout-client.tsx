"use client";

import {
  Calendar,
  Computer,
  FileText,
  Gauge,
  Home,
  KeyRound,
  LogOut,
  PlusCircle,
  Search,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

import { AdminMobileHeader } from "./mobile-header";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { appInfo } from "@/constants/data";
import { logoutAction } from "@/lib/actions/admin-auth";
import type { AdminUser } from "@/lib/auth/session";
import type { NavigationItem } from "@/lib/navigation/server-nav";
import { cn } from "@/lib/utils/cn";

// アイコン名からコンポーネントへのマッピング
const iconMap = {
  Gauge,
  Calendar,
  FileText,
  PlusCircle,
  Search,
  Shield,
  Users,
  KeyRound,
} as const;

interface AdminLayoutClientProps {
  children: ReactNode;
  user: AdminUser | null;
  navigationItems: NavigationItem[];
}

export function AdminLayoutClient({
  children,
  user,
  navigationItems,
}: AdminLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ログアウト処理
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("ログアウトに失敗しました");
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* サイドバー */}
      <aside className="z-10 hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Card className="flex h-screen flex-col gap-3 rounded-none border-0 py-0 shadow-sm">
          {/* ヘッダー */}
          <div className="flex flex-shrink-0 items-center p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Computer className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-lg font-bold">
                  サイト管理
                </h1>
                <p className="text-muted-foreground text-sm">{appInfo.name}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* ナビゲーション */}
          <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
            {navigationItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-10 w-full justify-start gap-3",
                    isActive && "bg-secondary text-secondary-foreground",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <Separator />

          {/* ユーザー情報とフッターアクション */}
          <div className="bg-background flex-shrink-0">
            {/* ユーザー情報 */}
            {user && (
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="px-2 py-0 text-xs">
                        {user.role === "admin" ? "管理者" : "編集者"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* アクションメニュー */}
          <div className="space-y-2 p-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-full justify-start gap-3"
              asChild
            >
              <Link href="/" target="_self">
                <Home className="h-4 w-4" />
                サイトを表示
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-full cursor-pointer justify-start gap-3"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "ログアウト中..." : "ログアウト"}
            </Button>
          </div>
        </Card>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* モバイルヘッダー */}
        <AdminMobileHeader />

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster richColors />
    </div>
  );
}
