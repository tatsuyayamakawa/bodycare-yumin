import { ScrollAnimator } from 'react-animate-observer';

import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { ImageWrapper } from 'src/components/elements/image/ImageWrapper';
import { SvgWaveTop, SvgWaveBottom } from 'src/components/elements/image/SvgWave';
import { menus } from 'src/constants/menus';
import { observerOptions } from 'src/constants/optionObserver';

export const Menu = () => {
  return (
    <section id="menu">
      <div className="botom-0 left-0 w-full overflow-hidden">
        <SvgWaveTop />
      </div>
      <div className="bg-secondary py-[6.25rem]">
        <SectionHeading heading2="料金" heading3="Price" isAlign={true} />
        <div className="flex flex-col items-center justify-center gap-5 lg:flex-row">
          {menus.map((menu, index) => {
            return (
              <ScrollAnimator
                key={index}
                transition={{
                  transitionDelay: 0.2 + index * 0.2,
                  transitionDuration: 0.4,
                  transitionTimingFunction: 'ease-in-out',
                }}
                observerOptions={observerOptions}
                className="flex min-h-[28rem] max-w-[20rem] flex-col items-center rounded-lg bg-white shadow-lg md:mx-5 md:min-h-full md:max-w-full md:flex-row lg:mx-0 lg:min-h-[28rem] lg:max-w-[20rem] lg:flex-col"
              >
                <div className="relative">
                  <div className="h-full">
                    <ImageWrapper
                      width="320"
                      height="213"
                      src={menu.src}
                      alt={menu.title}
                      className="h-auto rounded-t-md md:rounded-l-md md:rounded-tr-none lg:rounded-t-md lg:rounded-bl-none"
                    />
                  </div>
                </div>
                <div className="mx-6 flex flex-col items-center justify-center py-8 md:basis-1/2 md:py-0 lg:basis-auto lg:py-8">
                  <h4 className="text-center font-notojp text-lg font-bold text-primary">
                    {menu.title}
                    <span className="text-sm">{menu.time}</span>
                  </h4>
                  <h5 className="mt-1 text-center font-zenmincho text-base font-bold text-primary">{menu.price}</h5>
                  <p className="mt-4 text-justify font-notojp text-sm font-normal not-italic leading-normal tracking-wide text-primary">{menu.content}</p>
                  <div className="mt-4 flex w-full">
                    <div className="rounded-lg bg-secondary/80 px-3 py-2 font-notojp text-sm not-italic tracking-wide text-primary">{menu.option}</div>
                  </div>
                </div>
              </ScrollAnimator>
            );
          })}
        </div>
      </div>
      <SvgWaveBottom />
    </section>
  );
};
