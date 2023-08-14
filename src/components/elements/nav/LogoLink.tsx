import { Link as Scroll } from 'react-scroll';

import Image from 'next/image';

import logoImage from 'public/images/logo.png';
import { NavStateProps } from 'src/@types/global';
import { data } from 'src/constants/data';

export const LogoLink = ({ handler }: NavStateProps) => {
  return (
    <h1>
      <figure>
        {/* handler propsが有効な場合、クリックイベントを発生させる */}
        <Scroll to="header" smooth={true} duration={600} className="cursor-pointer" onClick={handler}>
          <Image width={255} height={30} src={logoImage} alt={data.info.title} sizes="100vw" priority className="h-auto" />
        </Scroll>
      </figure>
    </h1>
  );
};
