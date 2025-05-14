"use client";

import FixedHeader from "./components/fixed-header";

import { useScrollDirection } from "@/hooks";

export default function Header() {
  const { isHeaderShadowVisible } = useScrollDirection();

  return (
    <FixedHeader isVisible={true} isShadowVisible={!isHeaderShadowVisible} />
  );
}
