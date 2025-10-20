import { Metadata } from "next";
import { ReactNode } from "react";

import { AdminLayoutServer } from "./_components/admin-layout-server";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AdminLayoutServer>{children}</AdminLayoutServer>;
}
