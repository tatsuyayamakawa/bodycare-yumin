'use client';

import React, { useState } from 'react';
import { ScrollAnimator } from 'react-animate-observer';

import { Button, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import { FaMobileScreenButton, FaRegEnvelope, FaAngleRight } from 'react-icons/fa6';

import { ExternalLink } from './external-link';
import { Heading } from './heading';
import { Logo } from './logo';
import { SvgWaveTop } from './wave';
import { data } from '../constants/data';
import { fadeUpComponent } from '../constants/motion';
import { observerOptions } from '../constants/observer-options';
import { GoogleMaps } from '../lib/google-maps/google-maps';

export const Access = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section>
      <SvgWaveTop />
      <div className="bg-secondary py-[6.25rem]">
        <div className="container">
          <Heading heading2="アクセス" heading3="Access" isAlign={true} />
          <div className="mx-5 flex flex-col justify-center gap-10 lg:flex-row">
            <div className="flex flex-col justify-center md:basis-2/5">
              <ScrollAnimator {...fadeUpComponent} observerOptions={observerOptions} className="w-full">
                <Logo />
                <div className="mt-5">
                  <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
                    〒990-0851
                  </Typography>
                  <div className="flex flex-col items-start gap-1 md:flex-row lg:items-center">
                    <Typography variant="paragraph" className="font-notojp font-normal tracking-wide md:mr-2">
                      山形県山形市大字上椹沢195-2
                    </Typography>
                    <ExternalLink url={data.google.map} ariaLabel="Google map" icon={false}>
                      <Button size="sm" variant="filled" color="blue-gray" className="rounded-full px-3 py-1 shadow-none hover:shadow-none">
                        <div className="flex items-center">
                          <Typography variant="small" className="font-notojp font-normal tracking-wide">
                            GOOGLE MAP
                          </Typography>
                        </div>
                      </Button>
                    </ExternalLink>
                  </div>
                </div>
                <div className="mt-10 flex flex-col gap-5">
                  <ExternalLink url={data.sns.line} ariaLabel="LINEで予約する" icon={false}>
                    <Button variant="filled" size="lg" color="white" ripple={true} fullWidth={true} className="bg-white text-primary">
                      <div className="flex items-center justify-center gap-4">
                        <FaMobileScreenButton size={24} />
                        <Typography variant="lead" className="font-notojp text-lg font-medium">
                          LINEで予約
                        </Typography>
                        <FaAngleRight size={24} />
                      </div>
                      <Typography variant="small" className="mt-2 font-notojp font-normal text-gray-50">
                        当日受付 9:00 ～ 15:00 木曜日定休
                      </Typography>
                    </Button>
                  </ExternalLink>
                  <Link href="/contact">
                    <Button variant="filled" size="lg" color="white" ripple={true} fullWidth={true} className="bg-white text-primary" onClick={handleClick}>
                      <div className="flex items-center justify-center gap-4">
                        <FaRegEnvelope size={24} />
                        <Typography variant="lead" className="font-notojp text-lg font-medium">
                          お問い合わせ
                        </Typography>
                        <FaAngleRight size={24} />
                      </div>
                      <Typography variant="small" className="mt-2 font-notojp font-normal text-gray-50">
                        不明な点はお問い合わせください
                      </Typography>
                    </Button>
                  </Link>
                </div>
              </ScrollAnimator>
            </div>
            <div className="h-[50vh] md:basis-3/5">
              <ScrollAnimator {...fadeUpComponent} observerOptions={observerOptions} className="w-full">
                <GoogleMaps />
              </ScrollAnimator>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
