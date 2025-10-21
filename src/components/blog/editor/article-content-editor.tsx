"use client";

import type { JSONContent } from "@tiptap/core";

import { RichTextEditor } from "./rich-text-editor";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ArticleContentEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content?: JSONContent;
  onContentChange: (content: JSONContent) => void;
  titleError?: string;
}

export function ArticleContentEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  titleError,
}: ArticleContentEditorProps) {
  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div>
        <Label htmlFor="title" className="sr-only">
          タイトル
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="タイトルを追加"
          className="border-0 px-3 py-6 !text-2xl font-bold placeholder-gray-400 shadow-none focus:border-0 focus:ring-0"
        />
        {titleError && (
          <p className="mt-2 text-sm text-red-600">{titleError}</p>
        )}
      </div>

      {/* 本文エディタ */}
      <div>
        <Label htmlFor="content" className="sr-only">
          記事本文
        </Label>
        <RichTextEditor
          content={content}
          onChange={onContentChange}
          placeholder="記事の内容を入力してください..."
        />
      </div>
    </div>
  );
}
