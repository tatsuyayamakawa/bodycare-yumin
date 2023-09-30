import Image from 'next/image';
import Link from 'next/link';

import logoImage from 'public/logo.png';

import { data } from '../constants/data';

export const Logo = ({ link }: { link?: boolean }) => {
  return (
    <h1>
      <figure>
        {link ? (
          <Link href="/">
            <Image width={255} height={30} src={logoImage} alt={data.info.title} sizes="100vw" priority className="h-auto" />
          </Link>
        ) : (
          <Image width={255} height={30} src={logoImage} alt={data.info.title} sizes="100vw" priority className="h-auto" />
        )}
      </figure>
    </h1>
  );
};
