"use client";

import Image from "next/image";
import { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({
  videoId,
  title,
  className = "",
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!videoId) {
    return null;
  }

  return (
    <div className={`youtube-embed-wrapper relative my-6 ${className}`}>
      <div className="relative h-0 overflow-hidden rounded-lg bg-gray-100 pb-[56.25%]">
        {!isLoaded && (
          <div
            className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 transition-opacity hover:bg-opacity-30"
            onClick={() => setIsLoaded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsLoaded(true);
              }
            }}
            aria-label={`YouTube動画を再生: ${title || "YouTube動画"}`}
          >
            {/* YouTube風のサムネイル背景 */}
            <Image
              src={thumbnailUrl}
              alt={title || "YouTube動画のサムネイル"}
              fill
              className="object-cover"
              loading="lazy"
            />
            {/* 再生ボタン */}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(348,100%,50%)] shadow-lg transition-transform group-hover:scale-110">
              <svg
                className="ml-0.5 h-7 w-7"
                viewBox="0 0 68 48"
                fill="none"
                aria-hidden="true"
              >
                <path d="M56 24 12 0v48l44-24z" fill="white" />
              </svg>
            </div>
            {/* グラデーションオーバーレイ */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {isLoaded && (
          <iframe
            src={embedUrl}
            title={title || "YouTube動画"}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {title && (
        <p className="mt-2 text-center text-sm text-gray-600">{title}</p>
      )}
    </div>
  );
}
