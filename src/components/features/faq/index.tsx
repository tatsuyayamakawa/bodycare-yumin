import FaqItem from "./components/faq-item";
import { faqData, faqStyles } from "./constants";

import Heading from "@/components/common/heading";
import Section from "@/components/common/section";
import { Accordion } from "@/components/ui/accordion";

export default function Faq() {
  const { heading, subheading, lists } = faqData;
  const { container, accordion } = faqStyles;

  return (
    <Section id="faq" hasPadding hasArrow arrowColor="brand-secondary">
      <div className={container.base}>
        <Heading heading={heading} subheading={subheading} center />
        <Accordion type="single" collapsible className={accordion.base}>
          {lists.map((item, index) => (
            <FaqItem key={index} item={item} index={index} />
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
