"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface DataTablePaginationProps {
  total: number;
  limit: number;
  offset: number;
}

export function UserTablePagination({
  total,
  limit,
  offset,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (newOffset: number) => {
    router.push(
      pathname + "?" + createQueryString("offset", String(newOffset))
    );
  };

  const handlePreviousPage = () => {
    const newOffset = Math.max(0, offset - limit);
    handlePageChange(newOffset);
  };

  const handleNextPage = () => {
    const newOffset = offset + limit;
    if (newOffset < total) {
      handlePageChange(newOffset);
    }
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages} ({total} users total)
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={offset === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={offset + limit >= total}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
