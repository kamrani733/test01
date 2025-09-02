import Image from 'next/image';

import ProductComments from '@/components/main/comment/ProductComment';
import ProductGallery from '@/components/main/products/ProductGallery';
import ProductInformation from '@/components/main/products/ProductInformation';
import RelatedProducts from '@/components/main/products/RelatedProducts';
import Container from '@/components/shared/Container';
import {
  getProductById,
  getProductColorsById,
  getProductGalleryById,
} from '@/core/lib/api/main/main-shop-product';

export type ProductPageProps = {
  params: Promise<{
    id: number;
    slug: string[];
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, colors, gallery] = await Promise.all([
    getProductById(id),
    getProductColorsById(id),
    getProductGalleryById(id),
  ]);

  return (
    <Container className="flex flex-col gap-12 mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2">
          {product.thumbnail && (
            <Image
              src={product.thumbnail.url}
              alt={product.thumbnail.alt || 'تصویر محصول'}
              width={600}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          )}
          {gallery.image_info.length > 0 && (
            <ProductGallery images={gallery.image_info} />
          )}
        </div>
        <aside className="col-span-1 sticky top-20 h-fit">
          <ProductInformation product={product} colors={colors} />
        </aside>
      </div>
      <RelatedProducts productId={id} />
      <ProductComments productId={id} />
    </Container>
  );
}
