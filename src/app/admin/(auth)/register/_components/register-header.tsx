import { AlertCircle, UserPlus } from "lucide-react";

import { getRoleLabel } from "../_lib/utils";

interface RegisterHeaderProps {
  variant?: "register" | "error";
  role?: string;
  errorMessage?: string;
}

export default function RegisterHeader({
  variant = "register",
  role,
  errorMessage,
}: RegisterHeaderProps) {
  if (variant === "error") {
    return (
      <header className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 shadow-xl">
          <AlertCircle className="h-10 w-10 text-red-600" aria-hidden="true" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900">
          招待リンクが無効です
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {errorMessage ||
            "スタッフとしてログインするか、有効な招待リンクからアクセスしてください。"}
        </p>
      </header>
    );
  }

  return (
    <header className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 shadow-xl">
        <UserPlus className="h-10 w-10 text-white" aria-hidden="true" />
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900">
        アカウント新規登録
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {getRoleLabel(role)}として参加しましょう
      </p>
    </header>
  );
}
