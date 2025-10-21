import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { appInfo } from "@/constants/data";

// ========================================
// 定数
// ========================================

const EYECATCH_CONFIG = {
  width: 1200,
  height: 630,
  backgroundImage: "eyecatch.png",
  siteName: `© ${appInfo.name}`,
} as const;

const STYLE_CONFIG = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  titleColor: "#333333",
  titleFontSize: 48,
  siteNameFontSize: 20,
} as const;

// ========================================
// ヘルパー関数
// ========================================

/**
 * 背景画像をBase64 Data URLに変換
 */
function loadBackgroundImage(): string {
  const imagePath = path.join(
    process.cwd(),
    "public",
    EYECATCH_CONFIG.backgroundImage,
  );
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  return `data:image/png;base64,${base64Image}`;
}

/**
 * アイキャッチSVGを生成
 */
function generateEyecatchSvg(
  title: string,
  backgroundImageUrl: string,
): string {
  return `
    <svg width="${EYECATCH_CONFIG.width}" height="${EYECATCH_CONFIG.height}" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景画像 -->
      <image x="0" y="0" width="${EYECATCH_CONFIG.width}" height="${EYECATCH_CONFIG.height}" href="${backgroundImageUrl}" />

      <!-- タイトルテキスト -->
      <foreignObject x="60" y="180" width="1080" height="270">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: ${STYLE_CONFIG.fontFamily};
          color: ${STYLE_CONFIG.titleColor};
          font-size: ${STYLE_CONFIG.titleFontSize}px;
          font-weight: bold;
          line-height: 1.3;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          word-wrap: break-word;
          hyphens: auto;
          padding: 0 80px;
          box-sizing: border-box;
        ">
          ${title}
        </div>
      </foreignObject>

      <!-- サイト名 -->
      <text x="600" y="580" text-anchor="middle" fill="${STYLE_CONFIG.titleColor}"
            font-family="${STYLE_CONFIG.fontFamily}"
            font-size="${STYLE_CONFIG.siteNameFontSize}"
            font-weight="bold">
        ${EYECATCH_CONFIG.siteName}
      </text>
    </svg>
  `;
}

/**
 * SVGをBase64 Data URIに変換
 */
function svgToDataUri(svg: string): string {
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

// ========================================
// APIハンドラー
// ========================================

/**
 * アイキャッチ画像生成API
 * @param request - タイトルを含むPOSTリクエスト
 * @returns 生成されたアイキャッチ画像のData URI
 */
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    // バリデーション
    if (!title) {
      return NextResponse.json(
        { error: "タイトルが必要です" },
        { status: 400 },
      );
    }

    // アイキャッチ生成
    const backgroundImageUrl = loadBackgroundImage();
    const svg = generateEyecatchSvg(title, backgroundImageUrl);
    const imageUrl = svgToDataUri(svg);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating eyecatch:", error);
    return NextResponse.json(
      { error: "アイキャッチの生成に失敗しました" },
      { status: 500 },
    );
  }
}
