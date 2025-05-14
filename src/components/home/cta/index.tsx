import CtaButton from "./components/cta-button";
import CtaScroll from "./components/cta-scroll";
import CtaText from "./components/cta-text";
import { ctaStyles } from "./constants";

import Section from "@/components/common/section";

export default function Cta() {
  const { container } = ctaStyles;

  return (
    <Section hasPadding className={container.base}>
      <CtaText />
      <CtaButton />
      <CtaScroll />
    </Section>
  );
}
