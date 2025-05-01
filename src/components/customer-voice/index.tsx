import Heading from "../heading";
import Section from "../section";

import ReviewCard from "./components/review-card";
import { customerVoice } from "./data";

export default function CustomerVoice() {
  return (
    <Section arrow bgColor padding>
      <Heading heading="お客様のご感想" subheading="Customer's Review" center />
      <div className="mx-auto mt-6 flex flex-col justify-center gap-8 md:flex-row md:flex-wrap xl:mt-12 xl:w-[1020px] xl:gap-12">
        {customerVoice.reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </Section>
  );
}
