import { ReactNode } from "react";

import { AdminLayoutClient } from "./admin-layout-client";

import { getServerNavigation } from "@/lib/navigation/server-nav";

interface AdminLayoutServerProps {
  children: ReactNode;
}

export async function AdminLayoutServer({ children }: AdminLayoutServerProps) {
  // サーバーサイドでナビゲーション情報を取得
  const { user, navigationItems } = await getServerNavigation();

  return (
    <AdminLayoutClient user={user} navigationItems={navigationItems}>
      {children}
    </AdminLayoutClient>
  );
}
