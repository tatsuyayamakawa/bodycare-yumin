import type { SectionStyles } from "../types";

export const sectionDefaults = {
  hasArrow: false,
  arrowColor: "white" as const,
  hasBackground: false,
  hasPadding: false,
} as const;

export const sectionStyles: SectionStyles = {
  background: "bg-brand-secondary",
  container: {
    base: "container",
    withPadding: "py-md xl:py-lg",
  },
  arrow: {
    wrapper: "relative",
    element: {
      base: [
        "absolute",
        "left-1/2 top-0",
        "-translate-x-1/2",
        "w-0 h-0",
        "border-x-[25px] border-t-[20px] border-b-0",
        "border-solid border-x-transparent",
      ].join(" "),
      white: "border-t-white",
      brandSecondary: "border-t-brand-secondary",
    },
  },
} as const;
