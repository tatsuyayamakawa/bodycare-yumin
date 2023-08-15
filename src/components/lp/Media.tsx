import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useAnimation, motion } from 'framer-motion';

import { ImageWrapper } from '@/components/elements/image/ImageWrapper';

import media01Image from 'public/images/media-01.jpg';
import media02Image from 'public/images/media-02.png';
import { display } from 'src/constants/motion';

export const Media = () => {
  const heading2 = '不眠症改善の専門家として全国誌掲載されました';

  const ctrls = useAnimation();

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      ctrls.start('visible');
    }
    if (!inView) {
      ctrls.start('hidden');
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
    <section className="container">
      <div className="mx-auto my-[6.25rem] max-w-[62rem]">
        <h2 className="mx-5 mb-10 text-center font-notojp text-3xl font-bold not-italic leading-normal tracking-normal text-accent lg:text-4xl">
          {heading2.split(' ').map((word, index) => {
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
                {word.split('').map((character, index) => (
                  <motion.div aria-hidden="true" key={index} variants={characterAnimation} className="inline-block">
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
          className="flex flex-col items-center justify-between gap-5 bg-gray-10 p-5 md:rounded-lg lg:flex-row lg:p-10"
        >
          <ImageWrapper width="328" height="467" src={media01Image} alt="はつらつ元気 2014年9月号" className="h-auto" />
          <ImageWrapper width="640" height="426" src={media02Image} alt="特集掲載ページ" className="h-auto" />
        </motion.div>
      </div>
    </section>
  );
};
