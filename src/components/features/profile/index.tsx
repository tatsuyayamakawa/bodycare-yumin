import Intro from "./components/intro";
import Media from "./components/media";
import { profileStyles } from "./constants";

import Section from "@/components/common/section";

export default function Profile() {
  const { container } = profileStyles;

  return (
    <Section hasPadding hasArrow arrowColor="brand-secondary">
      <div className={container.base}>
        <Intro />
        <Media />
      </div>
    </Section>
  );
}
