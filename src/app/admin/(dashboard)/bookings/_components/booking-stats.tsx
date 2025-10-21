/**
 * 予約統計カードコンポーネント
 */

'use client';

import { Calendar, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BookingStatsProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
    cancelled: number;
    completed: number;
    totalRevenue: number;
    expectedRevenue: number;
  };
}

export function BookingStats({ stats }: BookingStatsProps) {
  const formatPrice = (amount: number) => {
    const value = amount / 100;
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(value);
  };

  const statCards = [
    {
      label: '総予約数',
      value: stats.total,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '確認待ち',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: '承認済み',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '完了',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'キャンセル/拒否',
      value: stats.cancelled + stats.declined,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: '確定売上',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
