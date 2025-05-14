import { ExternalLinkIcon } from "lucide-react";

import media_01 from "../assets/media-image-01.png";
import media_02 from "../assets/media-image-02.jpg";
import media_03 from "../assets/media-image-03.jpg";
import media_04 from "../assets/media-image-04.jpg";
import { mediaData } from "../constants";

import SwitchImage from "./switch-image";

import Heading from "@/components/common/heading";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const images = [media_01, media_02, media_03, media_04];

export default function Media() {
  const { heading, subheading, title, description, link } = mediaData;

  return (
    <div className="mx-auto mt-[var(--spacing-md)] xl:mt-[var(--spacing-lg)]">
      <Heading heading={heading} subheading={subheading} center />
      <div className="mx-auto mt-[var(--spacing-sm)] flex flex-col-reverse items-center justify-center gap-[var(--spacing-sm)] md:flex-row md:gap-[var(--spacing-md)] xl:mt-[var(--spacing-md)] xl:w-[1020px]">
        <div className="w-full">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <SwitchImage
                    src={images[0]}
                    alt={title}
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
        <div className="border-border w-full border-2 border-dashed p-[var(--spacing-sm)]">
          <h3 className="text-brand-primary mb-[var(--spacing-sm)] text-lg/normal font-semibold lg:text-2xl/normal xl:mb-[var(--spacing-md)]">
            {title}
          </h3>
          <div className="mb-[var(--spacing-sm)] text-sm/normal lg:text-base/normal xl:mb-[var(--spacing-md)] [&>p]:mb-4 lg:[&>p]:mb-[var(--spacing-sm)] [&>p:last-child]:mb-0">
            {description.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          <Button variant="outline" size="lg" asChild>
            <a
              title={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
