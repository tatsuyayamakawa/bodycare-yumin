export interface PolicySectionProps {
  title: string;
  content?: string;
  items?: readonly string[];
  links?: readonly { title: string; url: string }[];
  additionalContent?: string;
}
