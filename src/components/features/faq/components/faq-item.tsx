import type { FaqItemProps } from "./types";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqItem({ item, index }: FaqItemProps) {
  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger className="bg-brand-secondary cursor-pointer gap-2 rounded-lg p-[var(--spacing-sm)] text-start text-base/normal font-normal hover:no-underline md:text-lg/normal [&>*]:h-6 [&>*]:w-6">
        {item.question}
      </AccordionTrigger>

      <AccordionContent className="p-[var(--spacing-sm)] text-base/normal">
        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
      </AccordionContent>
    </AccordionItem>
  );
}
