"use client";

import type { JSONContent } from "@tiptap/core";
import Image from "next/image";

import { HEADING_CLASSES, DEFAULT_HEADING_CLASS } from "./constants";
import type { ArticleContentProps } from "./types";

import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { extractYouTubeVideoId } from "@/lib/utils/youtube";

export function ArticleContent({ content, className = "" }: ArticleContentProps) {
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
            className={`${isInsideTable ? "mb-0" : "mb-4"} ${alignClass} text-gray-700 leading-relaxed`}
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
        const headingClass = HEADING_CLASSES[level] || DEFAULT_HEADING_CLASS;

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
            style={{ listStyleType: 'disc', paddingLeft: '1rem' }}
          >
            {childContent}
          </ul>
        );

      case "orderedList":
        return (
          <ol
            key={`orderedList-${index}`}
            className="mb-4 ml-6 list-decimal space-y-2"
            style={{ listStyleType: 'decimal', paddingLeft: '1rem' }}
          >
            {childContent}
          </ol>
        );

      case "listItem":
        return (
          <li key={`listItem-${index}`} className="text-gray-700 leading-relaxed">
            {childContent}
          </li>
        );

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
          >
            <code className={`language-${language} text-sm`}>
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

  // 文字列の場合は従来の処理（後方互換性）
  if (typeof content === 'string') {
    const lines = content.split('\n');
    return (
      <div className={`article-content ${className}`}>
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          const videoId = extractYouTubeVideoId(trimmedLine);
          
          if (videoId && trimmedLine.split(' ').length === 1) {
            return (
              <YouTubeEmbed
                key={`youtube-${index}-${videoId}`}
                videoId={videoId}
              />
            );
          }

          if (trimmedLine === '') {
            return <br key={`br-${index}`} />;
          }

          return (
            <p key={`text-${index}`} className="mb-4 text-gray-700 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  }

  // JSONContentの場合の処理
  return (
    <article className={`article-content prose prose-sm max-w-none ${className}`}>
      {renderContent(content as JSONContent)}
    </article>
  );
}