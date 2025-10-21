import { cookies } from "next/headers";

import { findSessionByToken } from "./database";
import type { AdminUser } from "./session";

export type { AdminUser };

/**
 * サーバーサイドでログインユーザーを取得する
 */
export async function getServerUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin-session")?.value;

    if (!sessionToken) {
      return null;
    }

    const user = await findSessionByToken(sessionToken);
    return user;
  } catch (error) {
    console.error("Failed to get server user:", error);
    return null;
  }
}
