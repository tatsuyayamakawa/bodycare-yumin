import Image from "next/image";
import Link from "next/link";

import { LOGO_DATA } from "./data";

import { useConfig } from "@/contexts/config-context";

export default function Logo({ className }: { className?: string }) {
  const { APP_NAME } = useConfig();
  const { src, sizes } = LOGO_DATA;
  const responsiveClasses = `${sizes.responsive.mobile} ${sizes.responsive.desktop}`;

  return (
    <Link href="/" className={className}>
      <Image
        src={src}
        alt={APP_NAME}
        width={sizes.default.width}
        height={sizes.default.height}
        className={responsiveClasses}
        priority
      />
    </Link>
  );
}
