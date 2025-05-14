import { images } from "../assets";
import type { CustomerVoiceData, CustomerVoiceStyles } from "../types";

export const customerVoiceData: CustomerVoiceData = {
  heading: "お客様のご感想",
  subheading: "Customer's Review",
  reviews: [
    {
      title: "初めてでも恐怖感なく安心して受けられる",
      name: "大沼さま",
      symptom: "肩こり",
      image: images.customer_image_01,
    },
    {
      title: "今まで受けたことのない不思議な感覚",
      name: "松田さま",
      symptom: "腰痛",
      image: images.customer_image_02,
    },
    {
      title: "体が軽くなって背筋が伸びたと言われた",
      name: "金沢さま",
      symptom: "体のゆがみ、猫背",
      image: images.customer_image_03,
    },
    {
      title: "表情が明るくなって綺麗になったと言われた",
      name: "金沢さま",
      symptom: "顔のたるみ",
      image: images.customer_image_04,
    },
  ],
} as const;

export const customerVoiceStyles: CustomerVoiceStyles = {
  container: {
    base: "mx-auto mt-6 flex flex-col justify-center gap-8 md:flex-row md:flex-wrap xl:mt-12 xl:w-[1020px] xl:gap-12",
  },
  reviewList: {
    base: "",
  },
} as const;
