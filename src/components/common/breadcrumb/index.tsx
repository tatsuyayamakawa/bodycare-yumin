import { SlashIcon } from "lucide-react";
import Link from "next/link";

import { breadCrumbStyles } from "./constants";
import type { BreadCrumbProps } from "./types";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadCrumb({ children }: BreadCrumbProps) {
  const { container, list, page, separator } = breadCrumbStyles;

  return (
    <Breadcrumb className={container.base}>
      <BreadcrumbList className={list.base}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon className={separator.base} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className={page.base}>{children}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
