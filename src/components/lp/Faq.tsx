import { useState } from 'react';
import { ScrollAnimator } from 'react-animate-observer';

import { Accordion, AccordionHeader, AccordionBody, Typography } from '@material-tailwind/react';
import { FaChevronDown } from 'react-icons/fa6';

import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { fadeUpComponent } from 'src/constants/motion';
import { observerOptions } from 'src/constants/optionObserver';
import { questions } from 'src/constants/questions';

import type { ToggleArrowProps } from 'src/@types/global';

const SvgArrowDown = ({ id, open }: ToggleArrowProps) => {
  return <FaChevronDown size={20} color={'#707070'} className={`${id === open ? 'rotate-180' : ''} transition-transform`} />;
};

export const Faq = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  return (
    <section className="container">
      <div className="mx-auto my-[6.25rem] max-w-[62rem]">
        <SectionHeading heading2="よくあるご質問" heading3="FAQ" isAlign={false} />
        <div className="mx-5 my-10">
          <ScrollAnimator {...fadeUpComponent} observerOptions={observerOptions}>
            {questions.map((question) => {
              return (
                <Accordion open={open === question.id} icon={<SvgArrowDown id={question.id} open={open} />} animate={customAnimation} key={question.id} className="my-5">
                  <AccordionHeader className="rounded-lg bg-gray-10 px-5 py-5" onClick={() => handleOpen(question.id)}>
                    <Typography
                      variant="h4"
                      className="flex items-center font-notojp text-base font-medium leading-relaxed tracking-wide text-gray-75 before:mr-5 before:font-b612mono before:text-2xl before:content-['Q'] lg:text-lg before:lg:text-3xl"
                    >
                      {question.question}
                    </Typography>
                  </AccordionHeader>
                  <AccordionBody className="mt-5 px-6">
                    <Typography variant="small" className="font-notojp leading-relaxed tracking-wide text-gray-75">
                      {question.answer}
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
