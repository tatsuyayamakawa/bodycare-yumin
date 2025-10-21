"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "日時を選択してください",
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [timeValue, setTimeValue] = React.useState({
    hour: "00",
    minute: "00",
  });

  // value が変更されたときに selectedDate と timeValue を更新
  React.useEffect(() => {
    if (value) {
      const date = new Date(value + ":00"); // datetime-local format に :00 を追加
      setSelectedDate(date);
      setTimeValue({
        hour: date.getHours().toString().padStart(2, "0"),
        minute: date.getMinutes().toString().padStart(2, "0"),
      });
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateDateTime(date, timeValue);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    const newTimeValue = { ...timeValue, [type]: newValue };
    setTimeValue(newTimeValue);
    if (selectedDate) {
      updateDateTime(selectedDate, newTimeValue);
    }
  };

  const updateDateTime = (
    date: Date,
    time: { hour: string; minute: string },
  ) => {
    const newDate = new Date(date);
    newDate.setHours(parseInt(time.hour, 10));
    newDate.setMinutes(parseInt(time.minute, 10));
    newDate.setSeconds(0);

    // datetime-local format で出力 (YYYY-MM-DDTHH:MM)
    const formattedDateTime =
      newDate.getFullYear() +
      "-" +
      String(newDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(newDate.getDate()).padStart(2, "0") +
      "T" +
      String(newDate.getHours()).padStart(2, "0") +
      ":" +
      String(newDate.getMinutes()).padStart(2, "0");

    onChange?.(formattedDateTime);
  };

  // 時間の選択肢を生成
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(new Date(value + ":00"), "yyyy年M月d日 HH:mm", {
                locale: ja,
              })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ja}
              initialFocus
            />
            <div className="mt-3 border-t pt-3">
              <Label className="text-sm font-medium">時刻</Label>
              <div className="mt-2 flex items-center gap-2">
                <Select
                  value={timeValue.hour}
                  onValueChange={(value) => handleTimeChange("hour", value)}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm">:</span>
                <Select
                  value={timeValue.minute}
                  onValueChange={(value) => handleTimeChange("minute", value)}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
