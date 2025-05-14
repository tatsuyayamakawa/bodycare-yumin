import { ClipboardPenLine, UserRound } from "lucide-react";
import Image from "next/image";

import type { ReviewCardProps } from "./types";

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="md:w-[calc(100%/2-var(--spacing-xs))] xl:w-[calc(100%/2-var(--spacing-sm))]">
      <div className="bg-card text-brand-primary mb-4 rounded-lg px-4 py-2 lg:mb-[var(--spacing-sm)] lg:px-[var(--spacing-sm)] lg:py-4 [&>*]:my-2">
        <h4 className="text-sm/normal font-semibold lg:text-lg/normal">
          {review.title}
        </h4>

        <h5 className="flex items-center gap-2 text-xs/normal font-medium lg:text-base/normal">
          <UserRound size={20} />
          {review.name}
        </h5>

        <h6 className="flex items-center gap-2 text-xs/normal font-medium lg:text-base/normal">
          <ClipboardPenLine size={20} />
          {review.symptom}
        </h6>
      </div>
      <Image
        src={review.image}
        alt={review.name}
        placeholder="blur"
        draggable={false}
        className="pointer-events-none aspect-[3/2] rounded-lg object-cover"
      />
    </div>
  );
}
