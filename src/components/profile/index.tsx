import Section from "../section";

import Intro from "./components/intro";
import Media from "./components/media";

export default function Profile() {
  return (
    <Section padding>
      <Intro />
      <Media />
    </Section>
  );
}
