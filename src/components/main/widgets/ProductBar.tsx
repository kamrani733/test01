"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import ProductCard from "@/components/shared/ProductCard";
import { MainShopProduct } from "@/core/models/shop-product-model";
import { Heading } from "@/components/ui/Heading";
import { ArrowLeftIcon, Link } from "lucide-react";
import { useDictionary } from "@/core/hooks/use-dictionary";

export default function ProductBar({ data }: { data: MainShopProduct }) {
  const { dictionary } = useDictionary();
  console.log(data);

  return (
    <>
      <div className="flex justify-between mb-2">
        <div>
          <Heading level={3}>{data.title}</Heading>
          <p className="text-[#525252]">{data.description}</p>
        </div>
        {data.link && (
          <Link className="font-medium flex items-center gap-2 text-[#8B6F47] hover:text-[#D4A373] transition-colors" href={data.link}>
            {dictionary.ui.pages.seeAll}
            <ArrowLeftIcon className="stroke-2 size-4 rotate-180" />
          </Link>
        )}
      </div>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={16}
        slidesPerView="auto"
        scrollbar={{ draggable: true, dragSize: 100 }}
        className="w-full"
        style={{ paddingBottom: "40px" }}
      >
        {data.items.map((item) => (
          <SwiperSlide key={item.id} style={{ width: "300px" }}>
            <ProductCard
              id={item.id.toString()}
              name={item.title}
              price={parseFloat(item.price || "0")}
              rating={4.5}
              image={item.thumbnail?.url || "/placeholder.jpg"}
              description={item.description || item.excerpt || ""}
              href={`/shop/product/${item.id}/${item.slug}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
