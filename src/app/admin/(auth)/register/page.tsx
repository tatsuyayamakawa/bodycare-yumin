import { Metadata } from "next";

import AccessDeniedComponent from "./_components/access-denied";
import InvitationInfo from "./_components/invitation-info";
import RegisterForm from "./_components/register-form";
import RegisterHeader from "./_components/register-header";

import { verifyInvitationAction } from "@/lib/actions/admin-auth";

export const metadata: Metadata = {
  title: "管理者・編集者アカウント新規登録",
  description:
    "招待リンクから管理者または編集者としてアカウントを作成します。パスワードを設定してシステムへのアクセスを開始できます。",
};

interface RegisterPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;

  if (!token) {
    return <AccessDeniedComponent error="アクセス情報が見つかりません" />;
  }

  try {
    const invitation = await verifyInvitationAction(token);

    if (!invitation.valid) {
      return <AccessDeniedComponent error={invitation.error} />;
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-300">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 lg:px-8">
          <div className="mx-auto w-full max-w-140">
            <RegisterHeader role={invitation.role} />

            {invitation.email && (
              <InvitationInfo email={invitation.email} role={invitation.role} />
            )}

            <RegisterForm token={token} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to verify invitation:", error);
    return <AccessDeniedComponent error="アクセス権の確認に失敗しました" />;
  }
}
