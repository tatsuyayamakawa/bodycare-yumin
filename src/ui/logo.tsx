import { Link as Scroll } from 'react-scroll';

import Image from 'next/image';

import { data } from '../constants/data';
import logoImage from '../public/images/logo.png';

export const Logo = ({ handler }: { handler?: () => void }) => {
  return (
    <h1>
      <figure>
        {/* Fires a click event if handler props are enabled */}
        <Scroll href="#header" to="header" smooth={true} duration={600} className="cursor-pointer" onClick={handler}>
          <Image width={255} height={30} src={logoImage} alt={data.info.title} sizes="100vw" priority className="h-auto" />
        </Scroll>
      </figure>
    </h1>
  );
};
