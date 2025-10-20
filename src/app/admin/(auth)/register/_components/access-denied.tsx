"use client";

import { useRouter } from "next/navigation";

import RegisterHeader from "./register-header";

import { Button } from "@/components/ui/button";

interface AccessDeniedComponentProps {
  error?: string;
}

export default function AccessDeniedComponent({
  error,
}: AccessDeniedComponentProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-300">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 lg:px-8">
        <div className="mx-auto w-full max-w-140">
          <RegisterHeader variant="error" errorMessage={error} />
          <nav className="mt-8 text-center">
            <Button
              onClick={() => router.push("/admin/login")}
              className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold"
            >
              ログインページに戻る
            </Button>
          </nav>
        </div>
      </div>
    </main>
  );
}
