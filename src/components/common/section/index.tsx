import Arrow from "./components/arrow";
import { sectionDefaults, sectionStyles } from "./constants";
import type { SectionProps } from "./types";

import { cn } from "@/lib/utils";

export default function Section({
  hasArrow = sectionDefaults.hasArrow,
  arrowColor = sectionDefaults.arrowColor,
  hasBackground = sectionDefaults.hasBackground,
  hasPadding = sectionDefaults.hasPadding,
  className,
  children,
  id,
}: SectionProps) {
  const containerClasses = cn(
    sectionStyles.container.base,
    hasPadding && sectionStyles.container.withPadding,
    hasArrow && sectionStyles.arrow.wrapper,
    className,
  );

  return (
    <section
      className={hasBackground ? sectionStyles.background : undefined}
      id={id}
    >
      <div className={containerClasses}>
        {hasArrow && <Arrow color={arrowColor} />}
        {children}
      </div>
    </section>
  );
}
