import type { ReactNode } from "react";

export interface BreadCrumbProps {
  className?: string;
  children: ReactNode;
}

export interface BreadCrumbStyles {
  container: {
    base: string;
  };
  list: {
    base: string;
  };
  separator: {
    base: string;
  };
  page: {
    base: string;
  };
}
