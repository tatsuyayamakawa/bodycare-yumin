import { ShieldCheck } from "lucide-react";

export default function LoginHeader() {
  return (
    <header className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl">
        <ShieldCheck className="h-10 w-10 text-white" aria-hidden="true" />
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900">
        管理画面ログイン
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        管理者・編集者の方はこちらからログインしてください
      </p>
    </header>
  );
}
