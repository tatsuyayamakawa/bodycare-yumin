"use client";

import Image from "next/image";
import heroImg from "public/images/hero.jpg";

const Hero = () => {
  return (
    <section>
      <figure>
        <Image
          src={heroImg}
          alt="手もみ整体 癒眠 待合室写真"
          sizes="100vw"
          quality={75}
          priority
          className="mx-auto desktop:rounded-lg"
        />
      </figure>
    </section>
  );
};

export default Hero;
