"use client";

import { useCallback, useEffect, useState } from "react";

import { SCROLL_CONFIG } from "@/hooks/config";
import type { ScrollState } from "@/hooks/types";

export function useScrollDirection(): ScrollState {
  const [scrollDirection, setScrollDirection] = useState<
    ScrollState["scrollDirection"]
  >(SCROLL_CONFIG.initialDirection);
  const [isHeaderShadowVisible, setIsHeaderShadowVisible] = useState<boolean>(
    SCROLL_CONFIG.initialShadowState,
  );

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const lastScrollY = window.scrollY;

    setScrollDirection(
      currentScrollY > lastScrollY && currentScrollY > SCROLL_CONFIG.threshold
        ? "down"
        : "up",
    );

    setIsHeaderShadowVisible(currentScrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { scrollDirection, isHeaderShadowVisible };
}
