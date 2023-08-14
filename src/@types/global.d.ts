// @see https://github.com/vercel/next.js/issues/29788
declare type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

export type ImageWrapperProps = {
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  src: StaticImageData;
  alt: string;
  className?: string;
};

export type SectionHeadingProps = {
  heading2: string;
  heading3: string;
  isAlign: boolean;
};

export type NavItemProps = {
  id: number;
  title: string;
  link: string;
};

export type NavStateProps = {
  isOpen?: boolean;
  handler?: () => void;
};

export type MenuItemProps = {
  id: number;
  src: StaticImageData;
  title: string;
  time: string;
  price: string;
  content: string;
  option: string;
};

export type ToggleArrowProps = {
  id: number;
  open: number;
};

export type QuestionItemProps = {
  id: number;
  question: string;
  answer: string;
};

export type CoordinatesProps = {
  lat: number;
  lng: number;
};

export type MapKeyProps = {
  googleMapsApiKey: string;
};
