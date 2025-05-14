import type { EmpathyData, EmpathyStyles } from "../types";

export const lists: EmpathyData[] = [
  {
    title: "朝起きると体がだるい",
  },
  {
    title: "疲れているのに眠りが浅くてスッキリしない",
  },
  {
    title: "注意力散漫で集中できない",
  },
  {
    title: "デスクワークで目の奥がいつも重い",
  },
  {
    title: "姿勢が悪くよく注意される",
  },
  {
    title: "子育てで首や肩がいつも苦しい",
  },
] as const;

export const empathyStyles: EmpathyStyles = {
  container: {
    base: "relative",
  },
  content: {
    base: "md:flex md:flex-row md:justify-center md:gap-8 lg:gap-12 xl:ml-34 xl:justify-start",
  },
  image: {
    base: "",
  },
  list: {
    base: "",
  },
  title: {
    base: "",
  },
  background: {
    base: "pointer-events-none absolute right-0 bottom-0 -z-10 block w-[300px] opacity-30 md:hidden 2xl:block 2xl:w-[350px] 2xl:opacity-100",
  },
} as const;
