import type { TreatmentPolicyStyles } from "../types";

export const treatmentPolicyStyles: TreatmentPolicyStyles = {
  container: {
    base: "",
  },
  intro: {
    base: "text-brand-primary",
    title: {
      base: "relative mx-auto w-fit text-center text-lg/normal font-medium md:text-3xl/normal",
      line: "block pb-1 before:absolute before:bottom-6 before:-left-14 before:inline-block before:h-[5px] before:w-12 before:rotate-[50deg] before:bg-[radial-gradient(circle_farthest-side,_#71645D,_#71645D_50%,_transparent_60%,_transparent)] before:[background-size:5px] before:content-[''] md:pb-2 after:absolute after:-right-14 after:bottom-6 after:inline-block after:h-[5px] after:w-12 after:-rotate-[50deg] after:bg-[radial-gradient(circle_farthest-side,_#71645D,_#71645D_50%,_transparent_60%,_transparent)] after:[background-size:5px] after:content-['']",
    },
    subtitle: {
      base: "mx-auto my-6 w-fit text-lg/normal font-semibold after:-mt-[4px] after:block after:content-[''] after:[border-top:6px_solid_#FB923C] md:my-[var(--spacing-md)] md:text-4xl/normal md:after:-mt-[6px] md:after:[border-top:12px_solid_#FB923C] lg:text-5xl/normal",
      underline: "",
    },
    description: {
      base: "text-sm/normal md:text-center md:text-base/normal lg:text-lg/normal [&>p]:mb-4 lg:[&>p]:mb-[var(--spacing-xs)] [&>p:last-child]:mb-0",
    },
  },
  policy: {
    heading: "癒眠の療術方針",
    subheading: "Treatment policy",
    base: "mx-auto mt-[var(--spacing-md)] lg:mt-[var(--spacing-lg)] xl:w-[1020px]",
    content: {
      base: "w-full text-sm/normal md:text-base/normal [&>p]:mb-4 lg:[&>p]:mb-[var(--spacing-xs)] [&>p:last-child]:mb-0",
    },
    image: {
      base: "pointer-events-none aspect-[3/2] rounded-lg object-cover",
    },
  },
} as const;
