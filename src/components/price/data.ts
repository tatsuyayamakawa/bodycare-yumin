import type { MenuList } from "./types";

export const menus: MenuList = {
  heading: "料金",
  subheading: "Price",
  prices: [
    {
      title: "リラックス",
      time: "45分",
      price: "￥3,150 (税込)",
      content:
        "初めての方やちょっと体をほぐしたいという方におすすめのプランです。やさしいソフト整体になります。",
    },
    {
      title: "ベーシック",
      time: "75分",
      price: "￥5,250 (税込)",
      content:
        "体のダルさやなかなか良くならない慢性痛など根本改善したい方向けプランです。骨格のゆがみを確認しながら深層筋にアプローチします。",
    },
  ],
};
