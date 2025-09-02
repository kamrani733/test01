"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductItem } from "@/core/lib/product-fourth-section";

type ProductImageSwiperProps = {
  item: ProductItem;
};

export default function ProductImageSwiper({ item }: ProductImageSwiperProps) {
  return (
    <div className="h-full">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        spaceBetween={8}
        slidesPerView={1}
        allowTouchMove={false}
        className="h-[21.25rem] relative"
      >
        {(item.image_info?.urls || [item.image_info?.urls]).map(
          (image, index) => (
            <SwiperSlide key={index}>
              <figure className="w-full h-full bg-primary-100 flex justify-center items-center">
                <Image
                  src={image}
                  alt={item.title || "product image"}
                  width={300}
                  height={200}
                  className="w-1/2 h-3/5 object-cover select-none"
                />
              </figure>
            </SwiperSlide>
          )
        )}
        <button className="swiper-button-prev-custom absolute bottom-3 z-10 cursor-pointer disabled:opacity-0 disabled:cursor-default rtl:rotate-180 rtl:right-1/3 ltr:left-1/3">
          <ChevronLeft className="w-7 h-7 stroke-1 text-primary-600" />
        </button>
        <button className="swiper-button-next-custom absolute bottom-3 z-10 cursor-pointer disabled:opacity-0 disabled:cursor-default rtl:rotate-180 rtl:left-1/3 ltr:right-1/3">
          <ChevronRight className="w-7 h-7 stroke-1 text-primary-600" />
        </button>
      </Swiper>
    </div>
  );
}
