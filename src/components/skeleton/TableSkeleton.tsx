import { Skeleton } from "../ui/skeleton";

export default function TableSkeleton() {
  const columns = 5;
  const rows = 10;

  return (
    <div className="border rounded-md overflow-hidden bg-primary-0">
      {/* Table Header Skeleton */}
      <div className="p-4 flex justify-between">
        <div className="flex gap-4 flex-wrap">
          <Skeleton className="h-6 w-36 bg-primary-200 rounded" />
          <Skeleton className="h-6 w-20 bg-primary-200 rounded" />
          <Skeleton className="h-6 w-20 bg-primary-200 rounded" />
        </div>
        <div>
          <Skeleton className="h-6 w-20 bg-primary-200 rounded" />
        </div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y rounded-md border border-primary-200 mx-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-2 items-center p-4"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-4 w-full bg-primary-200 rounded"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Table Footer (Pagination) */}
      <div className="p-4 flex justify-between items-center">
        <Skeleton className="h-6 w-20 bg-primary-200 rounded" />
        <Skeleton className="h-6 w-36 bg-primary-200 rounded" />
      </div>
    </div>
  );
}
