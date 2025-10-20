import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EyecatchPreviewProps {
  imageSrc?: string;
  title: string;
  size?: "desktop" | "mobile";
}

/**
 * アイキャッチ画像プレビュー
 */
export function EyecatchPreview({
  imageSrc,
  title,
  size = "desktop",
}: EyecatchPreviewProps) {
  if (!imageSrc) return null;

  const containerClass =
    size === "desktop"
      ? "relative flex aspect-square rounded-lg bg-gray-100 hover:opacity-80"
      : "relative h-32 w-full rounded-lg bg-gray-100 hover:opacity-80";

  const imageSize =
    size === "desktop" ? "48px" : "(max-width: 768px) 100vw, 50vw";

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div className={containerClass}>
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes={imageSize}
                className="rounded-lg object-cover"
              />
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        {size === "desktop" && (
          <TooltipContent>クリックして拡大表示</TooltipContent>
        )}
      </Tooltip>
      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-auto sm:max-w-4xl md:max-w-5xl lg:max-w-6xl">
        <DialogTitle className="sr-only">{title}のアイキャッチ画像</DialogTitle>
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={imageSrc}
            alt={title}
            width={0}
            height={0}
            sizes="85vw"
            className="h-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          <p className="px-4 text-center text-sm text-gray-600">{title}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
