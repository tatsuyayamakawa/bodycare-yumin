"use client";

import HeadingTemp from "@/components/parts/SectionHeader";
import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { container, item } from "@/utiles/motion";

const Icon = ({ id, open }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? "ml-auto rotate-180 text-gray-50" : ""
      } ml-auto h-5 w-5 text-gray-50 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={4}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
};

const Faq = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const questions: QuestionItem[] = [
    {
      id: 1,
      question: "どれくらいのペースで通えばいいですか？",
      answer:
        "お客様のお好きなペースで通っていただいて構いません。こちらから次回予約を強制することもございません。\n\nペースを決められないので決めてほしいという方もいらっしゃいますので、そういった方には3週間～1ヵ月置きをお勧めしています。もちろんそれ以上置いていただいても大丈夫ですが、体に症状が出てからではなく、一定間隔でメンテナンスをおこなっていただくのがベストです。",
    },
    {
      id: 2,
      question: "支払方法はどうなりますか？",
      answer:
        "現金、クレジットカード（VISA、MASTER CARD、AMERICAN EXPRESS、JCB）、QRコード決済（PayPay、楽天ペイ）、電子マネー（iD）に対応しています。",
    },
    {
      id: 3,
      question: "当日予約はできますか？",
      answer:
        "Web予約は希望時間の2時間前まで有効です。\n\nその他、空き時間のご確認はLINEトークより直接お問い合わせください。",
    },
    {
      id: 4,
      question: "急な予約時間の変更、キャンセルはできますか？",
      answer:
        "2時間前までは変更・キャンセル可能です。LINEにてご連絡ください。\n\n2時間を過ぎた場合は1,500円、無連絡キャンセルは3,000円のキャンセル料金を請求させていただきます。",
    },
    {
      id: 5,
      question: "服装は自由ですか？",
      answer:
        "具体的には以下の服装以外でしたら何でも構いません。\n\n・スカート、スーツ（下肢の施術がしにくいため）\n・パーカー（首周りの施術がしにくいため）",
    },
    {
      id: 6,
      question: "駐車スペースはありますか？",
      answer:
        "玄関前に駐車していただいて構いませんが、あまり広くないためなるべく玄関側に寄せて車が出入りできるスペースを確保していただけますと大変助かります。",
    },
    {
      id: 7,
      question: "子連れでも平気ですか？",
      answer:
        "キッズスペースのようなものがないので、ソファに座っていられる年齢のお子さんであればiPadをお貸ししてアニメ鑑賞などして待っていただけます。\n\n抱っこが必要な乳幼児はお連れの方と一緒で来ていただけますと幸いです。",
    },
  ];

  return (
    <section className="lg:container">
      <div className="my-24 laptop:mx-10 desktop:mx-40">
        <HeadingTemp heading2="よくあるご質問" heading3="FAQ" isAlign={false} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={container}
          viewport={{ once: true }}
          className="my-10 mobile:mx-5"
        >
          {questions.map((question) => {
            return (
              <Accordion
                open={open === question.id}
                icon={<Icon id={question.id} open={open} />}
                animate={customAnimation}
                key={question.id}
                className="mobile:[&:not(:first-of-type)]:mt-5 laptop:[&:not(:first-of-type)]:mt-10"
              >
                <motion.div variants={item}>
                  <AccordionHeader
                    className="rounded-lg border-b-0 bg-gray-200 px-6 py-4"
                    onClick={() => handleOpen(question.id)}
                  >
                    <h4 className="flex items-center font-notojp font-normal text-gray-75 before:mr-5 before:font-b612mono before:content-['Q'] mobile:text-base mobile:before:text-2xl laptop:text-lg before:laptop:text-3xl">
                      {question.question}
                    </h4>
                  </AccordionHeader>
                  <AccordionBody className="mt-5 px-6">
                    <p className="whitespace-pre-wrap font-notojp font-normal tracking-widest text-gray-50 mobile:text-sm laptop:text-base">
                      {question.answer}
                    </p>
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

export default Faq;
