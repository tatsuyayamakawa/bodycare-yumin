import { Metadata } from "next";

import LoginForm from "./_components/login-form";
import LoginHeader from "./_components/login-header";

export const metadata: Metadata = {
  title: "管理画面ログイン",
  description:
    "管理者・編集者向けのログインページ。メールアドレスとパスワードでシステムにアクセスできます。",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 lg:px-8">
        <div className="mx-auto w-full max-w-140">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
