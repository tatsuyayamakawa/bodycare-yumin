/**
 * 管理画面用予約管理のServer Actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getBooking, updateBooking as updateSquareBooking } from '@/lib/square/bookings';

/**
 * 全予約を取得（管理者用）
 */
export async function getAllBookingsAction(params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const {
      status = 'all',
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = params || {};

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        customers!inner (
          name,
          email,
          phone
        )
      `, { count: 'exact' });

    // ステータスフィルター
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // 日付フィルター
    if (startDate) {
      query = query.gte('booking_datetime', startDate);
    }
    if (endDate) {
      query = query.lte('booking_datetime', endDate);
    }

    // ページネーション
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('booking_datetime', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Failed to get all bookings:', error);
      return {
        success: false,
        error: '予約一覧の取得に失敗しました',
      };
    }

    return {
      success: true,
      bookings: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error('Failed to get all bookings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約一覧の取得に失敗しました',
    };
  }
}

/**
 * 予約を承認
 */
export async function approveBookingAction(bookingId: string) {
  try {
    // Supabaseから予約を取得
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return {
        success: false,
        error: '予約が見つかりません',
      };
    }

    // Square予約を取得してバージョンを確認
    const squareBooking = await getBooking(booking.square_booking_id);
    if (!squareBooking) {
      return {
        success: false,
        error: 'Square予約が見つかりません',
      };
    }

    // Supabaseのステータスを更新
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'accepted',
        admin_note: '予約を承認しました',
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking status:', updateError);
      return {
        success: false,
        error: '予約ステータスの更新に失敗しました',
      };
    }

    // TODO: メール通知を送信

    revalidatePath('/admin/bookings');
    revalidatePath('/booking/my-bookings');

    return {
      success: true,
      message: '予約を承認しました',
    };
  } catch (error) {
    console.error('Failed to approve booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約の承認に失敗しました',
    };
  }
}

/**
 * 予約を拒否
 */
export async function rejectBookingAction(params: {
  bookingId: string;
  reason: string;
}) {
  try {
    const { bookingId, reason } = params;

    // Supabaseから予約を取得
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return {
        success: false,
        error: '予約が見つかりません',
      };
    }

    // Supabaseのステータスを更新
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'declined',
        admin_note: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking status:', updateError);
      return {
        success: false,
        error: '予約ステータスの更新に失敗しました',
      };
    }

    // TODO: メール通知を送信

    revalidatePath('/admin/bookings');
    revalidatePath('/booking/my-bookings');

    return {
      success: true,
      message: '予約を拒否しました',
    };
  } catch (error) {
    console.error('Failed to reject booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約の拒否に失敗しました',
    };
  }
}

/**
 * 管理者メモを更新
 */
export async function updateBookingNoteAction(params: {
  bookingId: string;
  note: string;
}) {
  try {
    const { bookingId, note } = params;

    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ admin_note: note })
      .eq('id', bookingId);

    if (error) {
      console.error('Failed to update booking note:', error);
      return {
        success: false,
        error: 'メモの更新に失敗しました',
      };
    }

    revalidatePath('/admin/bookings');

    return {
      success: true,
      message: 'メモを更新しました',
    };
  } catch (error) {
    console.error('Failed to update booking note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'メモの更新に失敗しました',
    };
  }
}

/**
 * 予約統計を取得
 */
export async function getBookingStatsAction(params?: {
  startDate?: string;
  endDate?: string;
}) {
  try {
    const { startDate, endDate } = params || {};

    let query = supabaseAdmin
      .from('bookings')
      .select('status, service_price, booking_datetime');

    if (startDate) {
      query = query.gte('booking_datetime', startDate);
    }
    if (endDate) {
      query = query.lte('booking_datetime', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to get booking stats:', error);
      return {
        success: false,
        error: '統計の取得に失敗しました',
      };
    }

    const bookings = data || [];

    // 統計を計算
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      accepted: bookings.filter(b => b.status === 'accepted').length,
      declined: bookings.filter(b => b.status === 'declined').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      totalRevenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.service_price, 0),
      expectedRevenue: bookings
        .filter(b => ['pending', 'accepted'].includes(b.status))
        .reduce((sum, b) => sum + b.service_price, 0),
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Failed to get booking stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '統計の取得に失敗しました',
    };
  }
}

/**
 * 今日の予約を取得
 */
export async function getTodayBookingsAction() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        customers!inner (
          name,
          email,
          phone
        )
      `)
      .gte('booking_datetime', today.toISOString())
      .lt('booking_datetime', tomorrow.toISOString())
      .in('status', ['pending', 'accepted'])
      .order('booking_datetime', { ascending: true });

    if (error) {
      console.error('Failed to get today bookings:', error);
      return {
        success: false,
        error: '本日の予約取得に失敗しました',
      };
    }

    return {
      success: true,
      bookings: data || [],
    };
  } catch (error) {
    console.error('Failed to get today bookings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '本日の予約取得に失敗しました',
    };
  }
}
