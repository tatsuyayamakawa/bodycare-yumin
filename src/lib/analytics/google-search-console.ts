import { GoogleAuth } from "google-auth-library";

import { getBaseURL } from "../utils";

// 型定義
export interface SearchQueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageSearchData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface QueryTrendData {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchAnalyticsQueryResponse {
  rows?: SearchConsoleRow[];
}

// 設定
const siteUrl = getBaseURL();

// 認証情報の取得
const getCredentials = () => {
  if (process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS) {
    try {
      return JSON.parse(process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS);
    } catch (error) {
      throw new Error(
        "Invalid GOOGLE_SEARCH_CONSOLE_CREDENTIALS format: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  }

  if (process.env.GOOGLE_SEARCH_CONSOLE_KEY_FILE) {
    return { keyFilename: process.env.GOOGLE_SEARCH_CONSOLE_KEY_FILE };
  }

  throw new Error(
    "Google Search Console credentials not found. Please set GOOGLE_SEARCH_CONSOLE_CREDENTIALS or GOOGLE_SEARCH_CONSOLE_KEY_FILE environment variable.",
  );
};

// 設定チェック
const isConfigured = (): boolean => {
  if (process.env.NODE_ENV === "development") {
    return false;
  }

  return !!(
    siteUrl &&
    (process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS ||
      process.env.GOOGLE_SEARCH_CONSOLE_KEY_FILE)
  );
};

// 認証クライアントの作成
const createAuthClient = async () => {
  if (!isConfigured()) {
    throw new Error("Google Search Console not configured");
  }

  try {
    const auth = new GoogleAuth({
      credentials: getCredentials(),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
    return await auth.getClient();
  } catch (error) {
    throw new Error(
      "Failed to initialize Google Search Console client: " +
        (error instanceof Error ? error.message : "Unknown error"),
    );
  }
};

// API リクエスト
const makeRequest = async <TResponse>(
  url: string,
  data: Record<string, unknown>,
): Promise<TResponse> => {
  const authClient = await createAuthClient();
  const headers = await authClient.getRequestHeaders();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Search Console API error: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
};

// 日付フォーマット
const formatDate = (dateStr: string): string => {
  if (dateStr === "today") {
    return new Date().toISOString().split("T")[0];
  }

  if (dateStr.endsWith("daysAgo")) {
    const days = parseInt(dateStr.replace("daysAgo", ""), 10);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  }

  return dateStr;
};

// モックデータ生成
const generateMockSearchQueries = (): SearchQueryData[] => {
  const queries = [
    "ボディケア 方法",
    "美容 スキンケア",
    "ボディクリーム おすすめ",
    "保湿 効果",
    "ボディオイル 使い方",
    "スクラブ 頻度",
    "乾燥肌 対策",
    "ボディソープ 選び方",
    "マッサージ やり方",
    "角質ケア 方法",
    "セルフケア ルーティン",
    "ボディケア 順番",
  ];

  return queries.map((query) => ({
    query,
    clicks: Math.floor(Math.random() * 100) + 10,
    impressions: Math.floor(Math.random() * 1000) + 100,
    ctr: parseFloat((Math.random() * 0.15 + 0.02).toFixed(3)),
    position: parseFloat((Math.random() * 20 + 1).toFixed(1)),
  }));
};

const generateMockPageSearchData = (): PageSearchData[] => {
  const pages = [
    "/blog/bodycare-basics",
    "/blog/moisturizing-tips",
    "/blog/body-scrub-guide",
    "/blog/dry-skin-solutions",
    "/blog/body-oil-benefits",
    "/blog/massage-techniques",
  ];

  return pages.map((page) => ({
    page,
    clicks: Math.floor(Math.random() * 50) + 5,
    impressions: Math.floor(Math.random() * 500) + 50,
    ctr: parseFloat((Math.random() * 0.12 + 0.02).toFixed(3)),
    position: parseFloat((Math.random() * 15 + 1).toFixed(1)),
  }));
};

const generateMockQueryTrend = (): QueryTrendData[] => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      clicks: Math.floor(Math.random() * 10) + 1,
      impressions: Math.floor(Math.random() * 100) + 20,
      ctr: parseFloat((Math.random() * 0.1 + 0.02).toFixed(3)),
      position: parseFloat((Math.random() * 5 + 3).toFixed(1)),
    });
  }

  return data;
};

// 公開API関数
export const getSearchQueries = async (
  startDate: string = "30daysAgo",
  endDate: string = "today",
  dimensions: string[] = ["query"],
): Promise<SearchQueryData[]> => {
  if (!isConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return generateMockSearchQueries();
    }
    return [];
  }

  try {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(getBaseURL())}/searchAnalytics/query`;

    const requestData = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      dimensions,
      rowLimit: 100,
      startRow: 0,
    };

    const response = await makeRequest<SearchAnalyticsQueryResponse>(
      url,
      requestData,
    );

    return (
      response.rows?.map((row: SearchConsoleRow) => ({
        query: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching search queries:", error);
    return [];
  }
};

export const getPageSearchPerformance = async (
  startDate: string = "30daysAgo",
  endDate: string = "today",
): Promise<PageSearchData[]> => {
  if (!isConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return generateMockPageSearchData();
    }
    return [];
  }

  try {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(getBaseURL())}/searchAnalytics/query`;

    const requestData = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      dimensions: ["page"],
      rowLimit: 50,
      startRow: 0,
    };

    const response = await makeRequest<SearchAnalyticsQueryResponse>(
      url,
      requestData,
    );

    return (
      response.rows?.map((row: SearchConsoleRow) => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching page search performance:", error);
    return [];
  }
};

export const getQueryTrend = async (
  query: string,
  startDate: string = "30daysAgo",
  endDate: string = "today",
): Promise<QueryTrendData[]> => {
  if (!isConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return generateMockQueryTrend();
    }
    return [];
  }

  try {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(getBaseURL())}/searchAnalytics/query`;

    const requestData = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      dimensions: ["date"],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "query",
              operator: "equals",
              expression: query,
            },
          ],
        },
      ],
      rowLimit: 100,
    };

    const response = await makeRequest<SearchAnalyticsQueryResponse>(
      url,
      requestData,
    );

    return (
      response.rows?.map((row: SearchConsoleRow) => ({
        date: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching query trend:", error);
    return [];
  }
};
