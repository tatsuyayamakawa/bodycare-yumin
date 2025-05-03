"use client";

import { PhoneCall } from "lucide-react";

import { accessData } from "@/components/access/data";
import Logo from "@/components/logo";
import { useConfig } from "@/contexts/config-context";

export default function AccessInfo() {
  const { PORTAL_CODE, ADDRESS, BUSINESS_DAYS, BUSINESS_HOURS, PHONE_NUMBER } =
    useConfig();

  return (
    <div className="flex w-full flex-col items-start lg:items-center">
      <div className="flex w-fit flex-col items-start">
        <Logo className="mb-6" />
        <div className="text-base/normal [&>p]:mb-1 [&>p:last-child]:mb-4">
          <p>{PORTAL_CODE}</p>
          <p>{ADDRESS}</p>
        </div>
        <div className="text-base [&>p]:mb-1 [&>p:last-child]:mb-6">
          <p>営業日 : {BUSINESS_DAYS}</p>
          <p>営業時間 : {BUSINESS_HOURS}</p>
        </div>
        <div className="text-brand-primary mb-3 flex flex-row items-center">
          <PhoneCall size={25} fill="#71645D" stroke="0" className="mr-3" />
          <div className="font-zen-old-mincho text-2xl/normal font-bold tracking-widest lg:text-3xl/normal">
            {PHONE_NUMBER}
          </div>
        </div>
        <div className="text-base/normal [&>p]:mb-1 [&>p:last-child]:mb-0">
          {accessData.phone.notice.map((text, index) => (
            <p key={index} className="text-base/normal">
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
