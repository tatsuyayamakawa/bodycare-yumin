import type { LogoData } from "./types";

export const logoData: LogoData = {
  src: "/logo.png",
  sizes: {
    default: {
      width: 600,
      height: 72,
    },
    responsive: {
      mobile: "w-50",
      desktop: "lg:w-75",
    },
  },
} as const;
