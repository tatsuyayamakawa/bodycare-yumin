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
    // 現在のスクロール位置を保存
    const scrollY = window.scrollY;

    if (isOpen) {
      // ヘッダーが表示される前の位置を記録
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // ヘッダーが閉じられたら元の位置に戻す
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
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
