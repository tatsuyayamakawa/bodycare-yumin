/**
 * 予約関連のServer Actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createClientHelper } from '@/lib/supabase/client-helpers';
import { createBooking, cancelBooking, getBooking, listCustomerBookings } from '@/lib/square/bookings';
import { getService } from '@/lib/square/catalog';
import { linkSquareCustomerAction } from './customers';

/**
 * 新しい予約を作成
 */
export async function createBookingAction(params: {
  serviceId: string;
  datetime: string;
  customerNote?: string;
}): Promise<{
  success: boolean;
  bookingId?: string;
  error?: string;
}> {
  try {
    const { serviceId, datetime, customerNote } = params;

    // 現在のユーザーを取得
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    // Square顧客と連携（まだの場合は作成）
    const linkResult = await linkSquareCustomerAction();
    if (!linkResult.success || !linkResult.squareCustomerId) {
      return {
        success: false,
        error: linkResult.error || 'Square顧客との連携に失敗しました',
      };
    }

    const squareCustomerId = linkResult.squareCustomerId;

    // サービス情報を取得
    const service = await getService(serviceId);
    if (!service) {
      return {
        success: false,
        error: '施術メニューが見つかりません',
      };
    }

    // Square APIで予約を作成
    const squareBooking = await createBooking({
      customerId: squareCustomerId,
      serviceVariationId: serviceId,
      startAt: datetime,
      customerNote,
    });

    // 終了時刻を計算
    const startDate = new Date(datetime);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);

    // Supabaseに予約を保存
    const adminSupabase = createClient();
    const { error: insertError } = await adminSupabase
      .from('bookings')
      .insert({
        user_id: user.id,
        square_booking_id: squareBooking.id,
        square_customer_id: squareCustomerId,
        service_id: serviceId,
        service_name: service.name,
        service_price: service.price,
        service_duration: service.duration,
        booking_datetime: datetime,
        end_datetime: endDate.toISOString(),
        status: squareBooking.status.toLowerCase(),
        customer_note: customerNote,
      });

    if (insertError) {
      console.error('Failed to save booking to database:', insertError);
      // Square予約は作成済みだが、DBへの保存に失敗
      // この場合でも予約IDは返す（後でWebhookで同期される）
    }

    revalidatePath('/booking/calendar');
    revalidatePath('/booking/my-bookings');

    return {
      success: true,
      bookingId: squareBooking.id,
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約の作成に失敗しました',
    };
  }
}

/**
 * 予約をキャンセル
 */
export async function cancelBookingAction(params: {
  bookingId: string;
  reason?: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { bookingId, reason } = params;

    // 現在のユーザーを取得
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    // Supabaseから予約を取得
    const adminSupabase = createClient();
    const { data: booking, error: bookingError } = await adminSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return {
        success: false,
        error: '予約が見つかりません',
      };
    }

    // キャンセル期限チェック（設定から取得）
    const { data: settings } = await adminSupabase
      .from('booking_settings')
      .select('value')
      .eq('key', 'cancellation_deadline_hours')
      .single();

    const deadlineHours = settings ? parseInt(settings.value) : 24;
    const bookingDate = new Date(booking.booking_datetime);
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < deadlineHours) {
      return {
        success: false,
        error: `予約の${deadlineHours}時間前までにキャンセルしてください`,
      };
    }

    // Square予約情報を取得
    const squareBooking = await getBooking(booking.square_booking_id);
    if (!squareBooking) {
      return {
        success: false,
        error: 'Square予約が見つかりません',
      };
    }

    // Squareでキャンセル
    await cancelBooking(booking.square_booking_id, squareBooking.version);

    // Supabaseを更新
    const { error: updateError } = await adminSupabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking status:', updateError);
    }

    revalidatePath('/booking/my-bookings');

    return { success: true };
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約のキャンセルに失敗しました',
    };
  }
}

/**
 * ユーザーの予約一覧を取得
 */
export async function getMyBookingsAction(params?: {
  status?: 'upcoming' | 'past' | 'cancelled';
}): Promise<{
  success: boolean;
  bookings?: Array<any>;
  error?: string;
}> {
  try {
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    const adminSupabase = createClient();
    let query = adminSupabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id);

    // ステータスでフィルタ
    const now = new Date().toISOString();
    if (params?.status === 'upcoming') {
      query = query
        .gte('booking_datetime', now)
        .in('status', ['pending', 'accepted']);
    } else if (params?.status === 'past') {
      query = query
        .or(`booking_datetime.lt.${now},status.in.(completed)`);
    } else if (params?.status === 'cancelled') {
      query = query.eq('status', 'cancelled');
    }

    const { data, error } = await query.order('booking_datetime', { ascending: false });

    if (error) {
      console.error('Failed to get bookings:', error);
      return {
        success: false,
        error: '予約一覧の取得に失敗しました',
      };
    }

    return {
      success: true,
      bookings: data || [],
    };
  } catch (error) {
    console.error('Failed to get my bookings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約一覧の取得に失敗しました',
    };
  }
}

/**
 * 予約詳細を取得
 */
export async function getBookingDetailAction(bookingId: string): Promise<{
  success: boolean;
  booking?: any;
  error?: string;
}> {
  try {
    const supabase = createClientHelper();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    const adminSupabase = createClient();
    const { data, error } = await adminSupabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: '予約が見つかりません',
      };
    }

    return {
      success: true,
      booking: data,
    };
  } catch (error) {
    console.error('Failed to get booking detail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約詳細の取得に失敗しました',
    };
  }
}
