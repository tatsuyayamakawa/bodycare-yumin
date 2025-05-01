import { CTA_DATA } from "../data";

export default function CtaText() {
  return (
    <>
      <h2 className="text-brand-primary text-xl/normal">
        <div>
          <span className="text-2xl/normal text-red-500">
            {CTA_DATA.title.highlight.days}
          </span>
          {CTA_DATA.title.text[0]}
          <span className="align-[-2px] text-3xl/normal text-red-500">
            {CTA_DATA.title.highlight.hour}
          </span>
          {CTA_DATA.title.text[1]}
        </div>
        <div className="mt-1">{CTA_DATA.title.subtitle}</div>
      </h2>
    </>
  );
}
