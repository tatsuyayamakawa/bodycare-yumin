import CtaButton from "./components/cta-button";
import CtaScroll from "./components/cta-scroll";
import CtaText from "./components/cta-text";

import Section from "@/components/section";

export default function Cta() {
  return (
    <Section padding className="text-center md:hidden">
      <CtaText />
      <CtaButton />
      <CtaScroll />
    </Section>
  );
}
