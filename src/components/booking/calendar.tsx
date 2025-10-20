/**
 * 予約カレンダーコンポーネント
 */

'use client';

import { useState, useEffect } from 'react';
import { getAvailableSlotsAction, getHolidaysAction, getBusinessHoursAction } from '@/lib/actions/booking-slots';

interface CalendarProps {
  serviceId: string;
  serviceDuration: number;
  onSelectSlot: (datetime: string) => void;
}

export function Calendar({ serviceId, serviceDuration, onSelectSlot }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Array<{ datetime: string; isAvailable: boolean }>>([]);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [businessHours, setBusinessHours] = useState<Record<number, { isOpen: boolean }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 営業時間と休業日を取得
  useEffect(() => {
    async function loadSettings() {
      // 営業時間
      const bhResult = await getBusinessHoursAction();
      if (bhResult.success && bhResult.businessHours) {
        const bhMap: Record<number, { isOpen: boolean }> = {};
        bhResult.businessHours.forEach((bh) => {
          bhMap[bh.dayOfWeek] = { isOpen: bh.isOpen };
        });
        setBusinessHours(bhMap);
      }

      // 休業日（今月から3ヶ月先まで）
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const holidayResult = await getHolidaysAction({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      if (holidayResult.success && holidayResult.holidays) {
        setHolidays(new Set(holidayResult.holidays.map((h) => h.date)));
      }
    }

    loadSettings();
  }, []);

  // 日付選択時に予約可能枠を取得
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    async function loadSlots() {
      setLoading(true);
      setError(null);

      const result = await getAvailableSlotsAction({
        date: selectedDate,
        duration: serviceDuration,
      });

      if (result.success && result.slots) {
        setAvailableSlots(result.slots);
      } else {
        setError(result.error || '予約可能枠の取得に失敗しました');
      }

      setLoading(false);
    }

    loadSlots();
  }, [selectedDate, serviceDuration]);

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0 = 日曜日

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 前月の日付で埋める
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // 当月の日付
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      const isPast = date < today;
      const isHoliday = holidays.has(dateString);
      const isClosed = businessHours[dayOfWeek]?.isOpen === false;
      const isDisabled = isPast || isHoliday || isClosed;

      days.push({
        date: day,
        dateString,
        isDisabled,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: dateString === selectedDate,
      });
    }

    return days;
  };

  const days = generateCalendarDays();
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  // 前月へ
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  // 次月へ
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      {/* カレンダーヘッダー */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-xl font-bold">
          {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {/* 曜日ヘッダー */}
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}

        {/* 日付 */}
        {days.map((day, index) =>
          day ? (
            <button
              key={index}
              onClick={() => !day.isDisabled && setSelectedDate(day.dateString)}
              disabled={day.isDisabled}
              className={`
                aspect-square p-2 rounded-lg text-center transition-colors
                ${day.isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary/10 cursor-pointer'}
                ${day.isToday ? 'ring-2 ring-primary' : ''}
                ${day.isSelected ? 'bg-primary text-white hover:bg-primary' : ''}
              `}
            >
              {day.date}
            </button>
          ) : (
            <div key={index} />
          )
        )}
      </div>

      {/* 時間枠選択 */}
      {selectedDate && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4">
            {selectedDate}の予約可能時間
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              {error}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-center">
              この日は予約枠がありません
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableSlots.map((slot) => {
                const time = new Date(slot.datetime).toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <button
                    key={slot.datetime}
                    onClick={() => slot.isAvailable && onSelectSlot(slot.datetime)}
                    disabled={!slot.isAvailable}
                    className={`
                      py-3 px-4 rounded-lg text-sm font-medium transition-colors
                      ${
                        slot.isAvailable
                          ? 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
