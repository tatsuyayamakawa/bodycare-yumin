"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { LOGO_DATA } from "./data";

import { Button } from "@/components/ui/button";
import { useConfig } from "@/contexts/config-context";
import { cn } from "@/lib/utils";

const Logo = memo(function Logo({ className }: { className?: string }) {
  const { APP_NAME } = useConfig();

  return (
    <Button variant="link" className={cn("p-0", className)} asChild>
      <Link href="/">
        <Image
          src={LOGO_DATA.src}
          alt={APP_NAME}
          width={LOGO_DATA.sizes.default.width}
          height={LOGO_DATA.sizes.default.height}
          className={cn(
            LOGO_DATA.sizes.responsive.mobile,
            LOGO_DATA.sizes.responsive.desktop,
          )}
          priority
        />
      </Link>
    </Button>
  );
});

export default Logo;
