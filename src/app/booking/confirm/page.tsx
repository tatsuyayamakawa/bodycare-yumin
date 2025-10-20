/**
 * 予約確認ページ
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getServiceAction } from '@/lib/actions/services';
import { getCurrentUser } from '@/lib/actions/auth';
import { createBookingAction } from '@/lib/actions/bookings';
import type { SquareService } from '@/lib/square/types';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const datetime = searchParams.get('datetime');

  const [service, setService] = useState<SquareService | null>(null);
  const [user, setUser] = useState<any>(null);
  const [customerNote, setCustomerNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      // ユーザー情報を取得
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login?redirect=/booking/confirm' +
          (serviceId ? `?service=${serviceId}` : '') +
          (datetime ? `&datetime=${datetime}` : ''));
        return;
      }
      setUser(currentUser);

      // サービス情報を取得
      if (!serviceId || !datetime) {
        router.push('/booking/services');
        return;
      }

      const result = await getServiceAction(serviceId);
      if (result.success && result.service) {
        setService(result.service);
      } else {
        setError(result.error || '施術メニューが見つかりません');
      }

      setLoading(false);
    }

    loadData();
  }, [serviceId, datetime, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceId || !datetime) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await createBookingAction({
      serviceId,
      datetime,
      customerNote: customerNote.trim() || undefined,
    });

    if (result.success) {
      router.push(`/booking/complete?id=${result.bookingId}`);
    } else {
      setError(result.error || '予約の作成に失敗しました');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !service || !datetime) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || '予約情報が正しくありません'}</p>
            <button
              onClick={() => router.push('/booking/services')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              メニュー一覧に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 日時をフォーマット
  const bookingDate = new Date(datetime);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 価格をフォーマット
  const formatPrice = (amount: number, currency: string) => {
    const value = amount / 100;
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  // 時間をフォーマット
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間`;
    } else {
      return `${mins}分`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">予約内容の確認</h1>
          <p className="text-gray-600">内容をご確認の上、予約を確定してください</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 予約内容 */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">予約内容</h2>

            <div className="space-y-4">
              {/* 施術メニュー */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">施術メニュー</p>
                <p className="text-lg font-bold text-gray-900">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
              </div>

              {/* 日時 */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">予約日時</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(bookingDate)}
                </p>
                <p className="text-lg font-bold text-primary">
                  {formatTime(bookingDate)} 〜
                </p>
              </div>

              {/* 料金・時間 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">料金</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(service.price, service.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">施術時間</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(service.duration)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* お客様情報 */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">お客様情報</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">お名前</p>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">メールアドレス</p>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-gray-500">電話番号</p>
                  <p className="text-lg text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* 備考欄 */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">備考・ご要望</h2>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              placeholder="特別なご要望やお伝えしたいことがあればご記入ください（任意）"
            />
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">ご予約前のご確認</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>予約は仮予約となります。確定後にメールでご連絡いたします</li>
              <li>前日までのキャンセルは無料です</li>
              <li>当日キャンセルの場合、キャンセル料が発生する場合がございます</li>
              <li>ご予約時間の10分前までにご来店ください</li>
            </ul>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
            >
              {submitting ? '予約中...' : '予約を確定する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
