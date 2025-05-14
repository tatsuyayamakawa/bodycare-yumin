import type { HeaderState } from "./types";

import Logo from "@/components/common/logo";
import { DesktopNav, MobileNav } from "@/components/layout/nav";

export default function FixedHeader({
  isVisible,
  isShadowVisible,
}: HeaderState) {
  return (
    <header
      className={`fixed z-20 flex h-15 w-full items-center bg-white transition-all duration-100 md:h-19 md:px-[var(--spacing-md)] lg:h-24 ${isVisible ? "top-0" : "-top-25"} ${isShadowVisible ? "shadow-none" : "shadow"} `}
    >
      <Logo className="not-md:px-3" />
      <div className="flex-1" aria-hidden="true" />
      <MobileNav />
      <DesktopNav />
    </header>
  );
}
