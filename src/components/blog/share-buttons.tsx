"use client";

import { Twitter, Facebook, Share } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url,
      });
    } else {
      // フォールバック：クリップボードにコピー
      navigator.clipboard.writeText(url).then(() => {
        alert("URLをクリップボードにコピーしました");
      });
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transform items-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg"
      >
        <Twitter className="h-4 w-4" />
        Twitter でシェア
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transform items-center gap-2 rounded-full bg-blue-700 px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-lg"
      >
        <Facebook className="h-4 w-4" />
        Facebook でシェア
      </a>

      <button
        onClick={handleNativeShare}
        className="inline-flex transform items-center gap-2 rounded-full bg-gray-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-lg"
      >
        <Share className="h-4 w-4" />
        その他の方法でシェア
      </button>
    </div>
  );
}