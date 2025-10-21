import type { BreadCrumbStyles } from "./types";

export const breadCrumbStyles: BreadCrumbStyles = {
  container: {
    base: "mb-md",
  },
  list: {
    base: "space-x-1",
  },
  separator: {
    base: "h-4 w-4",
  },
  page: {
    base: "font-semibold",
  },
} as const;
