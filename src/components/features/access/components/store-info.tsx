import { PhoneCall } from "lucide-react";
import Link from "next/link";

import { accessData, reservationButton } from "../constants";

import ScheduleTable from "./schedule-table";

import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";

export default function StoreInfo() {
  const { phone, address } = accessData;
  const { postal, location } = address;
  const { text, url } = reservationButton;

  return (
    <div className="flex w-full flex-col items-start lg:items-center">
      <div className="flex flex-col items-start gap-y-[var(--spacing-sm)]">
        <Logo />

        <div className="space-y-1 text-base/normal">
          <p>{postal}</p>
          <p>{location}</p>
        </div>

        <div className="text-brand-primary flex items-center">
          <PhoneCall size={25} className="mr-3" fill="#71645D" stroke="0" />
          <span className="font-zen-old-mincho text-2xl/normal font-bold tracking-widest lg:text-3xl/normal">
            {phone}
          </span>
        </div>

        <Button
          asChild
          className="bg-brand-primary hover:bg-brand-primary/90 h-12 w-full max-w-[250px] rounded-lg text-base"
        >
          <Link href={url} className="w-full max-w-[250px]">
            {text}
          </Link>
        </Button>

        <div className="w-full">
          <ScheduleTable />
        </div>
      </div>
    </div>
  );
}
