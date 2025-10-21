'use server';

import { supabaseAdmin } from '@/lib/supabase/server';

export interface PopularArticleWithViews {
  id: string;
  title: string;
  slug: string;
  view_count: number;
  published_at: string;
  created_at: string;
  monthly_views?: number;
  ga_view_count?: number;
  ga_monthly_views?: number;
  analytics_synced_at?: string;
}

/**
 * 全体の人気記事を取得する（総閲覧数順）
 */
export async function getPopularArticlesByViews(limit: number = 5): Promise<{
  success: boolean;
  data?: PopularArticleWithViews[];
  error?: string;
}> {
  try {
    // 1. まず関数を試す
    const { data: functionData, error: functionError } = await supabaseAdmin
      .rpc('get_popular_articles', { limit_count: limit });

    if (!functionError && functionData) {
      return { success: true, data: functionData };
    }

    // 2. 関数が失敗した場合、ビューを試す
    const { data: viewData, error: viewError } = await supabaseAdmin
      .from('popular_articles')
      .select('*')
      .limit(limit);

    if (!viewError && viewData) {
      return { success: true, data: viewData };
    }

    // 3. 両方失敗した場合、直接クエリ
    const { data: directData, error: directError } = await supabaseAdmin
      .from('articles')
      .select(`
        id,
        title,
        slug,
        view_count,
        published_at,
        created_at,
        ga_view_count,
        ga_monthly_views,
        analytics_synced_at
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('view_count', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (directError) {
      console.error('Direct query error:', directError);
      return { success: false, error: '人気記事の取得に失敗しました' };
    }

    return { success: true, data: directData || [] };

  } catch (error) {
    console.error('Popular articles fetch error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '不明なエラー' 
    };
  }
}

/**
 * 今月の人気記事を取得する（今月の閲覧数順）
 */
export async function getPopularArticlesThisMonth(limit: number = 5): Promise<{
  success: boolean;
  data?: PopularArticleWithViews[];
  error?: string;
}> {
  try {
    // 1. まず関数を試す
    const { data: functionData, error: functionError } = await supabaseAdmin
      .rpc('get_popular_articles_this_month', { limit_count: limit });

    if (!functionError && functionData) {
      return { success: true, data: functionData };
    }

    // 2. 関数が失敗した場合、ビューを試す
    const { data: viewData, error: viewError } = await supabaseAdmin
      .from('popular_articles_this_month')
      .select('*')
      .limit(limit);

    if (!viewError && viewData) {
      return { success: true, data: viewData };
    }

    // 3. 両方失敗した場合、直接クエリ
    const { data: directData, error: directError } = await supabaseAdmin
      .from('articles')
      .select(`
        id,
        title,
        slug,
        view_count,
        published_at,
        created_at,
        ga_view_count,
        ga_monthly_views,
        analytics_synced_at
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('view_count', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (directError) {
      console.error('Direct query error:', {
        error: directError,
        code: directError?.code,
        message: directError?.message,
        details: directError?.details,
        hint: directError?.hint
      });
      return { success: false, error: `人気記事の取得に失敗しました: ${directError?.message || 'Unknown error'}` };
    }

    // monthly_viewsがない場合は0またはview_countを使用
    const dataWithMonthlyViews = (directData || []).map(article => ({
      ...article,
      monthly_views: article.view_count || 0
    }));

    return { success: true, data: dataWithMonthlyViews };

  } catch (error) {
    console.error('Monthly popular articles fetch error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '不明なエラー' 
    };
  }
}

/**
 * 特定記事の閲覧数を取得する
 */
export async function getArticleViewCount(articleId: string): Promise<{
  success: boolean;
  data?: { view_count: number };
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('view_count')
      .eq('id', articleId)
      .single();

    if (error) {
      console.error('Article view count fetch error:', error);
      return { success: false, error: '閲覧数の取得に失敗しました' };
    }

    return { success: true, data: { view_count: data?.view_count || 0 } };
  } catch (error) {
    console.error('Article view count fetch error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '不明なエラー' 
    };
  }
}

/**
 * 閲覧数の統計情報を取得する
 */
export async function getViewsStats(): Promise<{
  success: boolean;
  data?: {
    totalViews: number;
    todayViews: number;
    thisWeekViews: number;
    thisMonthViews: number;
  };
  error?: string;
}> {
  try {
    // 総閲覧数
    const { data: totalData, error: totalError } = await supabaseAdmin
      .from('articles')
      .select('view_count');

    if (totalError) throw totalError;

    const totalViews = totalData?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;

    // 今日の閲覧数
    const { count: todayViews, error: todayError } = await supabaseAdmin
      .from('article_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', new Date().toISOString().split('T')[0] + 'T00:00:00Z');

    if (todayError) throw todayError;

    // 今週の閲覧数
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { count: thisWeekViews, error: weekError } = await supabaseAdmin
      .from('article_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', weekStart.toISOString());

    if (weekError) throw weekError;

    // 今月の閲覧数
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { count: thisMonthViews, error: monthError } = await supabaseAdmin
      .from('article_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', monthStart.toISOString());

    if (monthError) throw monthError;

    return {
      success: true,
      data: {
        totalViews,
        todayViews: todayViews || 0,
        thisWeekViews: thisWeekViews || 0,
        thisMonthViews: thisMonthViews || 0,
      }
    };
  } catch (error) {
    console.error('Views stats fetch error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '統計情報の取得に失敗しました' 
    };
  }
}