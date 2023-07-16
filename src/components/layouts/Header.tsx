"use client";

import Nav from "@/components/parts/Nav";

const Header = () => {
  return (
    <header className="mx-auto flex max-w-[1152px] items-center justify-between mobile:px-5 mobile:py-5 laptop:px-10 laptop:py-10">
      <Nav />
    </header>
  );
};

export default Header;
