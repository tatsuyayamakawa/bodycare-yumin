import { Link as Scroll } from 'react-scroll';

import { Typography, IconButton, Button, Dialog, DialogHeader, DialogBody, DialogFooter, List, ListItem } from '@material-tailwind/react';
import { FaMobileScreenButton } from 'react-icons/fa6';

import { NavStateProps } from 'src/@types/global';
import { LogoLink } from 'src/components/elements/nav/LogoLink';
import { data } from 'src/constants/data';
import { navs } from 'src/constants/navs';

export const ModalWindow = ({ isOpen, handler }: NavStateProps) => {
  return (
    <Dialog open={isOpen as boolean} handler={handler as () => void}>
      <DialogHeader className="justify-between">
        <LogoLink handler={handler} />
        <IconButton variant="text" size="sm" color="gray" ripple={false} aria-label="メインメニューを閉じる" className="hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden" onClick={handler}>
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
                <Scroll href={nav.link} to={nav.link} smooth={true} duration={600} offset={50} className="cursor-pointer" onClick={handler}>
                  <Typography variant="lead" color="gray" as="div" className="text-center font-notojp text-gray-75">
                    {nav.title}
                  </Typography>
                </Scroll>
              </ListItem>
            );
          })}
        </List>
      </DialogBody>
      <DialogFooter className="justify-center">
        <a href={data.sns.line} target="_blank" rel="noopener noreferrer" aria-label="LINEで予約する" className="w-full">
          <Button variant="filled" size="lg" color="green" ripple={true} fullWidth={true} className="bg-green text-white">
            <div className="flex items-center justify-center gap-4">
              <FaMobileScreenButton size={24} />
              <Typography variant="lead" className="font-notojp text-lg font-bold">
                当日予約も受付中‼
              </Typography>
            </div>
          </Button>
        </a>
      </DialogFooter>
    </Dialog>
  );
};
