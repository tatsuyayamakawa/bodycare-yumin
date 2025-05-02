import Heading from "../heading";
import Section from "../section";
import { Accordion } from "../ui/accordion";

import FaqItem from "./components/faq-item";
import { lists } from "./data";

export default function Faq() {
  return (
    <Section padding>
      <div className="mx-auto lg:w-[740px]">
        <Heading heading="よくあるご質問" subheading="FAQ" center />
        <Accordion
          type="single"
          collapsible
          className="mt-6 xl:mt-12 [&>div]:pb-8 [&>div:last-child]:pb-0"
        >
          {lists.map((item, index) => (
            <FaqItem key={index} item={item} index={index} />
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
