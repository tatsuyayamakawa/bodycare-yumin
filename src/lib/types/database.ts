/**
 * Supabase データベース型定義
 *
 * 予約システムで使用するテーブルの型定義
 * Supabase CLIで自動生成することも可能:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * 顧客情報テーブル
 */
export interface Customer {
  id: string
  user_id: string
  square_customer_id: string | null
  email: string
  name: string
  phone: string | null
  birthday: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  address: string | null
  notes: string | null
  synced_at: string | null
  created_at: string
  updated_at: string
}

/**
 * 予約情報テーブル
 */
export interface Booking {
  id: string
  user_id: string
  square_booking_id: string
  square_customer_id: string
  service_id: string
  service_name: string
  service_price: number
  service_duration: number
  booking_datetime: string
  end_datetime: string
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'
  customer_note: string | null
  admin_note: string | null
  cancellation_reason: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

/**
 * 営業時間テーブル
 */
export interface BusinessHour {
  id: string
  day_of_week: number // 0=日曜, 1=月曜, ..., 6=土曜
  is_open: boolean
  open_time: string // HH:MM形式
  close_time: string // HH:MM形式
  break_start_time: string | null
  break_end_time: string | null
  created_at: string
  updated_at: string
}

/**
 * 休業日テーブル
 */
export interface Holiday {
  id: string
  date: string // YYYY-MM-DD形式
  reason: string | null
  created_at: string
}

/**
 * 予約枠キャッシュテーブル
 */
export interface BookingSlot {
  id: string
  slot_datetime: string
  duration_minutes: number
  is_available: boolean
  booking_id: string | null
  created_at: string
  updated_at: string
}

/**
 * 予約設定テーブル
 */
export interface BookingSetting {
  id: string
  key: string
  value: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Database型定義（Supabase用）
 */
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
      }
      business_hours: {
        Row: BusinessHour
        Insert: Omit<BusinessHour, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BusinessHour, 'id' | 'created_at' | 'updated_at'>>
      }
      holidays: {
        Row: Holiday
        Insert: Omit<Holiday, 'id' | 'created_at'>
        Update: Partial<Omit<Holiday, 'id' | 'created_at'>>
      }
      booking_slots: {
        Row: BookingSlot
        Insert: Omit<BookingSlot, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BookingSlot, 'id' | 'created_at' | 'updated_at'>>
      }
      booking_settings: {
        Row: BookingSetting
        Insert: Omit<BookingSetting, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BookingSetting, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      upcoming_bookings: {
        Row: Booking & {
          customer_name: string
          customer_email: string
          customer_phone: string | null
        }
      }
      past_bookings: {
        Row: Booking & {
          customer_name: string
          customer_email: string
          customer_phone: string | null
        }
      }
    }
    Functions: {
      generate_booking_slots: {
        Args: {
          target_date: string
          slot_duration?: number
        }
        Returns: {
          slot_time: string
          is_available: boolean
        }[]
      }
      is_slot_available: {
        Args: {
          check_datetime: string
          duration_minutes: number
        }
        Returns: boolean
      }
    }
  }
}
