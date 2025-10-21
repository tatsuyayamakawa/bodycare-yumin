"use client";

import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  basePath?: string;
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  basePath = "/admin",
}: PaginationWrapperProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${basePath}?${params.toString()}`;
  };

  // 表示するページ番号の範囲を計算
  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots: (number | "...")[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-700">
        <span className="font-medium">{totalItems}</span> 件中{" "}
        <span className="font-medium">{startItem}</span> -{" "}
        <span className="font-medium">{endItem}</span> 件を表示
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {hasPreviousPage ? (
              <PaginationPrevious href={getPageUrl(currentPage - 1)} />
            ) : (
              <PaginationPrevious
                href="#"
                className="pointer-events-none opacity-50"
                aria-disabled="true"
              />
            )}
          </PaginationItem>

          {pageNumbers.map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <PaginationItem key={`dots-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const page = pageNumber as number;
            const isCurrentPage = page === currentPage;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={getPageUrl(page)}
                  isActive={isCurrentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {hasNextPage ? (
              <PaginationNext href={getPageUrl(currentPage + 1)} />
            ) : (
              <PaginationNext
                href="#"
                className="pointer-events-none opacity-50"
                aria-disabled="true"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
