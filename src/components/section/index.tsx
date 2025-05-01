import Arrow from "./components/arrow";
import { SECTION_STYLES } from "./styles";
import type { SectionProps } from "./types";

import { cn } from "@/lib/utils";

export default function Section({
  arrow,
  bgColor,
  padding,
  className,
  children,
}: SectionProps) {
  return (
    <section className={bgColor ? SECTION_STYLES.background : ""}>
      <div
        className={cn(
          arrow ? SECTION_STYLES.arrow.wrapper : "",
          padding
            ? SECTION_STYLES.container.withPadding
            : SECTION_STYLES.container.base,
          className,
        )}
      >
        {arrow && <Arrow />}
        {children}
      </div>
    </section>
  );
}
