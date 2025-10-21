import type { ReactNode } from "react";

export type ArrowColor = "white" | "brand-secondary";

export interface SectionProps {
  /** セクションの上部に矢印を表示するかどうか */
  hasArrow?: boolean;
  /** アローの色 */
  arrowColor?: ArrowColor;
  /** 背景色を適用するかどうか */
  hasBackground?: boolean;
  /** パディングを適用するかどうか */
  hasPadding?: boolean;
  /** 追加のクラス名 */
  className?: string;
  /** 子要素 */
  children: ReactNode;
  /** セクションに固有のID */
  id?: string;
}

export interface SectionStyles {
  background: string;
  container: {
    base: string;
    withPadding: string;
  };
  arrow: {
    wrapper: string;
    element: {
      base: string;
      white: string;
      brandSecondary: string;
    };
  };
}
