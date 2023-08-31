import menuImage01 from '../public/images/menu-01.jpg';
import menuImage02 from '../public/images/menu-02.jpg';
import menuImage03 from '../public/images/menu-03.jpg';

import type { StaticImageData } from 'next/image';

type MenuItemProps = {
  id: number;
  src: StaticImageData;
  title: string;
  time: string;
  price: string;
  content: string;
  option: string;
};

export const menus: MenuItemProps[] = [
  {
    id: 1,
    src: menuImage01,
    title: 'リラックス',
    time: '（45分）',
    price: '￥3,000',
    content: '整体が初めての方やちょっと体をほぐしたいという方におすすめのプランです。骨格矯正は含まないほぐしのみのソフト整体です。',
    option: '骨格矯正 無し',
  },
  {
    id: 2,
    src: menuImage02,
    title: 'ベーシック',
    time: '（75分）',
    price: '￥5,000',
    content: '体のダルさやなかなか良くならない慢性痛など根本改善したい方向けのプランです。骨格のゆがみを確認しながら深層筋にアプローチします。',
    option: '骨格矯正 含む',
  },
  {
    id: 3,
    src: menuImage03,
    title: 'スペシャル',
    time: '（90分）',
    price: '￥8,000',
    content: 'マッサージクリームを使った足の疲れやむくみに効果的な足つぼと表情筋をほぐすリラックス効果のある顔整体が付いた当院のスペシャル整体です。',
    option: '骨格矯正 含む',
  },
];
