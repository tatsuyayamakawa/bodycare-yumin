/**
 * マイ予約一覧ページ
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth';
import { getMyBookingsAction, cancelBookingAction } from '@/lib/actions/bookings';

export default function MyBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login?redirect=/booking/my-bookings');
        return;
      }
      setUser(currentUser);
    }
    loadUser();
  }, [router]);

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      setError(null);

      const result = await getMyBookingsAction({ status: filter });

      if (result.success && result.bookings) {
        setBookings(result.bookings);
      } else {
        setError(result.error || '予約一覧の取得に失敗しました');
      }

      setLoading(false);
    }

    if (user) {
      loadBookings();
    }
  }, [user, filter]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('この予約をキャンセルしてもよろしいですか？')) {
      return;
    }

    setCancellingId(bookingId);

    const result = await cancelBookingAction({ bookingId });

    if (result.success) {
      // 予約一覧を再読み込み
      const reloadResult = await getMyBookingsAction({ status: filter });
      if (reloadResult.success && reloadResult.bookings) {
        setBookings(reloadResult.bookings);
      }
    } else {
      alert(result.error || '予約のキャンセルに失敗しました');
    }

    setCancellingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      pending: { text: '確認待ち', className: 'bg-yellow-100 text-yellow-800' },
      accepted: { text: '確定', className: 'bg-green-100 text-green-800' },
      declined: { text: '拒否', className: 'bg-red-100 text-red-800' },
      cancelled: { text: 'キャンセル', className: 'bg-gray-100 text-gray-800' },
      completed: { text: '完了', className: 'bg-blue-100 text-blue-800' },
    };

    const badge = badges[status] || { text: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const canCancel = (booking: any) => {
    const bookingDate = new Date(booking.booking_datetime);
    const now = new Date();
    const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return (
      (booking.status === 'pending' || booking.status === 'accepted') &&
      hoursUntil >= 24
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">予約一覧</h1>
          <Link
            href="/booking/services"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            新規予約
          </Link>
        </div>

        {/* フィルター */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'upcoming'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            予約中
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'past'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            過去の予約
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'cancelled'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            キャンセル済み
          </button>
        </div>

        {/* 予約一覧 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">予約はありません</p>
            <Link
              href="/booking/services"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              予約する
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {booking.service_name}
                    </h3>
                    <p className="text-sm text-gray-500">予約番号: {booking.id.slice(0, 8)}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">日時</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(booking.booking_datetime)}
                    </p>
                    <p className="text-lg font-medium text-primary">
                      {formatTime(booking.booking_datetime)} 〜
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">料金・時間</p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(booking.service_price)}
                    </p>
                    <p className="text-sm text-gray-600">{booking.service_duration}分</p>
                  </div>
                </div>

                {booking.customer_note && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500 mb-1">ご要望</p>
                    <p className="text-sm text-gray-900">{booking.customer_note}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {canCancel(booking) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === booking.id ? 'キャンセル中...' : 'キャンセル'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
