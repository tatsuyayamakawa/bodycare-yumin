import GoogleMaps from "../google-maps";
import Heading from "../heading";
import Section from "../section";

import AccessInfo from "./components/info";
import { accessData } from "./data";

export default function Access() {
  return (
    <Section arrow bgColor padding>
      <Heading
        heading={accessData.heading}
        subheading={accessData.subheading}
        center
      />
      <div className="mt-6 flex flex-col items-center gap-6 rounded-lg lg:flex-row lg:gap-0 xl:mt-12">
        <AccessInfo />
        <div className="h-full w-full">
          <GoogleMaps />
        </div>
      </div>
    </Section>
  );
}
