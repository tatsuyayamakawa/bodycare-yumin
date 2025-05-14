import { Sparkle } from "lucide-react";

export default function EmpathyTitle() {
  return (
    <div>
      <h3 className="text-brand-primary mt-12 text-center text-lg/normal font-semibold md:text-2xl/normal lg:text-3xl/normal xl:mt-24 xl:text-4xl/normal">
        <div className="relative">
          もしあなたがそのような
          <span className="text-brand-accent relative inline-block font-semibold">
            悩み
            <Sparkle
              fill="currentColor"
              stroke="none"
              className="absolute -top-3 -right-3 h-5 w-5 animate-[fadeInOut_3s_ease-in-out_1.2s_infinite] text-yellow-400 md:h-6 md:w-6 lg:h-7 lg:w-7"
            />
          </span>
          をお持ちなら
        </div>
        <div className="pt-1 md:pt-2">
          きっと当サロンが
          <span className="text-brand-accent relative inline-block font-semibold">
            お役に立てます!
            <Sparkle
              fill="currentColor"
              stroke="none"
              className="absolute -top-4 -left-2 h-5 w-5 animate-[fadeInOut_3s_ease-in-out_0.6s_infinite] text-yellow-400 md:h-7 md:w-7 lg:h-8 lg:w-8"
            />
            <Sparkle
              fill="currentColor"
              stroke="none"
              className="absolute -right-1 -bottom-5 h-6 w-6 animate-[fadeInOut_3s_ease-in-out_1.8s_infinite] text-yellow-400 md:h-8 md:w-8 lg:h-9 lg:w-9"
            />
          </span>
        </div>
      </h3>
    </div>
  );
}
