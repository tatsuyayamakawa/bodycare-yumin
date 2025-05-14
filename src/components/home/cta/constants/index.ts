import type { CtaData, CtaStyles } from "../types";

export const ctaData: CtaData = {
  title: {
    highlight: {
      days: "土日祝",
      hour: "６",
    },
    text: ["も夕方", "時まで営業中!!"],
    subtitle: "急な不調も当日予約OK!",
  },
  button: {
    text: "今すぐ予約はこちら",
    url: process.env.NEXT_PUBLIC_SQUARE_BOOKING || "",
  },
} as const;

export const ctaStyles: CtaStyles = {
  container: {
    base: "text-center md:hidden",
  },
  text: {
    base: "",
  },
  button: {
    base: "",
  },
  scroll: {
    base: "",
  },
} as const;
