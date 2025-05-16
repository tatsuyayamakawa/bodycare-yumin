"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import hero_image from "../assets/hero-image.png";
import { texts } from "../constants";

import { cn } from "@/lib/utils";

function useInitialHeroHeight(): string {
  const [heroHeight, setHeroHeight] = useState<string>("calc(100dvh - 60px)");

  useEffect(() => {
    // 初回レンダリング時にのみ高さを計算
    // CSS変数の100dvhはモバイルでスクロール時に変動することがあるため
    // window.innerHeightで固定値をピクセル単位で取得して再計算を防止
    const height = window.innerHeight;
    setHeroHeight(`${height}px`);
    // 空の依存配列で初回レンダリング時のみ実行
  }, []);
  return heroHeight;
}

export default function HeroMobile({ className }: { className?: string }) {
  const heroHeight = useInitialHeroHeight();

  return (
    <section className={cn("relative w-dvw overflow-hidden", className)}>
      <div
        className="relative mt-[calc(var(--spacing-md)+12px)] flex items-center justify-center"
        style={{ height: `calc(${heroHeight} - 60px)` }}
      >
        <div className="absolute inset-0 w-[250%] overflow-hidden">
          <div className="animate-slow-pan-horizontal h-full w-full">
            <Image
              src={hero_image}
              placeholder="blur"
              alt="手もみ整体 癒眠 店内イメージ"
              priority
              draggable={false}
              className="pointer-events-none h-full w-full object-cover brightness-110"
            />
          </div>
        </div>
        <h2 className="font-zen-old-mincho text-shadow-accent-foreground absolute z-10 text-4xl/normal tracking-widest text-white [writing-mode:vertical-rl] text-shadow-2xs">
          <div className="flex flex-col">
            {texts.map((text, index) => (
              <span key={index} className="nth-2:py-4 nth-3:mt-auto">
                {text}
              </span>
            ))}
          </div>
        </h2>
      </div>
    </section>
  );
}
