import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  is_active: boolean;
  created_at?: string;
}

export interface SessionData {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
  last_accessed_at: string;
}

const BCRYPT_SALT_ROUNDS = 12;
const SESSION_TOKEN_BYTE_SIZE = 32;
const SESSION_COOKIE_MAX_AGE = 24 * 60 * 60; // 1日間（秒）

/**
 * セッショントークンを生成 (Web Crypto API使用)
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(SESSION_TOKEN_BYTE_SIZE);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * パスワードをハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * パスワードを検証
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 招待トークンを生成 (Web Crypto API使用)
 */
export function generateInvitationToken(): string {
  const array = new Uint8Array(SESSION_TOKEN_BYTE_SIZE);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Requestからセッショントークンを取得
 */
export function getSessionTokenFromRequest(
  request: NextRequest,
): string | null {
  return request.cookies.get("admin-session")?.value || null;
}

/**
 * セッションCookieを設定
 */
export function setSessionCookie(token: string) {
  return {
    name: "admin-session",
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    },
  };
}

/**
 * セッションCookieを削除
 */
export function clearSessionCookie() {
  return {
    name: "admin-session",
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 0,
      path: "/",
    },
  };
}
