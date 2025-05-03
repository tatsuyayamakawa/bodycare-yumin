import { SlashIcon } from "lucide-react";
import Link from "next/link";

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
  return (
    <Breadcrumb className="mb-12">
      <BreadcrumbList className="space-x-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">{children}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
