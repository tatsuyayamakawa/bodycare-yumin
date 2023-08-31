'use client';

import React, { useState, useEffect } from 'react';

import { Navbar } from '@material-tailwind/react';

import { NavDesktop } from './nav-desktop';
import { NavMobile } from './nav-mobile';

export const Nav = () => {
  // Manage shadow display when scrolling header
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    window.scrollY > 1 ? setIsVisible(true) : setIsVisible(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Manage the opening and closing of the hamburger button
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar
      className={!isVisible ? `rounded-none border-none shadow-none transition-shadow` : `rounded-none border-none transition-shadow`}
      fullWidth={true}
      aria-label="メインナビゲーション"
    >
      <div className="mx-auto flex max-w-[72rem] items-center justify-between lg:px-10 lg:py-5">
        <NavDesktop />
        <NavMobile isOpen={isOpen} handler={handleClick} />
      </div>
    </Navbar>
  );
};
