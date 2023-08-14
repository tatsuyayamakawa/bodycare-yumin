import { IconButton } from '@material-tailwind/react';

import { NavStateProps } from 'src/@types/global';

export const HamburgerButton = ({ handler }: NavStateProps) => {
  return (
    <IconButton variant="text" size="sm" color="gray" ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden" onClick={handler}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-75/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </IconButton>
  );
};
