/**
 * 施術メニュー詳細ページ
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getService } from '@/lib/square/catalog';

interface ServiceDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const service = await getService(params.id);

  if (!service) {
    return {
      title: '施術メニューが見つかりません',
    };
  }

  return {
    title: `${service.name} | 施術メニュー | ボディケアゆみん`,
    description: service.description || `${service.name}の詳細ページです。`,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = await getService(params.id);

  if (!service) {
    notFound();
  }

  // 価格をフォーマット
  const formatPrice = (amount: number, currency: string) => {
    const value = amount / 100;
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* パンくずリスト */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/booking/services" className="hover:text-primary">
            施術メニュー
          </Link>
          <span>/</span>
          <span className="text-gray-900">{service.name}</span>
        </nav>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 画像 */}
          <div className="relative h-96 bg-gray-200">
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
                  className="w-32 h-32"
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

          {/* 詳細情報 */}
          <div className="p-8 space-y-6">
            {/* カテゴリ */}
            {service.categoryName && (
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {service.categoryName}
              </div>
            )}

            {/* タイトル */}
            <h1 className="text-3xl font-bold text-gray-900">
              {service.name}
            </h1>

            {/* 説明 */}
            {service.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {/* 料金・時間 */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">料金</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(service.price, service.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">施術時間</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatDuration(service.duration)}
                </p>
              </div>
            </div>

            {/* 予約ボタン */}
            <div className="flex gap-4">
              <Link
                href={`/booking/calendar?service=${service.id}`}
                className="flex-1 py-4 bg-primary text-white text-center rounded-lg hover:bg-primary/90 transition-colors font-bold text-lg"
              >
                この施術を予約する
              </Link>
              <Link
                href="/booking/services"
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                メニュー一覧に戻る
              </Link>
            </div>

            {/* 注意事項 */}
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">ご予約前のご注意</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>初めてのお客様は、カウンセリングのお時間を追加でいただく場合がございます</li>
                <li>体調が優れない場合は、無理をせずご連絡ください</li>
                <li>キャンセルは前日までにお願いいたします</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
