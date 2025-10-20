import { supabaseAdmin } from "@/lib/supabase/server";

export default async function DebugPage() {
  let dbStatus = "unknown";
  let users: any[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, name, role, is_active, created_at, password_hash")
      .limit(10);

    if (dbError) {
      error = dbError.message;
      dbStatus = "error";
    } else {
      users = data || [];
      dbStatus = "connected";
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
    dbStatus = "error";
  }

  return (
    <div className="bg-white p-8">
      <h1 className="mb-6 text-2xl font-bold">認証システムデバッグ</h1>

      <div className="space-y-6">
        {/* 環境変数チェック */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">環境変数</h2>
          <div className="space-y-2 text-sm">
            <div>
              NEXT_PUBLIC_SUPABASE_URL:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL
                ? "✅ 設定済み"
                : "❌ 未設定"}
            </div>
            <div>
              SUPABASE_SERVICE_ROLE_KEY:{" "}
              {process.env.SUPABASE_SERVICE_ROLE_KEY
                ? "✅ 設定済み"
                : "❌ 未設定"}
            </div>
            <div>
              JWT_SECRET: {process.env.JWT_SECRET ? "✅ 設定済み" : "❌ 未設定"}
            </div>
          </div>
        </div>

        {/* データベース接続 */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">データベース接続</h2>
          <div className="mb-3">
            ステータス:{" "}
            {dbStatus === "connected"
              ? "✅ 接続済み"
              : dbStatus === "error"
                ? "❌ エラー"
                : "❓ 不明"}
          </div>
          {error && (
            <div className="mb-3 rounded bg-red-50 p-3 text-red-700">
              エラー: {error}
            </div>
          )}
        </div>

        {/* ユーザー一覧 */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">
            登録済みユーザー ({users.length}名)
          </h2>
          {users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user: any) => (
                <div key={user.id} className="rounded bg-gray-50 p-3">
                  <div className="font-medium">
                    {user.name} ({user.email})
                  </div>
                  <div className="text-sm text-gray-600">
                    権限: {user.role} | 状態:{" "}
                    {user.is_active ? "アクティブ" : "無効"} | 作成日:{" "}
                    {new Date(user.created_at).toLocaleDateString("ja-JP")}
                  </div>
                  <div className="mt-1 font-mono text-xs text-gray-500">
                    パスワードハッシュ: {user.password_hash?.substring(0, 30)}
                    ...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">ユーザーが見つかりません</div>
          )}
        </div>

        {/* テスト情報 */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">テスト情報</h2>
          <div className="rounded bg-blue-50 p-3 text-blue-700">
            <div>テストアカウント:</div>
            <div>• 管理者: admin@bodycare-yumin.com / admin123</div>
            <div>• 編集者: editor@bodycare-yumin.com / editor123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
