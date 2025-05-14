import { PolicySectionProps } from "./types";

export default function PolicySection({
  title,
  content,
  items,
  links,
  additionalContent,
}: PolicySectionProps) {
  return (
    <>
      <h4>{title}</h4>
      {content && <p>{content}</p>}
      {items && (
        <ol className="ml-5 list-decimal">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      )}
      {additionalContent && <p>{additionalContent}</p>}
      {links && (
        <ul className="ml-5 list-disc">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                className="text-blue-500 hover:underline"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
