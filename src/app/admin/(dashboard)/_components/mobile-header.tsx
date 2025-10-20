"use client";

import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
};

export function AdminMobileHeader() {
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    {
      name: "記事一覧",
      href: "/admin",
      icon: FileText,
      current: pathname === "/admin",
    },
    {
      name: "新規作成",
      href: "/admin/articles/new",
      icon: PlusCircle,
      current: pathname === "/admin/articles/new",
    },
  ];

  return (
    <div className="lg:hidden">
      <header className="border-b bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <LayoutDashboard className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">ブログ管理</h1>
            </div>
            <Link
              href="/"
              target="_blank"
              className="cursor-pointer text-gray-600 transition-colors hover:text-gray-900"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        <div className="px-4 pb-4">
          <nav className="flex gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
