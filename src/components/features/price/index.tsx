import PriceCard from "./components/price-card";
import VideoDialog from "./components/video-dialog";
import { menus, priceStyles } from "./constants";

import Heading from "@/components/common/heading";
import Section from "@/components/common/section";

export default function Price() {
  const { heading, subheading, prices } = menus;
  const { cardContainer, videoContainer } = priceStyles;

  return (
    <Section hasArrow hasBackground hasPadding>
      <Heading heading={heading} subheading={subheading} center />
      <div className={cardContainer.base}>
        <div className="flex flex-col justify-center gap-8 md:flex-row">
          {prices.map((price, index) => (
            <PriceCard key={index} price={price} />
          ))}
        </div>
      </div>
      <div className={videoContainer.base}>
        <VideoDialog />
      </div>
    </Section>
  );
}
