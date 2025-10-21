import type { StaticImageData } from "next/image";

export interface FlowChartSection {
  title: string;
  subtitle: string;
  image: StaticImageData;
  content: string[];
  imagePosition: "left" | "right";
  reverse: boolean;
}

export interface FlowChartData {
  sections: FlowChartSection[];
}

export interface FlowChartStyles {
  container: {
    base: string;
  };
  content: {
    base: string;
  };
  illustrations: {
    base: string;
  };
}
