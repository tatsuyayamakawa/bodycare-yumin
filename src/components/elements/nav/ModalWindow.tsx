import { Link as Scroll } from 'react-scroll';

import { Typography, IconButton, Button, Dialog, DialogHeader, DialogBody, DialogFooter, List, ListItem } from '@material-tailwind/react';

import { NavStateProps } from 'src/@types/global';
import { SvgCalendar } from 'src/components/elements/icon/SvgIcons';
import { LogoLink } from 'src/components/elements/nav/LogoLink';
import { navs } from 'src/constants/navs';

export const ModalWindow = ({ isOpen, handler }: NavStateProps) => {
  return (
    <Dialog open={isOpen as boolean} handler={handler as () => void}>
      <DialogHeader className="justify-between">
        <LogoLink handler={handler} />
        <IconButton variant="text" size="sm" color="gray" ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden" onClick={handler}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-8 w-8 text-gray-75/80" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </DialogHeader>
      <DialogBody divider={true}>
        <List className="space-y-1">
          {navs.map((nav) => {
            return (
              <ListItem className="block" key={nav.id}>
                <Scroll to={nav.link} smooth={true} duration={600} className="cursor-pointer" onClick={handler}>
                  <Typography variant="small" color="gray" as="div" className="text-center font-notojp text-lg font-normal text-gray-75">
                    {nav.title}
                  </Typography>
                </Scroll>
              </ListItem>
            );
          })}
        </List>
      </DialogBody>
      <DialogFooter className="justify-center">
        <a href="https://lin.ee/wzPQgmv" target="_blank" aria-label="LINEで予約する" className="w-full">
          <Button variant="filled" size="lg" color="green" ripple={true} fullWidth={true} className="bg-green font-notojp text-lg font-bold text-white">
            <div className="flex items-center justify-center gap-2">
              <SvgCalendar />
              当日予約も受付中‼
            </div>
          </Button>
        </a>
      </DialogFooter>
    </Dialog>
  );
};
