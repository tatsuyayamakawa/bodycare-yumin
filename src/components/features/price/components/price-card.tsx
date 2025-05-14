import type { MenuData } from "./types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PriceCard({ price }: { price: MenuData }) {
  return (
    <div className="relative md:w-[calc(100%/2-var(--spacing-xs))] lg:w-[calc(100%/2-var(--spacing-sm))]">
      <span className="bg-brand-accent-2 after:border-x-brand-accent-2 absolute right-3 p-2 text-sm/normal font-medium text-white after:absolute after:top-full after:left-0 after:h-0 after:w-0 after:border-x-[23px] after:border-b-[6px] after:border-solid after:border-b-transparent after:content-['']">
        {price.time}
      </span>
      <Card className="border-border rounded-lg pt-0 shadow-xs">
        <CardHeader className="gap-0 rounded-t-lg bg-neutral-200 py-[var(--spacing-sm)]">
          <CardTitle className="text-brand-primary text-center text-xl/normal font-semibold tracking-tight">
            {price.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-2">
          <CardDescription className="font-zen-old-mincho text-brand-primary text-center text-xl/normal font-semibold">
            {price.price}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex min-h-[85px] items-start">
          <CardDescription className="text-brand-primary text-sm/normal">
            {price.content}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
