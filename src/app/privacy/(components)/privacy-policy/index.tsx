import { privacyPolicyData } from "../../_lib/constants";

import PolicySection from "./policy-section";

import Breadcrumb from "@/components/common/breadcrumb";
import Heading from "@/components/common/heading";
import Section from "@/components/common/section";

export default function PrivacyPolicy() {
  const { title, intro, sections, footer } = privacyPolicyData;

  return (
    <div className="lg:bg-brand-secondary mt-[64px] md:mt-[76px] md:p-[var(--spacing-md)] lg:mt-[100px]">
      <Section className="bg-background py-[var(--spacing-xs)] md:rounded-lg lg:max-w-5xl lg:p-[var(--spacing-md)]">
        <Breadcrumb>{title.heading}</Breadcrumb>
        <Heading heading={title.heading} subheading={title.subheading} center />
        <div className="xl:border-border mt-[var(--spacing-sm)] rounded-lg xl:mt-[var(--spacing-md)] xl:border xl:p-[var(--spacing-md)] [&>*]:text-sm/normal xl:[&>*]:text-base/normal [&>h4]:mb-2 [&>h4]:text-base/normal [&>h4]:font-bold [&>ol]:mb-6 [&>p]:mb-6 [&>p:last-child]:mb-0 [&>ul]:mb-6">
          <p>{intro}</p>
          {sections.map((section, index) => (
            <PolicySection key={index} {...section} />
          ))}
          {footer && (
            <div className="mt-[var(--spacing-xs)] flex flex-col items-end xl:mt-[var(--spacing-sm)]">
              <p>{footer.company}</p>
              <p>{footer.date}</p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
