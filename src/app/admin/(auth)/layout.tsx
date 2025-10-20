import { Metadata } from "next";
import { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      {children}
      <Toaster richColors />
    </>
  );
}
