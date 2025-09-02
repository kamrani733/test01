import CategoryNavSection from "@/components/main/products/CategoryNavSection";
import ProductsList from "@/components/main/products/ProductsList";
import SliderSection from "@/components/main/products/SliderSection";
import Container from "@/components/shared/Container";
import { BannerSliderSkeleton } from "@/components/skeleton/BannerSliderSkeleton";
import { ProductsListSkeleton } from "@/components/skeleton/ProductListSkeleton";
import { getDictionaryServer } from "@/core/lib/dictionary";
import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>; // Already fixed for params
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Updated to Promise
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { dictionary } = await getDictionaryServer();
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug || "all");
  const categoryName =
    decodedSlug === "all" ? dictionary.ui.product.all : decodedSlug;

  return {
    title: categoryName,
  };
}

export default async function Page({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const decodedSlug = decodeURIComponent(slug || "all");
  const page = Number(query?.page) || 1;
  const perPage = Number(query?.perPage) || 15;

  return (
    <Container className="mt-10">
      <Suspense fallback={<BannerSliderSkeleton varient="short" />}>
        <SliderSection slug={decodedSlug} />
      </Suspense>
      <CategoryNavSection activeSlug={decodedSlug} />
      <Suspense fallback={<ProductsListSkeleton perPage={perPage} />}>
        <ProductsList slug={decodedSlug} page={page} perPage={perPage} />
      </Suspense>
    </Container>
  );
}
