import { NextRequest, NextResponse } from "next/server";

import { findSessionByToken } from "@/lib/auth/database";
import { getSessionTokenFromRequest } from "@/lib/auth/session";
import { generateCsrfToken } from "@/lib/utils/csrf";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register", "/admin/debug"];

/**
 * 地理的制限をチェック（本番環境のみ日本からのアクセスを許可）
 */
function checkGeographicRestriction(request: NextRequest): NextResponse | null {
  const country = request.headers.get("x-vercel-ip-country") || "Unknown";

  if (country !== "JP" && process.env.NODE_ENV === "production") {
    const ip = request.headers.get("x-forwarded-for") ||
                request.headers.get("x-real-ip") ||
                "Unknown";
    console.log(`Blocked access from country: ${country}, IP: ${ip}`);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
}

/**
 * セッションをクリアしてログインページにリダイレクト
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set("admin-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 管理ページ以外は処理をスキップ
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 地理的制限のチェック
  const geoResponse = checkGeographicRestriction(request);
  if (geoResponse) {
    return geoResponse;
  }

  // 公開パスは認証不要
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // セッショントークンの取得
  const sessionToken = getSessionTokenFromRequest(request);
  if (!sessionToken) {
    return redirectToLogin(request);
  }

  // セッション検証
  try {
    const user = await findSessionByToken(sessionToken);

    if (!user) {
      return redirectToLogin(request);
    }

    // ユーザー管理ページは管理者のみアクセス可能
    if (pathname.startsWith("/admin/users") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    return redirectToLogin(request);
  }

  // レスポンスヘッダーの設定
  const response = NextResponse.next();
  response.headers.set("x-url", request.url);
  response.headers.set("x-pathname", pathname);

  // CSRFトークンの生成
  const csrfToken = await generateCsrfToken();
  response.headers.set("x-csrf-token", csrfToken);

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
