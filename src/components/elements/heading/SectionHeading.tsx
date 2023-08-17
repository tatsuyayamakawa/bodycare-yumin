import { ScrollAnimator } from 'react-animate-observer';

import type { SectionHeadingProps } from 'src/@types/global';

export const SectionHeading = ({ heading2, heading3, isAlign = true }: SectionHeadingProps) => {
  return (
    <div className={isAlign ? 'my-10 text-center' : 'my-10'}>
      <h2 aria-label={`${heading2}`} role="heading" className="mx-10 mb-5 font-zenmincho text-4xl font-bold not-italic leading-normal text-primary lg:text-5xl">
        {heading2.split(' ').map((word, index) => {
          return (
            <ScrollAnimator key={index} start={{ opacity: 0 }} end={{ opacity: 1 }} className="inline-block">
              {word.split('').map((character, index) => (
                <ScrollAnimator
                  key={index}
                  start={{ opacity: 0 }}
                  end={{ opacity: 1 }}
                  transition={{
                    transitionDelay: 0.25 + index * 0.1,
                    transitionDuration: 0.4,
                    transitionTimingFunction: 'ease-in-out',
                  }}
                  className="inline-block"
                >
                  {character}
                </ScrollAnimator>
              ))}
            </ScrollAnimator>
          );
        })}
      </h2>
      <h3 aria-label={`${heading3}`} role="heading" className="mx-10 mb-10 font-allura text-3xl font-normal not-italic leading-normal text-accent lg:text-[2.5rem]">
        {heading3.split(' ').map((word, index) => {
          return (
            <ScrollAnimator key={index} start={{ opacity: 0 }} end={{ opacity: 1 }} className="inline-block">
              {word.split('').map((character, index) => (
                <ScrollAnimator
                  key={index}
                  start={{ opacity: 0 }}
                  end={{ opacity: 1 }}
                  transition={{
                    transitionDelay: 0.25 + index * 0.1,
                    transitionDuration: 0.4,
                    transitionTimingFunction: 'ease-in-out',
                  }}
                  className="inline-block"
                >
                  {character}
                </ScrollAnimator>
              ))}
            </ScrollAnimator>
          );
        })}
      </h3>
    </div>
  );
};
