import ProductCard from "@/components/shared/ProductCard";
import { MainShopProduct } from "@/core/models/shop-product-model";
import ProductsPagination from "./ProductPagination";
import { getProductsByCategory } from "@/core/lib/api/main/main-shop-product";

export default async function ProductsList({
  slug,
  page,
  perPage,
}: {
  slug: string;
  page: number;
  perPage: number;
}) {
  const products = await getProductsByCategory(slug, page, perPage);
  const items: MainShopProduct[] = products.data.data;
  console.log(products);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ProductsPagination
        currentPage={products.data.current_page ?? page}
        lastPage={products.data.last_page}
      />
    </div>
  );
}
