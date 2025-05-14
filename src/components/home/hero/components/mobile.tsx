"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import hero_image from "../assets/hero-image.png";
import { texts } from "../constants";

import { cn } from "@/lib/utils";

export default function HeroMobile({ className }: { className?: string }) {
  const [heroHeight, setHeroHeight] = useState("100vh");

  useEffect(() => {
    // 初回レンダリング時に一度だけ高さを計算して固定
    const calculateHeight = () => {
      const height = window.innerHeight;
      setHeroHeight(`${height}px`);
    };

    calculateHeight();

    // 向き変更時のみ再計算
    window.addEventListener("orientationchange", calculateHeight);

    return () => {
      window.removeEventListener("orientationchange", calculateHeight);
    };
  }, []);

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
