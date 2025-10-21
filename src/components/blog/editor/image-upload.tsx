"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { deleteImage, uploadImage } from "@/lib/actions/upload";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  imageClassName?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
  imageClassName,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled || isUploading) return;

      // ファイルサイズチェック (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("ファイルサイズは5MB以下にしてください。");
        return;
      }

      // ファイル形式チェック
      if (!file.type.startsWith("image/")) {
        alert("画像ファイルを選択してください。");
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);

        if ('error' in result) {
          alert(`アップロードに失敗しました: ${result.error}`);
        } else if (result.url) {
          onChange(result.url);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("アップロードに失敗しました。");
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, isUploading, onChange],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file && file.type.startsWith("image/")) {
        await handleUpload(file);
      }
    },
    [disabled, handleUpload],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [handleUpload],
  );

  const handleRemove = async () => {
    if (disabled || !value) return;

    try {
      await deleteImage(value);
      onChange(undefined);
    } catch (error) {
      console.error("Delete error:", error);
      alert("画像の削除に失敗しました。");
    }
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {value ? (
        <div className="relative">
          <div
            className={`relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50 ${imageClassName || "max-w-md"}`}
          >
            <Image
              src={value}
              alt="Featured image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 cursor-pointer"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              {isUploading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              ) : (
                <Upload className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div className="text-sm text-gray-600">
              {isUploading ? (
                "アップロード中..."
              ) : (
                <>
                  <span className="font-medium text-blue-600">
                    クリックしてファイルを選択
                  </span>
                  <br />
                  またはドラッグ＆ドロップ
                </>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              PNG, JPG, WEBP (最大5MB)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
