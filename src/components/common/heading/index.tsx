import { headingStyles } from "./constants";
import type { HeadingProps } from "./types";

export default function Heading({ heading, subheading, center }: HeadingProps) {
  const {
    container,
    heading: headingClass,
    subheading: subheadingClass,
  } = headingStyles;

  const containerClass = center ? container.center : container.base;

  return (
    <div className={containerClass}>
      <h2 className={headingClass.base}>{heading}</h2>
      <h3 className={subheadingClass.base}>{subheading}</h3>
    </div>
  );
}
