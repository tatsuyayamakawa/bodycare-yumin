import { sectionStyles } from "../constants";
import type { ArrowColor } from "../types";

import { cn } from "@/lib/utils";

interface ArrowProps {
  color: ArrowColor;
}

export default function Arrow({ color }: ArrowProps) {
  const arrowClasses = cn(
    sectionStyles.arrow.element.base,
    color === "white"
      ? sectionStyles.arrow.element.white
      : sectionStyles.arrow.element.brandSecondary,
  );

  return <div className={arrowClasses} aria-hidden="true" />;
}
