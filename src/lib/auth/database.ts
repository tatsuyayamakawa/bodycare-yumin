import {
  AdminUser,
  generateInvitationToken,
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "./session";

import { supabaseAdmin } from "@/lib/supabase/server";

// AdminUser型を再エクスポート
export type { AdminUser };

export interface AdminInvitation {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_by: string;
  used_at: string | null;
  used_by: string | null;
  role: "admin" | "editor";
  created_at: string;
}

/**
 * メールアドレスでユーザーを検索
 */
export async function findUserByEmail(
  email: string,
): Promise<AdminUser | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as "admin" | "editor",
    is_active: data.is_active,
    created_at: data.created_at,
  };
}

/**
 * IDでユーザーを検索
 */
export async function findUserById(id: string): Promise<AdminUser | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as "admin" | "editor",
    is_active: data.is_active,
    created_at: data.created_at,
  };
}

/**
 * ユーザー認証
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, data.password_hash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as "admin" | "editor",
    is_active: data.is_active,
    created_at: data.created_at,
  };
}

/**
 * セッションを作成
 */
export async function createSession(userId: string): Promise<string | null> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1日後

  const { data, error } = await supabaseAdmin
    .from("admin_sessions")
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select("token")
    .single();

  if (error || !data) {
    console.error("Session creation failed:", error);
    return null;
  }

  return data.token;
}

/**
 * セッションを検索・検証
 */
export async function findSessionByToken(
  token: string,
): Promise<AdminUser | null> {
  const { data: sessionData, error: sessionError } = await supabaseAdmin
    .from("admin_sessions")
    .select(
      `
      *,
      admin_users (*)
    `,
    )
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (sessionError || !sessionData || !sessionData.admin_users) {
    return null;
  }

  // 最終アクセス時刻を更新
  await supabaseAdmin
    .from("admin_sessions")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("token", token);

  const user = sessionData.admin_users as {
    id: string;
    email: string;
    name: string;
    role: string;
    is_active: boolean;
  };
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "admin" | "editor",
    is_active: user.is_active,
  };
}

/**
 * セッションを削除
 */
export async function deleteSession(token: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("admin_sessions")
    .delete()
    .eq("token", token);

  return !error;
}

/**
 * ユーザーの全セッションを削除
 */
export async function deleteAllUserSessions(userId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("admin_sessions")
    .delete()
    .eq("user_id", userId);

  return !error;
}

/**
 * 招待を作成
 */
export async function createInvitation(
  email: string,
  createdBy: string,
  role: "admin" | "editor" = "editor",
): Promise<AdminInvitation | null> {
  const token = generateInvitationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1日後

  const { data, error } = await supabaseAdmin
    .from("admin_invitations")
    .insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
      created_by: createdBy,
      role,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Invitation creation failed:", error);
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    token: data.token,
    expires_at: data.expires_at,
    created_by: data.created_by,
    used_at: data.used_at,
    used_by: data.used_by,
    role: data.role as "admin" | "editor",
    created_at: data.created_at,
  };
}

/**
 * 招待トークンを検証
 */
export async function findInvitationByToken(
  token: string,
): Promise<AdminInvitation | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_invitations")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .is("used_at", null)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    token: data.token,
    expires_at: data.expires_at,
    created_by: data.created_by,
    used_at: data.used_at,
    used_by: data.used_by,
    role: data.role as "admin" | "editor",
    created_at: data.created_at,
  };
}

/**
 * ユーザーを作成（招待から）
 */
export async function createUserFromInvitation(
  invitationToken: string,
  name: string,
  password: string,
): Promise<AdminUser | null> {
  const invitation = await findInvitationByToken(invitationToken);
  if (!invitation) {
    return null;
  }

  // 同じメールアドレスのユーザーが既に存在するかチェック
  const existingUser = await findUserByEmail(invitation.email);
  if (existingUser) {
    return null;
  }

  const passwordHash = await hashPassword(password);

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .insert({
      email: invitation.email,
      name,
      password_hash: passwordHash,
      role: invitation.role,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("User creation failed:", error);
    return null;
  }

  // 招待を使用済みにマーク
  await supabaseAdmin
    .from("admin_invitations")
    .update({
      used_at: new Date().toISOString(),
      used_by: data.id,
    })
    .eq("token", invitationToken);

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as "admin" | "editor",
    is_active: data.is_active,
    created_at: data.created_at,
  };
}

/**
 * 全ユーザーを取得
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "admin" | "editor",
    is_active: user.is_active,
    created_at: user.created_at,
  }));
}

/**
 * 招待一覧を取得
 */
export async function getAllInvitations(): Promise<AdminInvitation[]> {
  const { data, error } = await supabaseAdmin
    .from("admin_invitations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((invitation) => ({
    id: invitation.id,
    email: invitation.email,
    token: invitation.token,
    expires_at: invitation.expires_at,
    created_by: invitation.created_by,
    used_at: invitation.used_at,
    used_by: invitation.used_by,
    role: invitation.role as "admin" | "editor",
    created_at: invitation.created_at,
  }));
}
