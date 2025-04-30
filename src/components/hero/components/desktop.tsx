import Image from "next/image";

import hero_image from "../assets/hero-image.png";

import HeroSymbol from "./hero-symbol";

import { cn } from "@/lib/utils";

const HeroDesktop = ({ className }: { className?: string }) => {
  return (
    <section className={cn("md:pt-19 lg:pt-25 xl:py-25", className)}>
      <div className="flex gap-6 md:mx-12">
        <HeroSymbol />
        <div className="flex-1" aria-hidden="true" />
        <div className="relative">
          <Image
            src={hero_image}
            alt="手もみ整体 癒眠 店内イメージ"
            placeholder="blur"
            priority
            draggable={false}
            className="pointer-events-none object-cover brightness-110 md:h-75 md:rounded-lg lg:h-100 xl:h-[calc(100dvh-200px)]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroDesktop;
