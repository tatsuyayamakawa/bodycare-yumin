export interface LogoProps {
  className?: string;
}

export interface LogoSize {
  width: number;
  height: number;
}

export interface LogoResponsive {
  mobile: string;
  desktop: string;
}

export interface LogoSizes {
  default: LogoSize;
  responsive: LogoResponsive;
}

export interface LogoData {
  src: string;
  sizes: LogoSizes;
}
