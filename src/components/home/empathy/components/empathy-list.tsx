import { Check } from "lucide-react";

import type { EmpathyListProps } from "./types";

export default function EmpathyList({ lists }: EmpathyListProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-brand-accent my-[var(--spacing-sm)] text-center text-lg/normal font-semibold md:my-[calc(var(--spacing-sm)+6px)] md:text-xl/normal lg:text-2xl/normal xl:my-[calc(var(--spacing-md)+4px)] xl:text-3xl/normal">
        辛い体の悩み 我慢していませんか？
      </h2>
      <ul className="space-y-4 text-sm/normal font-normal md:text-base/normal lg:text-base/normal xl:text-lg/normal">
        {lists.map((list, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check size={20} className="text-brand-accent" />
            <div className="text-brand-primary w-full after:mt-1 after:block after:opacity-30 after:content-[''] after:[border-top:1px_dashed_#71645D]">
              {list.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
