import Image from "next/image";
import logoImage from "public/images/logo.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link as Scroll } from "react-scroll";

// デスクトップ版ナビゲーション
const CustomLink = ({ href, to, title, className }: NavProps) => {
  return (
    <Scroll
      href={href}
      to={to}
      smooth={true}
      duration={600}
      offset={-50}
      className={`${className} cursor-pointer hover:opacity-50`}
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
        className={`${className} my-2 cursor-pointer hover:opacity-50`}
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
            alt="手もみ整体 癒眠｜山形で自律神経を改善するための整体サロン"
            placeholder="blur"
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
          className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out ${
            isOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`my-0.5 block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out ${
            isOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      {/* グローバルナビゲーション */}
      <div className="hidden items-center justify-between lg:flex">
        <nav
          aria-label="グローバルナビゲーション"
          className="font-notojp text-lg font-normal text-primary"
        >
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
          className="fixed left-1/2 top-1/2 z-30 min-w-[70vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-lg bg-black/40 py-32 text-center backdrop-blur-md lg:hidden"
        >
          <nav
            aria-label="グローバルナビゲーション"
            className="flex flex-col items-center justify-center font-notojp text-lg font-normal text-white"
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
