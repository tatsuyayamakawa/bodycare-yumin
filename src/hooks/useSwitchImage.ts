"use client";

import { useCallback, useState } from "react";

import type { ExtendedImageProps } from "@/hooks/types";

export function useSwitchImage(props: ExtendedImageProps) {
  const { images, ...rest } = props;
  const [current, setCurrent] = useState(images[0]);

  const handleSwitch = useCallback(() => {
    setCurrent((prevCurrent) => {
      const nextIndex = (images.indexOf(prevCurrent) + 1) % images.length;
      return images[nextIndex];
    });
  }, [images]);

  return {
    ...rest,
    src: current,
    onClick: handleSwitch,
  };
}
