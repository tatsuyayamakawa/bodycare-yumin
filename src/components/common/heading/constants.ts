import type { HeadingStyles } from "./types";

export const headingStyles: HeadingStyles = {
  container: {
    base: "text-left md:pl-sm",
    center: "text-center",
  },
  heading: {
    base: "font-zen-old-mincho text-brand-primary text-3xl/normal font-bold md:text-5xl/normal",
  },
  subheading: {
    base: "font-allura text-brand-accent mt-[calc(var(--spacing-xs)/2)] text-2xl/normal font-normal md:mt-xs md:text-4xl/normal",
  },
} as const;
