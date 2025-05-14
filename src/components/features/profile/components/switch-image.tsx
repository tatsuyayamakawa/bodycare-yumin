"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";

import { useSwitchImage, type ExtendedImageProps } from "@/hooks/index";

interface SwitchImageProps extends ExtendedImageProps {
  src: StaticImageData;
  alt: string;
  images: string[];
}

export default function SwitchImage(props: SwitchImageProps) {
  const { src, alt, onClick, ...rest } = useSwitchImage(props);
  return <Image src={src} alt={alt} onClick={onClick} {...rest} />;
}
