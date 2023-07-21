import Image from "next/image";
import logoImage from "public/images/logo.png";
import { notojp } from "@/utiles/fonts";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link as Scroll } from "react-scroll";
import Data from "@/data/data.json";

// デスクトップ版ナビゲーション
const CustomLink = ({ href, to, title, className }: NavProps) => {
  return (
    <Scroll
      href={href}
      to={to}
      smooth={true}
      duration={600}
      offset={-50}
      className={`${className} cursor-pointer font-notojp text-lg font-normal tracking-wide text-gray-75 hover:opacity-50`}
    >
      {title}
    </Scroll>
  );
};

// モバイル版ナビゲーション
const CustomMobileLink = ({ to, title, className, toggle }: NavProps) => {
  const handleClick = () => {
    toggle();
  };

  return (
    <Scroll to={to} smooth={true} duration={600} offset={-50}>
      <button
        className={`${className} my-2 cursor-pointer font-notojp text-lg font-normal tracking-wide text-white hover:opacity-50`}
        onClick={handleClick}
      >
        {title}
      </button>
    </Scroll>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* ロゴ */}
      <h1>
        <figure>
          <Image
            src={logoImage}
            width={225}
            height={27}
            alt={Data.data.info.title}
            priority
          />
        </figure>
      </h1>

      {/* ハンバーガーボタン */}
      <button
        aria-label="メインメニュー"
        className="flex flex-col items-center justify-center lg:hidden"
        onClick={handleClick}
      >
        <span
          className={`block h-0.5 w-6 rounded-sm bg-gray-75 transition-all duration-300 ease-out ${
            isOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`my-0.5 block h-0.5 w-6 rounded-sm bg-gray-75 transition-all duration-300 ease-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block h-0.5 w-6 rounded-sm bg-gray-75 transition-all duration-300 ease-out ${
            isOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      {/* グローバルナビゲーション */}
      <div
        className={`${notojp.variable} hidden items-center justify-between lg:flex`}
      >
        <nav aria-label="グローバルナビゲーション" className="">
          <CustomLink
            href="#about"
            to="about"
            title="癒眠について"
            className="mr-4"
          />
          <CustomLink href="#menu" to="menu" title="料金" className="mx-4" />
          <CustomLink
            href="#access"
            to="access"
            title="アクセス"
            className="ml-4"
          />
        </nav>
      </div>

      {/* モーダルメニュー */}
      {isOpen ? (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed left-1/2 top-1/2 z-30 min-w-[70vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-lg bg-gray-75/80 py-32 text-center backdrop-blur-md lg:hidden"
        >
          <nav
            aria-label="グローバルナビゲーション"
            className="flex flex-col items-center justify-center"
          >
            <CustomMobileLink
              href="#about"
              to="about"
              title="癒眠について"
              className=""
              toggle={handleClick}
            />
            <CustomMobileLink
              href="#menu"
              to="menu"
              title="料金"
              className=""
              toggle={handleClick}
            />
            <CustomMobileLink
              href="#access"
              to="access"
              title="アクセス"
              className=""
              toggle={handleClick}
            />
          </nav>
        </motion.div>
      ) : null}
    </>
  );
};

export default Nav;
