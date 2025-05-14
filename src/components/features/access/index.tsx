import GoogleMap from "../google-maps";

import StoreInfo from "./components/store-info";
import { accessData, accessStyles } from "./constants";

import Heading from "@/components/common/heading";
import Section from "@/components/common/section";

export default function Access() {
  const { heading, subheading } = accessData;
  const { container, storeInfo, map } = accessStyles;

  return (
    <Section id="access" hasArrow hasBackground hasPadding>
      <Heading heading={heading} subheading={subheading} center />
      <div className={container.base}>
        <div className={storeInfo.base}>
          <StoreInfo />
        </div>
        <div className={map.base}>
          <GoogleMap />
        </div>
      </div>
    </Section>
  );
}
