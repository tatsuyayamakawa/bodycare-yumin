import { AlertCircle } from "lucide-react";

interface ErrorViewProps {
  message?: string;
}

/**
 * 共通エラー表示コンポーネント
 */
export function ErrorView({ message }: ErrorViewProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          エラーが発生しました
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {message || "データの取得に失敗しました"}
        </p>
      </div>
    </div>
  );
}
