/**
 * CSRFトークンの生成・検証モジュール
 * Edge Runtime対応のためWeb Crypto APIを使用
 */

// ========================================
// 定数
// ========================================

const CSRF_SECRET = process.env.CSRF_SECRET;

if (!CSRF_SECRET) {
  throw new Error(
    "CSRF_SECRET environment variable is required. Please set it in your .env.local file.",
  );
}

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1時間
const TOKEN_BYTE_SIZE = 32;

// ========================================
// ヘルパー関数
// ========================================

/**
 * バイト配列を16進数文字列に変換
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * HMAC-SHA256署名を生成
 */
async function generateHmacSignature(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(CSRF_SECRET);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    messageData,
  );
  return bytesToHex(new Uint8Array(signatureBuffer));
}

// ========================================
// 公開API
// ========================================

/**
 * CSRFトークンを生成する
 * @returns トークン文字列（形式: ランダム値:タイムスタンプ:署名）
 */
export async function generateCsrfToken(): Promise<string> {
  // ランダムトークン生成
  const tokenBytes = new Uint8Array(TOKEN_BYTE_SIZE);
  crypto.getRandomValues(tokenBytes);
  const token = bytesToHex(tokenBytes);

  const timestamp = Date.now().toString();

  // HMAC署名を生成
  const signature = await generateHmacSignature(`${token}:${timestamp}`);

  return `${token}:${timestamp}:${signature}`;
}

/**
 * CSRFトークンを検証する
 * @param token 検証するトークン文字列
 * @returns トークンが有効な場合true、それ以外false
 */
export async function validateCsrfToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const [tokenPart, timestampPart, signature] = token.split(":");

    // トークン形式チェック
    if (!tokenPart || !timestampPart || !signature) {
      return false;
    }

    // 有効期限チェック
    const timestamp = parseInt(timestampPart, 10);
    const now = Date.now();

    if (now - timestamp > TOKEN_EXPIRY_MS) {
      return false;
    }

    // 署名検証
    const expectedSignature = await generateHmacSignature(
      `${tokenPart}:${timestampPart}`,
    );

    return signature === expectedSignature;
  } catch (error) {
    console.error("CSRF token validation error:", error);
    return false;
  }
}

/**
 * リクエストヘッダーからCSRFトークンを取得する
 * @param headers リクエストヘッダー
 * @returns CSRFトークン、見つからない場合null
 */
export function getCsrfTokenFromHeaders(headers: Headers): string | null {
  return headers.get("x-csrf-token") || headers.get("X-CSRF-Token");
}