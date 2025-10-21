/**
 * 管理画面 - 予約管理ページ
 */

import { requireAdminAuth } from '@/lib/actions/admin-auth';
import { BookingsManagement } from './_components/bookings-management';

export const metadata = {
  title: '予約管理 | 管理画面',
  description: '予約の確認・承認・管理を行います',
};

export default async function AdminBookingsPage() {
  await requireAdminAuth();

  return <BookingsManagement />;
}
