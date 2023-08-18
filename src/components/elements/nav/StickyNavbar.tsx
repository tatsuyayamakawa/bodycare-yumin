'use client';

import React, { useState, useEffect } from 'react';

import { Navbar } from '@material-tailwind/react';

import { HamburgerButton } from 'src/components/elements/nav/HamburgerButton';
import { LogoLink } from 'src/components/elements/nav/LogoLink';
import { ModalWindow } from 'src/components/elements/nav/ModalWindow';
import { NavList } from 'src/components/elements/nav/NavList';
import { ProgressBar } from 'src/libs/progress-bar/progress-bar';

export const StickyNavbar = () => {
  // ヘッダースクロール時の影表示を管理する
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    window.scrollY > 1 ? setIsVisible(true) : setIsVisible(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // ハンバーガーボタンの開閉を管理する
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar
        className={!isVisible ? `rounded-none border-none shadow-none transition-shadow` : `rounded-none border-none transition-shadow`}
        fullWidth={true}
        aria-label="メインナビゲーション"
      >
        <div className="mx-auto flex max-w-[72rem] items-center justify-between lg:px-10 lg:py-5">
          <LogoLink />
          <NavList />
          <HamburgerButton handler={handleClick} />
          <ModalWindow isOpen={isOpen} handler={handleClick} />
        </div>
      </Navbar>
      <ProgressBar />
    </>
  );
};
