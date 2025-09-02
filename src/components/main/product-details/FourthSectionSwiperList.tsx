"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import { Heading } from "@/components/ui/Heading";
import ProductCard from "@/components/shared/ProductCard";
import { MainShopProduct } from "@/core/models/shop-product-model";

export interface ProductSection {
  title: string;
  items: MainShopProduct[];
}

interface FourthSectionSwiperListProps {
  data: ProductSection;
}

export function FourthSectionSwiperList({
  data,
}: FourthSectionSwiperListProps) {
  return (
    <div className="w-full">
      <Heading level={3} className="mb-4">
        {data.title}
      </Heading>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={16}
        slidesPerView="auto"
        scrollbar={{ draggable: true, dragSize: 500 }}
        className="w-full"
        style={{ paddingBottom: "70px" }}
      >
        {data.items.map((item, index) => (
          <SwiperSlide key={index} style={{ width: "300px", height: "480px" }}>
            <ProductCard product={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
