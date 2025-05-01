import type { StaticImageData } from "next/image";

export interface ReviewData {
  title: string;
  name: string;
  symptom: string;
  image: StaticImageData;
}

export interface CustomerVoiceData {
  reviews: ReviewData[];
}
