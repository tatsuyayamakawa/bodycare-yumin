"use client";

import { FaInstagram, FaGithub } from "react-icons/fa";
import { SiQiita } from "react-icons/si";
import { Button } from "@material-tailwind/react";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Data from "@/data/data.json";
import { motion } from "framer-motion";
import { scale } from "@/utiles/motion";

const data = Data.data;

const Footer = () => {
  return (
    <footer className="bg-secondary py-10 text-lg font-normal laptop:px-10">
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
              className="w-full bg-white px-10 py-5 font-notojp text-lg font-bold text-primary laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-3">
                <DevicePhoneMobileIcon strokeWidth={2} className="h-7 w-7" />
                LINEで予約
                <ChevronRightIcon strokeWidth={2} className="h-7 w-7" />
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
              className="w-full bg-white py-5 font-notojp text-lg font-bold text-primary laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-3 ">
                <EnvelopeIcon strokeWidth={2} className="h-7 w-7" />
                お問い合わせ
                <ChevronRightIcon strokeWidth={2} className="h-7 w-7" />
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
        <div className="flex flex-col items-center justify-between ">
          <small className="mx-10 mb-5 font-notojp text-sm font-normal">
            &copy; 手もみ整体 癒眠
          </small>
          <p className="font-notojp text-sm font-normal">
            《適格請求書発行事業者登録番号》
          </p>
          <p className="font-notojp text-sm font-normal">T8 8108 1135 4453</p>
        </div>
        <div className="mx-10 flex justify-center gap-10 font-notojp text-sm font-normal">
          <a href={data.sns.instagram} aria-label="Instagram" target="_blank">
            <FaInstagram fontSize={40} />
          </a>
          <a href={data.sns.github} aria-label="Github" target="_blank">
            <FaGithub fontSize={40} />
          </a>
          <a href={data.sns.qiita} aria-label="Qiita" target="_blank">
            <SiQiita fontSize={40} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
