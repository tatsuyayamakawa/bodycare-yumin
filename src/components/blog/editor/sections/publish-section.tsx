import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Label } from "@/components/ui/label";

interface PublishSectionProps {
  status: string;
  onStatusChange: (status: string) => void;
  scheduledAt?: string;
  onScheduledAtChange: (date: string) => void;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function PublishSection({
  status,
  onStatusChange,
  scheduledAt,
  onScheduledAtChange,
  isSubmitting,
  onSave,
  onCancel,
  isEditing = false,
}: PublishSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 md:p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base">
        公開
      </h3>

      <div className="space-y-3 md:space-y-4">
        {/* 公開状態 */}
        <div>
          <Label htmlFor="status" className="text-xs font-medium md:text-sm">
            状態
          </Label>
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none md:px-3 md:py-2"
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
            <option value="private">非公開</option>
            <option value="scheduled">予約投稿</option>
          </select>
        </div>

        {/* 予約投稿日時 */}
        {status === "scheduled" && (
          <div>
            <Label className="text-xs font-medium md:text-sm">
              予約投稿日時
            </Label>
            <div className="mt-1">
              <DateTimePicker
                value={scheduledAt || ""}
                onChange={onScheduledAtChange}
                placeholder="予約投稿日時を選択してください"
              />
            </div>
          </div>
        )}

        {/* 公開ボタン */}
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button
            onClick={onSave}
            disabled={isSubmitting}
            className="flex-1 cursor-pointer text-sm"
            size="sm"
          >
            {isSubmitting
              ? isEditing
                ? "更新中..."
                : "作成中..."
              : isEditing
                ? "記事を更新"
                : "記事を作成"}
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              size="sm"
              className="cursor-pointer text-sm sm:flex-shrink-0"
            >
              キャンセル
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}