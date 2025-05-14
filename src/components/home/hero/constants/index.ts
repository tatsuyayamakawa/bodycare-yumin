import type { Catchphrase, HeroStyles } from "../types";

export const texts: Catchphrase[] = [
  "深層筋ほぐしから",
  "自律神経を整える",
  "整体サロン",
] as const;

export const heroStyles: HeroStyles = {
  container: {
    base: "",
  },
  desktop: {
    base: "hidden md:block",
  },
  mobile: {
    base: "md:hidden",
  },
} as const;
