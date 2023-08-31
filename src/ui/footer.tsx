'use client';

import { useEffect, useState } from 'react';

import { Typography } from '@material-tailwind/react';
import { FaInstagram, FaYoutube } from 'react-icons/fa6';

import { ExternalLink } from './external-link';
import { data } from '../constants/data';

export const Footer = () => {
  const [year, setYear] = useState<number>(0);

  useEffect(() => {
    setInterval(() => {
      let d = new Date();
      let year = d.getFullYear();
      setYear(year);
    });
  }, []);

  return (
    <footer className="bg-secondary">
      <div className="mx-5 border border-gray-25/20"></div>
      <div className="mx-5 flex flex-col items-center justify-between gap-6 py-[2.5rem] md:mx-10 md:flex-row lg:mx-20">
        <div className="flex items-center justify-center gap-6">
          <Typography variant="paragraph" className="font-zenmincho font-semibold tracking-wide text-gray-75">
            FOLLOW ME
          </Typography>
          <ExternalLink url={data.sns.instagram} ariaLabel="Instagram" icon={false}>
            <FaInstagram size={24} title="Instagram" />
          </ExternalLink>
          <ExternalLink url={data.sns.youtube} ariaLabel="YouTube" icon={false}>
            <FaYoutube size={24} title="YouTube" />
          </ExternalLink>
        </div>
        <div className="flex items-center justify-between">
          <small className="font-notojp text-sm font-normal tracking-wide text-gray-75">
            &copy; 2012-{year} {data.info.name}
          </small>
        </div>
      </div>
    </footer>
  );
};
