import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useAnimation, motion } from 'framer-motion';

import type { SectionHeadingProps } from 'src/@types/global';

export const SectionHeading = ({ heading2, heading3, isAlign = true }: SectionHeadingProps) => {
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
    <div className={isAlign ? 'my-10 text-center' : 'my-10'}>
      <h2 aria-label={`${heading2}`} role="heading" className="mx-10 mb-5 font-zenmincho text-4xl font-bold not-italic leading-normal text-primary lg:text-5xl">
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
      <h3 aria-label={`${heading3}`} role="heading" className="mx-10 mb-10 font-allura text-3xl font-normal not-italic leading-normal text-accent lg:text-[2.5rem]">
        {heading3.split(' ').map((word, index) => {
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
      </h3>
    </div>
  );
};
