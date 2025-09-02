import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type ProductsPaginationProps = {
  currentPage: number;
  lastPage: number;
  perPage?: number;
  maxVisible?: number; // تعداد لینک‌های وسط
};

export default function ProductsPagination({
  currentPage,
  lastPage,
  perPage = 15,
  maxVisible = 5,
}: ProductsPaginationProps) {
  const pages: (number | "...")[] = [];

  if (lastPage <= maxVisible) {
    // همه صفحات را نشان بده
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(lastPage, currentPage + half);

    if (start === 1) {
      end = maxVisible;
    } else if (end === lastPage) {
      start = lastPage - maxVisible + 1;
    }

    // اضافه کردن نقطه‌چین در صورت نیاز
    if (start > 1) {
      pages.push(1, "...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < lastPage) {
      pages.push("...", lastPage);
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious
              href={`?page=${currentPage - 1}&perPage=${perPage}`}
            />
          ) : (
            <span className="pointer-events-none opacity-50">
              <PaginationPrevious href="#" />
            </span>
          )}
        </PaginationItem>

        {/* Page Links */}
        {pages.map((p, i) => (
          <PaginationItem key={i}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?page=${p}&perPage=${perPage}`}
                isActive={p === currentPage}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          {currentPage < lastPage ? (
            <PaginationNext
              href={`?page=${currentPage + 1}&perPage=${perPage}`}
            />
          ) : (
            <span className="pointer-events-none opacity-50">
              <PaginationNext href="#" />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
