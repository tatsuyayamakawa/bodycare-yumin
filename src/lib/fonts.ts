import {
  Allura,
  Bebas_Neue,
  Montserrat,
  Noto_Sans_JP,
  Zen_Old_Mincho,
} from "next/font/google";

export const notojp = Noto_Sans_JP({
  variable: "--font-notojp",
  subsets: ["latin"],
});

export const zenmincho = Zen_Old_Mincho({
  variable: "--font-zenmincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
});

export const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
