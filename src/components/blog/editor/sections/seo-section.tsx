"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateDefaultMetaDescription } from "@/lib/utils/metadata";

interface SEOSectionProps {
  title: string;
  metaDescription: string;
  onMetaDescriptionChange: (description: string) => void;
  isSubmitting: boolean;
}

export function SEOSection({
  title,
  metaDescription,
  onMetaDescriptionChange,
  isSubmitting,
}: SEOSectionProps) {
  const [isGeneratingMetaDescription, setIsGeneratingMetaDescription] =
    useState(false);

  const generateMetaDescription = () => {
    if (!title.trim()) {
      toast.error(
        "タイトルを入力してからメタディスクリプションを生成してください",
      );
      return;
    }

    setIsGeneratingMetaDescription(true);

    const generatedDescription = generateDefaultMetaDescription(title);

    onMetaDescriptionChange(generatedDescription);
    toast.success("メタディスクリプションを生成しました");
    setIsGeneratingMetaDescription(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 md:text-base">
          SEO設定
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateMetaDescription}
          disabled={
            isGeneratingMetaDescription || isSubmitting || !title.trim()
          }
          className="cursor-pointer text-xs"
        >
          <Wand2 className="mr-1 h-3 w-3" />
          {isGeneratingMetaDescription ? "生成中..." : "自動生成"}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label
            htmlFor="meta_description"
            className="text-xs font-medium md:text-sm"
          >
            メタディスクリプション
          </Label>
          <Textarea
            id="meta_description"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="SEO用の説明文（60文字以内推奨）"
            rows={3}
            className="mt-1 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            検索結果に表示される説明文です。設定がない場合、手もみ整体
            癒眠のブログ記事「{title}」をご覧ください。が指定されます。
          </p>
        </div>
      </div>
    </div>
  );
}