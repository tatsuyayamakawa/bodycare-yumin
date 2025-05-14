import Image from "next/image";

import hero_image from "../assets/hero-image.png";

import HeroSymbol from "./hero-symbol";

import { cn } from "@/lib/utils";

export default function HeroDesktop({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "md:pt-[calc(var(--spacing-lg)-20px)] lg:pt-[var(--spacing-lg)] xl:py-[var(--spacing-lg)]",
        className,
      )}
    >
      <div className="mx-[var(--spacing-md)] flex gap-[var(--spacing-sm)]">
        <HeroSymbol />
        <div className="flex-1" aria-hidden="true" />
        <div className="relative">
          <Image
            src={hero_image}
            alt="手もみ整体 癒眠 店内イメージ"
            placeholder="blur"
            priority
            draggable={false}
            className="pointer-events-none rounded-lg object-cover brightness-110 md:h-[300px] lg:h-[400px] xl:h-[calc(100svh-192px)]"
          />
        </div>
      </div>
    </section>
  );
}
