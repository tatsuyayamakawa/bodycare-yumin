/**
 * 施術メニューカードコンポーネント
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { SquareService } from '@/lib/square/types';

interface ServiceCardProps {
  service: SquareService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  // 価格をフォーマット（Square APIは最小通貨単位で返す）
  const formatPrice = (amount: number, currency: string) => {
    const value = amount / 100; // 円の場合、100で割る
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  // 時間をフォーマット
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間`;
    } else {
      return `${mins}分`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 画像 */}
      <div className="relative h-48 bg-gray-200">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
          {service.name}
        </h3>

        {service.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {service.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(service.price, service.currency)}
            </p>
            <p className="text-sm text-gray-500">
              {formatDuration(service.duration)}
            </p>
          </div>

          <Link
            href={`/booking/services/${service.id}`}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            予約する
          </Link>
        </div>
      </div>
    </div>
  );
}
