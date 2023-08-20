'use client';

import { useState } from 'react';
import { ScrollAnimator } from 'react-animate-observer';

import { Button, Dialog, DialogBody, DialogFooter, Typography } from '@material-tailwind/react';
import { FaYoutube } from 'react-icons/fa6';

import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { ImageWrapper } from 'src/components/elements/image/ImageWrapper';
import { SvgWaveTop, SvgWaveBottom } from 'src/components/elements/image/SvgWave';
import { ExternalLink } from 'src/components/elements/link/ExternalLink';
import { menus } from 'src/constants/menus';
import { observerOptions } from 'src/constants/optionObserver';

export const Menu = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

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
                  <div className="mt-4 flex w-full justify-between">
                    <div className="flex items-center rounded-lg bg-secondary/80 px-3 py-3 font-notojp text-sm not-italic tracking-wide text-primary">{menu.option}</div>
                    {index === 1 && (
                      <Button size="sm" variant="outlined" className="border border-gray-25 shadow-none" onClick={handleClick}>
                        <div className="flex items-center gap-2">
                          <FaYoutube size={24} color="red" />
                          <Typography variant="small" className="font-notojp font-normal not-italic tracking-wide text-gray-50">
                            施術の流れ
                          </Typography>
                        </div>
                      </Button>
                    )}
                    <Dialog size="lg" open={open} handler={handleClick}>
                      <DialogBody className="p-0">
                        <video className="h-full w-full rounded-t-lg" controls autoPlay muted>
                          <source src="video/basic.mp4" type="video/mp4" />
                        </video>
                      </DialogBody>
                      <DialogFooter className="justify-end">
                        <ExternalLink url="https://youtu.be/xZo39vNkaUk" ariaLabel="YOUTUBEで見る" icon={false}>
                          <Button size="sm" variant="outlined" className="border border-gray-25 shadow-none">
                            <div className="flex items-center gap-2">
                              <FaYoutube size={24} color="red" />
                              <Typography variant="small" className="font-notojp font-normal not-italic tracking-wide text-gray-50">
                                YOUTUBEで見る
                              </Typography>
                            </div>
                          </Button>
                        </ExternalLink>
                      </DialogFooter>
                    </Dialog>
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
