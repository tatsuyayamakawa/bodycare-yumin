import { ScrollAnimator } from 'react-animate-observer';

import { ImageWrapper } from '@/components/elements/image/ImageWrapper';

import media01Image from 'public/images/media-01.jpg';
import media02Image from 'public/images/media-02.png';
import { fadeUpComponent } from 'src/constants/motion';
import { observerOptions } from 'src/constants/optionObserver';

export const Media = () => {
  const heading2 = '不眠症改善の専門家として全国誌掲載されました';

  return (
    <section className="container">
      <div className="mx-auto my-[6.25rem] max-w-[62rem]">
        <h2 className="mx-5 mb-10 text-center font-notojp text-3xl font-bold not-italic leading-normal tracking-normal text-accent lg:text-4xl">
          {heading2.split(' ').map((word, index) => {
            return (
              <ScrollAnimator key={index} start={{ opacity: 0 }} end={{ opacity: 1 }} observerOptions={observerOptions} className="inline-block">
                {word.split('').map((character, index) => (
                  <ScrollAnimator
                    key={index}
                    start={{ opacity: 0 }}
                    end={{ opacity: 1 }}
                    transition={{
                      transitionDelay: 0.25 + index * 0.025,
                      transitionDuration: 0.4,
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    observerOptions={observerOptions}
                    className="inline-block"
                  >
                    {character}
                  </ScrollAnimator>
                ))}
              </ScrollAnimator>
            );
          })}
        </h2>
        <ScrollAnimator
          {...fadeUpComponent}
          observerOptions={observerOptions}
          className="flex flex-col items-center justify-between gap-5 bg-gray-10 p-5 md:rounded-lg lg:flex-row lg:p-10"
        >
          <ImageWrapper width="328" height="467" src={media01Image} alt="はつらつ元気 2014年9月号" className="h-auto" />
          <ImageWrapper width="640" height="426" src={media02Image} alt="特集掲載ページ" className="h-auto" />
        </ScrollAnimator>
      </div>
    </section>
  );
};
