import Image from "next/image";

import profile_image from "../assets/profile-image.jpg";
import { profileData } from "../constants";

export default function Introduction() {
  const { name, title, education, description } = profileData;

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-[var(--spacing-sm)] md:flex-row md:gap-[var(--spacing-md)] xl:w-[1020px] xl:gap-[var(--spacing-lg)]">
      <div className="w-full lg:w-[400px]">
        <Image
          src={profile_image}
          alt={name}
          placeholder="blur"
          priority
          draggable={false}
          className="pointer-events-none rounded-lg"
        />
      </div>
      <div className="w-full lg:w-[530px]">
        <h2 className="text-brand-accent mb-2 text-2xl/normal font-medium lg:mb-[var(--spacing-sm)] lg:text-3xl/normal">
          {title}
        </h2>
        <h3 className="font-zen-old-mincho text-brand-primary mb-4 text-3xl/normal font-semibold lg:mb-[var(--spacing-md)] lg:text-5xl/normal">
          {name}
        </h3>
        <h4 className="text-brand-primary mb-4 text-lg/normal font-medium lg:text-2xl/normal">
          {education}
        </h4>
        <div className="text-sm/normal lg:text-base/normal [&>p]:mb-4 lg:[&>p]:mb-[var(--spacing-sm)] [&>p:last-child]:mb-0">
          {description.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
