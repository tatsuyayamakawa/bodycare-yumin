import type { JSONContent } from "@tiptap/core";

export interface RichTextEditorProps {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
}

export type ViewMode = "edit" | "preview" | "split";

export interface EditorStates {
  bold: boolean;
  italic: boolean;
  heading1: boolean;
  heading2: boolean;
  heading3: boolean;
  bulletList: boolean;
  orderedList: boolean;
  blockquote: boolean;
  codeBlock: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}
