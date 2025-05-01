import Image from "next/image";

import { sections } from "../data";

export default function FlowChartContent() {
  return (
    <>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`grid grid-cols-1 items-center gap-x-8 lg:mx-auto lg:grid-cols-2 lg:gap-x-24 xl:w-[1020px] ${
            index === sections.length - 1 ? "mb-0" : "mb-12 lg:mb-24 xl:mb-36"
          }`}
        >
          <h2
            className={`font-zenmincho text-brand-primary order-1 col-span-1 mb-6 text-3xl/normal font-semibold md:col-span-2 md:text-center lg:col-span-1 lg:mb-12 lg:text-5xl/normal ${
              section.reverse
                ? "lg:col-start-1 lg:col-end-2"
                : "lg:col-start-2 lg:col-end-3"
            } lg:row-start-1 lg:text-left`}
          >
            <span className="lg:block lg:pb-4">{section.title}</span>
            {section.subtitle}
          </h2>
          <div
            className={`order-3 md:order-2 md:col-span-1 ${
              section.reverse ? "lg:col-start-1" : "lg:col-start-2"
            }`}
          >
            <div className="mt-6 text-sm/normal md:mt-0 lg:text-base/normal xl:w-[440px] [&>p]:mb-4 lg:[&>p]:mb-6 [&>p:last-child]:mb-0">
              {section.content.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
          <div
            className={`order-2 col-span-1 md:order-3 lg:row-span-2 lg:row-start-1 ${
              section.reverse
                ? "lg:col-start-2 lg:col-end-3"
                : "lg:col-start-1 lg:col-end-2"
            }`}
          >
            <Image
              src={section.image}
              alt=""
              placeholder="blur"
              draggable={false}
              className={`lg:animate-fluid pointer-events-none relative z-10 mx-auto rounded-lg md:h-[250px] md:w-[250px] md:object-cover lg:h-[400px] lg:w-[400px] ${
                section.imagePosition === "left" ? "md:object-left" : ""
              }`}
            />
          </div>
        </div>
      ))}
    </>
  );
}
