import type { JSONContent } from "@tiptap/core";
import Image from "next/image";
import { forwardRef } from "react";

import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { extractYouTubeVideoId } from "@/lib/utils/youtube";

interface PreviewContentProps {
  content: JSONContent;
  className?: string;
}

export const PreviewContent = forwardRef<HTMLDivElement, PreviewContentProps>(
  ({ content, className = "" }, ref) => {
    // JSONContentをHTMLに変換するヘルパー関数
    const renderContent = (
      node: JSONContent,
      index: number = 0,
      isInsideTable: boolean = false,
    ): React.ReactNode => {
      if (!node) return null;

      const { type, content: children, attrs, marks } = node;

      // テキストノードの処理
      if (type === "text") {
        let text: React.ReactNode = node.text || "";

        // YouTube URLの検出と埋め込み
        const textString = String(node.text || "");
        const videoId = extractYouTubeVideoId(textString);
        
        // 単一行がYouTube URLのみの場合は埋め込み表示
        if (videoId && textString.trim().split(' ').length === 1) {
          return (
            <YouTubeEmbed 
              key={`youtube-${index}-${videoId}`}
              videoId={videoId}
            />
          );
        }

        // マークの適用
        if (marks) {
          marks.forEach((mark) => {
            switch (mark.type) {
              case "bold":
                text = <strong key="bold">{text}</strong>;
                break;
              case "italic":
                text = <em key="italic">{text}</em>;
                break;
              case "link":
                text = (
                  <a
                    key="link"
                    href={mark.attrs?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {text}
                  </a>
                );
                break;
              case "textStyle":
                if (mark.attrs?.color) {
                  text = (
                    <span key="color" style={{ color: mark.attrs.color }}>
                      {text}
                    </span>
                  );
                }
                break;
            }
          });
        }

        return text;
      }

      // ブロックノードの処理
      const childContent = children?.map((child, childIndex) =>
        renderContent(child, childIndex, isInsideTable),
      );

      switch (type) {
        case "paragraph":
          const textAlign = attrs?.textAlign;
          const alignClass = textAlign
            ? `text-${textAlign === "center" ? "center" : textAlign === "right" ? "right" : "left"}`
            : "";

          // 空の段落（改行のみ）の場合は<br>として扱う
          const isEmpty =
            !childContent ||
            (Array.isArray(childContent) &&
              childContent.every((child) => !child));
          if (isEmpty) {
            return <br key={`linebreak-${index}`} />;
          }

          // YouTube埋め込みが含まれている場合は<div>を使用
          const hasYouTubeEmbed = childContent && Array.isArray(childContent) && 
            childContent.some(child => 
              child && typeof child === 'object' && 'key' in child && 
              String(child.key).includes('youtube-')
            );

          if (hasYouTubeEmbed) {
            return (
              <div
                key={`paragraph-div-${index}`}
                className={`${isInsideTable ? "mb-0" : "mb-4"} ${alignClass}`}
              >
                {childContent}
              </div>
            );
          }

          return (
            <p
              key={`paragraph-${index}`}
              className={`${isInsideTable ? "mb-0" : "mb-4"} ${alignClass}`}
            >
              {childContent}
            </p>
          );

        case "heading":
          const level = attrs?.level || 1;
          const textAlignH = attrs?.textAlign;
          const alignClassH = textAlignH
            ? `text-${textAlignH === "center" ? "center" : textAlignH === "right" ? "right" : "left"}`
            : "";
          const headingClasses: Record<number, string> = {
            1: "text-3xl font-bold mb-6 mt-8",
            2: "text-2xl font-bold mb-4 mt-6",
            3: "text-xl font-bold mb-3 mt-5",
            4: "text-lg font-bold mb-2 mt-4",
            5: "text-base font-bold mb-2 mt-3",
            6: "text-sm font-bold mb-2 mt-2",
          };
          const headingClass =
            headingClasses[level] || "text-lg font-bold mb-2";

          const HeadingComponent = `h${level}` as
            | "h1"
            | "h2"
            | "h3"
            | "h4"
            | "h5"
            | "h6";

          return (
            <HeadingComponent
              key={`heading-${index}`}
              className={`${headingClass} ${alignClassH}`}
            >
              {childContent}
            </HeadingComponent>
          );

        case "bulletList":
          return (
            <ul
              key={`bulletList-${index}`}
              className="mb-4 ml-6 list-disc space-y-2"
            >
              {childContent}
            </ul>
          );

        case "orderedList":
          return (
            <ol
              key={`orderedList-${index}`}
              className="mb-4 ml-6 list-decimal space-y-2"
            >
              {childContent}
            </ol>
          );

        case "listItem":
          return <li key={`listItem-${index}`}>{childContent}</li>;

        case "blockquote":
          return (
            <blockquote
              key={`blockquote-${index}`}
              className="mb-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic"
            >
              {childContent}
            </blockquote>
          );

        case "codeBlock":
          const language = attrs?.language || "text";
          return (
            <pre
              key={`codeBlock-${index}`}
              className="mb-4 overflow-x-auto rounded-md bg-gray-100 p-4"
              style={{
                maxWidth: "100%",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <code
                className={`language-${language} text-sm`}
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {children?.map((child) => child.text).join("")}
              </code>
            </pre>
          );

        case "image":
          return (
            <Image
              key={`image-${index}`}
              src={attrs?.src}
              alt={attrs?.alt || ""}
              width={800}
              height={600}
              className="mb-4 max-w-full rounded-lg"
            />
          );

        case "table":
          return (
            <div key={`table-${index}`} className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {children?.map((child, childIndex) =>
                    renderContent(child, childIndex, true),
                  )}
                </tbody>
              </table>
            </div>
          );

        case "tableRow":
          return (
            <tr key={`tableRow-${index}`}>
              {children?.map((child, childIndex) =>
                renderContent(child, childIndex, true),
              )}
            </tr>
          );

        case "tableCell":
          return (
            <td
              key={`tableCell-${index}`}
              className="border border-gray-300 px-3 py-2"
            >
              {children?.map((child, childIndex) =>
                renderContent(child, childIndex, true),
              )}
            </td>
          );

        case "tableHeader":
          return (
            <th
              key={`tableHeader-${index}`}
              className="border border-gray-300 bg-gray-100 px-3 py-2 font-semibold"
            >
              {children?.map((child, childIndex) =>
                renderContent(child, childIndex, true),
              )}
            </th>
          );

        case "hardBreak":
          return <br key={`hardBreak-${index}`} />;

        default:
          return <div key={`default-${index}`}>{childContent}</div>;
      }
    };

    return (
      <div
        ref={ref}
        className={`prose prose-sm max-w-none p-6 md:p-8 ${className}`}
        style={{
          minHeight: "300px",
          maxWidth: "100%",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {renderContent(content)}
      </div>
    );
  },
);

PreviewContent.displayName = "PreviewContent";
