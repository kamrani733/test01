"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // 👈 Autoplay اضافه شد
import "swiper/css";
import "swiper/css/navigation";
import { SliderItemFrom } from "@/core/models/slider-model";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import Link from "next/link";
import CustomButton from "@/components/shared/CustomButton";

type BannerSliderProps = {
  slides: SliderItemFrom[];
  varient?: "full" | "short";
};

export default function BannerSlider({
  slides,
  varient = "full",
}: BannerSliderProps) {
  console.log(slides);

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation={{
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      }}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="w-full"
    >
      {slides.map((slide) => {
        const Content = (
          <div
            className={cn(
              "relative flex justify-center items-center",
              varient === "full" ? "h-[calc(100vh-4.5rem)]" : "aspect-[16/9]"
            )}
          >
            <Image
              src={slide.image_info.url}
              alt={slide.image_info.description || ""}
              fill
              className="w-full h-svh object-cover z-0 absolute"
            />
            <div className="absolute inset-0 bg-black/20 z-0" />
            <div className="text-white absolute top-1/2 left-1/2 text-center -translate-y-1/2 -translate-x-1/2 z-10 space-y-3">
              <Heading
                level={1}
                className="m text-white text-[calc(1.2rem+0.3vw)] font-serif"
              >
                {slide.title}
              </Heading>
              <Heading level={2} className="text-white font-serif">
                {slide?.description}
              </Heading>
              {slide.buttonContent && <CustomButton size="lg" variant="black">{slide?.buttonContent}</CustomButton>}
            </div>
          </div>
        );

        return (
          <SwiperSlide key={slide.priority}>
            {slide.link ? (
              <Link href={slide.link}>
                {Content}
              </Link>
            ) : (
              Content
            )}
          </SwiperSlide>
        );
      })}

      <button className="swiper-button-prev-custom absolute ltr:left-4 top-1/2 -translate-y-1/2 z-10 text-white cursor-pointer disabled:opacity-0 disabled:cursor-default rtl:rotate-180 rtl:right-4 ">
        <ChevronLeft className="w-10 h-10 stroke-1 text-white" />
      </button>
      <button className="swiper-button-next-custom absolute ltr:right-4 top-1/2 -translate-y-1/2 z-10 text-white cursor-pointer disabled:opacity-0 disabled:cursor-default rtl:rotate-180 rtl:left-4">
        <ChevronRight className="w-10 h-10 stroke-1 text-white" />
      </button>
    </Swiper>
  );
}
