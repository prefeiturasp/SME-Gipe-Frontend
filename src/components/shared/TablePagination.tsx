"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TablePaginationProps = {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
};

function getPageNumbers(
    pageIndex: number,
    pageCount: number,
): (number | "...")[] {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i);
    }

    const pages = new Set<number>();
    pages.add(0);
    pages.add(pageCount - 1);

    for (let i = pageIndex - 1; i <= pageIndex + 1; i++) {
        if (i >= 0 && i < pageCount) {
            pages.add(i);
        }
    }

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | "...")[] = [];

    for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
            result.push(sorted[i]);
            continue;
        }
        const gap = sorted[i] - sorted[i - 1];
        if (gap === 2) {
            result.push(sorted[i] - 1);
        } else if (gap > 2) {
            result.push("...");
        }
        result.push(sorted[i]);
    }

    return result;
}

export default function TablePagination({
    pageIndex,
    pageCount,
    onPageChange,
    canPreviousPage,
    canNextPage,
}: Readonly<TablePaginationProps>) {
    const pageNumbers = getPageNumbers(pageIndex, pageCount);

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="pagination"
                size="icon"
                onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
                disabled={!canPreviousPage}
                className="w-[32px] h-[32px]"
                data-testid="prev-page-button"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-1">
                {pageNumbers.map((item, i) => {
                    if (item === "...") {
                        return (
                            <span
                                key={`ellipsis-${i}`}
                                className="flex items-center justify-center w-[32px] h-[32px] text-sm text-[#42474a]"
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        );
                    }
                    return (
                        <Button
                            key={`page-${item + 1}`}
                            variant={
                                pageIndex === item
                                    ? "paginationActive"
                                    : "pagination"
                            }
                            size="sm"
                            className="w-[32px] h-[32px]"
                            onClick={() => onPageChange(item)}
                            aria-current={
                                pageIndex === item ? "page" : undefined
                            }
                        >
                            {item + 1}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="pagination"
                size="icon"
                onClick={() =>
                    onPageChange(Math.min(pageIndex + 1, pageCount - 1))
                }
                disabled={!canNextPage}
                className="w-[32px] h-[32px]"
                data-testid="next-page-button"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
