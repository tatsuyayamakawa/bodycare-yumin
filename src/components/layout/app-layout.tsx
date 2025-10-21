"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import Footer from "./footer";
import Header from "./header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // 管理ページかどうかを判定
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    // 管理ページの場合はHeader/Footerなしで直接子要素をレンダリング
    return <>{children}</>;
  }

  // 通常のページの場合はHeader/Footerを含める
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
