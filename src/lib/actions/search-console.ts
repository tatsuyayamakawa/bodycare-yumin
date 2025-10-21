"use server";

import {
  getPageSearchPerformance as getPageSearchPerformanceAPI,
  getQueryTrend as getQueryTrendAPI,
  getSearchQueries as getSearchQueriesAPI,
} from "@/lib/analytics/google-search-console";

/**
 * 検索クエリデータを取得
 */
export async function getSearchQueries(days: number = 30) {
  try {
    const startDate = `${days}daysAgo`;
    const endDate = "today";

    const queries = await getSearchQueriesAPI(startDate, endDate);

    // クリック数順にソート
    const sortedQueries = queries.sort((a, b) => b.clicks - a.clicks);

    return {
      success: true,
      data: sortedQueries,
    };
  } catch (error) {
    console.error("Error in getSearchQueries:", error);
    return {
      success: false,
      error: "Failed to fetch search queries",
      data: [],
    };
  }
}

/**
 * ページ別検索パフォーマンスを取得
 */
export async function getPageSearchPerformance(days: number = 30) {
  try {
    const startDate = `${days}daysAgo`;
    const endDate = "today";

    const pages = await getPageSearchPerformanceAPI(startDate, endDate);

    // クリック数順にソート
    const sortedPages = pages.sort((a, b) => b.clicks - a.clicks);

    return {
      success: true,
      data: sortedPages,
    };
  } catch (error) {
    console.error("Error in getPageSearchPerformance:", error);
    return {
      success: false,
      error: "Failed to fetch page search performance",
      data: [],
    };
  }
}

/**
 * 検索クエリのトレンドデータを取得
 */
export async function getQueryTrend(query: string, days: number = 30) {
  try {
    const startDate = `${days}daysAgo`;
    const endDate = "today";

    const trend = await getQueryTrendAPI(query, startDate, endDate);

    return {
      success: true,
      data: trend,
    };
  } catch (error) {
    console.error("Error in getQueryTrend:", error);
    return {
      success: false,
      error: "Failed to fetch query trend",
      data: [],
    };
  }
}

/**
 * 検索コンソールの総合統計を取得
 */
export async function getSearchConsoleStats(days: number = 30) {
  try {
    const queries = await getSearchQueries(days);

    if (!queries.success || !queries.data) {
      return {
        success: false,
        error: "Failed to fetch search console data",
        data: null,
      };
    }

    // 統計計算
    const totalClicks = queries.data.reduce(
      (sum, query) => sum + query.clicks,
      0,
    );
    const totalImpressions = queries.data.reduce(
      (sum, query) => sum + query.impressions,
      0,
    );
    const averageCTR =
      totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const averagePosition =
      queries.data.length > 0
        ? queries.data.reduce((sum, query) => sum + query.position, 0) /
          queries.data.length
        : 0;

    // トップパフォーマンスクエリ（上位10件）
    const topQueries = queries.data.slice(0, 10);

    return {
      success: true,
      data: {
        totalClicks,
        totalImpressions,
        averageCTR: parseFloat(averageCTR.toFixed(4)),
        averagePosition: parseFloat(averagePosition.toFixed(1)),
        topQueries,
        totalQueries: queries.data.length,
      },
    };
  } catch (error) {
    console.error("Error in getSearchConsoleStats:", error);
    return {
      success: false,
      error: "Failed to fetch search console stats",
      data: null,
    };
  }
}
