"use client";

import HeadingTemp from "@/components/parts/SectionHeader";
import { Button } from "@material-tailwind/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import ImageWrapper from "./parts/ImageWrapper";
import menuImg01 from "public/images/menu-01.jpg";
import menuImg02 from "public/images/menu-02.jpg";
import menuImg03 from "public/images/menu-03.jpg";
import { motion } from "framer-motion";
import { container, item, scale } from "@/utiles/motion";

const Menu = () => {
  const menus: MenuItem[] = [
    {
      id: 1,
      src: menuImg01,
      title: "リラックス",
      time: "（45分）",
      price: "￥3,000",
      content:
        "短めのショートプランです。整体が初めての方やちょっと体をほぐしたいという方はこちらがおすすめです。骨格矯正は含みません。",
    },
    {
      id: 2,
      src: menuImg02,
      title: "ベーシック",
      time: "（75分）",
      price: "￥5,000",
      content:
        "当店基本プランです。骨格の歪みを確認しながら全身を丁寧にほぐし、矯正をして整えます。単純に長めがご希望の方もこちらです。",
    },
    {
      id: 3,
      src: menuImg03,
      title: "スペシャル",
      time: "（90分）",
      price: "￥8,000",
      content:
        "マッサージクリームを使った足の疲れやむくみに効果的な足つぼと表情筋をほぐすリラックス効果のある顔整体が付いた当店のスペシャル整体です。",
    },
  ];

  return (
    <section id="menu">
      <div className="botom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="block h-10 w-[calc(200%_+_1.3px)] origin-center rotate-180 desktop:h-20"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-secondary"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-secondary"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-secondary"
          ></path>
        </svg>
      </div>
      <div className="bg-secondary pb-24 pt-14">
        <HeadingTemp heading2="料金" heading3="Price" isAlign={true} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={container}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-6 laptop:container laptop:flex-row"
        >
          {menus.map((menu) => {
            return (
              <motion.div
                variants={item}
                className="mx-10 flex min-h-[430px] flex-col rounded-lg bg-white shadow-lg tablet:max-w-md laptop:mx-0 laptop:max-w-[295px] desktop:max-w-xs [&:nth-child(2)]:border-4 [&:nth-child(2)]:border-gray-300 [&:nth-child(2)]:bg-gray-100"
                key={menu.id}
              >
                <ImageWrapper
                  src={menu.src}
                  alt={menu.title}
                  className="rounded-t-md"
                />
                <div className="mx-6 mb-6 mt-8">
                  <h4 className="mb-1 text-center font-notojp text-lg font-bold text-primary">
                    {menu.title}
                    <span className="text-sm">{menu.time}</span>
                  </h4>
                  <h5 className="mb-6 text-center font-zenmincho text-base font-bold text-primary">
                    {menu.price}
                  </h5>
                  <p className="font-notojp text-sm font-normal leading-5 tracking-widest text-primary">
                    {menu.content}
                  </p>
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
          className="mx-10 mb-4 mt-8 flex flex-col items-center"
        >
          <a href="https://lin.ee/wzPQgmv" target="_blank" className="mx-auto">
            <Button
              color="green"
              className="flex gap-4 px-10 py-5 font-notojp text-xl font-bold laptop:text-2xl"
            >
              <div className="flex items-center justify-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-white"
                >
                  <path d="M17 3v-2c0-.552.447-1 1-1s1 .448 1 1v2c0 .552-.447 1-1 1s-1-.448-1-1zm-12 1c.553 0 1-.448 1-1v-2c0-.552-.447-1-1-1-.553 0-1 .448-1 1v2c0 .552.447 1 1 1zm13 13v-3h-1v4h3v-1h-2zm-5 .5c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5-4.5 2.019-4.5 4.5zm11 0c0 3.59-2.91 6.5-6.5 6.5s-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5zm-14.237 3.5h-7.763v-13h19v1.763c.727.33 1.399.757 2 1.268v-9.031h-3v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-9v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-3v21h11.031c-.511-.601-.938-1.273-1.268-2z" />
                </svg>
                LINEで予約する
              </div>
            </Button>
          </a>
          <p className="mt-8 font-notojp text-sm font-normal text-gray-50">
            <a
              href="https://kosodate.pref.yamagata.jp/passport"
              target="_blank"
              className="underline"
            >
              子育て応援パスポート
            </a>
            のご提示で&#34;10%割引&#34;できます！
          </p>
        </motion.div>
      </div>
      <div className="left-0 top-0 w-full overflow-hidden leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="block h-10 w-[calc(200%_+_1.3px)] desktop:h-20"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-secondary"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-secondary"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-secondary"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Menu;
