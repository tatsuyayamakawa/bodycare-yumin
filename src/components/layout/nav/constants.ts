import type { NavData, NavStyles } from "./types";

export const navData: NavData[] = [
  {
    title: "ブログ",
    url: "/blog",
  },
  {
    title: "オンライン予約",
    url: "https://squareup.com/appointments/book/u0jc60b4z1ls1d/5G0J44Q57FF95/start",
  },
  {
    title: "お問い合わせ",
    url: "/contact",
  },
] as const;

export const navStyles: NavStyles = {
  container: {
    base: "",
  },
  desktop: {
    base: "hidden md:block",
    list: {
      base: "flex gap-[var(--spacing-sm)] ",
    },
    item: {
      base: "px-[var(--spacing-sm)] py-3 text-sm/normal lg:text-lg/normal font-medium text-foreground ",
    },
  },
  mobile: {
    base: "",
    button: {
      base: "absolute top-3 right-3 z-40 md:hidden",
    },
    overlay: {
      base: "animate-in fade-in-0 fixed inset-0 z-40 backdrop-blur-sm",
      background: "fixed inset-0 bg-white/80",
    },
    nav: {
      base: "relative z-50 flex h-dvh w-screen flex-col items-center justify-center",
    },
    list: {
      base: "flex flex-col items-center gap-[var(--spacing-md)]",
    },
    item: {
      base: "text-center text-xl/normal font-medium",
    },
  },
} as const;
