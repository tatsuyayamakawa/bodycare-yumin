import { Button } from '@material-tailwind/react';
import { motion } from 'framer-motion';

import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { SvgWaveTop } from 'src/components/elements/icon/SvgIcons';
import { SvgArrowRight, SvgMobilePhone, SvgMail } from 'src/components/elements/icon/SvgIcons';
import { LogoLink } from 'src/components/elements/nav/LogoLink';
import { scale } from 'src/constants/motion';
import { GoogleMaps } from 'src/libs/google-maps/google-maps';

export const Access = () => {
  return (
    <section id="access">
      <SvgWaveTop />
      <div className="bg-secondary py-[6.25rem]">
        <div className="container">
          <SectionHeading heading2="アクセス" heading3="Access" isAlign={true} />
          <div className="mx-5 flex flex-col justify-center gap-10 lg:flex-row">
            <div className="flex flex-col md:basis-2/5">
              <LogoLink />
              <div className="mt-5 font-notojp text-base font-normal leading-relaxed tracking-wide text-gray-75">
                <div>〒990-0851</div>
                <div className="flex flex-row gap-1">
                  <div className="mr-2">山形県山形市大字上椹沢195-2</div>
                  <div className="rounded-2xl bg-primary px-2 py-1 text-xs text-white">
                    <a href="https://goo.gl/maps/29tNCDiTSxQLgRm79" target="_blank" aria-label="Google map">
                      Google map
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-col gap-5">
                <motion.div initial="hidden" whileInView="visible" variants={scale} viewport={{ once: true }} className="w-full">
                  <a href="https://lin.ee/wzPQgmv" target="_blank" aria-label="LINEで予約する">
                    <Button variant="filled" size="lg" color="white" ripple={true} fullWidth={true} className="bg-white font-notojp text-lg font-bold text-primary">
                      <div className="flex items-center justify-center gap-4">
                        <SvgMobilePhone />
                        LINEで予約
                        <SvgArrowRight />
                      </div>
                      <div className="mt-2 text-xs font-normal text-gray-50">当日受付 9:00 ～ 15:00 木曜日定休</div>
                    </Button>
                  </a>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" variants={scale} viewport={{ once: true }} className="w-full">
                  <a href="https://forms.gle/a8qo8Cr1snXYHTMp8" target="_blank" aria-label="お問い合わせ">
                    <Button variant="filled" size="lg" color="white" ripple={true} fullWidth={true} className="bg-white font-notojp text-lg font-bold text-primary">
                      <div className="flex items-center justify-center gap-4">
                        <SvgMail />
                        お問い合わせ
                        <SvgArrowRight />
                      </div>
                      <div className="mt-2 text-xs font-normal text-gray-50">不明な点はお問い合わせください</div>
                    </Button>
                  </a>
                </motion.div>
              </div>
            </div>
            <div className="h-[50vh] md:basis-3/5">
              <GoogleMaps />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
