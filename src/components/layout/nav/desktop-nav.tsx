import Link from "next/link";

import { navData, navStyles } from "./constants";

import { Button } from "@/components/ui/button";

export function DesktopNav() {
  const { desktop } = navStyles;

  return (
    <nav className={desktop.base}>
      <ul className={desktop.list.base}>
        {navData.map((nav) => (
          <li key={nav.url}>
            <Button variant="ghost" className={desktop.item.base} asChild>
              <Link href={nav.url} className="h-auto">
                {nav.title}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
