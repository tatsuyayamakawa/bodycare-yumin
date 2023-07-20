"use client";

import HeadingTemp from "@/components/parts/SectionHeader";
import ImageWrapper from "./parts/ImageWrapper";
import menuImg01 from "public/images/menu-01.jpg";
import menuImg02 from "public/images/menu-02.jpg";
import menuImg03 from "public/images/menu-03.jpg";
import {
  SvgWaveTop,
  SvgWaveBottom,
  SvgCalendar,
} from "@/components/parts/SvgIcons";
import { Button } from "@material-tailwind/react";
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
      <SvgWaveTop />
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
          <a href="https://lin.ee/wzPQgmv" target="_blank">
            <Button
              color="green"
              className="flex gap-4 px-10 py-5 font-notojp text-xl font-bold laptop:text-2xl"
            >
              <div className="flex items-center gap-4">
                <SvgCalendar />
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
      <SvgWaveBottom />
    </section>
  );
};

export default Menu;
