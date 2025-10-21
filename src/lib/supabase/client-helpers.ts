/**
 * Supabase クライアントヘルパー（Next.js App Router用）
 *
 * Server ComponentsとServer Actionsで使用するSupabaseクライアント
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/types/database";

/**
 * Server Component用のSupabaseクライアントを作成
 *
 * @returns 型安全なSupabaseクライアント
 */
/**
 * Server Component用のSupabaseクライアントを作成
 *
 * @returns 型安全なSupabaseクライアント
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Componentでsetできない場合があるため、エラーを無視
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Server Componentでremoveできない場合があるため、エラーを無視
          }
        },
      },
    },
  );
}

/**
 * Server Action用のSupabaseクライアントを作成（非推奨）
 * 代わりに createClient() を使用してください
 *
 * @deprecated createClient() を使用してください
 */
export const createServerActionClient = createClient;
