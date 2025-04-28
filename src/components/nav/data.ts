import type { NavData } from "./types";

export const NAV_DATA: NavData[] = [
  {
    title: "オンライン予約",
    href: `${process.env.NEXT_PUBLIC_SQUARE_BOOKING}`,
  },
  {
    title: "お問い合わせ",
    href: "/contact",
  },
] as const;
