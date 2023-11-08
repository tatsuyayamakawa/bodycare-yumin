import { MenuItem, Typography } from '@material-tailwind/react';
import Link from 'next/link';

import { ExternalLink } from './external-link';
import { Logo } from './logo';
import { data } from '../constants/data';
import { navs } from '../constants/navs';

const NavList = () => {
  return (
    <ul className="hidden space-x-5 text-gray-75 lg:flex lg:items-center">
      <li>
        <ExternalLink url={data.booking} ariaLabel="オンラインで予約する" className="hover:no-underline">
          <MenuItem className="px-6 py-3">
            <Typography variant="paragraph" className="font-notojp text-lg font-semibold tracking-wide text-gray-75">
              オンライン予約
            </Typography>
          </MenuItem>
        </ExternalLink>
      </li>
      {navs.map((nav) => {
        return (
          <li key={nav.id} className="list-none">
            <Link href={`${nav.link}`} className="cursor-pointer">
              <MenuItem className="px-6 py-3">
                <Typography variant="paragraph" className="font-notojp text-lg font-semibold tracking-wide text-gray-75">
                  {nav.title}
                </Typography>
              </MenuItem>
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
