/**
 * 予約管理メインコンポーネント
 */

'use client';

import { useEffect, useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { getAllBookingsAction, getBookingStatsAction } from '@/lib/actions/admin-bookings';
import { BookingsTable } from './bookings-table';
import { BookingFilters } from './booking-filters';
import { BookingStats } from './booking-stats';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  // 予約データを読み込み
  const loadBookings = async () => {
    setLoading(true);
    setError(null);

    const result = await getAllBookingsAction({
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    });

    if (result.success) {
      setBookings(result.bookings || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } else {
      setError(result.error || '予約の取得に失敗しました');
    }

    setLoading(false);
  };

  // 統計データを読み込み
  const loadStats = async () => {
    const result = await getBookingStatsAction({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    if (result.success && result.stats) {
      setStats(result.stats);
    }
  };

  // 初回読み込みとフィルター変更時に再読み込み
  useEffect(() => {
    loadBookings();
    loadStats();
  }, [filters, pagination.page]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // ページを1に戻す
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleBookingUpdate = () => {
    // 予約が更新されたら再読み込み
    loadBookings();
    loadStats();
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">予約管理</h1>
          <p className="text-gray-600 mt-1">予約の確認・承認・管理</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </span>
        </div>
      </div>

      {/* 統計カード */}
      {stats && <BookingStats stats={stats} />}

      {/* フィルター */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold">フィルター</h2>
        </div>
        <BookingFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Card>

      {/* タブと予約一覧 */}
      <Tabs value={filters.status} onValueChange={(value) => handleFilterChange({ ...filters, status: value })}>
        <TabsList>
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">確認待ち</TabsTrigger>
          <TabsTrigger value="accepted">承認済み</TabsTrigger>
          <TabsTrigger value="completed">完了</TabsTrigger>
          <TabsTrigger value="cancelled">キャンセル</TabsTrigger>
          <TabsTrigger value="declined">拒否</TabsTrigger>
        </TabsList>

        <TabsContent value={filters.status} className="mt-6">
          {error && (
            <Card className="p-6 bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          <BookingsTable
            bookings={bookings}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onBookingUpdate={handleBookingUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
