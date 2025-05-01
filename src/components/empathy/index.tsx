import Image from "next/image";

import Section from "../section";

import { images } from "./assets";
import EmpathyImage from "./components/empathy-image";
import EmpathyList from "./components/empathy-list";
import EmpathyTitle from "./components/empathy-title";
import { lists } from "./data";

export default function Empathy() {
  return (
    <Section padding className="relative">
      <div className="md:flex md:flex-row md:justify-center md:gap-8 lg:gap-12 xl:ml-34 xl:justify-start">
        <EmpathyImage />
        <EmpathyList lists={lists} />
      </div>
      <EmpathyTitle />
      <Image
        src={images.empathy_image_03}
        alt=""
        draggable={false}
        className="pointer-events-none absolute right-0 bottom-0 -z-10 block w-[300px] opacity-30 md:hidden 2xl:block 2xl:w-[350px] 2xl:opacity-100"
      />
    </Section>
  );
}
