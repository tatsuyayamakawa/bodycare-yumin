import { NextRequest, NextResponse } from 'next/server';
import googleAnalytics from '@/lib/analytics/google-analytics';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の確認
    const config = {
      propertyId: process.env.GA4_PROPERTY_ID,
      hasCredentials: !!(process.env.GOOGLE_ANALYTICS_CREDENTIALS || process.env.GOOGLE_ANALYTICS_KEY_FILE),
      nodeEnv: process.env.NODE_ENV,
    };

    // 簡単な接続テスト
    console.log('Testing GA4 connection...');

    // サイト全体の統計を取得してみる
    const siteStats = await googleAnalytics.getSiteStats('7daysAgo', 'today');

    // 特定のページの閲覧数を取得してみる（存在しないページでもエラーが出ないかテスト）
    const testPageViews = await googleAnalytics.getPageViews('/blog/test-page', '7daysAgo', 'today');

    return NextResponse.json({
      success: true,
      message: 'GA4 connection test completed',
      config: {
        ...config,
        // 認証情報は含めない
        hasCredentials: config.hasCredentials,
      },
      testResults: {
        siteStats,
        testPageViews,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('GA4 connection test failed:', error);

    return NextResponse.json({
      success: false,
      error: 'GA4 connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      config: {
        propertyId: process.env.GA4_PROPERTY_ID,
        hasCredentials: !!(process.env.GOOGLE_ANALYTICS_CREDENTIALS || process.env.GOOGLE_ANALYTICS_KEY_FILE),
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, startDate, endDate } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'slug parameter is required' },
        { status: 400 }
      );
    }

    console.log(`Testing GA4 for specific article: ${slug}`);

    // 特定記事のアクセス数を取得
    const [totalViews, recentViews] = await Promise.all([
      googleAnalytics.getPageViews(`/blog/${slug}`, startDate || '30daysAgo', endDate || 'today'),
      googleAnalytics.getPageViews(`/blog/${slug}`, '7daysAgo', 'today'),
    ]);

    return NextResponse.json({
      success: true,
      message: `GA4 data retrieved for article: ${slug}`,
      data: {
        slug,
        totalViews,
        recentViews,
        dateRange: {
          total: `${startDate || '30daysAgo'} to ${endDate || 'today'}`,
          recent: '7daysAgo to today',
        },
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('GA4 article test failed:', error);

    return NextResponse.json({
      success: false,
      error: 'GA4 article test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}