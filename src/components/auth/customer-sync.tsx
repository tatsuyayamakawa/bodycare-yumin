/**
 * Square顧客同期コンポーネント
 * 
 * ログイン後に自動的にSquare顧客と連携する
 */

'use client';

import { useEffect, useState } from 'react';
import { linkSquareCustomerAction } from '@/lib/actions/customers';

export function CustomerSync() {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function syncCustomer() {
      // 既に同期済みまたは同期中の場合はスキップ
      if (synced || syncing) {
        return;
      }

      setSyncing(true);
      setError(null);

      try {
        const result = await linkSquareCustomerAction();

        if (result.success) {
          setSynced(true);
        } else {
          setError(result.error || '顧客情報の同期に失敗しました');
        }
      } catch (err) {
        console.error('Customer sync error:', err);
        setError('顧客情報の同期中にエラーが発生しました');
      } finally {
        setSyncing(false);
      }
    }

    syncCustomer();
  }, [synced, syncing]);

  // 同期中の表示
  if (syncing) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-700">顧客情報を同期中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">同期エラー</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setSyncing(false);
              setSynced(false);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // 同期完了時は何も表示しない
  return null;
}
