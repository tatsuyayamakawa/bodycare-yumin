"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { navData, navStyles } from "./constants";
import type { NavData } from "./types";

import { Button } from "@/components/ui/button";

type NavItemProps = NavData & {
  onClose: () => void;
};

function NavItem({ url, title, onClose }: NavItemProps) {
  return (
    <li>
      <Link href={url} className={navStyles.mobile.item.base} onClick={onClose}>
        {title}
      </Link>
    </li>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      // メニュー表示時は本文のスクロールを無効にする
      document.body.style.overflow = "hidden";
    } else {
      // メニュー非表示時は本文のスクロールを有効にする
      document.body.style.overflow = "";
    }

    return () => {
      // クリーンアップ時にスクロールを有効に戻す
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className={navStyles.mobile.button.base}>
        <Button size="icon" variant="ghost" onClick={handleToggle} asChild>
          <Menu size={40} />
        </Button>
      </div>

      {isOpen && (
        <div className={navStyles.mobile.overlay.base}>
          <div className={navStyles.mobile.overlay.background} />
          <nav className={navStyles.mobile.nav.base}>
            <div className="fixed top-3 right-3">
              <Button size="icon" variant="ghost" onClick={handleClose} asChild>
                <X size={40} />
              </Button>
            </div>
            <ul className={navStyles.mobile.list.base}>
              {navData.map((nav) => (
                <NavItem key={nav.url} {...nav} onClose={handleClose} />
              ))}
            </ul>
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
              <Link href="/" onClick={handleClose}>
                <Button size="lg" variant="outline">
                  ホームページ
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
