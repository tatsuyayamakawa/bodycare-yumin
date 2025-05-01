import { images } from "./assets";
import type { CustomerVoiceData } from "./types";

export const customerVoice: CustomerVoiceData = {
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
};
