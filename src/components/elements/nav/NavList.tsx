import { Link as Scroll } from 'react-scroll';

import { Typography } from '@material-tailwind/react';

import { navs } from 'src/constants/navs';

export const NavList = () => {
  return (
    <ul className="hidden space-x-10 text-gray-75 lg:flex">
      {navs.map((nav) => {
        return (
          <Typography as="li" variant="small" className="font-notojp text-lg font-normal text-gray-75" key={nav.id}>
            <Scroll href={nav.link} to={nav.link} smooth={true} duration={600} className="cursor-pointer">
              {nav.title}
            </Scroll>
          </Typography>
        );
      })}
    </ul>
  );
};
