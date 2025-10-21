import type { Editor } from "@tiptap/core";

/**
 * 要素のスクロール位置を割合（0-1）で取得
 */
export function getScrollPercentage(element: HTMLElement): number {
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;

  if (scrollHeight <= clientHeight) return 0;
  return scrollTop / (scrollHeight - clientHeight);
}

/**
 * 要素のスクロール位置を割合（0-1）で設定
 */
export function setScrollPercentage(
  element: HTMLElement,
  percentage: number,
): void {
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  const maxScrollTop = scrollHeight - clientHeight;

  if (maxScrollTop > 0) {
    element.scrollTop = maxScrollTop * percentage;
  }
}

/**
 * テーブル内にカーソルがあるかどうかを判定
 */
export function isInTable(editor: Editor): boolean {
  if (!editor) return false;

  const { state } = editor;
  const { selection } = state;
  const { $from } = selection;

  // 現在の位置からテーブルを探す
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d);
    if (node.type.name === "table") {
      return true;
    }
  }

  return false;
}
