// ========================================
// 型定義
// ========================================

export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: string;
}

// ========================================
// ユーティリティ関数
// ========================================

/**
 * User-Agentからブラウザ情報を抽出
 */
function parseBrowser(ua: string): string {
  if (ua.includes("Edg/")) {
    const match = ua.match(/Edg\/([\d.]+)/);
    return match ? `Edge ${match[1].split(".")[0]}` : "Edge";
  }
  if (ua.includes("Chrome/")) {
    const match = ua.match(/Chrome\/([\d.]+)/);
    return match ? `Chrome ${match[1].split(".")[0]}` : "Chrome";
  }
  if (ua.includes("Firefox/")) {
    const match = ua.match(/Firefox\/([\d.]+)/);
    return match ? `Firefox ${match[1].split(".")[0]}` : "Firefox";
  }
  if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    const match = ua.match(/Version\/([\d.]+)/);
    return match ? `Safari ${match[1].split(".")[0]}` : "Safari";
  }
  return "その他";
}

/**
 * User-AgentからOS情報を抽出
 */
function parseOS(ua: string): string {
  if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
  if (ua.includes("Windows NT 6.3")) return "Windows 8.1";
  if (ua.includes("Windows NT 6.2")) return "Windows 8";
  if (ua.includes("Windows NT 6.1")) return "Windows 7";
  if (ua.includes("Windows")) return "Windows";

  if (ua.includes("Mac OS X")) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    if (match) {
      const version = match[1].split("_")[0];
      return `macOS ${version}`;
    }
    return "macOS";
  }

  if (ua.includes("Android")) {
    const match = ua.match(/Android ([\d.]+)/);
    return match ? `Android ${match[1]}` : "Android";
  }

  if (ua.includes("iPhone") || ua.includes("iPad")) {
    const match = ua.match(/OS ([\d_]+)/);
    if (match) {
      const version = match[1].split("_")[0];
      return `iOS ${version}`;
    }
    return "iOS";
  }

  if (ua.includes("Linux")) return "Linux";

  return "その他";
}

/**
 * User-Agentからデバイス種別を抽出
 */
function parseDevice(ua: string): string {
  if (ua.includes("Mobile") || ua.includes("Android")) {
    return "モバイル";
  }
  if (ua.includes("Tablet") || ua.includes("iPad")) {
    return "タブレット";
  }
  return "デスクトップ";
}

/**
 * User-Agentをパースして情報を抽出
 */
export function parseUserAgent(userAgent: string | null | undefined): ParsedUserAgent {
  if (!userAgent) {
    return {
      browser: "不明",
      os: "不明",
      device: "不明",
    };
  }

  return {
    browser: parseBrowser(userAgent),
    os: parseOS(userAgent),
    device: parseDevice(userAgent),
  };
}
