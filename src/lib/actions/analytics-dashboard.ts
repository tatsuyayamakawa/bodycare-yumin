'use server';

import googleAnalytics from '@/lib/analytics/google-analytics';

export interface DashboardAnalyticsData {
  dailyStats: Array<{
    date: string;
    pageViews: number;
    sessions: number;
    users: number;
    desktop: number;
    mobile: number;
  }>;
  summary: {
    totalViews: number;
    totalSessions: number;
    totalUsers: number;
    totalDesktop: number;
    totalMobile: number;
    avgViews: number;
    avgSessions: number;
    avgUsers: number;
  };
}

/**
 * ダッシュボード用のAnalyticsデータを取得
 */
export async function getDashboardAnalytics(days: number = 30): Promise<{
  success: boolean;
  data?: DashboardAnalyticsData;
  error?: string;
}> {
  try {
    // 日別データを取得
    const dailyStats = await googleAnalytics.getDailyPageViews(days);

    if (dailyStats.length === 0) {
      return {
        success: true,
        data: {
          dailyStats: [],
          summary: {
            totalViews: 0,
            totalSessions: 0,
            totalUsers: 0,
            totalDesktop: 0,
            totalMobile: 0,
            avgViews: 0,
            avgSessions: 0,
            avgUsers: 0,
          }
        }
      };
    }

    // 合計値を計算
    const totalViews = dailyStats.reduce((sum, day) => sum + day.pageViews, 0);
    const totalSessions = dailyStats.reduce((sum, day) => sum + day.sessions, 0);
    const totalUsers = dailyStats.reduce((sum, day) => sum + day.users, 0);
    const totalDesktop = dailyStats.reduce((sum, day) => sum + day.desktop, 0);
    const totalMobile = dailyStats.reduce((sum, day) => sum + day.mobile, 0);

    // 平均値を計算
    const avgViews = Math.round(totalViews / dailyStats.length);
    const avgSessions = Math.round(totalSessions / dailyStats.length);
    const avgUsers = Math.round(totalUsers / dailyStats.length);

    return {
      success: true,
      data: {
        dailyStats,
        summary: {
          totalViews,
          totalSessions,
          totalUsers,
          totalDesktop,
          totalMobile,
          avgViews,
          avgSessions,
          avgUsers,
        }
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}

/**
 * 人気ページのデータを取得
 */
export async function getPopularPages(days: number = 30): Promise<{
  success: boolean;
  data?: Array<{
    pagePath: string;
    pageTitle: string;
    pageViews: number;
    sessions: number;
  }>;
  error?: string;
}> {
  try {
    if (!googleAnalytics) {
      return { success: false, error: 'Google Analytics not configured' };
    }

    // 人気ページデータの取得は後で実装
    // 現在はGA4のgetPageViewsを使用して個別に取得する必要がある

    return {
      success: true,
      data: []
    };
  } catch (error) {
    console.error('Error fetching popular pages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}