import ReviewCard from "./components/review-card";
import { customerVoiceData, customerVoiceStyles } from "./constants";

import Heading from "@/components/common/heading";
import Section from "@/components/common/section";

export default function CustomerVoice() {
  const { heading, subheading } = customerVoiceData;

  return (
    <Section id="customer-voice" hasArrow hasBackground hasPadding>
      <Heading heading={heading} subheading={subheading} center />
      <div className={customerVoiceStyles.container.base}>
        {customerVoiceData.reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </Section>
  );
}
