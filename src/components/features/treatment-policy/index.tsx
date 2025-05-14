import Intro from "./components/intro";
import Policy from "./components/policy";
import { treatmentPolicyStyles } from "./constants";

import Section from "@/components/common/section";

export default function TreatmentPolicy() {
  const { container } = treatmentPolicyStyles;

  return (
    <Section hasPadding hasArrow arrowColor="brand-secondary">
      <div className={container.base}>
        <Intro />
        <Policy />
      </div>
    </Section>
  );
}
