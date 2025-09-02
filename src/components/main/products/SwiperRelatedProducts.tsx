"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import ProductCard from "@/components/shared/ProductCard";
import { MainShopProduct } from "@/core/models/shop-product-model";

type SwiperRelatedProductsProps = {
  items: MainShopProduct[];
};

export default function SwiperRelatedProducts({
  items,
}: SwiperRelatedProductsProps) {
  return (
    <Swiper
      modules={[Scrollbar]}
      spaceBetween={16}
      slidesPerView="auto"
      scrollbar={{ draggable: true, dragSize: 500 }}
      className="w-full"
      style={{ paddingBottom: "70px" }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} style={{ width: "300px" }}>
          <ProductCard product={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
