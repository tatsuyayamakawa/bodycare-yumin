"use client";

import { useCallback, useEffect, useState } from "react";

import { SCROLL_CONFIG } from "@/hooks/config";
import type { ScrollState } from "@/hooks/types";

export function useScrollDirection(): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollDirection: SCROLL_CONFIG.initialDirection,
    isHeaderShadowVisible: SCROLL_CONFIG.initialShadowState,
  });
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setScrollState((prevState) => {
      const newDirection =
        currentScrollY > lastScrollY && currentScrollY > SCROLL_CONFIG.threshold
          ? "down"
          : "up";

      const newShadowVisible = currentScrollY > 0;

      if (
        newDirection === prevState.scrollDirection &&
        newShadowVisible === prevState.isHeaderShadowVisible
      ) {
        return prevState;
      }

      return {
        scrollDirection: newDirection,
        isHeaderShadowVisible: newShadowVisible,
      };
    });

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrollState;
}
