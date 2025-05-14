import { Loader2 } from "lucide-react";

import type { SubmitButtonProps } from "./types";

import { Button } from "@/components/ui/button";

export default function SubmitButton({
  isValid,
  isSubmitting,
}: SubmitButtonProps) {
  return (
    <Button
      title="送信ボタン"
      type="submit"
      size="lg"
      className="cursor-pointer bg-blue-500 hover:bg-blue-400"
      disabled={!isValid || isSubmitting}
    >
      {isSubmitting && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      内容を送信する
    </Button>
  );
}
