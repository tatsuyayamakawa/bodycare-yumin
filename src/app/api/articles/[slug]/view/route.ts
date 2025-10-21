import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // リクエストからメタデータを取得
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    
    // IPアドレスを取得（Vercelの場合）
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIP || undefined;

    // 記事IDを取得
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (articleError || !article) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    // 閲覧数を増加（データベース関数を使用）
    const { data, error } = await supabaseAdmin.rpc(
      'increment_article_view_count',
      {
        p_article_id: article.id,
        p_ip_address: ipAddress,
        p_user_agent: userAgent,
        p_referrer: referrer
      }
    );

    if (error) {
      console.error('View count increment error:', error);
      return NextResponse.json(
        { error: '閲覧数の記録に失敗しました' },
        { status: 500 }
      );
    }

    // 重複チェックの結果を返す
    const wasIncremented = data as boolean;

    return NextResponse.json({
      success: true,
      incremented: wasIncremented,
      message: wasIncremented ? '閲覧数を記録しました' : '重複アクセスのため記録されませんでした'
    });

  } catch (error) {
    console.error('Article view API error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}