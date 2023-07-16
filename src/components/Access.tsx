"use client";

import HeadingTemp from "@/components/parts/SectionHeader";
import GoogleMaps from "./GoogleMaps";

const Access = () => {
  return (
    <section id="access">
      <HeadingTemp heading2="アクセス" heading3="Access" isAlign={true} />
      <div className="h-[50vh]">
        <GoogleMaps />
      </div>
    </section>
  );
};

export default Access;
