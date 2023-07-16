"use client";

import Image from "next/image";
import heroImg from "public/images/hero.png";

const Hero = () => {
  return (
    <section>
      <figure>
        <Image
          src={heroImg}
          width={1152}
          height={480}
          alt="手もみ整体 癒眠 待合室写真"
          quality={75}
          placeholder="blur"
          className="mx-auto desktop:rounded-lg"
        />
      </figure>
    </section>
  );
};

export default Hero;
