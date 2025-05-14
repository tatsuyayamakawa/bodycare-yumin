import Image from "next/image";

import treatment_image from "../assets/treatment-image.png";
import { treatmentPolicyStyles } from "../constants";

import Heading from "@/components/common/heading";

export default function Policy() {
  const { policy } = treatmentPolicyStyles;
  const { heading, subheading, content } = policy;

  return (
    <div className={policy.base}>
      <Heading heading={heading} subheading={subheading} />
      <div className="mt-6 flex flex-col-reverse items-center gap-6 lg:flex-row lg:gap-12">
        <div className={content.base}>
          <p>整体の本質は骨格のバランスを整えることではありません。</p>
          <p>
            自然治癒力を最大限に高め、自身の力で体を調整できるようになることが何よりも大切です。
          </p>
          <p>
            多くの方が、整体は痛みが出てから通うものだと勘違いをしていますが、実際には痛みが出てからでは遅いこともあり、改善までに時間もお金も浪費してしまいます。
          </p>
          <p>
            そうならないよう、当サロンでは健康だからこその整体施術をおすすめしており、丈夫な体作りの方法を理解し、良い状態の保ち方を学ぶことこそが最大の療法と考えます。
          </p>
        </div>
        <div className="w-full">
          <Image
            src={treatment_image}
            alt="アロマディフューザー"
            priority
            draggable={false}
            className={treatmentPolicyStyles.policy.image.base}
          />
        </div>
      </div>
    </div>
  );
}
