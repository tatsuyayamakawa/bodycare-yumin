/**
 * 予約カレンダーページ
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar } from '@/components/booking/calendar';
import { getServiceAction } from '@/lib/actions/services';
import { getCurrentUser } from '@/lib/actions/auth';
import type { SquareService } from '@/lib/square/types';

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');

  const [service, setService] = useState<SquareService | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      // ユーザー情報を取得
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login?redirect=/booking/calendar' + (serviceId ? `?service=${serviceId}` : ''));
        return;
      }
      setUser(currentUser);

      // サービス情報を取得
      if (!serviceId) {
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
  }, [serviceId, router]);

  const handleSelectSlot = (datetime: string) => {
    // 予約確認画面へ遷移
    router.push(`/booking/confirm?service=${serviceId}&datetime=${encodeURIComponent(datetime)}`);
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

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || '施術メニューが見つかりません'}</p>
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">予約日時を選択</h1>
          <p className="text-gray-600">ご希望の日時をお選びください</p>
        </div>

        {/* 選択中のサービス */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">選択中の施術メニュー</h2>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(service.price, service.currency)}
              </p>
              <p className="text-sm text-gray-500">{formatDuration(service.duration)}</p>
            </div>
          </div>
        </div>

        {/* カレンダー */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Calendar
            serviceId={service.id}
            serviceDuration={service.duration}
            onSelectSlot={handleSelectSlot}
          />
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">ご予約の注意事項</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>予約は仮予約となります。確定後にメールでご連絡いたします</li>
            <li>前日までのキャンセルは無料です</li>
            <li>当日キャンセルの場合、キャンセル料が発生する場合がございます</li>
            <li>体調が優れない場合は、無理をせずご連絡ください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
