"use client";

import { Button } from "@material-tailwind/react";
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
              className="w-full bg-white px-10 py-5 font-notojp text-xl font-bold laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-primary"
                >
                  <path d="M19 2c0-1.104-.896-2-2-2h-10c-1.104 0-2 .896-2 2v20c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2v-20zm-8.5 0h3c.276 0 .5.224.5.5s-.224.5-.5.5h-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5zm1.5 20c-.553 0-1-.448-1-1s.447-1 1-1c.552 0 .999.448.999 1s-.447 1-.999 1zm5-3h-10v-14.024h10v14.024z" />
                </svg>
                LINEで予約
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-primary"
                >
                  <path d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z" />
                </svg>
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
              className="w-full bg-white py-5 font-notojp text-xl font-bold laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-primary"
                >
                  <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                </svg>
                お問い合わせ
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-primary"
                >
                  <path d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z" />
                </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href={data.sns.github} aria-label="Github" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
