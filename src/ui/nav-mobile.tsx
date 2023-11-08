import { Typography, IconButton, Button, Dialog, DialogBody, DialogFooter, DialogHeader, MenuItem } from '@material-tailwind/react';
import Link from 'next/link';

import { ExternalLink } from './external-link';
import { Logo } from './logo';
import { data } from '../constants/data';
import { navs } from '../constants/navs';

const Hamburger = ({ handler }: { isOpen?: boolean; handler?: () => void }) => {
  return (
    <IconButton
      variant="text"
      size="sm"
      color="gray"
      ripple={false}
      aria-label="メインメニューを開く"
      className="hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
      onClick={handler}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-75/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </IconButton>
  );
};

export const NavMobile = ({ isOpen, handler }: { isOpen?: boolean; handler?: () => void }) => {
  return (
    <>
      <Hamburger handler={handler} />
      <Dialog open={isOpen as boolean} handler={handler as () => void}>
        <DialogHeader>
          <Logo link={true} />
        </DialogHeader>
        <DialogBody divider={true}>
          <ul className="flex flex-col space-y-3">
            <li>
              <ExternalLink url={data.booking} ariaLabel="オンラインで予約する" className="hover:no-underline">
                <MenuItem className="flex items-center gap-3">
                  <Typography variant="small" className="font-notojp text-base font-semibold text-gray-75 ">
                    オンライン予約
                  </Typography>
                </MenuItem>
              </ExternalLink>
            </li>
            {navs.map((nav) => {
              return (
                <li key={nav.id} className="list-none">
                  <Link href={`${nav.link}`} onClick={handler}>
                    <MenuItem>
                      <Typography variant="small" className="font-notojp text-base font-semibold text-gray-75">
                        {nav.title}
                      </Typography>
                    </MenuItem>
                  </Link>
                </li>
              );
            })}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button size="lg" variant="text" color="blue" onClick={handler} className="font-notojp">
            閉じる
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
