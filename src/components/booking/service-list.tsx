/**
 * 施術メニュー一覧コンポーネント
 */

'use client';

import { useState, useEffect } from 'react';
import { getServicesByCategoryAction } from '@/lib/actions/services';
import type { SquareService } from '@/lib/square/types';
import { ServiceCard } from './service-card';

export function ServiceList() {
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, SquareService[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      setError(null);

      const result = await getServicesByCategoryAction();

      if (result.success && result.servicesByCategory) {
        setServicesByCategory(result.servicesByCategory);
      } else {
        setError(result.error || '施術メニューの取得に失敗しました');
      }

      setLoading(false);
    }

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          再読み込み
        </button>
      </div>
    );
  }

  const categories = Object.keys(servicesByCategory).sort((a, b) => {
    // "その他"を最後に
    if (a === 'その他') return 1;
    if (b === 'その他') return -1;
    return a.localeCompare(b, 'ja');
  });

  if (categories.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">施術メニューが登録されていません</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section key={category} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesByCategory[category].map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
