import { memo } from "react";

import Logo from "@/components/logo";
import { DesktopNav, MobileNav } from "@/components/nav";

const Header = memo(function Header() {
  return (
    <header className="flex h-15 w-full items-center bg-white transition-all duration-100 md:h-19 md:px-12 lg:h-25">
      <Logo className="not-md:px-3" />
      <span className="flex-1" aria-hidden="true" />
      <MobileNav />
      <DesktopNav />
    </header>
  );
});

export default Header;
