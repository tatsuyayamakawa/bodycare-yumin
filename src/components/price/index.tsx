import Heading from "../heading";
import Section from "../section";

import PriceCard from "./components/price-card";
import VideoDialog from "./components/video-dialog";
import { menus } from "./data";

export default function Price() {
  return (
    <Section arrow bgColor padding>
      <Heading heading={menus.heading} subheading={menus.subheading} center />
      <div className="mx-auto mt-6 lg:w-[740px] xl:mt-12">
        <div className="flex flex-col justify-center gap-8 md:flex-row">
          {menus.prices.map((price, index) => (
            <PriceCard key={index} price={price} />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 lg:w-[720px]">
        <VideoDialog />
      </div>
    </Section>
  );
}
