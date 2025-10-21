"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ImageUpload } from "../image-upload";
import { Button } from "@/components/ui/button";
import { generateEyecatchImage } from "@/lib/utils/eyecatch";

interface EyecatchSectionProps {
  title: string;
  featuredImage?: string;
  onFeaturedImageChange: (url?: string) => void;
  isSubmitting: boolean;
}

export function EyecatchSection({
  title,
  featuredImage,
  onFeaturedImageChange,
  isSubmitting,
}: EyecatchSectionProps) {
  const [isGeneratingEyecatch, setIsGeneratingEyecatch] = useState(false);

  const generateEyecatch = async () => {
    if (!title.trim()) {
      toast.error("タイトルを入力してからアイキャッチを生成してください");
      return;
    }

    setIsGeneratingEyecatch(true);
    try {
      const imageUrl = await generateEyecatchImage(title);
      onFeaturedImageChange(imageUrl);
      toast.success("アイキャッチを生成しました");
    } catch (error) {
      console.error("Error generating eyecatch:", error);
      toast.error("アイキャッチの生成に失敗しました");
    } finally {
      setIsGeneratingEyecatch(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 md:text-base">
          アイキャッチ画像
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateEyecatch}
          disabled={isGeneratingEyecatch || isSubmitting || !title.trim()}
          className="cursor-pointer text-xs"
        >
          <Wand2 className="mr-1 h-3 w-3" />
          {isGeneratingEyecatch ? "生成中..." : "自動生成"}
        </Button>
      </div>
      <ImageUpload
        value={featuredImage}
        onChange={onFeaturedImageChange}
        disabled={isSubmitting}
        imageClassName="max-w-none"
      />
    </div>
  );
}