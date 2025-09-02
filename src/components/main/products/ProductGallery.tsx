"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type Image = {
  url: string;
  alt?: string;
};

type ProductGalleryProps = {
  images: Image[];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

const breakpointColumnsObj =
  images.length === 1
    ? { default: 1, 1100: 1 } 
    : { default: 2, 1100: 2 };
  return (
    <div className="mt-8">
      {!isGalleryOpen && (
        <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="mb-4 overflow-hidden cursor-pointer"
              onClick={() => {
                setStartIndex(index);
                setIsGalleryOpen(true);
              }}
            >
              <img
                src={img.url}
                alt={img.alt || "تصویر محصول"}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </Masonry>
      )}

      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl font-bold z-50 hover:text-gray-300"
          >
            ✕
          </button>

          <Swiper
            modules={[Navigation, Keyboard]}
            navigation
            keyboard
            initialSlide={startIndex}
            className="w-full max-w-4xl"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img.url}
                  alt={img.alt || "تصویر محصول"}
                  className="w-full h-auto object-contain max-h-[90vh]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
