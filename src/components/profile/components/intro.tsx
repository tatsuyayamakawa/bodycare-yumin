import Image from "next/image";

import profile_image from "../assets/profile-image.jpg";
import { profileData } from "../data";

export default function Introduction() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12 xl:w-[1020px]">
      <div className="w-full lg:w-[400px]">
        <Image
          src={profile_image}
          alt={profileData.name}
          placeholder="blur"
          priority
          draggable={false}
          className="pointer-events-none rounded-md"
        />
      </div>
      <div className="w-full lg:w-[530px]">
        <h2 className="text-brand-accent mb-2 text-2xl/normal font-medium lg:mb-6 lg:text-3xl/normal">
          {profileData.title}
        </h2>
        <h3 className="font-zenmincho text-brand-primary mb-4 text-3xl/normal font-semibold lg:mb-12 lg:text-5xl/normal">
          {profileData.name}
        </h3>
        <h4 className="text-brand-primary mb-4 text-lg/normal font-medium lg:text-2xl/normal">
          {profileData.education}
        </h4>
        <div className="text-sm/normal lg:text-base/normal [&>p]:mb-4 lg:[&>p]:mb-6 [&>p:last-child]:mb-0">
          {profileData.description.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
