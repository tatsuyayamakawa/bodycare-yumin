import { Button } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import { FaMobileScreenButton } from 'react-icons/fa6';

import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { ImageWrapper } from 'src/components/elements/image/ImageWrapper';
import { SvgWaveTop, SvgWaveBottom } from 'src/components/elements/image/SvgWave';
import { ExternalLink } from 'src/components/elements/link/ExternalLink';
import { data } from 'src/constants/data';
import { menus } from 'src/constants/menus';
import { container, item, scale } from 'src/constants/motion';

export const Menu = () => {
  return (
    <section id="menu">
      <div className="botom-0 left-0 w-full overflow-hidden">
        <SvgWaveTop />
      </div>
      <div className="bg-secondary py-[6.25rem]">
        <SectionHeading heading2="料金" heading3="Price" isAlign={true} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={container}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-5 lg:flex-row"
        >
          {menus.map((menu) => {
            return (
              <motion.div
                variants={item}
                className="flex min-h-[28rem] max-w-[20rem] flex-col items-center rounded-lg bg-white shadow-lg md:mx-5 md:min-h-full md:max-w-full md:flex-row lg:mx-0 lg:min-h-[28rem] lg:max-w-[20rem] lg:flex-col [&:nth-child(2)]:border-4 [&:nth-child(2)]:border-gray-300 [&:nth-child(2)]:bg-gray-100"
                key={menu.id}
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
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scale}
          viewport={{ once: true }}
          className="mx-10 mb-4 mt-8 flex flex-col items-center justify-center"
        >
          <ExternalLink url={data.sns.line} icon={false} ariaLabel="LINEで予約する">
            <Button variant="filled" size="lg" color="green" ripple={true} fullWidth={false} className="bg-green font-notojp text-lg font-bold text-white">
              <div className="flex items-center justify-center gap-4">
                <FaMobileScreenButton size={24} />
                LINEで予約する
              </div>
            </Button>
          </ExternalLink>
          <p className="mt-4 font-notojp text-sm font-normal not-italic tracking-wide text-gray-50">
            <ExternalLink url="https://kosodate.pref.yamagata.jp/passport" ariaLabel="やまがた子育て応援パスポート公式サイト" className="underline">
              子育て応援パスポート
            </ExternalLink>
            のご提示で&#34;10%割引&#34;
          </p>
        </motion.div>
      </div>
      <SvgWaveBottom />
    </section>
  );
};
