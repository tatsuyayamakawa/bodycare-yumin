import Image from 'next/image';

import type { StaticImageData } from 'next/image';

type ImageWrapperProps = {
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  src: StaticImageData;
  alt: string;
  className?: string;
};

export const ImageWrapper = ({ width, height, src, alt, className }: ImageWrapperProps) => {
  return (
    <div className="relative">
      <div className="h-full">
        <Image
          width={width}
          height={height}
          src={src}
          alt={alt}
          sizes="100vw"
          quality={75}
          placeholder="blur"
          className={`${className} relative object-contain`}
        />
      </div>
    </div>
  );
};
