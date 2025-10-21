import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * Google Analytics 4クライアント
 */
class GoogleAnalyticsClient {
  private client: BetaAnalyticsDataClient | null = null;
  private propertyId: string;

  constructor() {
    this.propertyId = process.env.GA4_PROPERTY_ID || '';
    
    // 環境変数でクライアントを初期化
    if (this.isConfigured()) {
      try {
        this.client = new BetaAnalyticsDataClient({
          credentials: this.getCredentials(),
        });
      } catch (error) {
        console.error('Failed to initialize Google Analytics client:', error);
      }
    }
  }

  /**
   * GA4が正しく設定されているかチェック
   */
  private isConfigured(): boolean {
    // 開発環境では常にfalseを返してエラーを回避
    if (process.env.NODE_ENV === 'development') {
      return false;
    }

    return !!(
      this.propertyId &&
      (process.env.GOOGLE_ANALYTICS_CREDENTIALS || process.env.GOOGLE_ANALYTICS_KEY_FILE)
    );
  }

  /**
   * 認証情報を取得
   */
  private getCredentials() {
    if (process.env.GOOGLE_ANALYTICS_CREDENTIALS) {
      return JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS);
    }
    if (process.env.GOOGLE_ANALYTICS_KEY_FILE) {
      return { keyFilename: process.env.GOOGLE_ANALYTICS_KEY_FILE };
    }
    throw new Error('Google Analytics credentials not found');
  }

  /**
   * 特定ページの閲覧数を取得
   */
  async getPageViews(
    pagePath: string,
    startDate: string = '30daysAgo',
    endDate: string = 'today'
  ): Promise<number> {
    if (!this.client || !this.isConfigured()) {
      console.warn('Google Analytics not configured, returning 0');
      return 0;
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'CONTAINS',
              value: pagePath,
            },
          },
        },
      });

      const views = response.rows?.[0]?.metricValues?.[0]?.value || '0';
      return parseInt(views, 10);
    } catch (error) {
      console.error(`Error fetching page views for ${pagePath}:`, error);
      return 0;
    }
  }

  /**
   * 複数ページの閲覧数を一括取得
   */
  async getBulkPageViews(
    pagePaths: string[],
    startDate: string = '30daysAgo',
    endDate: string = 'today'
  ): Promise<Record<string, number>> {
    if (!this.client || !this.isConfigured()) {
      console.warn('Google Analytics not configured, returning empty result');
      return {};
    }

    // 空の配列の場合は早期リターン
    if (pagePaths.length === 0) {
      return {};
    }

    try {
      // パスを正規化（先頭の/を除去）
      const normalizedPaths = pagePaths.map(path => path.replace(/^\//, ''));

      // GA4 APIの制限に配慮（大量データの場合はチャンクに分割）
      const CHUNK_SIZE = 50;
      const result: Record<string, number> = {};

      for (let i = 0; i < normalizedPaths.length; i += CHUNK_SIZE) {
        const chunk = normalizedPaths.slice(i, i + CHUNK_SIZE);
        const chunkResult = await this.getBulkPageViewsChunk(chunk, startDate, endDate);
        Object.assign(result, chunkResult);
      }

      return result;
    } catch (error) {
      console.error('Error fetching bulk page views:', error);
      return {};
    }
  }

  /**
   * GA4から少量のページデータを取得（内部メソッド）
   */
  private async getBulkPageViewsChunk(
    normalizedPaths: string[],
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    try {
      const [response] = await this.client!.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
          orGroup: {
            expressions: normalizedPaths.map(path => ({
              filter: {
                fieldName: 'pagePath',
                stringFilter: {
                  matchType: 'CONTAINS',
                  value: `/blog/${path}`,
                },
              },
            })),
          },
        },
      });

      const result: Record<string, number> = {};
      
      // すべてのパスを0で初期化
      normalizedPaths.forEach(path => {
        result[path] = 0;
      });

      // レスポンスから実際の値を設定
      response.rows?.forEach(row => {
        const pagePath = row.dimensionValues?.[0]?.value || '';
        const views = parseInt(row.metricValues?.[0]?.value || '0', 10);
        
        // パスからslugを抽出
        const match = pagePath.match(/\/blog\/([^/?]+)/);
        if (match && match[1]) {
          const slug = match[1];
          if (normalizedPaths.includes(slug)) {
            result[slug] = views;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error fetching chunk page views:', error);
      return {};
    }
  }

  /**
   * 開発環境用のモックデータを生成
   */
  private generateMockDailyData(days: number): Array<{
    date: string;
    pageViews: number;
    sessions: number;
    users: number;
    desktop: number;
    mobile: number;
  }> {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // ランダムなデータを生成（実際のトレンドに近いパターン）
      const baseViews = 50 + Math.random() * 100;
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.0;
      const trendMultiplier = 1 + (Math.sin((i / days) * Math.PI) * 0.3);

      const pageViews = Math.round(baseViews * weekendMultiplier * trendMultiplier);
      const sessions = Math.round(pageViews * (0.6 + Math.random() * 0.2));
      const users = Math.round(sessions * (0.8 + Math.random() * 0.2));

      // Desktop/Mobile 分割（モバイルが約60%）
      const mobile = Math.round(pageViews * (0.55 + Math.random() * 0.1)); // 55-65%
      const desktop = pageViews - mobile;

      data.push({
        date: date.toISOString().split('T')[0],
        pageViews,
        sessions,
        users,
        desktop,
        mobile,
      });
    }

    return data;
  }

  /**
   * 日別アクセス数を取得
   */
  async getDailyPageViews(
    days: number = 30
  ): Promise<Array<{
    date: string;
    pageViews: number;
    sessions: number;
    users: number;
    desktop: number;
    mobile: number;
  }>> {
    if (!this.client || !this.isConfigured()) {
      // 開発環境用のモックデータを返す
      if (process.env.NODE_ENV === 'development') {
        return this.generateMockDailyData(days);
      }
      return [];
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{
          startDate: `${days}daysAgo`,
          endDate: 'today'
        }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'activeUsers' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      });

      const data = response.rows?.map(row => {
        const dateStr = row.dimensionValues?.[0]?.value || '';
        const pageViews = parseInt(row.metricValues?.[0]?.value || '0', 10);
        const sessions = parseInt(row.metricValues?.[1]?.value || '0', 10);
        const users = parseInt(row.metricValues?.[2]?.value || '0', 10);

        // GA4の日付形式（YYYYMMDD）を標準形式に変換
        const date = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

        // Desktop/Mobile分割（実装時は別クエリでdeviceCategoryディメンションを使用）
        // 現在は仮でページビューの60%をモバイル、40%をデスクトップとして分割
        const mobile = Math.round(pageViews * 0.6);
        const desktop = pageViews - mobile;

        return {
          date,
          pageViews,
          sessions,
          users,
          desktop,
          mobile,
        };
      }) || [];

      return data;
    } catch (error) {
      console.error('Error fetching daily page views:', error);
      return [];
    }
  }

  /**
   * サイト全体の統計を取得
   */
  async getSiteStats(
    startDate: string = '30daysAgo',
    endDate: string = 'today'
  ): Promise<{
    totalViews: number;
    sessions: number;
    users: number;
  }> {
    if (!this.client || !this.isConfigured()) {
      return { totalViews: 0, sessions: 0, users: 0 };
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'activeUsers' },
        ],
      });

      const totalViews = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
      const sessions = parseInt(response.rows?.[0]?.metricValues?.[1]?.value || '0', 10);
      const users = parseInt(response.rows?.[0]?.metricValues?.[2]?.value || '0', 10);

      return { totalViews, sessions, users };
    } catch (error) {
      console.error('Error fetching site stats:', error);
      return { totalViews: 0, sessions: 0, users: 0 };
    }
  }
}

// シングルトンインスタンス
const googleAnalytics = new GoogleAnalyticsClient();

export default googleAnalytics;