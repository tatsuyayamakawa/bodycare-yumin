import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

import type { FaqItemProps } from "./types";

export default function FaqItem({ item, index }: FaqItemProps) {
  return (
    <AccordionItem value={`item-${index}`} className="border-none">
      <AccordionTrigger className="bg-brand-secondary cursor-pointer gap-2 rounded-lg px-6 py-6 text-start text-base/normal font-normal hover:no-underline md:text-lg/normal [&>*]:h-6 [&>*]:w-6">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="px-6 pt-8 text-base/normal">
        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
      </AccordionContent>
    </AccordionItem>
  );
}
