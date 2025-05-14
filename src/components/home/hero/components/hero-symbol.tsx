import Image from "next/image";

import hero_symbol from "../assets/hero-symbol.png";
import { texts } from "../constants";

export default function HeroSymbol() {
  return (
    <div className="flex w-full min-w-25 items-center justify-center">
      <Image
        src={hero_symbol}
        placeholder="blur"
        alt="手もみ整体 癒眠 シンボルマーク"
        priority
        draggable={false}
        className="pointer-events-none relative opacity-25 xl:w-67.5"
      />
      <h2 className="font-zen-old-mincho text-brand-primary absolute z-10 font-normal tracking-widest [writing-mode:vertical-rl] md:text-sm/normal lg:text-2xl/normal xl:text-4xl/normal">
        <div className="flex flex-col">
          {texts.map((text, index) => (
            <span
              key={index}
              className="nth-3:mt-auto md:nth-2:py-1 lg:nth-2:py-2 xl:nth-2:py-5"
            >
              {text}
            </span>
          ))}
        </div>
      </h2>
    </div>
  );
}
