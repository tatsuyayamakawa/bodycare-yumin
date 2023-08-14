import Image from 'next/image';

import type { ImageWrapperProps } from 'src/@types/global';

export const ImageWrapper = ({ width, height, src, alt, className }: ImageWrapperProps) => {
  return (
    <div className="relative">
      <div className="h-full">
        <Image width={width} height={height} src={src} alt={alt} sizes="100vw" quality={75} placeholder="blur" className={`${className} relative object-contain`} />
      </div>
    </div>
  );
};
