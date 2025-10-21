import type { EditorStates } from "./types";

/**
 * エディタの初期状態
 */
export const INITIAL_EDITOR_STATES: EditorStates = {
  bold: false,
  italic: false,
  heading1: false,
  heading2: false,
  heading3: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  codeBlock: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
};

/**
 * スクロール同期のデバウンス時間（ミリ秒）
 */
export const SCROLL_SYNC_DEBOUNCE = 50;
