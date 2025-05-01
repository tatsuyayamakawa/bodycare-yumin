import type { ImageProps } from "next/image";

export interface ExtendedImageProps extends ImageProps {
  images: string[];
}

export type ScrollDirection = "up" | "down";

export interface ScrollState {
  scrollDirection: ScrollDirection;
  isHeaderShadowVisible: boolean;
}
