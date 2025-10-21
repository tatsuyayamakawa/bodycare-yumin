import type { StaticImageData } from "next/image";

export interface ReviewData {
  title: string;
  name: string;
  symptom: string;
  image: StaticImageData;
}

export interface CustomerVoiceData {
  heading: string;
  subheading: string;
  reviews: ReviewData[];
}

export interface CustomerVoiceStyles {
  container: {
    base: string;
  };
  reviewList: {
    base: string;
  };
}

export interface ReviewCardProps {
  review: ReviewData;
}
