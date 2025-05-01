import Image from "next/image";

import { images } from "../assets";

export default function EmpathyImage() {
  return (
    <div className="hidden md:relative md:block md:w-[260px] lg:w-[340px] xl:w-[370px]">
      <Image
        src={images.empathy_image_01}
        alt=""
        placeholder="blur"
        draggable={false}
        className="pointer-events-none md:h-[230px] md:w-[150px] md:object-cover lg:h-[280px] lg:w-[200px] xl:h-[310px] xl:w-[220px]"
      />
      <Image
        src={images.empathy_image_02}
        alt=""
        placeholder="blur"
        draggable={false}
        className="pointer-events-none md:absolute md:top-[115px] md:left-[110px] md:-z-10 md:h-[230px] md:w-[150px] md:object-cover md:object-[10%] lg:top-[70px] lg:left-[140px] lg:h-[280px] lg:w-[200px] xl:top-[110px] xl:left-[150px] xl:h-[310px] xl:w-[220px]"
      />
    </div>
  );
}
