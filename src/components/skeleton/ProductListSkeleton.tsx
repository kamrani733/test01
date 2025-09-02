// components/shared/ProductsListSkeleton.tsx
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ProductsListSkeleton({ perPage }: { perPage: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: perPage }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
