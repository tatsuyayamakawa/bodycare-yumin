import type { HeadingProps } from "./types";

export default function Heading({ heading, subheading, center }: HeadingProps) {
  return (
    <div className={center ? "text-center" : "text-left md:pl-6"}>
      <h2 className="font-zen-old-mincho text-brand-primary text-3xl/normal font-bold md:text-5xl/normal">
        {heading}
      </h2>
      <h3 className="font-allura text-brand-accent mt-2 text-2xl/normal font-normal md:mt-4 md:text-4xl/normal">
        {subheading}
      </h3>
    </div>
  );
}
