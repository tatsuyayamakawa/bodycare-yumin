import Image from "next/image";

export default function ImageWrapper({
  src,
  alt,
  className,
}: ImageWrapperProps) {
  return (
    <div className="relative">
      <div className="h-full">
        <Image
          src={src}
          alt={alt}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          quality={75}
          placeholder="blur"
          className={`${className} relative object-contain`}
        />
      </div>
    </div>
  );
}
