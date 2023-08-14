import { Link as Scroll } from 'react-scroll';

import { Typography } from '@material-tailwind/react';

import { navs } from 'src/constants/navs';

export const NavList = () => {
  return (
    <ul className="hidden space-x-10 text-gray-75 lg:flex">
      {navs.map((nav) => {
        return (
          <Scroll to={nav.link} smooth={true} duration={600} className="cursor-pointer" key={nav.id}>
            <Typography as="li" variant="small" className="font-notojp text-lg font-normal text-gray-75">
              {nav.title}
            </Typography>
          </Scroll>
        );
      })}
    </ul>
  );
};
