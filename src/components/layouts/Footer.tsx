"use client";

import {
  SvgArrowRight,
  SvgMobilePhone,
  SvgMail,
  SvgInstagram,
  SvgThreads,
  SvgGithub,
} from "@/components/parts/SvgIcons";
import { notojp } from "@/utiles/fonts";
import { Button } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { scale } from "@/utiles/motion";

const Footer = () => {
  return (
    <footer className={`${notojp.variable} bg-secondary py-10 laptop:px-10`}>
      <div className="mx-10 mb-20 mt-10 flex flex-col items-center justify-center gap-10 laptop:flex-row laptop:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scale}
          viewport={{ once: true }}
          className="w-full laptop:w-1/2 desktop:w-2/6"
        >
          <a
            href="https://lin.ee/wzPQgmv"
            aria-label="LINEで予約"
            target="_blank"
          >
            <Button
              color="white"
              className="w-full bg-white px-10 py-5 font-notojp text-xl font-bold tracking-wide laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-4 text-primary">
                <SvgMobilePhone />
                LINEで予約
                <SvgArrowRight />
              </div>
              <div className="mt-2 text-xs font-normal text-gray-50 laptop:text-sm">
                当日受付 9:00 ～ 15:00 木曜日定休
              </div>
            </Button>
          </a>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scale}
          viewport={{ once: true }}
          className="w-full laptop:w-1/2 desktop:w-2/6"
        >
          <a
            href="https://forms.gle/a8qo8Cr1snXYHTMp8"
            aria-label="お問い合わせ"
            target="_blank"
          >
            <Button
              color="white"
              className="w-full bg-white py-5 font-notojp text-xl font-bold tracking-wide laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-4 text-primary">
                <SvgMail />
                お問い合わせ
                <SvgArrowRight />
              </div>
              <div className="mt-2 text-xs font-normal text-gray-50 laptop:text-sm">
                不明な点はお問い合わせください
              </div>
            </Button>
          </a>
        </motion.div>
      </div>
      <div className="mx-10 my-10 border border-gray-25/20" />
      <div className="mx-10 flex flex-col items-center justify-between gap-10 laptop:flex-row">
        <div className="flex flex-col items-center justify-between">
          <small className="mx-10 mb-5 font-notojp text-sm font-normal tracking-normal">
            &copy; 手もみ整体 癒眠
          </small>
          <p className="font-notojp text-sm font-normal tracking-normal">
            《適格請求書発行事業者登録番号》
          </p>
          <p className="font-notojp text-sm font-normal tracking-normal">
            T8 8108 1135 4453
          </p>
        </div>
        <div className="mx-10 flex items-center justify-center gap-10">
          <SvgInstagram />
          <SvgThreads />
          <SvgGithub />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
