import Image from "next/image";

import { images } from "./assets";
import EmpathyImage from "./components/empathy-image";
import EmpathyList from "./components/empathy-list";
import EmpathyTitle from "./components/empathy-title";
import { empathyStyles, lists } from "./constants";

import Section from "@/components/common/section";

export default function Empathy() {
  const { container, content, background } = empathyStyles;

  return (
    <Section hasPadding className={container.base}>
      <div className={content.base}>
        <EmpathyImage />
        <EmpathyList lists={lists} />
      </div>
      <EmpathyTitle />
      <Image
        src={images.empathy_image_03}
        alt=""
        draggable={false}
        className={background.base}
      />
    </Section>
  );
}
