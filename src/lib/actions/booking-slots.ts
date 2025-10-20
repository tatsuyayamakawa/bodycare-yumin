/**
 * 予約枠関連のServer Actions
 */

'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * 特定日の予約可能枠を取得
 */
export async function getAvailableSlotsAction(params: {
  date: string; // YYYY-MM-DD形式
  duration?: number; // 施術時間（分）、デフォルト30分
}): Promise<{
  success: boolean;
  slots?: Array<{
    datetime: string;
    isAvailable: boolean;
  }>;
  error?: string;
}> {
  try {
    const { date, duration = 30 } = params;

    const supabase = createClient();

    // generate_booking_slots関数を呼び出し
    const { data, error } = await supabase.rpc('generate_booking_slots', {
      target_date: date,
      slot_duration: duration,
    });

    if (error) {
      console.error('Failed to generate booking slots:', error);
      return {
        success: false,
        error: '予約可能枠の取得に失敗しました',
      };
    }

    const slots = (data || []).map((slot: any) => ({
      datetime: slot.slot_time,
      isAvailable: slot.is_available,
    }));

    return {
      success: true,
      slots,
    };
  } catch (error) {
    console.error('Failed to get available slots:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約可能枠の取得に失敗しました',
    };
  }
}

/**
 * 特定の時間枠が予約可能かチェック
 */
export async function checkSlotAvailabilityAction(params: {
  datetime: string;
  duration: number;
}): Promise<{
  success: boolean;
  isAvailable?: boolean;
  error?: string;
}> {
  try {
    const { datetime, duration } = params;

    const supabase = createClient();

    const { data, error } = await supabase.rpc('is_slot_available', {
      check_datetime: datetime,
      duration_minutes: duration,
    });

    if (error) {
      console.error('Failed to check slot availability:', error);
      return {
        success: false,
        error: '予約可能状態の確認に失敗しました',
      };
    }

    return {
      success: true,
      isAvailable: data as boolean,
    };
  } catch (error) {
    console.error('Failed to check slot availability:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約可能状態の確認に失敗しました',
    };
  }
}

/**
 * 営業時間を取得
 */
export async function getBusinessHoursAction(): Promise<{
  success: boolean;
  businessHours?: Array<{
    dayOfWeek: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
  }>;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Failed to get business hours:', error);
      return {
        success: false,
        error: '営業時間の取得に失敗しました',
      };
    }

    const businessHours = (data || []).map((row) => ({
      dayOfWeek: row.day_of_week,
      isOpen: row.is_open,
      openTime: row.open_time,
      closeTime: row.close_time,
      breakStartTime: row.break_start_time || undefined,
      breakEndTime: row.break_end_time || undefined,
    }));

    return {
      success: true,
      businessHours,
    };
  } catch (error) {
    console.error('Failed to get business hours:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '営業時間の取得に失敗しました',
    };
  }
}

/**
 * 休業日を取得
 */
export async function getHolidaysAction(params: {
  startDate: string;
  endDate: string;
}): Promise<{
  success: boolean;
  holidays?: Array<{
    date: string;
    reason?: string;
  }>;
  error?: string;
}> {
  try {
    const { startDate, endDate } = params;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('holidays')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Failed to get holidays:', error);
      return {
        success: false,
        error: '休業日の取得に失敗しました',
      };
    }

    const holidays = (data || []).map((row) => ({
      date: row.date,
      reason: row.reason || undefined,
    }));

    return {
      success: true,
      holidays,
    };
  } catch (error) {
    console.error('Failed to get holidays:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '休業日の取得に失敗しました',
    };
  }
}

/**
 * 予約設定を取得
 */
export async function getBookingSettingsAction(): Promise<{
  success: boolean;
  settings?: Record<string, string>;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('booking_settings')
      .select('*');

    if (error) {
      console.error('Failed to get booking settings:', error);
      return {
        success: false,
        error: '予約設定の取得に失敗しました',
      };
    }

    const settings: Record<string, string> = {};
    (data || []).forEach((row) => {
      settings[row.key] = row.value;
    });

    return {
      success: true,
      settings,
    };
  } catch (error) {
    console.error('Failed to get booking settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予約設定の取得に失敗しました',
    };
  }
}
