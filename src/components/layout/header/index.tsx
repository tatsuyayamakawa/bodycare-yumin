"use client";

import FixedHeader from "./components/fixed-header";

import { useScrollDirection } from "@/hooks";

export default function Header() {
  const { scrollDirection, isHeaderShadowVisible } = useScrollDirection();

  return (
    <FixedHeader
      isVisible={scrollDirection === "up"}
      isShadowVisible={!isHeaderShadowVisible}
    />
  );
}
