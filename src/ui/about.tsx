import { ScrollAnimator } from 'react-animate-observer';

import { Typography } from '@material-tailwind/react';
import Image from 'next/image';

import { Heading } from './heading';
import { fadeUpComponent, slideInRightAnimation } from '../constants/motion';
import { observerOptions } from '../constants/observer-options';
import aboutImage from '../public/images/about.jpg';

export const About = () => {
  return (
    <section id="about">
      <div className="mx-auto mt-[6.25rem] max-w-[62rem]">
        <Heading heading2="癒眠について" heading3="About" isAlign={false} />
        <div className="md:relative md:mb-[46.875rem]">
          <ScrollAnimator
            {...fadeUpComponent}
            observerOptions={observerOptions}
            className="z-20 bg-secondary/80 px-5 py-5 backdrop-blur-xl md:absolute md:left-0 md:top-[6.25rem] md:max-w-[30.75rem] md:rounded-lg md:px-[3.125rem] md:py-[2.125rem]"
          >
            <Typography variant="paragraph" className="py-4 text-justify font-notojp font-normal tracking-wide">
              日々のストレス、不規則な生活習慣などが重なると交感神経優位となり、自律神経は乱れ、倦怠感、不眠症、頭痛などを引き起こします。
            </Typography>
            <Typography variant="paragraph" className="py-4 text-justify font-notojp font-normal tracking-wide">
              自律神経の正常な状態を維持するためには、交感神経と副交感神経どちらもバランスよく調整することが大切です。
            </Typography>
            <Typography variant="paragraph" className="py-4 text-justify font-notojp font-normal tracking-wide">
              当院では深層筋への整体アプローチによる筋肉ストレスの緩和、そして骨格矯正による神経圧迫の調整により副交感神経の働きを高めることで、健康な体を取り戻すためのお手伝いをいたします。
            </Typography>
            <Typography variant="paragraph" className="py-4 text-justify font-notojp font-normal tracking-wide">
              身体的なお悩みはもちろん、お時間の許す限り全てを打ち明けて身体も心もスッキリしましょう。
            </Typography>
          </ScrollAnimator>
          <ScrollAnimator {...slideInRightAnimation} observerOptions={observerOptions}>
            <figure>
              <Image
                src={aboutImage}
                width={618}
                height={414}
                alt="アロマディフューザーと骨格模型"
                sizes="100vw"
                quality={75}
                priority
                className="m-auto mt-6 hidden h-auto rounded-lg md:absolute md:right-0 md:top-0 md:block"
              />
            </figure>
          </ScrollAnimator>
        </div>
      </div>
    </section>
  );
};
