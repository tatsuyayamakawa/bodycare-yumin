import Link from "next/link";
import { memo } from "react";

import { NAV_DATA } from "./data";

import { Button } from "@/components/ui/button";

export const DesktopNav = memo(function DesktopNav() {
  return (
    <nav className="hidden md:block">
      <ul>
        <li className="space-x-6">
          {NAV_DATA.map((nav) => (
            <Button
              key={nav.href}
              variant="ghost"
              className="px-6 py-3 text-lg/normal font-medium"
              asChild
            >
              <Link href={nav.href} className="h-auto">
                {nav.title}
              </Link>
            </Button>
          ))}
        </li>
      </ul>
    </nav>
  );
});
