/**
 * 予約完了ページ
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getBookingDetailAction } from '@/lib/actions/bookings';

export default function CompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) {
        router.push('/booking/services');
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getBookingDetailAction(bookingId);

      if (result.success && result.booking) {
        setBooking(result.booking);
      } else {
        setError(result.error || '予約情報が見つかりません');
      }

      setLoading(false);
    }

    loadBooking();
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || '予約情報が見つかりません'}</p>
            <Link
              href="/booking/services"
              className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              メニュー一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.booking_datetime);
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

  const formatPrice = (amount: number) => {
    const value = amount / 100;
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 完了メッセージ */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            ご予約を受け付けました
          </h1>
          <p className="text-lg text-gray-600">
            予約確認メールをお送りしましたのでご確認ください
          </p>
        </div>

        {/* 予約詳細 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">予約内容</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">予約番号</p>
              <p className="text-lg font-mono text-gray-900">{booking.id}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-1">施術メニュー</p>
              <p className="text-lg font-bold text-gray-900">{booking.service_name}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-1">予約日時</p>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(bookingDate)}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatTime(bookingDate)} 〜
              </p>
            </div>

            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">料金</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(booking.service_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">施術時間</p>
                <p className="text-xl font-bold text-gray-900">
                  {booking.service_duration}分
                </p>
              </div>
            </div>

            {booking.customer_note && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">ご要望</p>
                <p className="text-gray-900 whitespace-pre-wrap">{booking.customer_note}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-1">ステータス</p>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                確認待ち
              </span>
            </div>
          </div>
        </div>

        {/* 次のステップ */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">今後の流れ</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>予約内容を確認後、メールで予約確定のご連絡をいたします</li>
            <li>予約日の前日に、リマインダーメールをお送りします</li>
            <li>予約時間の10分前までにご来店ください</li>
          </ol>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">キャンセルについて</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>前日までのキャンセルは無料です</li>
            <li>当日キャンセルの場合、キャンセル料が発生する場合がございます</li>
            <li>キャンセルは「マイページ」から行えます</li>
          </ul>
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          <Link
            href="/booking/my-bookings"
            className="block w-full py-4 bg-primary text-white text-center rounded-lg hover:bg-primary/90 transition-colors font-bold"
          >
            予約一覧を見る
          </Link>
          <Link
            href="/booking/services"
            className="block w-full py-4 border-2 border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            他の施術を予約する
          </Link>
          <Link
            href="/"
            className="block w-full py-4 text-gray-600 text-center hover:text-gray-900 transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
