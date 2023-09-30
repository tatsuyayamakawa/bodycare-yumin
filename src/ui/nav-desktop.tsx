import { Typography } from '@material-tailwind/react';
import Link from 'next/link';

import { Logo } from './logo';
import { data } from '../constants/data';
import { navs } from '../constants/navs';

const NavList = () => {
  return (
    <ul className="hidden space-x-10 text-gray-75 lg:flex lg:items-center">
      <li>
        <a href={data.sns.line} target="_blank" rel="noopener noreferrer" aria-label="LINEで予約する">
          <Typography
            variant="paragraph"
            className="font-notojp text-lg font-semibold tracking-wide text-gray-75 hover:underline hover:underline-offset-4"
          >
            LINEで予約
          </Typography>
        </a>
      </li>
      {navs.map((nav) => {
        return (
          <li key={nav.id} className="list-none">
            <Link href={`${nav.link}`} className="cursor-pointer">
              <Typography
                variant="paragraph"
                className="font-notojp text-lg font-semibold tracking-wide text-gray-75 hover:underline hover:underline-offset-4"
              >
                {nav.title}
              </Typography>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export const NavDesktop = () => {
  return (
    <>
      <Logo link={true} />
      <NavList />
    </>
  );
};
