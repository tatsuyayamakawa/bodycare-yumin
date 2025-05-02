import { ExternalLinkIcon } from "lucide-react";

import Heading from "../../heading";
import media_01 from "../assets/media-image-01.png";
import media_02 from "../assets/media-image-02.jpg";
import media_03 from "../assets/media-image-03.jpg";
import media_04 from "../assets/media-image-04.jpg";
import { mediaData } from "../data";

import SwitchImage from "./switch-image";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const images = [media_01, media_02, media_03, media_04];

export default function Media() {
  return (
    <div className="mx-auto mt-12 xl:mt-24">
      <Heading
        heading={mediaData.heading}
        subheading={mediaData.subheading}
        center
      />
      <div className="mx-auto mt-6 flex flex-col-reverse items-center justify-center gap-6 md:flex-row md:gap-12 xl:mt-12 xl:w-[1020px]">
        <div className="w-full">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <SwitchImage
                    src={images[0]}
                    alt={mediaData.title}
                    width="640"
                    height="480"
                    images={images.map((image) => image.src)}
                    draggable={false}
                    className="aspect-[4/3] object-cover hover:cursor-pointer"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>クリックで画像が切り替わります</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="mt-4 text-center text-sm/normal lg:hidden">
            タップで画像が切り替わります
          </p>
        </div>
        <div className="border-border w-full border-2 border-dashed p-6">
          <h3 className="text-brand-primary mb-6 text-lg/normal font-semibold lg:text-2xl/normal xl:mb-12">
            {mediaData.title}
          </h3>
          <div className="mb-6 text-sm/normal lg:text-base/normal xl:mb-12 [&>p]:mb-4 lg:[&>p]:mb-6 [&>p:last-child]:mb-0">
            {mediaData.description.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          <Button variant="outline" size="lg" asChild>
            <a
              title={mediaData.link.title}
              href={mediaData.link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {mediaData.link.text}
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
