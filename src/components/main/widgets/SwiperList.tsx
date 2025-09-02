'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import { Heading } from '@/components/ui/Heading';
import Link from 'next/link';
import { SwiperListProps } from '@/core/models/slider-model';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { ArrowLeftIcon } from 'lucide-react';

export function SwiperList({ data }: SwiperListProps) {
  const { dictionary } = useDictionary();
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <div>
          <Heading level={3}>{data.title}</Heading>
          <p className="text-[#525252]">{data.description}</p>
        </div>
        {data.link && (
          <Link className="font-medium flex items-center gap-2 text-[#8B6F47] hover:text-[#D4A373] transition-colors" href={data.link}>
            {dictionary.ui.pages.seeAll}
            <ArrowLeftIcon className="stroke-2 size-4 ltr:rotate-180" />
          </Link>
        )}
      </div>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={16}
        slidesPerView="auto"
        scrollbar={{
          draggable: true,
          dragSize: 100,
        }}
        className="w-full"
        style={{
          paddingBottom: '70px',
        }}
      >
        {data.items.map((item, index) => {
          const Content = (
            <div>
              <div
                className="w-full h-full mb-2 relative overflow-hidden rounded-lg bg-[#F5F5F5]"
                style={{ width: '300px', height: '360px' }}
              >
                {item.image_info?.url && (
                  <Image
                    src={item.image_info.url}
                    alt={item.title || ''}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <Heading level={3}>{item.title}</Heading>
              <p className="text-[#525252]">{item.description}</p>
            </div>
          );

          return (
            <SwiperSlide
              key={index}
              style={{ width: '300px', height: '360px' }}
            >
              {item.link ? <Link href={item.link}>{Content}</Link> : Content}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
