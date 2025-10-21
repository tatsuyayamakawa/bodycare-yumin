/**
 * 予約フィルターコンポーネント
 */

'use client';

import { Button } from '@/components/ui/button';

interface BookingFiltersProps {
  filters: {
    status: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filters: BookingFiltersProps['filters']) => void;
}

export function BookingFilters({ filters, onFilterChange }: BookingFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      status: 'all',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          開始日
        </label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          終了日
        </label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="flex items-end">
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          フィルターをリセット
        </Button>
      </div>
    </div>
  );
}
