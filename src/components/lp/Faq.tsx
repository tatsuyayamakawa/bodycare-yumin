import { useState } from 'react';

import { Accordion, AccordionHeader, AccordionBody } from '@material-tailwind/react';
import { motion } from 'framer-motion';

import { SectionHeading } from 'src/components/elements/heading/SectionHeading';
import { SvgArrowDown } from 'src/components/elements/icon/SvgIcons';
import { container, item } from 'src/constants/motion';
import { questions } from 'src/constants/questions';

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
        <motion.div initial="hidden" whileInView="visible" variants={container} viewport={{ once: true }} className="mx-5 my-10">
          {questions.map((question) => {
            return (
              <Accordion open={open === question.id} icon={<SvgArrowDown id={question.id} open={open} />} animate={customAnimation} key={question.id} className="my-5">
                <motion.div variants={item}>
                  <AccordionHeader className="rounded-lg bg-gray-10 px-5 py-5" onClick={() => handleOpen(question.id)}>
                    <h4 className="flex items-center font-notojp text-base font-normal not-italic leading-relaxed tracking-wide text-gray-75 before:mr-5 before:font-b612mono before:text-2xl before:content-['Q'] lg:text-lg before:lg:text-3xl">
                      {question.question}
                    </h4>
                  </AccordionHeader>
                  <AccordionBody className="mt-5 px-6">
                    <p className="whitespace-pre-wrap font-notojp text-sm font-normal not-italic leading-relaxed tracking-wide text-gray-50 lg:text-base">{question.answer}</p>
                  </AccordionBody>
                </motion.div>
              </Accordion>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
