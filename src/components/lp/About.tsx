import { ScrollAnimator } from 'react-animate-observer';

import Image from 'next/image';

import aboutImage from 'public/images/about.jpg';
import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { slideInLeftAnimation, slideInRightAnimation } from 'src/constants/motion';

export const About = () => {
  return (
    <section id="about">
      <div className="mt-[6.25rem] max-w-[62rem] lg:mx-5 xl:mx-auto">
        <SectionHeading heading2="癒眠について" heading3="About" isAlign={false} />
        <div className="lg:relative lg:mb-[46.875rem]">
          <ScrollAnimator
            {...slideInLeftAnimation}
            className="z-20 bg-secondary/80 px-5 py-5 backdrop-blur-xl lg:absolute lg:left-0 lg:top-[6.25rem] lg:max-w-[30.75rem] lg:rounded-lg lg:px-[3.125rem] lg:py-[2.125rem] [&>p]:py-4 [&>p]:font-notojp [&>p]:text-base [&>p]:font-normal [&>p]:not-italic [&>p]:leading-relaxed [&>p]:tracking-wide [&>p]:text-gray-75 lg:[&>p]:tracking-widest"
          >
            <p>日頃の生活で凝り固まった筋肉や骨格のゆがみによる神経の圧迫、さらには精神的なストレスなどが重なると、倦怠感、不眠症、頭痛など、自律神経の乱れを引き起こします。</p>
            <p>自律神経の健康な状態を維持するためには、交感神経と副交感神経をバランスよく調整するのがとても大切です。</p>
            <p>当店では深層筋、骨格への整体アプローチにより本来の健康な体を取り戻すために必要な自然治癒力を高めるお手伝いをいたします。</p>
            <p>身体的なお悩みはもちろん、お時間の許す限り全てを打ち明けて身体も心もスッキリしましょう。</p>
          </ScrollAnimator>
          <ScrollAnimator {...slideInRightAnimation}>
            <figure>
              <Image
                src={aboutImage}
                width={618}
                height={414}
                alt="アロマディフューザーと骨格模型"
                sizes="100vw"
                quality={75}
                priority
                className="m-auto mt-6 hidden h-auto rounded-lg lg:absolute lg:right-0 lg:top-0 lg:block"
              />
            </figure>
          </ScrollAnimator>
        </div>
      </div>
    </section>
  );
};
