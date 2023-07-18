"use client";

import SectionHeader from "@/components/parts/SectionHeader";
import Image from "next/image";
import aboutImage from "public/images/about.png";
import { motion } from "framer-motion";
import { left, right } from "@/utiles/motion";

const About = () => {
  return (
    <section id="about" className="laptop:container">
      <div className="my-24 laptop:mx-10 desktop:mx-40">
        <SectionHeader
          heading2="癒眠について"
          heading3="About"
          isAlign={false}
        />
        <div className="laptop:relative laptop:mb-[42rem]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={left}
            viewport={{ once: true }}
            className="bg-secondary px-10 py-6 laptop:absolute laptop:left-0 laptop:top-24 laptop:z-20 laptop:max-w-[492px] laptop:rounded-lg [&>p]:py-4 [&>p]:font-notojp [&>p]:text-base [&>p]:tracking-widest"
          >
            <p>
              日常生活で凝り固まった筋肉や外から受ける精神的なストレスは交感神経を刺激し、倦怠感、不眠症、頭痛などあらゆる身体的症状を引き起こします。
            </p>
            <p>
              自律神経の調整には交感神経と副交感神経のバランスがとても大事です。
            </p>
            <p>
              当店では深層筋への整体アプローチにより、本来の健康な体を取り戻すために必要な自然治癒力を高めるお手伝いをいたします。
            </p>
            <p>
              身体的なお悩みはもちろん、お時間の許す限り全てを打ち明けて身体も心もスッキリしましょう。
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={right}
            viewport={{ once: true }}
          >
            <figure>
              <Image
                src={aboutImage}
                width={618}
                height={414}
                alt="アロマディフューザーと骨格模型"
                quality={75}
                className="m-auto mt-6 hidden rounded-lg laptop:absolute laptop:right-0 laptop:top-0 laptop:z-10 laptop:block"
              />
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
