export const CTA_DATA = {
  title: {
    highlight: {
      days: "土日祝",
      hour: "６",
    },
    text: ["も夕方", "時まで営業中‼"],
    subtitle: "急な不調も当日予約OK!",
  },
  button: {
    text: "今すぐご予約はコチラ",
    url: process.env.NEXT_PUBLIC_SQUARE_BOOKING || "",
  },
} as const;
