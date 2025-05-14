"use client";

import Image from "next/image";
import Link from "next/link";

import { logoData } from "./constants";
import type { LogoProps } from "./types";

import { appInfo } from "@/constants/data";

export default function Logo({ className }: LogoProps) {
  const { name } = appInfo;
  const {
    src,
    sizes: {
      responsive: { mobile, desktop },
      default: { width, height },
    },
  } = logoData;
  const responsiveClasses = `${mobile} ${desktop}`;

  return (
    <Link href="/" className={className}>
      <Image
        src={src}
        alt={name}
        width={width}
        height={height}
        className={responsiveClasses}
        priority
      />
    </Link>
  );
}
