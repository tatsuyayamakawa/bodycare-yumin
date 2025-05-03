import Image from "next/image";

import { texts } from "../data";

import hero_image from "@/components/hero/assets/hero-image.png";
import { cn } from "@/lib/utils";

const HeroMobile = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("flex w-dvw items-center justify-center px-0", className)}
    >
      <Image
        src={hero_image}
        placeholder="blur"
        alt="手もみ整体 癒眠 店内イメージ"
        priority
        draggable={false}
        className="pointer-events-none mt-15 h-[calc(100dvh-60px)] object-cover brightness-110"
      />
      <h2 className="font-zen-old-mincho text-shadow-accent-foreground absolute z-10 text-3xl/normal tracking-widest text-white [writing-mode:vertical-rl] text-shadow-2xs">
        <div className="flex flex-col">
          {texts.map((text, index) => (
            <span key={index} className="nth-2:py-4 nth-3:mt-auto">
              {text}
            </span>
          ))}
        </div>
      </h2>
    </section>
  );
};

export default HeroMobile;
