import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SectionHeader = ({
  heading2,
  heading3,
  isAlign = true,
}: SectionProps) => {
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
    <div
      className={
        isAlign ? "my-10 text-center" : "my-10 mobile:mx-10 laptop:mx-14"
      }
    >
      <h2
        aria-label={`${heading2}`}
        role="heading"
        className="mb-4 font-zenmincho font-bold leading-relaxed text-primary mobile:text-3xl laptop:text-5xl"
      >
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
      <h3
        aria-label={`${heading3}`}
        role="heading"
        className="font-allura font-normal leading-normal text-accent mobile:text-2xl laptop:text-4xl"
      >
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
    </div>
  );
};

export default SectionHeader;
