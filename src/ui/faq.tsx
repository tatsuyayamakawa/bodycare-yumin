'use client';

import { useState } from 'react';
import { ScrollAnimator } from 'react-animate-observer';

import { Accordion, AccordionHeader, AccordionBody, Typography } from '@material-tailwind/react';
import { FaChevronDown } from 'react-icons/fa6';

import { Heading } from './heading';
import { faqs } from '../constants/faqs';
import { fadeUpComponent } from '../constants/motion';
import { observerOptions } from '../constants/observer-options';

const SvgArrowDown = ({ id, open }: { id: number; open: number }) => {
  return <FaChevronDown size={20} color={'#707070'} className={`${id === open ? 'rotate-180' : ''} transition-transform`} />;
};

export const Faq = () => {
  const [isOpen, setIsOpen] = useState<number>(0);

  const handleOpen = (value: number) => {
    setIsOpen(isOpen === value ? 0 : value);
  };

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  return (
    <section className="container">
      <div className="mx-auto my-[6.25rem] max-w-[62rem]">
        <Heading heading2="よくあるご質問" heading3="FAQ" isAlign={false} />
        <div className="mx-5 my-10">
          <ScrollAnimator {...fadeUpComponent} observerOptions={observerOptions}>
            {faqs.map((faq) => {
              return (
                <Accordion
                  open={isOpen === faq.id}
                  icon={<SvgArrowDown id={faq.id} open={isOpen} />}
                  animate={customAnimation}
                  key={faq.id}
                  className="my-6"
                >
                  <AccordionHeader className="rounded-lg bg-gray-10 px-5 py-5" onClick={() => handleOpen(faq.id)}>
                    <Typography
                      variant="h4"
                      className="flex items-center font-notojp text-base font-normal leading-relaxed tracking-wide text-gray-75 before:mr-5 before:font-b612mono before:text-2xl before:content-['Q'] lg:text-lg before:lg:text-3xl"
                    >
                      {faq.question}
                    </Typography>
                  </AccordionHeader>
                  <AccordionBody className="mt-6 px-6">
                    <Typography variant="paragraph" className="font-notojp font-normal leading-relaxed tracking-wide text-gray-75">
                      {faq.answer}
                    </Typography>
                  </AccordionBody>
                </Accordion>
              );
            })}
          </ScrollAnimator>
        </div>
      </div>
    </section>
  );
};
