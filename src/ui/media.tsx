import { ScrollAnimator } from 'react-animate-observer';

import { Typography } from '@material-tailwind/react';

import { ImageWrapper } from './image-wrapper';
import { fadeUpComponent } from '../constants/motion';
import { observerOptions } from '../constants/observer-options';
import mediaImage01 from '../public/images/media-01.jpg';
import mediaImage02 from '../public/images/media-02.png';

export const Media = () => {
  const heading2 = '不眠症改善の専門家として紹介されました';

  return (
    <section>
      <div className="my-[6.25rem] max-w-[62rem] md:mx-5 lg:mx-auto">
        <Typography variant="h2" className="mx-5 mb-10 text-center font-notojp text-3xl font-medium leading-relaxed tracking-wide text-accent lg:text-4xl">
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
        </Typography>
        <ScrollAnimator {...fadeUpComponent} observerOptions={observerOptions} className="flex flex-col items-center justify-between gap-10 bg-gray-10 p-10 md:rounded-lg lg:flex-row lg:p-10">
          <ImageWrapper width="328" height="467" src={mediaImage01} alt="はつらつ元気 2014年9月号" className="h-auto" />
          <ImageWrapper width="640" height="426" src={mediaImage02} alt="特集掲載ページ" className="h-auto" />
        </ScrollAnimator>
      </div>
    </section>
  );
};
