/**
 * Square Bookings API
 *
 * 予約の作成・管理を行います
 */

import { SQUARE_LOCATION_ID, squareClient } from "./client";
import type { BookingStatus, SquareBooking } from "./types";
import { handleSquareError } from "./utils";

/**
 * 新しい予約を作成
 *
 * @param params - 予約情報
 * @returns 作成された予約
 */
export async function createBooking(params: {
  customerId: string;
  serviceVariationId: string;
  startAt: string; // ISO 8601形式
  customerNote?: string;
}): Promise<SquareBooking> {
  try {
    const { customerId, serviceVariationId, startAt, customerNote } = params;

    if (!SQUARE_LOCATION_ID) {
      throw new Error("SQUARE_LOCATION_ID is not configured");
    }

    const { result } = await squareClient.bookingsApi.createBooking({
      booking: {
        customerId,
        serviceVariationId,
        startAt,
        locationId: SQUARE_LOCATION_ID,
        customerNote,
      },
    });

    if (!result.booking) {
      throw new Error("予約の作成に失敗しました");
    }

    const booking = result.booking;
    return {
      id: booking.id!,
      version: booking.version!,
      status: booking.status as BookingStatus,
      customerId: booking.customerId!,
      serviceVariationId: booking.appointmentSegments![0].serviceVariationId!,
      startAt: booking.startAt!,
      locationId: booking.locationId!,
      customerNote: booking.customerNote,
      sellerNote: booking.sellerNote,
      createdAt: booking.createdAt!,
      updatedAt: booking.updatedAt!,
    };
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 予約を取得
 *
 * @param bookingId - Square予約ID
 * @returns 予約情報
 */
export async function getBooking(
  bookingId: string,
): Promise<SquareBooking | null> {
  try {
    const { result } =
      await squareClient.bookingsApi.retrieveBooking(bookingId);

    if (!result.booking) {
      return null;
    }

    const booking = result.booking;
    return {
      id: booking.id!,
      version: booking.version!,
      status: booking.status as BookingStatus,
      customerId: booking.customerId!,
      serviceVariationId: booking.appointmentSegments![0].serviceVariationId!,
      startAt: booking.startAt!,
      locationId: booking.locationId!,
      customerNote: booking.customerNote,
      sellerNote: booking.sellerNote,
      createdAt: booking.createdAt!,
      updatedAt: booking.updatedAt!,
    };
  } catch (error) {
    console.error("Failed to get booking:", error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 予約をキャンセル
 *
 * @param bookingId - Square予約ID
 * @param version - 予約のバージョン
 * @returns キャンセルされた予約
 */
export async function cancelBooking(
  bookingId: string,
  version: number,
): Promise<SquareBooking> {
  try {
    const { result } = await squareClient.bookingsApi.cancelBooking(bookingId, {
      bookingVersion: version,
    });

    if (!result.booking) {
      throw new Error("予約のキャンセルに失敗しました");
    }

    const booking = result.booking;
    return {
      id: booking.id!,
      version: booking.version!,
      status: booking.status as BookingStatus,
      customerId: booking.customerId!,
      serviceVariationId: booking.appointmentSegments![0].serviceVariationId!,
      startAt: booking.startAt!,
      locationId: booking.locationId!,
      customerNote: booking.customerNote,
      sellerNote: booking.sellerNote,
      createdAt: booking.createdAt!,
      updatedAt: booking.updatedAt!,
    };
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 予約を更新
 *
 * @param bookingId - Square予約ID
 * @param params - 更新情報
 * @returns 更新された予約
 */
export async function updateBooking(
  bookingId: string,
  params: {
    version: number;
    startAt?: string;
    customerNote?: string;
  },
): Promise<SquareBooking> {
  try {
    const { version, startAt, customerNote } = params;

    const { result } = await squareClient.bookingsApi.updateBooking(bookingId, {
      booking: {
        version,
        startAt,
        customerNote,
      },
    });

    if (!result.booking) {
      throw new Error("予約の更新に失敗しました");
    }

    const booking = result.booking;
    return {
      id: booking.id!,
      version: booking.version!,
      status: booking.status as BookingStatus,
      customerId: booking.customerId!,
      serviceVariationId: booking.appointmentSegments![0].serviceVariationId!,
      startAt: booking.startAt!,
      locationId: booking.locationId!,
      customerNote: booking.customerNote,
      sellerNote: booking.sellerNote,
      createdAt: booking.createdAt!,
      updatedAt: booking.updatedAt!,
    };
  } catch (error) {
    console.error("Failed to update booking:", error);
    throw new Error(handleSquareError(error));
  }
}

/**
 * 顧客の予約一覧を取得
 *
 * @param customerId - Square顧客ID
 * @param params - フィルター条件
 * @returns 予約の配列
 */
export async function listCustomerBookings(
  customerId: string,
  params?: {
    startAtMin?: string;
    startAtMax?: string;
  },
): Promise<SquareBooking[]> {
  try {
    if (!SQUARE_LOCATION_ID) {
      throw new Error("SQUARE_LOCATION_ID is not configured");
    }

    const { result } = await squareClient.bookingsApi.listBookings({
      locationId: SQUARE_LOCATION_ID,
      customerId,
      startAtMin: params?.startAtMin,
      startAtMax: params?.startAtMax,
    });

    if (!result.bookings || result.bookings.length === 0) {
      return [];
    }

    return result.bookings.map((booking) => ({
      id: booking.id!,
      version: booking.version!,
      status: booking.status as BookingStatus,
      customerId: booking.customerId!,
      serviceVariationId: booking.appointmentSegments![0].serviceVariationId!,
      startAt: booking.startAt!,
      locationId: booking.locationId!,
      customerNote: booking.customerNote,
      sellerNote: booking.sellerNote,
      createdAt: booking.createdAt!,
      updatedAt: booking.updatedAt!,
    }));
  } catch (error) {
    console.error("Failed to list customer bookings:", error);
    throw new Error(handleSquareError(error));
  }
}
