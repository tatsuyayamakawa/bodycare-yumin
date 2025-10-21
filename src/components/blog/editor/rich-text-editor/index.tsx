"use client";

import type { Editor } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Maximize,
  Quote,
  RotateCcw,
  RowsIcon,
  Table as TableIcon,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import "../editor-styles.css";

import { PreviewContent } from "../preview-content";
import { INITIAL_EDITOR_STATES } from "./constants";
import type { RichTextEditorProps, ViewMode } from "./types";
import { getScrollPercentage, setScrollPercentage, isInTable } from "./utils";

import { Button } from "@/components/ui/button";

export const RichTextEditor = memo(function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const lowlightInstance = createLowlight(common);
  const [isTableActive, setIsTableActive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [syncScrollEnabled, setSyncScrollEnabled] = useState(true);

  // スクロール同期用のref
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef<"editor" | "preview" | null>(null);

  // エディタの状態を管理
  const [editorStates, setEditorStates] = useState(INITIAL_EDITOR_STATES);



  // エディタの状態を更新する関数
  const updateEditorStates = useCallback(
    (editor: Editor) => {
      if (!editor) return;

      setEditorStates({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        heading1: editor.isActive("heading", { level: 1 }),
        heading2: editor.isActive("heading", { level: 2 }),
        heading3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
        codeBlock: editor.isActive("codeBlock"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
      });
      setIsTableActive(isInTable(editor));
    },
    [isInTable],
  );



  // 現在の状態を参照するためのRef
  const syncScrollEnabledRef = useRef(syncScrollEnabled);
  const viewModeRef = useRef(viewMode);

  // Refの値を更新
  useEffect(() => {
    syncScrollEnabledRef.current = syncScrollEnabled;
    viewModeRef.current = viewMode;
  }, [syncScrollEnabled, viewMode]);

  // エディターのスクロール同期
  const handleEditorScroll = useCallback((event: Event) => {
    const currentSyncEnabled = syncScrollEnabledRef.current;
    const currentViewMode = viewModeRef.current;

    if (
      !currentSyncEnabled ||
      currentViewMode !== "split" ||
      syncingRef.current === "preview"
    ) {
      return;
    }

    const editorElement = event.target as HTMLElement;
    const previewElement = previewContainerRef.current;

    if (editorElement && previewElement) {
      syncingRef.current = "editor";
      const percentage = getScrollPercentage(editorElement);

      setScrollPercentage(previewElement, percentage);

      setTimeout(() => {
        syncingRef.current = null;
      }, 100);
    }
  }, []);

  // プレビューのスクロール同期
  const handlePreviewScroll = useCallback((event: Event) => {
    const currentSyncEnabled = syncScrollEnabledRef.current;
    const currentViewMode = viewModeRef.current;

    if (
      !currentSyncEnabled ||
      currentViewMode !== "split" ||
      syncingRef.current === "editor"
    ) {
      return;
    }

    const previewElement = event.target as HTMLElement;
    const editorContainer = editorContainerRef.current;

    if (editorContainer && previewElement) {
      // エディターのスクロール要素を取得
      const editorScrollElement =
        editorContainer.querySelector(".ProseMirror") ||
        editorContainer.querySelector('[contenteditable="true"]');

      if (editorScrollElement) {
        syncingRef.current = "preview";
        const percentage = getScrollPercentage(previewElement);

        setScrollPercentage(editorScrollElement as HTMLElement, percentage);

        setTimeout(() => {
          syncingRef.current = null;
        }, 100);
      }
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({
        lowlight: lowlightInstance,
        defaultLanguage: "javascript",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
      updateEditorStates(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateEditorStates(editor);
    },
    editorProps: {
      attributes: {
        class:
          "h-full overflow-y-auto p-6 md:p-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 prose prose-sm max-w-none word-wrap break-words",
        style:
          "min-height: 400px; max-width: 100%; white-space: pre-wrap; word-break: break-word;",
      },
    },
    immediatelyRender: false,
  });

  // スクロールイベントリスナーの設定（双方向）
  useEffect(() => {
    if (viewMode !== "split" || !editor) {
      return;
    }

    const setupScrollListeners = () => {
      const editorContainer = editorContainerRef.current;
      const previewElement = previewContainerRef.current;

      if (!editorContainer || !previewElement) {
        setTimeout(setupScrollListeners, 500);
        return;
      }

      // エディター内のすべての可能なスクロール要素を探す
      const proseMirrorElement = editorContainer.querySelector(".ProseMirror");
      const contentEditableElement = editorContainer.querySelector(
        '[contenteditable="true"]',
      );
      const editorContentDiv =
        editorContainer.querySelector(".ProseMirror-focused") ||
        editorContainer.querySelector(".tiptap") ||
        editorContainer.querySelector(".editor");

      const editorScrollElement =
        proseMirrorElement || contentEditableElement || editorContentDiv;

      if (!editorScrollElement) {
        return;
      }

      // リスナーを設定
      editorScrollElement.addEventListener("scroll", handleEditorScroll, {
        passive: true,
      });
      previewElement.addEventListener("scroll", handlePreviewScroll, {
        passive: true,
      });

      return () => {
        editorScrollElement.removeEventListener("scroll", handleEditorScroll);
        previewElement.removeEventListener("scroll", handlePreviewScroll);
      };
    };

    const timeoutId = setTimeout(setupScrollListeners, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    viewMode,
    handleEditorScroll,
    handlePreviewScroll,
    editor,
    syncScrollEnabled,
  ]);

  // エディタの状態変化を監視
  useEffect(() => {
    if (editor) {
      updateEditorStates(editor);
    }
  }, [editor, updateEditorStates]);

  // ESCキーでフルスクリーン終了
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const addImage = () => {
    const url = window.prompt("画像のURLを入力してください:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("リンクのURLを入力してください:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const deleteTable = () => {
    if (editor) {
      // 削除前に他のテーブルがあるかチェック
      const tables = editor.view.dom.querySelectorAll("table");
      const hasOtherTables = tables.length > 1;

      editor.chain().focus().deleteTable().run();

      // 他のテーブルがある場合、次のテーブルにフォーカスを移動
      if (hasOtherTables) {
        setTimeout(() => {
          const remainingTables = editor.view.dom.querySelectorAll("table");
          if (remainingTables.length > 0) {
            // 最初のテーブルの最初のセルにフォーカスを移動
            const firstCell = remainingTables[0].querySelector("td, th");
            if (firstCell) {
              try {
                const pos = editor.view.posAtDOM(firstCell, 0);
                editor.commands.setTextSelection(pos);
                editor.commands.focus();
              } catch (e) {
                // フォーカス設定に失敗した場合は無視
              }
            }
          }
        }, 50);
      }
    }
  };

  const clearFormatting = () => {
    if (editor) {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    }
  };

  const resetDocument = () => {
    if (editor) {
      const confirmReset = window.confirm(
        "すべての内容をクリアします。この操作は元に戻せません。続行しますか？",
      );
      if (confirmReset) {
        editor.chain().focus().clearContent().run();
      }
    }
  };

  if (!editor) {
    return null;
  }

  const containerClasses = `
    ${isFullscreen ? "fixed inset-0 z-50 bg-white" : "rounded-lg border"}
  `.trim();

  return (
    <div className={containerClasses}>
      {/* モード切り替えタブ（独立エリア） */}
      <div className="flex items-center justify-between rounded-t-lg border-b bg-white px-4 py-2">
        {/* 左側：編集・プレビューグループ */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <Button
            type="button"
            variant={viewMode === "edit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("edit")}
            className="cursor-pointer rounded-md px-4 py-1 text-sm"
          >
            編集
          </Button>
          <div className="mx-1 h-8 w-px bg-gray-300" />
          <Button
            type="button"
            variant={viewMode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="cursor-pointer rounded-md px-4 py-1 text-sm"
          >
            プレビュー
          </Button>
        </div>

        {/* 右側：分割表示・同期・フルスクリーングループ */}
        <div className="flex items-center gap-2">
          {/* 分割表示ボタン */}
          <Button
            type="button"
            variant={viewMode === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("split")}
            className="cursor-pointer rounded-md px-4 py-1 text-sm"
          >
            分割表示
          </Button>

          {/* スクロール同期切り替えボタン（分割表示時のみ表示） */}
          {viewMode === "split" && (
            <Button
              type="button"
              variant={syncScrollEnabled ? "default" : "ghost"}
              size="sm"
              onClick={() => setSyncScrollEnabled(!syncScrollEnabled)}
              className="cursor-pointer text-xs"
              title={
                syncScrollEnabled
                  ? "スクロール同期を無効にする"
                  : "スクロール同期を有効にする"
              }
            >
              {syncScrollEnabled ? "同期ON" : "同期OFF"}
            </Button>
          )}

          {/* フルスクリーンボタン */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "フルスクリーン終了" : "フルスクリーン"}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 編集ツールバー */}
      {viewMode !== "preview" && (
        <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-1.5 md:p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editorStates.heading1
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="見出し1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editorStates.heading2
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="見出し2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editorStates.heading3
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="見出し3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editorStates.bold
                ? "cursor-pointer border-blue-300 bg-blue-100 font-bold text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="太字"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editorStates.italic
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 italic shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="斜体"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editorStates.bulletList
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="箇条書き"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editorStates.orderedList
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="番号付きリスト"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editorStates.alignLeft
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="左揃え"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editorStates.alignCenter
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="中央揃え"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editorStates.alignRight
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="右揃え"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editorStates.blockquote
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="引用"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editorStates.codeBlock
                ? "cursor-pointer border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                : "cursor-pointer hover:bg-gray-100"
            }
            title="コードブロック"
          >
            <Code2 className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="cursor-pointer hover:bg-gray-100"
            title="画像挿入"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className="cursor-pointer hover:bg-gray-100"
            title="リンク挿入"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTable}
            className="cursor-pointer hover:bg-gray-100"
            title="テーブル挿入"
          >
            <TableIcon className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-px self-center bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFormatting}
            className="cursor-pointer hover:bg-gray-100"
            title="選択範囲のフォーマットをクリア"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetDocument}
            className="cursor-pointer text-gray-600 hover:bg-red-50 hover:text-red-600"
            title="すべての内容をクリア"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* テーブル操作バー */}
      {isTableActive && viewMode !== "preview" && (
        <div className="sticky top-[calc(6rem+3rem+1px)] z-40 flex flex-wrap gap-1 border-b bg-blue-50 px-2 py-1">
          <span className="px-1 py-1 text-xs font-medium text-blue-700">
            テーブル操作:
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="h-6 cursor-pointer gap-1 bg-white text-xs"
          >
            <RowsIcon className="h-3 w-3" />
            行追加
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="h-6 cursor-pointer gap-1 bg-white text-xs"
          >
            <RowsIcon className="h-3 w-3 rotate-90" />
            列追加
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="h-6 cursor-pointer gap-1 bg-white text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <RowsIcon className="h-3 w-3" />
            行削除
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="h-6 cursor-pointer gap-1 bg-white text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <RowsIcon className="h-3 w-3 rotate-90" />
            列削除
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={deleteTable}
            className="h-6 cursor-pointer gap-1 text-xs"
          >
            <Trash2 className="h-3 w-3" />
            テーブル削除
          </Button>
        </div>
      )}

      {/* メインコンテンツエリア */}
      <div
        className={`${isFullscreen ? "h-screen overflow-hidden" : "h-auto"}`}
      >
        {viewMode === "edit" && (
          <div
            className="h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]"
            ref={editorContainerRef}
          >
            <EditorContent
              editor={editor}
              placeholder={placeholder}
              className="h-full"
            />
          </div>
        )}

        {viewMode === "preview" && (
          <div
            className="h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]"
            ref={previewContainerRef}
          >
            <PreviewContent
              content={editor.getJSON()}
              className="h-full overflow-y-auto"
            />
          </div>
        )}

        {viewMode === "split" && (
          <div className="flex h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]">
            <div className="flex w-1/2 flex-col border-r">
              <div className="flex-shrink-0 border-b bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                編集
                {syncScrollEnabled && (
                  <span className="ml-2 text-green-600">(同期中)</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden" ref={editorContainerRef}>
                <EditorContent
                  editor={editor}
                  placeholder={placeholder}
                  className="h-full"
                />
              </div>
            </div>
            <div className="flex w-1/2 flex-col">
              <div className="flex-shrink-0 border-b bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                プレビュー
                {syncScrollEnabled && (
                  <span className="ml-2 text-green-600">(同期中)</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <PreviewContent
                  content={editor.getJSON()}
                  className="h-full overflow-y-auto"
                  ref={previewContainerRef}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フルスクリーン時のESCキー案内 */}
      {isFullscreen && (
        <div className="bg-opacity-75 absolute right-4 bottom-4 rounded bg-black px-3 py-1 text-xs text-white">
          ESCキーまたはフルスクリーンボタンで終了
        </div>
      )}
    </div>
  );
});
