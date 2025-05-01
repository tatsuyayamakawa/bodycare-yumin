import { CTA_DATA } from "../data";

export default function CtaText() {
  const { title } = CTA_DATA;

  return (
    <>
      <h2 className="text-brand-primary text-xl/normal">
        <div>
          <span className="text-2xl/normal text-red-500">
            {title.highlight.days}
          </span>
          {title.text[0]}
          <span className="align-[-2px] text-3xl/normal text-red-500">
            {title.highlight.hour}
          </span>
          {title.text[1]}
        </div>
        <div className="mt-1">{title.subtitle}</div>
      </h2>
    </>
  );
}
