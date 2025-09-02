// components/shared/ProductCardSkeleton.tsx

export function ProductCardSkeleton() {
  return (
    <div className="h-75 p-0 flex flex-col">
      <div className="relative flex-1">
        {/* Image skeleton */}
        <div className="absolute inset-0 bg-primary-200 animate-pulse rounded-md" />
      </div>
      <div className="p-2 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-primary-200 animate-pulse rounded" />
        {/* Price skeleton */}
        <div className="h-4 bg-primary-200 animate-pulse rounded w-20" />
        {/* Color indicator skeleton */}
        <div className="size-5 rounded-full bg-primary-200 animate-pulse" />
      </div>
    </div>
  );
}
