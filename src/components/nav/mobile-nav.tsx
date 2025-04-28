"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

import { NAV_DATA } from "./data";

import { Button } from "@/components/ui/button";

const NavItem = memo(function NavItem({
  href,
  title,
  onClose,
}: {
  href: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-center text-xl/normal font-medium"
        onClick={onClose}
      >
        {title}
      </Link>
    </li>
  );
});

export const MobileNav = memo(function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div className="absolute top-3 right-3 z-40 md:hidden">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          asChild
        >
          <Menu size={40} />
        </Button>
      </div>

      {isOpen && (
        <div className="animate-in fade-in-0 fixed inset-0 z-40 backdrop-blur-sm">
          <div className="fixed inset-0 bg-white/80" />
          <nav className="relative z-50 flex h-dvh w-screen flex-col items-center justify-center">
            <div className="fixed top-3 right-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <X size={40} />
              </Button>
            </div>
            <ul className="flex flex-col items-center gap-8">
              {NAV_DATA.map((nav) => (
                <NavItem
                  key={nav.href}
                  {...nav}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
});
