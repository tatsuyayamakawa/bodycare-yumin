/**
 * 予約一覧テーブルコンポーネント
 */

'use client';

import { useState } from 'react';
import { Check, X, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { approveBookingAction, rejectBookingAction, updateBookingNoteAction } from '@/lib/actions/admin-bookings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface BookingsTableProps {
  bookings: any[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onBookingUpdate: () => void;
}

export function BookingsTable({
  bookings,
  loading,
  pagination,
  onPageChange,
  onBookingUpdate,
}: BookingsTableProps) {
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    bookingId: string | null;
  }>({ open: false, bookingId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async (bookingId: string) => {
    if (!confirm('この予約を承認しますか？')) return;

    setProcessing(true);
    const result = await approveBookingAction(bookingId);

    if (result.success) {
      toast.success(result.message);
      onBookingUpdate();
    } else {
      toast.error(result.error);
    }

    setProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectDialog.bookingId || !rejectReason.trim()) {
      toast.error('拒否理由を入力してください');
      return;
    }

    setProcessing(true);
    const result = await rejectBookingAction({
      bookingId: rejectDialog.bookingId,
      reason: rejectReason,
    });

    if (result.success) {
      toast.success(result.message);
      setRejectDialog({ open: false, bookingId: null });
      setRejectReason('');
      onBookingUpdate();
    } else {
      toast.error(result.error);
    }

    setProcessing(false);
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
    const variants: Record<string, { text: string; variant: any }> = {
      pending: { text: '確認待ち', variant: 'default' },
      accepted: { text: '承認済み', variant: 'default' },
      declined: { text: '拒否', variant: 'destructive' },
      cancelled: { text: 'キャンセル', variant: 'secondary' },
      completed: { text: '完了', variant: 'default' },
    };

    const badge = variants[status] || { text: status, variant: 'default' };

    return <Badge variant={badge.variant}>{badge.text}</Badge>;
  };

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">読み込み中...</p>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600">予約がありません</p>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  予約日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  お客様
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  施術メニュー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  料金
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(booking.booking_datetime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(booking.booking_datetime)} ({booking.service_duration}分)
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.customers?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.customers?.email}
                    </div>
                    {booking.customers?.phone && (
                      <div className="text-sm text-gray-500">
                        {booking.customers.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.service_name}
                    </div>
                    {booking.customer_note && (
                      <div className="text-sm text-gray-500 mt-1">
                        <MessageSquare className="h-3 w-3 inline mr-1" />
                        {booking.customer_note}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(booking.service_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(booking.id)}
                          disabled={processing}
                          variant="default"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          承認
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setRejectDialog({ open: true, bookingId: booking.id })}
                          disabled={processing}
                          variant="destructive"
                        >
                          <X className="h-4 w-4 mr-1" />
                          拒否
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className="px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-700">
            全 {pagination.total} 件中 {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              前へ
            </Button>
            <div className="flex items-center px-4 py-2 text-sm">
              {pagination.page} / {pagination.totalPages}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              次へ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* 拒否ダイアログ */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, bookingId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>予約を拒否</DialogTitle>
            <DialogDescription>
              予約を拒否する理由を入力してください。お客様に通知されます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              placeholder="例: ご希望の日時が満席のため、別の日時をご提案させていただきます。"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, bookingId: null })}
              disabled={processing}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectReason.trim()}
            >
              {processing ? '処理中...' : '拒否する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
