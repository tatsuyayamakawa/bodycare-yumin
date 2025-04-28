"use client";

import { memo } from "react";

import { FixedHeader } from "./components/fixed-header";

import { useScrollDirection } from "@/hooks";

const Header = memo(function Header() {
  const { scrollDirection, isHeaderShadowVisible } = useScrollDirection();
  const isVisible = scrollDirection === "up";
  const isShadowVisible = isHeaderShadowVisible === false;

  return (
    <FixedHeader isVisible={isVisible} isShadowVisible={isShadowVisible} />
  );
});

export default Header;
