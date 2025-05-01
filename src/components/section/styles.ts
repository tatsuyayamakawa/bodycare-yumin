export const SECTION_STYLES = {
  background: "bg-brand-secondary",
  container: {
    base: "container",
    withPadding: "container py-12 xl:py-24",
  },
  arrow: {
    wrapper: "relative",
    element:
      "absolute left-1/2 top-0 mx-auto h-0 w-0 -translate-x-1/2 border-x-[25px] border-b-0 border-t-[20px] border-solid border-x-transparent border-t-white",
  },
} as const;
