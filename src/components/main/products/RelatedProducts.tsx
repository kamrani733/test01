import { Heading } from "@/components/ui/Heading";
import SwiperRelatedProducts from "./SwiperRelatedProducts";
import { getRelatedProductsById } from "@/core/lib/api/main/main-shop-product";
import { getDictionaryServer } from "@/core/lib/dictionary";

type RelatedProductsProps = {
  productId: number;
};

export default async function RelatedProducts({
  productId,
}: RelatedProductsProps) {
  const relatedProduct = await getRelatedProductsById(productId);
  const {dictionary} = await getDictionaryServer()
  if (relatedProduct.related_products.length === 0 ) return null;

  return (
    <div className="w-full">
      <Heading level={3} className="mb-4">
        {dictionary.forms.related_products}
      </Heading>
      <SwiperRelatedProducts items={relatedProduct.related_products} />
    </div>
  );
}
