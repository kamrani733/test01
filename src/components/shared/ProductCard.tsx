"use client";
import { MainShopProduct } from "@/core/models/shop-product-model";
import Image from "next/image";
import { Heading } from "../ui/Heading";
// import { getDictionaryServer } from "@/core/lib/dictionary";
import Link from "next/link";
import { useDictionary } from "@/core/hooks/use-dictionary";

export default function ProductCard({ product }: { product: MainShopProduct }) {
  const { dictionary } = useDictionary();

  return (
    <Link
      href={`/shop/product/${product.id}/${product.slug}`}
      className="h-75 p-0 flex flex-col"
    >
      <div className="relative flex-1">
        <Image
          src={product.thumbnail.url}
          alt={product.title}
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="p-2 space-y-3">
        <Heading level={3} className="text-sm">
          {product.title} {product.color_title}
        </Heading>
        <p className="text-primary-600 text-xs">
          {product.price &&
            `${product.price} ${dictionary.ui.product.currency}`}
        </p>
        <div className="size-5 rounded-full border border-primary-300 bg-primary-300" />
      </div>
    </Link>
  );
}
