"use client";

import ImageWrapper from "./parts/ImageWrapper";
import profileImage from "public/images/profile.jpg";
import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { scale, display } from "@/utiles/motion";

const Profile = () => {
  const heading2 = "整体師";
  const heading3 = "山川 達也";
  const heading4 = "東洋カイロプラクティック専門学院卒";

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
      <div className="my-24 flex items-center mobile:mx-10 mobile:flex-col mobile:gap-10 laptop:mx-20 laptop:flex-row laptop:gap-20 desktop:mx-52">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scale}
          viewport={{ once: true }}
        >
          <figure className="mask">
            <ImageWrapper src={profileImage} alt="山川 達也 ポートレート" />
          </figure>
        </motion.div>
        <div>
          <h2 className="mb-6 font-notojp font-medium text-accent mobile:text-2xl laptop:text-3xl">
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
          <h3 className="mb-10 font-zenmincho font-bold text-primary mobile:text-4xl laptop:text-5xl">
            {heading3.split(" ").map((word, index) => {
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
          </h3>
          <h4 className="mb-6 font-notojp font-medium text-primary mobile:text-xl laptop:text-2xl">
            {heading4.split(" ").map((word, index) => {
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
          </h4>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={display}
            viewport={{ once: true }}
            className="[&>p]:py-4 [&>p]:font-notojp [&>p]:text-base [&>p]:tracking-widest"
          >
            <p>
              当店は2012年8月に開業した一軒家の一室を利用して施術を行っている整体サロンです。
            </p>
            <p>
              東洋整体術（東洋カイロプラクティック）はカイロプラクティックと整体に中国の推拿の技術を取り入れて発展された独自技術になります。
            </p>
            <p>
              手もみ中心ですので初めての方でも安心して受けていただけますが、要望をお聞きしながらおひとりおひとりに合った施術をさせていただきます。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
