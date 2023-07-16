"use client";

import ImageWrapper from "./parts/ImageWrapper";
import media01Image from "public/images/media-01.png";
import media02Image from "public/images/media-02.png";
import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { display } from "@/utiles/motion";

const Media = () => {
  const heading2 = "不眠症改善の専門家として全国誌掲載されました！";

  const ctrls = useAnimation();

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      ctrls.start("visible");
    }
    if (!inView) {
      ctrls.start("hidden");
    }
  }, [ctrls, inView]);

  const wordAnimation = {
    hidden: {},
    visible: {},
  };

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <section className="laptop:container">
      <div className="my-24 tablet:mx-10 desktop:mx-40">
        <h2 className="mb-10 text-center font-notojp font-bold text-accent mobile:mx-10 mobile:text-2xl laptop:text-4xl">
          {heading2.split(" ").map((word, index) => {
            return (
              <motion.div
                ref={ref}
                aria-hidden="true"
                key={index}
                initial="hidden"
                animate={ctrls}
                variants={wordAnimation}
                transition={{
                  delayChildren: index * 0.25,
                  staggerChildren: 0.05,
                }}
                className="inline-block"
              >
                {word.split("").map((character, index) => (
                  <motion.div
                    aria-hidden="true"
                    key={index}
                    variants={characterAnimation}
                    className="inline-block"
                  >
                    {character}
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={display}
          viewport={{ once: true }}
          className="flex items-center justify-between gap-10 bg-gray-10 p-10 mobile:flex-col tablet:rounded-lg laptop:flex-row"
        >
          <ImageWrapper src={media01Image} alt="はつらつ元気 2014年9月号" />
          <ImageWrapper src={media02Image} alt="特集掲載ページ" />
        </motion.div>
      </div>
    </section>
  );
};

export default Media;
