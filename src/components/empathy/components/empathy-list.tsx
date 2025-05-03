import { Check } from "lucide-react";

import type { EmpathyListProps } from "./types";

export default function EmpathyList({ lists }: EmpathyListProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-brand-primary mb-12 text-center text-lg/normal font-semibold md:my-8 md:text-xl/normal lg:text-2xl/normal xl:mt-16 xl:mb-10 xl:text-3xl/normal">
        <div className="relative inline-block">
          <span className="border-brand-primary relative z-10 mx-auto rounded-full border bg-white/80 px-4 py-1 tracking-wider italic md:px-6 lg:px-8">
            これすべて
            <span className="text-brand-accent font-medium">自律神経</span>
            が問題かも!
          </span>
        </div>
      </h2>
      <ul className="space-y-4 text-sm/normal font-medium md:text-base/normal lg:text-base/normal xl:text-lg/normal">
        {lists.map((list, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check size={20} color="orange" className="text-brand-accent" />
            <div className="text-brand-primary w-full after:mt-1 after:block after:content-[''] after:[border-top:1px_dashed_#71645D]">
              {list.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
