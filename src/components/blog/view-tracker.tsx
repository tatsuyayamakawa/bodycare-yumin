'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // コンポーネントマウント時に閲覧数を記録
    const recordView = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('View tracking result:', result);
        }
      } catch (error) {
        // エラーが発生してもユーザー体験を阻害しない
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to record view:', error);
        }
      }
    };

    // 少し遅らせて実行（ページ読み込み完了後）
    const timer = setTimeout(recordView, 1000);

    return () => clearTimeout(timer);
  }, [slug]);

  // このコンポーネントは何も表示しない
  return null;
}