'use client';

import React, { useState } from 'react';

import { Navbar } from '@material-tailwind/react';

import { NavDesktop } from './nav-desktop';
import { NavMobile } from './nav-mobile';

export const Nav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar className="rounded-none border-none shadow-none transition-shadow" fullWidth={true} aria-label="メインナビゲーション">
      <div className="mx-auto flex max-w-[72rem] items-center justify-between lg:px-10 lg:py-5">
        <NavDesktop />
        <NavMobile isOpen={isOpen} handler={handleClick} />
      </div>
    </Navbar>
  );
};
