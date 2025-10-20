/**
 * 施術メニュー一覧ページ
 */

import { Metadata } from 'next';
import { ServiceList } from '@/components/booking/service-list';

export const metadata: Metadata = {
  title: '施術メニュー | ボディケアゆみん',
  description: 'ボディケアゆみんの施術メニュー一覧です。お好みのメニューをお選びください。',
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            施術メニュー
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お客様の症状やご要望に合わせた施術メニューをご用意しております。
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {/* 施術メニュー一覧 */}
        <ServiceList />
      </div>
    </div>
  );
}
